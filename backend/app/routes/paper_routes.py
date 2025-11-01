from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from app.models.paper import PaperCreate, PaperUpdate
from app.controllers.paper_controller import (
    create_paper,
    get_all_papers,
    get_paper_by_id,
    update_paper,
    delete_paper,
    get_faculty_papers
)
from app.utils.jwt import get_current_user, require_role

router = APIRouter(prefix="/papers", tags=["Papers"])


@router.post("/", dependencies=[Depends(require_role(["faculty"]))])
async def create_paper_route(
    paper: PaperCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new paper (Faculty only)"""
    result = await create_paper(paper, current_user["username"])
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.get("/")
async def get_papers(
    college: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    exam_type: Optional[str] = Query(None),
    has_faculty_solution: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all papers with optional filters"""
    filters = {
        "college": college,
        "course": course,
        "subject": subject,
        "year": year,
        "exam_type": exam_type,
        "has_faculty_solution": has_faculty_solution
    }
    
    # Remove None values
    filters = {k: v for k, v in filters.items() if v is not None}
    
    result = await get_all_papers(filters, skip, limit)
    return result


@router.get("/{paper_id}")
async def get_paper(paper_id: str):
    """Get a single paper by ID"""
    result = await get_paper_by_id(paper_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return result


@router.put("/{paper_id}", dependencies=[Depends(require_role(["faculty"]))])
async def update_paper_route(
    paper_id: str,
    paper: PaperUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a paper (Faculty only)"""
    result = await update_paper(paper_id, paper)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.delete("/{paper_id}", dependencies=[Depends(require_role(["faculty", "admin"]))])
async def delete_paper_route(
    paper_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a paper (Faculty/Admin only)"""
    result = await delete_paper(paper_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return result


@router.get("/faculty/{faculty_id}")
async def get_faculty_papers_route(faculty_id: str):
    """Get all papers by a faculty member"""
    result = await get_faculty_papers(faculty_id)
    return result
