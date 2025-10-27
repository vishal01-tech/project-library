import pytest
from fastapi.testclient import TestClient

def test_issue_book(test_client: TestClient):
    # First create a book
    book_response = test_client.post("/addbooks", data={
        "title": "Test Book",
        "author": "Test Author",
        "quantity": "5",
        "category": "Fiction"
    })
    book_id = book_response.json()["data"]["id"]

    # Create a member
    test_client.post("/addmember", json={
        "name": "Test Member",
        "email": "test@example.com",
        "phone": "1234567890",
        "address": "Test Address"
    })

    response = test_client.post("/issuebook", data={
        "member_phone": "1234567890",
        "book_id": str(book_id)
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Book added successfully"

def test_return_book(test_client: TestClient):
    # First issue a book
    book_response = test_client.post("/addbooks", data={
        "title": "Test Book",
        "author": "Test Author",
        "quantity": "5",
        "category": "Fiction"
    })
    book_id = book_response.json()["data"]["id"]

    test_client.post("/addmember", json={
        "name": "Test Member",
        "email": "test@example.com",
        "phone": "1234567890",
        "address": "Test Address"
    })

    test_client.post("/issuebook", data={
        "member_phone": "1234567890",
        "book_id": str(book_id)
    })

    response = test_client.post("/returnbook", data={
        "book_id": str(book_id),
        "member_id": "1"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Book returned successfully"
