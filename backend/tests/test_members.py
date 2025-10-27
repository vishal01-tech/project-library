import pytest
from fastapi.testclient import TestClient
import uuid

def test_create_member(test_client: TestClient):
    unique_email = f"test_{uuid.uuid4().hex}@example.com"
    response = test_client.post("/addmember", json={
        "name": "Test Member",
        "email": unique_email,
        "phone": "1234567890",
        "address": "Test Address"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Member added successfully"

def test_get_members(test_client: TestClient):
    response = test_client.get("/members")
    assert response.status_code == 200
    assert "data" in response.json()
    assert isinstance(response.json()["data"], list)
