from app.config.database import get_database
from app.models.paper import PaperCreate, PaperUpdate
from datetime import datetime
from bson import ObjectId
from fastapi import UploadFile
from typing import Optional
from app.utils.file_storage import upload_paper_pdf, delete_file
from app.utils.ocr_extractor import process_paper_pdf


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


async def upload_paper_with_pdf(
    file: UploadFile,
    subject: str,
    college: str,
    course: str,
    semester: int,
    year: int,
    exam_type: str,
    faculty_id: str,
    faculty_name: str,
    extract_questions: bool = True
):
    """Upload paper PDF and optionally extract questions using OCR"""
    db = get_database()
    papers_collection = db.papers
    questions_collection = db.questions
    
    try:
        # Upload the PDF file
        upload_result = await upload_paper_pdf(file)
        
        if not upload_result["success"]:
            return {"success": False, "message": "Failed to upload PDF"}
        
        # Create paper document
        paper_dict = {
            "subject": subject,
            "college": college,
            "course": course,
            "semester": semester,
            "year": year,
            "exam_type": exam_type,
            "pdf_url": upload_result["file_url"],
            "faculty_id": faculty_id,
            "faculty_name": faculty_name,
            "has_faculty_solution": False,
            "solution_url": None,
            "question_count": 0,
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert paper
        result = await papers_collection.insert_one(paper_dict)
        paper_id = str(result.inserted_id)
        paper_dict["id"] = paper_id
        
        # Extract questions if requested
        questions_created = 0
        if extract_questions:
            ocr_result = await process_paper_pdf(upload_result["file_path"])
            
            if ocr_result["success"] and ocr_result["questions"]:
                # Create question documents
                for q in ocr_result["questions"]:
                    question_dict = {
                        "paper_id": paper_id,
                        "question_number": q["question_number"],
                        "question_text": q["question_text"],
                        "marks": q.get("marks"),
                        "has_ai_solution": False,
                        "ai_solution": None,
                        "has_video_solution": False,
                        "video_url": None,
                        "views": 0,
                        "created_at": datetime.utcnow()
                    }
                    await questions_collection.insert_one(question_dict)
                    questions_created += 1
                
                # Update paper with question count
                await papers_collection.update_one(
                    {"_id": ObjectId(paper_id)},
                    {"$set": {"question_count": questions_created}}
                )
                paper_dict["question_count"] = questions_created
        
        return {
            "success": True,
            "message": "Paper uploaded successfully",
            "paper": paper_dict,
            "questions_extracted": questions_created,
            "file_info": {
                "filename": upload_result["filename"],
                "size": upload_result["file_size"]
            }
        }
    except Exception as e:
        return {"success": False, "message": f"Upload failed: {str(e)}"}


async def update_paper_solution(paper_id: str, file: UploadFile):
    """Upload faculty solution for a paper"""
    from app.utils.file_storage import upload_solution_file
    
    db = get_database()
    papers_collection = db.papers
    
    try:
        # Upload the solution file
        upload_result = await upload_solution_file(file)
        
        if not upload_result["success"]:
            return {"success": False, "message": "Failed to upload solution"}
        
        # Update paper with solution URL
        result = await papers_collection.update_one(
            {"_id": ObjectId(paper_id)},
            {
                "$set": {
                    "has_faculty_solution": True,
                    "solution_url": upload_result["file_url"],
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            return {"success": False, "message": "Paper not found"}
        
        return {
            "success": True,
            "message": "Solution uploaded successfully",
            "solution_url": upload_result["file_url"]
        }
    except Exception as e:
        return {"success": False, "message": f"Upload failed: {str(e)}"}

