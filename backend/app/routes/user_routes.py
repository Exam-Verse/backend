from fastapi import APIRouter, Depends, HTTPException
from app.config.database import get_database
from app.utils.jwt import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    user = await users.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user.pop("_id"))
    # Hide sensitive fields
    user.pop("hashed_password", None)
    return {"success": True, "user": user}


@router.put("/profile")
async def update_profile(data: dict, current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    allowed = {"college", "course", "year", "department", "username"}
    update = {k: v for k, v in data.items() if k in allowed}
    if not update:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    await users.update_one({"_id": ObjectId(current_user["user_id"])}, {"$set": update})
    return {"success": True, "message": "Profile updated"}


@router.get("/saved/papers")
async def get_saved_papers(current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    papers = db.papers
    user = await users.find_one({"_id": ObjectId(current_user["user_id"])})
    saved_ids = user.get("saved_papers", []) if user else []
    results = []
    if saved_ids:
        cursor = papers.find({"_id": {"$in": [ObjectId(pid) for pid in saved_ids]}})
        async for p in cursor:
            p["id"] = str(p.pop("_id"))
            results.append(p)
    return results


@router.get("/saved/questions")
async def get_saved_questions(current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    questions = db.questions
    user = await users.find_one({"_id": ObjectId(current_user["user_id"])})
    saved_ids = user.get("saved_questions", []) if user else []
    results = []
    if saved_ids:
        cursor = questions.find({"_id": {"$in": [ObjectId(qid) for qid in saved_ids]}})
        async for q in cursor:
            q["id"] = str(q.pop("_id"))
            results.append(q)
    return results


@router.post("/saved/papers/{paper_id}")
async def save_paper(paper_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    await users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$addToSet": {"saved_papers": paper_id}}
    )
    return {"success": True, "message": "Paper saved"}


@router.delete("/saved/papers/{paper_id}")
async def unsave_paper(paper_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    await users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$pull": {"saved_papers": paper_id}}
    )
    return {"success": True, "message": "Paper unsaved"}


@router.post("/saved/questions/{question_id}")
async def save_question(question_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    await users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$addToSet": {"saved_questions": question_id}}
    )
    return {"success": True, "message": "Question saved"}


@router.delete("/saved/questions/{question_id}")
async def unsave_question(question_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = db.users
    await users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$pull": {"saved_questions": question_id}}
    )
    return {"success": True, "message": "Question unsaved"}
