from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: Literal["student", "faculty", "admin"] = "student"


class UserRegister(UserBase):
    password: str
    # Student-specific fields (optional)
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    # Faculty-specific fields (optional)
    department: Optional[str] = None
    faculty_id: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    department: Optional[str] = None
    is_verified: bool = False

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    department: Optional[str] = None
    faculty_id: Optional[str] = None
    is_verified: bool = False
    # Saved items
    saved_papers: List[str] = Field(default_factory=list)
    saved_questions: List[str] = Field(default_factory=list)
    # Faculty verification
    college_email: Optional[str] = None
    id_card_url: Optional[str] = None
