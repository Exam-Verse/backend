from fastapi import APIRouter, Depends, HTTPException
from app.config.database import get_database
from app.utils.jwt import require_role
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/faculty/pending")
async def get_pending_faculty(current_user: dict = Depends(require_role(["admin"]))):
    db = get_database()
    users = db.users
    cursor = users.find({"role": "faculty", "is_verified": {"$in": [False, None]}})
    results = []
    async for u in cursor:
        u["id"] = str(u.pop("_id"))
        u.pop("hashed_password", None)
        results.append(u)
    return results


@router.post("/faculty/{user_id}/approve")
async def approve_faculty(user_id: str, current_user: dict = Depends(require_role(["admin"]))):
    db = get_database()
    users = db.users
    res = await users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_verified": True, "role": "faculty", "status": "approved"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}


@router.post("/faculty/{user_id}/reject")
async def reject_faculty(user_id: str, current_user: dict = Depends(require_role(["admin"]))):
    db = get_database()
    users = db.users
    res = await users.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "rejected", "is_verified": False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}


@router.get("/reports")
async def get_reports(current_user: dict = Depends(require_role(["admin"]))):
    # Stub endpoint: return empty list for now
    return []


@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(require_role(["admin"]))):
    db = get_database()
    users = db.users
    papers = db.papers
    questions = db.questions
    u = await users.count_documents({})
    p = await papers.count_documents({})
    q = await questions.count_documents({})
    return {"users": u, "papers": p, "questions": q}
