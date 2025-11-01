from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from . import schemas
from .auth import get_password_hash, verify_password, create_access_token
from .database import init_db
from .deps import get_db

app = FastAPI(title="Examverse API")


@app.on_event("startup")
async def on_startup():
    # Ensure MongoDB indexes are created
    await init_db()


def _user_doc_to_out(doc: Dict[str, Any]) -> schemas.UserOut:
    return schemas.UserOut(
        id=str(doc.get("_id")),
        email=doc["email"],
        created_at=doc["created_at"],
    )


@app.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: schemas.UserCreate, db=Depends(get_db)):
    # Check if user exists
    existing = await db["users"].find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    doc = {
        "email": payload.email,
        "hashed_password": get_password_hash(payload.password),
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = await db["users"].insert_one(doc)
        doc["_id"] = result.inserted_id
    except DuplicateKeyError:
        # In case of race condition between existence check and insert
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return _user_doc_to_out(doc)


@app.post("/login", response_model=schemas.Token)
async def login(payload: schemas.LoginInput, db=Depends(get_db)):
    user = await db["users"].find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Use user id as subject; also include email for convenience
    sub = str(user.get("_id")) if isinstance(user.get("_id"), ObjectId) else str(user.get("_id"))
    access_token = create_access_token({"sub": sub, "email": user["email"]})
    return schemas.Token(access_token=access_token)


@app.get("/health")
async def health(db=Depends(get_db)):
    # Lightweight health check that ensures DB is reachable
    await db.command("ping")
    return {"status": "ok"}


@app.exception_handler(DuplicateKeyError)
async def handle_duplicate_key(_: Request, __: DuplicateKeyError):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": "Duplicate key"})


@app.exception_handler(Exception)
async def handle_unexpected(_: Request, exc: Exception):
    # Default 500 for unexpected errors with minimal leak of internals
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": "Internal server error"})
