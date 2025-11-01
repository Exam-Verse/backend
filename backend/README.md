# ExamVerse Backend

A FastAPI backend application with MongoDB for the ExamVerse platform - Previous-year papers with AI-powered solutions.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config/
│   │   ├── __init__.py
│   │   └── database.py      # MongoDB connection configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User data models
│   │   ├── paper.py         # Paper data models
│   │   └── question.py      # Question data models
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── auth_controller.py      # Authentication logic
│   │   ├── paper_controller.py     # Paper management logic
│   │   └── question_controller.py  # Question management logic
│   └── routes/
│       ├── __init__.py
│       ├── auth_routes.py     # Authentication endpoints
│       ├── paper_routes.py    # Paper endpoints
│       └── question_routes.py # Question endpoints
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

1. **Clone the repository**

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file**
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` with your MongoDB connection details.

6. **Run MongoDB**
   Make sure MongoDB is running locally or update the `MONGODB_URL` in `.env`

7. **Start the application**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Endpoints

### Authentication (`/auth`)

- **POST /auth/register**
  - Register a new user (student or faculty)
  - Body: 
    ```json
    {
      "email": "user@example.com",
      "username": "username",
      "password": "password",
      "role": "student",
      "college": "Your College",
      "course": "B.Tech CSE",
      "year": "3"
    }
    ```

- **POST /auth/login**
  - Login with existing credentials
  - Body: 
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

### Papers (`/papers`)

- **GET /papers**
  - Get all papers with optional filters
  - Query params: `college`, `course`, `subject`, `year`, `exam_type`, `has_faculty_solution`, `skip`, `limit`

- **GET /papers/{paper_id}**
  - Get a single paper by ID

- **POST /papers**
  - Create a new paper (Faculty only)
  - Body:
    ```json
    {
      "subject": "Computer Networks",
      "college": "ABC College",
      "course": "B.Tech CSE",
      "semester": "5",
      "year": "2024",
      "exam_type": "Midterm",
      "pdf_url": "https://...",
      "faculty_id": "faculty_user_id",
      "has_faculty_solution": true,
      "solution_url": "https://..."
    }
    ```

- **PUT /papers/{paper_id}**
  - Update a paper (Faculty only)

- **DELETE /papers/{paper_id}**
  - Delete a paper (Faculty/Admin only)

- **GET /papers/faculty/{faculty_id}**
  - Get all papers by a faculty member

### Questions (`/questions`)

- **GET /questions/paper/{paper_id}**
  - Get all questions for a paper

- **GET /questions/{question_id}**
  - Get a single question by ID

- **POST /questions**
  - Create a new question
  - Body:
    ```json
    {
      "question_number": 1,
      "question_text": "Explain OSI Model",
      "paper_id": "paper_id",
      "subject": "Computer Networks"
    }
    ```

- **POST /questions/{question_id}/ai-solution**
  - Generate AI solution for a question

- **GET /questions/{question_id}/videos**
  - Get video solutions for a question

- **POST /questions/{question_id}/report**
  - Report an issue with a question
  - Body:
    ```json
    {
      "issue_type": "wrong_answer",
      "description": "The AI solution is incorrect",
      "user_id": "user_id"
    }
    ```

- **POST /questions/{question_id}/vote/{up|down}**
  - Upvote or downvote a question solution

### Root

- **GET /**
  - Welcome message and API information

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Database Collections

### users
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "username": "username",
  "role": "student|faculty|admin",
  "hashed_password": "...",
  "college": "ABC College",
  "course": "B.Tech CSE",
  "year": "3",
  "is_verified": true,
  "created_at": ISODate
}
```

### papers
```json
{
  "_id": ObjectId,
  "subject": "Computer Networks",
  "college": "ABC College",
  "course": "B.Tech CSE",
  "semester": "5",
  "year": "2024",
  "exam_type": "Midterm",
  "pdf_url": "https://...",
  "faculty_id": "faculty_user_id",
  "faculty_name": "Dr. Smith",
  "has_faculty_solution": true,
  "solution_url": "https://...",
  "question_count": 10,
  "views": 150,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### questions
```json
{
  "_id": ObjectId,
  "question_number": 1,
  "question_text": "Explain OSI Model",
  "paper_id": "paper_id",
  "subject": "Computer Networks",
  "faculty_solution": "...",
  "ai_solution": {
    "text": "...",
    "generated_at": ISODate,
    "model": "gemini"
  },
  "video_links": [
    {
      "title": "OSI Model Explained",
      "url": "https://youtube.com/...",
      "thumbnail": "https://..."
    }
  ],
  "tags": ["networking", "osi", "layers"],
  "upvotes": 10,
  "downvotes": 2,
  "reports": [],
  "created_at": ISODate
}
```

## Technologies

- **FastAPI** - Modern web framework for building APIs
- **MongoDB** - NoSQL database via Motor (async driver)
- **Pydantic** - Data validation
- **Passlib** - Password hashing with Bcrypt
- **Uvicorn** - ASGI server

## Features

✅ User authentication (Students, Faculty, Admin)  
✅ Role-based access control  
✅ Paper management with filters  
✅ Question extraction and storage  
✅ AI solution generation (placeholder for Gemini API)  
✅ Video solution links (placeholder for YouTube API)  
✅ Report system for incorrect solutions  
✅ Upvote/downvote system  
✅ Faculty verification system  

## Next Steps

- [ ] Integrate Gemini API for AI solutions
- [ ] Integrate YouTube API for video solutions
- [ ] Add OCR for PDF question extraction
- [ ] Implement JWT authentication
- [ ] Add file upload for PDFs
- [ ] Implement admin verification workflow
- [ ] Add analytics endpoints
- [ ] Implement saved papers/questions functionality

## License

MIT License
