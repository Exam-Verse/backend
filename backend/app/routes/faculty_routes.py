from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.config.database import get_database
from app.utils.jwt import get_current_user, require_role
from app.controllers.paper_controller import get_faculty_papers
from app.controllers.paper_controller import create_paper
from app.controllers.paper_controller import update_paper
from app.controllers.paper_controller import delete_paper
from app.controllers.paper_controller import get_paper_by_id
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/faculty", tags=["Faculty"])


@router.get("/dashboard")
async def faculty_dashboard(current_user: dict = Depends(require_role(["faculty", "admin"]))):
    db = get_database()
    papers = db.papers
    total_papers = await papers.count_documents({"faculty_id": current_user["user_id"]})
    recent = []
    cursor = papers.find({"faculty_id": current_user["user_id"]}).sort("created_at", -1).limit(5)
    async for p in cursor:
        p["id"] = str(p.pop("_id"))
        recent.append(p)
    return {
        "stats": {
            "totalPapers": total_papers,
        },
        "recentPapers": recent,
    }


@router.get("/papers")
async def my_papers(current_user: dict = Depends(require_role(["faculty", "admin"]))):
    db = get_database()
    papers = db.papers
    results = []
    cursor = papers.find({"faculty_id": current_user["user_id"]}).sort("created_at", -1)
    async for p in cursor:
        p["id"] = str(p.pop("_id"))
        results.append(p)
    return results


@router.get("/papers/{paper_id}/analytics")
async def paper_analytics(paper_id: str, current_user: dict = Depends(require_role(["faculty", "admin"]))):
    db = get_database()
    papers = db.papers
    p = await papers.find_one({"_id": ObjectId(paper_id), "faculty_id": current_user["user_id"]})
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    # Minimal stub analytics
    questions = db.questions
    q_count = await questions.count_documents({"paper_id": paper_id})
    return {
        "paperId": paper_id,
        "questionCount": q_count,
        "views": 0,
        "solves": 0,
    }
