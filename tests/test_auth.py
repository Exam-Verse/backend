import os
from pymongo import MongoClient

# Use a separate MongoDB database for tests before importing the app
os.environ["MONGODB_URI"] = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
os.environ["MONGODB_DB"] = "examverse_test"

# Drop the test database to start clean
_client = MongoClient(os.environ["MONGODB_URI"])  # type: ignore
_client.drop_database(os.environ["MONGODB_DB"])  # type: ignore

from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402

client = TestClient(app)


def test_register_and_login_flow():
    email = "user@example.com"
    password = "strongpassword"

    # Register
    r = client.post("/register", json={"email": email, "password": password})
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["email"] == email
    assert "id" in data

    # Duplicate register should fail
    r2 = client.post("/register", json={"email": email, "password": password})
    assert r2.status_code == 400

    # Login success
    r3 = client.post("/login", json={"email": email, "password": password})
    assert r3.status_code == 200, r3.text
    token = r3.json()
    assert token["token_type"] == "bearer"
    assert isinstance(token["access_token"], str) and len(token["access_token"]) > 10

    # Login wrong password
    r4 = client.post("/login", json={"email": email, "password": "wrongpass"})
    assert r4.status_code == 401
