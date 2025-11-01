from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import connect_to_mongo, close_mongo_connection
from app.routes import auth_routes, paper_routes, question_routes

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
            "papers": {
                "get_all": "/papers",
                "get_by_id": "/papers/{id}",
                "create": "/papers (POST)",
                "faculty_papers": "/papers/faculty/{faculty_id}"
            },
            "questions": {
                "get_by_paper": "/questions/paper/{paper_id}",
                "get_by_id": "/questions/{id}",
                "ai_solution": "/questions/{id}/ai-solution (POST)",
                "video_solutions": "/questions/{id}/videos",
                "report": "/questions/{id}/report (POST)",
                "vote": "/questions/{id}/vote/{up|down} (POST)"
            }
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }
