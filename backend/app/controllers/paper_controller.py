from app.config.database import get_database
from app.models.paper import PaperCreate, PaperUpdate
from datetime import datetime
from bson import ObjectId


async def create_paper(paper_data: PaperCreate, faculty_name: str):
    """Create a new paper"""
    db = get_database()
    papers_collection = db.papers
    
    paper_dict = {
        "subject": paper_data.subject,
        "college": paper_data.college,
        "course": paper_data.course,
        "semester": paper_data.semester,
        "year": paper_data.year,
        "exam_type": paper_data.exam_type,
        "pdf_url": paper_data.pdf_url,
        "faculty_id": paper_data.faculty_id,
        "faculty_name": faculty_name,
        "has_faculty_solution": paper_data.has_faculty_solution,
        "solution_url": paper_data.solution_url,
        "question_count": 0,
        "views": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await papers_collection.insert_one(paper_dict)
    
    paper_dict["id"] = str(result.inserted_id)
    return {"success": True, "message": "Paper created successfully", "paper": paper_dict}


async def get_all_papers(filters: dict = None, skip: int = 0, limit: int = 20):
    """Get all papers with optional filters"""
    db = get_database()
    papers_collection = db.papers
    
    query = {}
    if filters:
        if filters.get("college"):
            query["college"] = filters["college"]
        if filters.get("course"):
            query["course"] = filters["course"]
        if filters.get("subject"):
            query["subject"] = filters["subject"]
        if filters.get("year"):
            query["year"] = filters["year"]
        if filters.get("exam_type"):
            query["exam_type"] = filters["exam_type"]
        if filters.get("has_faculty_solution") is not None:
            query["has_faculty_solution"] = filters["has_faculty_solution"]
    
    cursor = papers_collection.find(query).skip(skip).limit(limit).sort("created_at", -1)
    papers = []
    
    async for paper in cursor:
        paper["id"] = str(paper.pop("_id"))
        papers.append(paper)
    
    total = await papers_collection.count_documents(query)
    
    return {"success": True, "papers": papers, "total": total, "skip": skip, "limit": limit}


async def get_paper_by_id(paper_id: str):
    """Get a single paper by ID"""
    db = get_database()
    papers_collection = db.papers
    
    try:
        paper = await papers_collection.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return {"success": False, "message": "Paper not found"}
        
        # Increment views
        await papers_collection.update_one(
            {"_id": ObjectId(paper_id)},
            {"$inc": {"views": 1}}
        )
        
        paper["id"] = str(paper.pop("_id"))
        return {"success": True, "paper": paper}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def update_paper(paper_id: str, update_data: PaperUpdate):
    """Update a paper"""
    db = get_database()
    papers_collection = db.papers
    
    update_dict = {k: v for k, v in update_data.dict(exclude_unset=True).items()}
    update_dict["updated_at"] = datetime.utcnow()
    
    try:
        result = await papers_collection.update_one(
            {"_id": ObjectId(paper_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            return {"success": False, "message": "Paper not found or not modified"}
        
        return {"success": True, "message": "Paper updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def delete_paper(paper_id: str):
    """Delete a paper"""
    db = get_database()
    papers_collection = db.papers
    questions_collection = db.questions
    
    try:
        # Delete associated questions
        await questions_collection.delete_many({"paper_id": paper_id})
        
        # Delete paper
        result = await papers_collection.delete_one({"_id": ObjectId(paper_id)})
        
        if result.deleted_count == 0:
            return {"success": False, "message": "Paper not found"}
        
        return {"success": True, "message": "Paper deleted successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def get_faculty_papers(faculty_id: str):
    """Get all papers uploaded by a faculty"""
    db = get_database()
    papers_collection = db.papers
    
    cursor = papers_collection.find({"faculty_id": faculty_id}).sort("created_at", -1)
    papers = []
    
    async for paper in cursor:
        paper["id"] = str(paper.pop("_id"))
        papers.append(paper)
    
    return {"success": True, "papers": papers, "total": len(papers)}
