import uuid
from fastapi.testclient import TestClient


def test_signup(test_client: TestClient):
    unique_email = f"user_{uuid.uuid4().hex}@example.com"
    response = test_client.post("/signup", json={
        "fullname": "Test User",          
        "email": unique_email,
        "password": "securepass123",
        "role": "user"                  
    })
    assert response.status_code == 200
    assert response.json()["message"] == "User created successfully"


def test_login(test_client: TestClient):
    # create a unique email for login test
    unique_email = f"login_{uuid.uuid4().hex}@example.com"

    # ✅ first signup the user
    test_client.post("/signup", json={
        "fullname": "Login User",
        "email": unique_email,
        "password": "password123",
        "role": "user"
    })

    # ✅ then try to login
    response = test_client.post("/login", json={
        "email": unique_email,
        "password": "password123"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()["data"]
