from app.config.database import get_database
from app.models.question import QuestionCreate, ReportIssue
from datetime import datetime
from bson import ObjectId


async def create_question(question_data: QuestionCreate):
    """Create a new question"""
    db = get_database()
    questions_collection = db.questions
    
    question_dict = {
        "question_number": question_data.question_number,
        "question_text": question_data.question_text,
        "paper_id": question_data.paper_id,
        "subject": question_data.subject,
        "faculty_solution": None,
        "ai_solution": None,
        "video_links": [],
        "tags": [],
        "upvotes": 0,
        "downvotes": 0,
        "reports": [],
        "created_at": datetime.utcnow()
    }
    
    result = await questions_collection.insert_one(question_dict)
    
    # Update paper question count
    papers_collection = db.papers
    await papers_collection.update_one(
        {"_id": ObjectId(question_data.paper_id)},
        {"$inc": {"question_count": 1}}
    )
    
    question_dict["id"] = str(result.inserted_id)
    return {"success": True, "message": "Question created successfully", "question": question_dict}


async def get_questions_by_paper(paper_id: str):
    """Get all questions for a paper"""
    db = get_database()
    questions_collection = db.questions
    
    cursor = questions_collection.find({"paper_id": paper_id}).sort("question_number", 1)
    questions = []
    
    async for question in cursor:
        question["id"] = str(question.pop("_id"))
        questions.append(question)
    
    return {"success": True, "questions": questions, "total": len(questions)}


async def get_question_by_id(question_id: str):
    """Get a single question by ID"""
    db = get_database()
    questions_collection = db.questions
    
    try:
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return {"success": False, "message": "Question not found"}
        
        question["id"] = str(question.pop("_id"))
        return {"success": True, "question": question}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def generate_ai_solution(question_id: str):
    """Generate AI solution for a question (placeholder)"""
    db = get_database()
    questions_collection = db.questions
    
    try:
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return {"success": False, "message": "Question not found"}
        
        # Check if AI solution already exists
        if question.get("ai_solution"):
            return {"success": True, "message": "AI solution already exists", "ai_solution": question["ai_solution"]}
        
        # TODO: Integrate with Gemini API
        # For now, return a placeholder
        ai_solution = {
            "text": "AI solution will be generated here using Gemini API.",
            "generated_at": datetime.utcnow(),
            "model": "gemini"
        }
        
        # Update question with AI solution
        await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": {"ai_solution": ai_solution}}
        )
        
        return {"success": True, "message": "AI solution generated", "ai_solution": ai_solution}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def get_video_solutions(question_id: str):
    """Get video solutions for a question (placeholder)"""
    db = get_database()
    questions_collection = db.questions
    
    try:
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return {"success": False, "message": "Question not found"}
        
        # Check if video links already exist
        if question.get("video_links"):
            return {"success": True, "video_links": question["video_links"]}
        
        # TODO: Integrate with YouTube API
        # For now, return placeholder
        video_links = [
            {
                "title": "Sample Video 1",
                "url": "https://youtube.com/watch?v=sample1",
                "thumbnail": "https://img.youtube.com/vi/sample1/0.jpg"
            }
        ]
        
        # Update question with video links
        await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": {"video_links": video_links}}
        )
        
        return {"success": True, "video_links": video_links}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def report_question_issue(question_id: str, report: ReportIssue):
    """Report an issue with a question"""
    db = get_database()
    questions_collection = db.questions
    
    try:
        report_dict = {
            "issue_type": report.issue_type,
            "description": report.description,
            "user_id": report.user_id,
            "reported_at": datetime.utcnow()
        }
        
        result = await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {"$push": {"reports": report_dict}}
        )
        
        if result.modified_count == 0:
            return {"success": False, "message": "Question not found"}
        
        return {"success": True, "message": "Issue reported successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def vote_question(question_id: str, vote_type: str):
    """Upvote or downvote a question"""
    db = get_database()
    questions_collection = db.questions
    
    try:
        field = "upvotes" if vote_type == "up" else "downvotes"
        
        result = await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {"$inc": {field: 1}}
        )
        
        if result.modified_count == 0:
            return {"success": False, "message": "Question not found"}
        
        return {"success": True, "message": f"Question {vote_type}voted"}
    except Exception as e:
        return {"success": False, "message": str(e)}
