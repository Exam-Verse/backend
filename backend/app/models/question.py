from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class VideoLink(BaseModel):
    title: str
    url: str
    thumbnail: Optional[str] = None


class QuestionBase(BaseModel):
    question_number: int
    question_text: str
    paper_id: str
    subject: str


class QuestionCreate(QuestionBase):
    pass


class AISolution(BaseModel):
    text: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    model: str = "gemini"


class QuestionResponse(QuestionBase):
    id: str
    faculty_solution: Optional[str] = None
    ai_solution: Optional[AISolution] = None
    video_links: List[VideoLink] = []
    tags: List[str] = []
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class QuestionInDB(QuestionBase):
    faculty_solution: Optional[str] = None
    ai_solution: Optional[dict] = None
    video_links: List[dict] = []
    tags: List[str] = []
    upvotes: int = 0
    downvotes: int = 0
    reports: List[dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReportIssue(BaseModel):
    issue_type: str  # wrong_answer, wrong_ocr, missing_topic
    description: str
    user_id: str
