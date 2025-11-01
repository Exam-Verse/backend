from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PaperBase(BaseModel):
    subject: str
    college: str
    course: str
    semester: str
    year: str
    exam_type: str  # Midterm, Endterm, Competitive


class PaperCreate(PaperBase):
    pdf_url: str
    faculty_id: str
    has_faculty_solution: bool = False
    solution_url: Optional[str] = None


class PaperUpdate(BaseModel):
    subject: Optional[str] = None
    has_faculty_solution: Optional[bool] = None
    solution_url: Optional[str] = None


class PaperResponse(PaperBase):
    id: str
    pdf_url: str
    faculty_id: str
    faculty_name: str
    has_faculty_solution: bool
    solution_url: Optional[str] = None
    question_count: int = 0
    views: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaperInDB(PaperBase):
    pdf_url: str
    faculty_id: str
    faculty_name: str
    has_faculty_solution: bool = False
    solution_url: Optional[str] = None
    question_count: int = 0
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
