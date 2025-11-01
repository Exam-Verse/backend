from passlib.context import CryptContext
from app.config.database import get_database
from app.models.user import UserRegister, UserLogin, UserResponse, UserInDB
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


async def register_user(user_data: UserRegister):
    """Register a new user"""
    db = get_database()
    users_collection = db.users
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        return {"success": False, "message": "Email already registered"}
    
    # Check if username exists
    existing_username = await users_collection.find_one({"username": user_data.username})
    if existing_username:
        return {"success": False, "message": "Username already taken"}
    
    # Create user document
    user_dict = {
        "email": user_data.email,
        "username": user_data.username,
        "role": user_data.role,
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.utcnow(),
        "is_verified": True if user_data.role == "student" else False  # Faculty needs verification
    }
    
    # Add student-specific fields
    if user_data.role == "student":
        user_dict["college"] = user_data.college
        user_dict["course"] = user_data.course
        user_dict["year"] = user_data.year
    
    # Add faculty-specific fields
    if user_data.role == "faculty":
        user_dict["department"] = user_data.department
        user_dict["faculty_id"] = user_data.faculty_id
    
    # Insert user
    result = await users_collection.insert_one(user_dict)
    
    # Return user response
    user_response = {
        "id": str(result.inserted_id),
        "email": user_data.email,
        "username": user_data.username,
        "role": user_data.role,
        "created_at": user_dict["created_at"],
        "is_verified": user_dict["is_verified"]
    }
    
    # Add role-specific fields to response
    if user_data.role == "student":
        user_response["college"] = user_data.college
        user_response["course"] = user_data.course
        user_response["year"] = user_data.year
    elif user_data.role == "faculty":
        user_response["department"] = user_data.department
    
    return {"success": True, "message": "User registered successfully", "user": user_response}


async def login_user(user_data: UserLogin):
    """Login a user"""
    db = get_database()
    users_collection = db.users
    
    # Find user by email
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        return {"success": False, "message": "Invalid email or password"}
    
    # Verify password
    if not verify_password(user_data.password, user["hashed_password"]):
        return {"success": False, "message": "Invalid email or password"}
    
    # Return user response
    user_response = {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "role": user.get("role", "student"),
        "created_at": user["created_at"],
        "is_verified": user.get("is_verified", True)
    }
    
    # Add role-specific fields
    if user.get("role") == "student":
        user_response["college"] = user.get("college")
        user_response["course"] = user.get("course")
        user_response["year"] = user.get("year")
    elif user.get("role") == "faculty":
        user_response["department"] = user.get("department")
    
    return {"success": True, "message": "Login successful", "user": user_response}
