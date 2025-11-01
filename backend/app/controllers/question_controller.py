from app.config.database import get_database
from app.models.question import QuestionCreate, ReportIssue
from datetime import datetime
from bson import ObjectId
from app.utils.gemini_ai import generate_ai_solution as gemini_generate, is_gemini_configured
from app.utils.youtube_search import search_videos_for_question, is_youtube_configured


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
    """Generate AI solution for a question using Gemini"""
    db = get_database()
    questions_collection = db.questions
    papers_collection = db.papers
    
    try:
        # Check if Gemini is configured
        if not is_gemini_configured():
            return {
                "success": False,
                "message": "AI service not configured. Please set GEMINI_API_KEY in .env file"
            }
        
        # Get question
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return {"success": False, "message": "Question not found"}
        
        # Check if AI solution already exists
        if question.get("ai_solution") and question["ai_solution"].get("text"):
            return {
                "success": True,
                "message": "AI solution already exists",
                "ai_solution": question["ai_solution"],
                "cached": True
            }
        
        # Get paper context
        paper = None
        if question.get("paper_id"):
            paper = await papers_collection.find_one({"_id": ObjectId(question["paper_id"])})
        
        # Build context
        context = {}
        if paper:
            context["subject"] = paper.get("subject")
            context["course"] = paper.get("course")
        if question.get("marks"):
            context["marks"] = question["marks"]
        
        # Generate AI solution
        result = await gemini_generate(question["question_text"], context)
        
        if not result["success"]:
            return {
                "success": False,
                "message": f"Failed to generate AI solution: {result.get('error', 'Unknown error')}"
            }
        
        # Prepare AI solution object
        ai_solution = {
            "text": result["solution"],
            "generated_at": datetime.utcnow(),
            "model": result.get("model", "gemini-pro"),
            "has_ai_solution": True
        }
        
        # Update question with AI solution
        await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {
                "$set": {
                    "ai_solution": ai_solution,
                    "has_ai_solution": True
                }
            }
        )
        
        return {
            "success": True,
            "message": "AI solution generated successfully",
            "ai_solution": ai_solution,
            "cached": False
        }
    except Exception as e:
        return {"success": False, "message": f"Error generating AI solution: {str(e)}"}


async def get_video_solutions(question_id: str, force_refresh: bool = False):
    """Get video solutions for a question using YouTube API"""
    db = get_database()
    questions_collection = db.questions
    papers_collection = db.papers
    
    try:
        # Check if YouTube API is configured
        if not is_youtube_configured():
            return {
                "success": False,
                "message": "YouTube API not configured. Please set YOUTUBE_API_KEY in .env file",
                "video_links": []
            }
        
        # Get question
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return {"success": False, "message": "Question not found", "video_links": []}
        
        # Check if video links already exist and not forcing refresh
        if not force_refresh and question.get("video_links") and len(question["video_links"]) > 0:
            return {
                "success": True,
                "video_links": question["video_links"],
                "cached": True
            }
        
        # Get paper for subject context
        subject = None
        if question.get("paper_id"):
            paper = await papers_collection.find_one({"_id": ObjectId(question["paper_id"])})
            if paper:
                subject = paper.get("subject")
        
        # Search for videos
        result = await search_videos_for_question(
            question_text=question["question_text"],
            subject=subject,
            max_results=5
        )
        
        if not result["success"]:
            return {
                "success": False,
                "message": f"Failed to fetch videos: {result.get('error', 'Unknown error')}",
                "video_links": []
            }
        
        # Format video links
        video_links = []
        for video in result.get("videos", []):
            video_links.append({
                "video_id": video["video_id"],
                "title": video["title"],
                "url": video["url"],
                "embed_url": video["embed_url"],
                "thumbnail": video["thumbnail"],
                "channel": video["channel_title"],
                "views": video.get("view_count", 0),
                "duration": video.get("duration", "PT0S")
            })
        
        # Update question with video links
        await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {
                "$set": {
                    "video_links": video_links,
                    "has_video_solution": len(video_links) > 0,
                    "videos_updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "success": True,
            "video_links": video_links,
            "total": len(video_links),
            "cached": False
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching videos: {str(e)}",
            "video_links": []
        }


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
