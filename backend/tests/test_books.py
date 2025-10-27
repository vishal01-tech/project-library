import pytest
from app.crud.books import create_book, get_books, get_book_by_id, update_book_crud, delete_book
from app.schemas.books import BookCreate, BookUpdate

def test_create_book(test_client):
    # Use the correct endpoint /addbooks with form data
    response = test_client.post("/addbooks", data={
        "title": "Test Book",
        "author": "Test Author",
        "quantity": "5",
        "category": "Fiction"
    })
    assert response.status_code == 200  # success_response returns 200
    assert response.json()["data"]["title"] == "Test Book"

def test_get_books(test_client):
    response = test_client.get("/books")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "data" in response.json()

def test_get_book_by_id(test_client):
    # First create a book
    create_response = test_client.post("/addbooks", data={
        "title": "Test Book 2",
        "author": "Test Author 2",
        "quantity": "3",
        "category": "Non-Fiction"
    })
    book_id = create_response.json()["data"]["id"]

    response = test_client.get(f"/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book 2"

def test_update_book(test_client):
    # First create a book
    create_response = test_client.post("/addbooks", data={
        "title": "Test Book 3",
        "author": "Test Author 3",
        "quantity": "2",
        "category": "Sci-Fi"
    })
    book_id = create_response.json()["data"]["id"]

    # Update using PUT with form data
    response = test_client.put(f"/books/{book_id}", data={"title": "Updated Title"})
    assert response.status_code == 200
    assert response.json()["data"]["title"] == "Updated Title"

def test_delete_book(test_client):
    # First create a book
    create_response = test_client.post("/addbooks", data={
        "title": "Test Book 4",
        "author": "Test Author 4",
        "quantity": "1",
        "category": "Mystery"
    })
    book_id = create_response.json()["data"]["id"]

    response = test_client.delete(f"/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Book deleted successfully"
