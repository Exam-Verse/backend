from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config.database import connect_to_mongo, close_mongo_connection
from app.routes import auth_routes, paper_routes, question_routes
from app.routes import video_routes
from app.routes import user_routes, faculty_routes, admin_routes

app = FastAPI(
    title="ExamVerse API",
    description="Backend API for ExamVerse - Previous-year papers with AI solutions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    await close_mongo_connection()


# Include routers
app.include_router(auth_routes.router)
app.include_router(paper_routes.router)
app.include_router(question_routes.router)
app.include_router(video_routes.router)
app.include_router(user_routes.router)
app.include_router(faculty_routes.router)
app.include_router(admin_routes.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ExamVerse API",
        "version": "1.0.0",
        "tagline": "Previous-year papers. Verified solutions. AI + video explanations. One platform.",
        "endpoints": {
            "auth": {
                "register": "/auth/register",
                "login": "/auth/login"
            },
            "user": {
                "profile_get": "/user/profile (GET)",
                "profile_update": "/user/profile (PUT)",
                "saved_papers": "/user/saved/papers",
                "saved_questions": "/user/saved/questions",
                "save_paper": "/user/saved/papers/{paper_id} (POST)",
                "unsave_paper": "/user/saved/papers/{paper_id} (DELETE)",
                "save_question": "/user/saved/questions/{question_id} (POST)",
                "unsave_question": "/user/saved/questions/{question_id} (DELETE)"
            },
            "faculty": {
                "dashboard": "/faculty/dashboard",
                "my_papers": "/faculty/papers",
                "paper_analytics": "/faculty/papers/{paper_id}/analytics"
            },
            "admin": {
                "pending_faculty": "/admin/faculty/pending",
                "approve_faculty": "/admin/faculty/{user_id}/approve",
                "reject_faculty": "/admin/faculty/{user_id}/reject",
                "reports": "/admin/reports",
                "analytics": "/admin/analytics"
            },
            "papers": {
                "get_all": "/papers",
                "get_by_id": "/papers/{id}",
                "create": "/papers (POST)",
                "upload": "/papers/upload (POST - multipart/form-data)",
                "add_solution": "/papers/{id}/solution (POST)",
                "faculty_papers": "/papers/faculty/{faculty_id}"
            },
            "questions": {
                "get_by_paper": "/questions/paper/{paper_id}",
                "get_by_id": "/questions/{id}",
                "ai_solution": "/questions/{id}/ai-solution (POST)",
                "video_solutions": "/questions/{id}/videos",
                "report": "/questions/{id}/report (POST)",
                "vote": "/questions/{id}/vote/{up|down} (POST)"
            },
            "videos": {
                "search": "/videos/search",
                "topic": "/videos/topic",
                "details": "/videos/{video_id}"
            }
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Render monitoring"""
    from app.config.database import get_database
    
    status = {
        "status": "healthy",
        "api": "operational",
        "database": "unknown"
    }
    
    try:
        db = get_database()
        if db is not None:
            # Quick ping to verify connection
            await db.command("ping")
            status["database"] = "connected"
        else:
            status["database"] = "disconnected"
            status["status"] = "degraded"
    except Exception as e:
        status["database"] = "error"
        status["status"] = "degraded"
    
    return status
