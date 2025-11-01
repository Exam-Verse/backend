# Examverse Backend (Auth MVP)

This is a minimal FastAPI authentication service providing `/register` and `/login` endpoints with password hashing (bcrypt) and JWT issuance. The primary database is MongoDB (via Motor).

## Endpoints

- POST `/register` — Body: `{ "email": string, "password": string(min 8) }` — Creates a user.
- POST `/login` — Body: `{ "email": string, "password": string }` — Returns `{ access_token, token_type }`.

## Quickstart (Windows PowerShell)

```powershell
# 1) Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2) Install dependencies
pip install -U pip
pip install -r requirements.txt

# 3) Ensure MongoDB is running locally
#    - Start the MongoDB Windows service or run `mongod` locally

# 4) Run tests (uses database `examverse_test`)
pytest -q

# 5) Run the API locally (uses database `examverse` by default)
uvicorn app.main:app --reload --port 8000
```

Open http://127.0.0.1:8000/docs for interactive docs.

## Configuration

Environment variables (optional):
- `MONGODB_URI` — default: `mongodb://localhost:27017`
- `MONGODB_DB` — default: `examverse`
- `SECRET_KEY` — default: `change-me-in-prod`
- `JWT_ALGORITHM` — default: `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` — default: `60`

## Notes
- The app ensures a unique index on `users.email` at startup.
- Passwords are hashed with bcrypt via Passlib.
