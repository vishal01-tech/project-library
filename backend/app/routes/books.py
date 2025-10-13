from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.books import BookUpdate
from app.crud.books import create_book, get_books, get_book_by_id, update_book, delete_book
from app.responses import success_response, error_response
import shutil


router = APIRouter()

# POST add books
@router.post("/addbooks")
def add_books(
    title: str = Form(...),
    author: str = Form(...),
    quantity: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    try:
        quantity_int = int(quantity)
    except ValueError:
        raise HTTPException(status_code=400, detail="Quantity must be a valid integer")

    image_path = None
    if image:
        # Save the uploaded file
        file_location = f"app/media/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_path = f"/media/{image.filename}"

    from app.schemas.books import BookCreate
    book_data = BookCreate(title=title, author=author, quantity=quantity_int, category=category)
    new_book = create_book(db, book_data, image_path)
    return success_response({"message": "Book added successfully"})

# GET books
@router.get("/books")
def get_books_route(page: int = 1, limit: int = 12, db: Session = Depends(get_db)):
    return get_books(db, page, limit)

# GET single book
@router.get("/books/{book_id}")
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# PUT update book
@router.put("/books/{book_id}")
def update_book(
    book_id: int,
    title: str = Form(None),
    author: str = Form(None),
    quantity: str = Form(None),
    category: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    update_data = {}
    if title is not None:
        update_data['title'] = title
    if author is not None:
        update_data['author'] = author
    if quantity is not None:
        try:
            quantity_int = int(quantity)
        except ValueError:
            raise error_response(status_code=400, detail="Quantity must be a valid integer")
        update_data['quantity'] = quantity_int
    if category is not None:
        update_data['category'] = category

    image_path = None
    if image:
        # Save the uploaded file
        file_location = f"app/media/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_path = f"/media/{image.filename}"

    book_update = BookUpdate(**update_data)
    updated_book = update_book(db, book_id, book_update, image_path)
    return updated_book

# DELETE book
@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    return delete_book(db, book_id)
