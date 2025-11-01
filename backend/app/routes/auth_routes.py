from fastapi import APIRouter, HTTPException
from app.models.user import UserRegister, UserLogin
from app.controllers.auth_controller import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):
    """Register a new user"""
    result = await register_user(user)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return {
        "message": result["message"],
        "user": result["user"]
    }


@router.post("/login")
async def login(user: UserLogin):
    """Login a user"""
    result = await login_user(user)
    
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    
    return {
        "message": result["message"],
        "user": result["user"]
    }
