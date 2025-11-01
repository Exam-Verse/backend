from fastapi import APIRouter, HTTPException
from app.models.question import QuestionCreate, ReportIssue
from app.controllers.question_controller import (
    create_question,
    get_questions_by_paper,
    get_question_by_id,
    generate_ai_solution,
    get_video_solutions,
    report_question_issue,
    vote_question
)

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.post("/")
async def create_question_route(question: QuestionCreate):
    """Create a new question"""
    result = await create_question(question)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.get("/paper/{paper_id}")
async def get_questions_by_paper_route(paper_id: str):
    """Get all questions for a paper"""
    result = await get_questions_by_paper(paper_id)
    return result


@router.get("/{question_id}")
async def get_question_route(question_id: str):
    """Get a single question by ID"""
    result = await get_question_by_id(question_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return result


@router.post("/{question_id}/ai-solution")
async def generate_ai_solution_route(question_id: str):
    """Generate AI solution for a question"""
    result = await generate_ai_solution(question_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.get("/{question_id}/videos")
async def get_video_solutions_route(question_id: str):
    """Get video solutions for a question"""
    result = await get_video_solutions(question_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.post("/{question_id}/report")
async def report_issue_route(question_id: str, report: ReportIssue):
    """Report an issue with a question"""
    result = await report_question_issue(question_id, report)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.post("/{question_id}/vote/{vote_type}")
async def vote_question_route(question_id: str, vote_type: str):
    """Upvote or downvote a question"""
    if vote_type not in ["up", "down"]:
        raise HTTPException(status_code=400, detail="Invalid vote type")
    
    result = await vote_question(question_id, vote_type)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result
