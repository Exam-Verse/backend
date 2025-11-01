# 🎓 ExamVerse - Complete Project Setup Guide

**Project Name**: ExamVerse  
**Tagline**: Previous-year papers. Verified solutions. AI + video explanations. One platform.

---

## 📁 Project Structure

```
examverse-backend/
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config/
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── paper.py
│   │   │   └── question.py
│   │   ├── controllers/
│   │   │   ├── auth_controller.py
│   │   │   ├── paper_controller.py
│   │   │   └── question_controller.py
│   │   └── routes/
│   │       ├── auth_routes.py
│   │       ├── paper_routes.py
│   │       └── question_routes.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/                     # React + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/              # Button, Input, Card, Modal, etc.
    │   │   └── layout/          # Navbar, Footer
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── About.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── StudentDashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── authStore.js
    │   ├── App.jsx
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start Guide

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment**:
   ```bash
   copy .env.example .env
   # Edit .env with your MongoDB URL
   ```

5. **Start backend server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

**Backend runs on**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

---

### Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   ```bash
   # Create .env file
   VITE_API_URL=http://localhost:8000
   ```

4. **Start frontend server**:
   ```bash
   npm run dev
   ```

**Frontend runs on**: http://localhost:5173

---

## 🎨 Design System - Neo-Brutalism

### Core Principles
- ✅ **Thick borders** (3-5px)
- ✅ **Hard shadows** (no blur)
- ✅ **Bold, pure colors**
- ✅ **Raw typography**
- ✅ **Boxy elements**
- ❌ **No gradients**
- ❌ **No rounded corners**
- ❌ **No soft shadows**

### Color Palette
```css
Primary:   #FF6B35 (Bold Orange)
Secondary: #FFD23F (Bold Yellow)
Accent:    #00D9FF (Bright Cyan)
Success:   #06FFA5 (Neon Green)
Danger:    #FF006E (Hot Pink)
Dark:      #1A1A1A (Almost Black)
Light:     #FFFFFF (Pure White)
```

### UI Components
- **Button**: 4 variants (primary, secondary, accent, outline)
- **Input**: With error states and labels
- **Card**: Hoverable with brutal shadows
- **Modal**: Full-screen with backdrop
- **Badge**: Status indicators
- **Select**: Dropdown with brutal styling

---

## 📡 API Endpoints

### Authentication
```
POST /auth/register   - Register new user
POST /auth/login      - Login user
```

### Papers
```
GET    /papers                     - Get all papers (with filters)
GET    /papers/{id}                - Get paper by ID
POST   /papers                     - Create paper (Faculty)
PUT    /papers/{id}                - Update paper (Faculty)
DELETE /papers/{id}                - Delete paper (Faculty/Admin)
GET    /papers/faculty/{id}        - Get faculty's papers
```

### Questions
```
GET  /questions/paper/{paper_id}   - Get questions for paper
GET  /questions/{id}                - Get question by ID
POST /questions                     - Create question
POST /questions/{id}/ai-solution    - Generate AI solution
GET  /questions/{id}/videos         - Get video solutions
POST /questions/{id}/report         - Report issue
POST /questions/{id}/vote/{up|down} - Vote on solution
```

---

## 💾 Database Schema

### Users Collection
```json
{
  "email": "student@college.com",
  "username": "john_doe",
  "role": "student",
  "hashed_password": "...",
  "college": "ABC University",
  "course": "B.Tech CSE",
  "year": "3",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00"
}
```

### Papers Collection
```json
{
  "subject": "Computer Networks",
  "college": "ABC University",
  "course": "B.Tech CSE",
  "semester": "5",
  "year": "2024",
  "exam_type": "Midterm",
  "pdf_url": "https://cloudinary.com/...",
  "faculty_id": "faculty_123",
  "faculty_name": "Dr. Smith",
  "has_faculty_solution": true,
  "solution_url": "https://...",
  "question_count": 10,
  "views": 150,
  "created_at": "2024-01-01T00:00:00"
}
```

### Questions Collection
```json
{
  "question_number": 1,
  "question_text": "Explain OSI Model with diagram",
  "paper_id": "paper_123",
  "subject": "Computer Networks",
  "faculty_solution": "The OSI model...",
  "ai_solution": {
    "text": "AI generated answer...",
    "generated_at": "2024-01-01T00:00:00",
    "model": "gemini"
  },
  "video_links": [
    {
      "title": "OSI Model Explained",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail": "https://img.youtube.com/..."
    }
  ],
  "tags": ["networking", "osi"],
  "upvotes": 10,
  "downvotes": 2,
  "reports": [],
  "created_at": "2024-01-01T00:00:00"
}
```

---

## ✅ Features Implemented

### Frontend ✅
- [x] Landing page with hero section
- [x] About page
- [x] Login/Register pages
- [x] Student dashboard
- [x] Protected routes
- [x] Neo-Brutalist UI components
- [x] Responsive navigation
- [x] State management (Zustand)
- [x] API integration layer

### Backend ✅
- [x] User authentication (register/login)
- [x] Role-based user system (student/faculty/admin)
- [x] Paper CRUD operations
- [x] Question CRUD operations
- [x] AI solution generation (placeholder)
- [x] Video solution links (placeholder)
- [x] Report system
- [x] Vote system
- [x] MongoDB integration
- [x] CORS configured

---

## 🚧 Next Steps (To Complete MVP)

### High Priority
1. **PDF Upload System**
   - Integrate Cloudinary/Firebase for PDF storage
   - Add file upload endpoint
   - Implement PDF viewer component

2. **OCR Integration**
   - Integrate Tesseract.js or OCR.space
   - Extract questions from PDFs automatically
   - Parse question numbers and text

3. **AI Integration (Gemini API)**
   - Set up Google Gemini API key
   - Implement solution generation
   - Add retry logic and error handling

4. **YouTube API Integration**
   - Set up YouTube Data API
   - Fetch relevant videos for questions
   - Display in modal

5. **JWT Authentication**
   - Implement token generation
   - Add protected route middleware
   - Token refresh mechanism

### Medium Priority
6. **Papers Browsing Page**
   - Filter UI component
   - Search functionality
   - Pagination

7. **Paper Viewer Page**
   - PDF preview
   - Question list sidebar
   - Solution display

8. **Faculty Dashboard**
   - Upload paper form
   - Manage papers page
   - Analytics view

9. **Admin Dashboard**
   - Faculty verification UI
   - Reports handling
   - Platform analytics

10. **Saved Items**
    - Save papers functionality
    - Save questions functionality
    - Saved items page

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=examverse
SECRET_KEY=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
YOUTUBE_API_KEY=your-youtube-api-key
CLOUDINARY_URL=your-cloudinary-url
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Passlib** - Password hashing
- **Uvicorn** - ASGI server

### External APIs (To Integrate)
- **Google Gemini** - AI solutions
- **YouTube Data API** - Video solutions
- **Tesseract.js/OCR.space** - PDF text extraction
- **Cloudinary/Firebase** - File storage

---

## 🎯 User Roles & Features

### Student
- Browse papers by college/course/subject/year
- View PDFs and questions
- Get AI solutions
- Watch video explanations
- Save papers and questions
- Track progress
- Report incorrect solutions

### Faculty
- Upload question papers (PDF)
- Upload solution PDFs (optional)
- View upload analytics
- Edit/delete their papers
- Verification required by admin

### Admin
- Approve/reject faculty registrations
- View all papers and users
- Handle reported issues
- Platform-wide analytics
- Remove inappropriate content

---

## 🌐 Deployment

### Backend (Render/Railway)
```bash
# Procfile
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Database (MongoDB Atlas)
- Free tier available
- Create cluster
- Get connection string
- Update .env

---

## 📝 Git Workflow

```bash
# Commit backend changes
cd backend
git add .
git commit -m "feat: add paper routes"

# Commit frontend changes
cd frontend
git add .
git commit -m "feat: add paper viewer page"

# Push to main
git push origin main
```

---

## 🐛 Common Issues & Fixes

### Issue: Frontend can't connect to backend
**Fix**: Check CORS settings in backend `main.py` and `VITE_API_URL` in frontend `.env`

### Issue: MongoDB connection error
**Fix**: Ensure MongoDB is running locally or check Atlas connection string

### Issue: Tailwind styles not working
**Fix**: Restart dev server after changing `tailwind.config.js`

### Issue: Module import errors
**Fix**: Check file paths and ensure `__init__.py` files exist

---

## 📚 Documentation Links

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Gemini API**: https://ai.google.dev
- **YouTube API**: https://developers.google.com/youtube

---

## 🏆 Project Status

**✅ Phase 1**: Core setup and authentication - **COMPLETED**  
**✅ Phase 2**: Database models and API routes - **COMPLETED**  
**🚧 Phase 3**: PDF upload and OCR - **IN PROGRESS**  
**⏳ Phase 4**: AI & YouTube integration - **PENDING**  
**⏳ Phase 5**: Complete all dashboards - **PENDING**  
**⏳ Phase 6**: Testing & deployment - **PENDING**

---

## 🤝 Contributing

This project is built for hackathons and learning. Follow Neo-Brutalism design principles and maintain clean code structure.

---

**Built with ❤️ for students everywhere**

© 2025 ExamVerse - All rights reserved
