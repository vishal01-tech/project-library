from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.books import BookUpdate
from app.crud.books import create_book, get_books, get_book_by_id, update_book_crud, delete_book
from app.utils.responses import success_response
from app.utils.auth import get_current_user_with_role, oauth2_scheme
import shutil


router = APIRouter(dependencies=[Depends(oauth2_scheme)])

# POST add books
@router.post("/addbooks")
def add_books(
    title: str = Form(...),
    author: str = Form(...),
    quantity: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user : dict = Depends(get_current_user_with_role)
):
    try:
        quantity_int = int(quantity)
    except ValueError:
        raise HTTPException(status_code=400, detail="Quantity must be a valid integer")

    image_path = None
    if image and isinstance(image, UploadFile):
        # Save the uploaded file
        file_location = f"app/media/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_path = f"/media/{image.filename}"
        print("📤 Received image object:", image)
        print("📤 Received image filename:", image.filename if image else None)


    from app.schemas.books import BookCreate
    book_data = BookCreate(title=title, author=author, quantity=quantity_int, category=category, image=image_path)
    new_book = create_book(db, book_data, image_path)
    book_dict = {
        "id": new_book.id,
        "title": new_book.title,
        "author": new_book.author,
        "quantity": new_book.quantity,
        "category": new_book.category,
        "image": new_book.image
    }
    return success_response(book_dict, "Book added successfully")

# GET books
@router.get("/books")
def get_books_route(page: int = 1, limit: int = 12, search: str = None, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    return get_books(db, page, limit, search)

# GET single book
@router.get("/books/{book_id}")
def get_book(book_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# PUT update book
@router.put("/books/{book_id}")
def update_book_route(
    book_id: int,
    title: str = Form(None),
    author: str = Form(None),
    quantity: str = Form(None),
    category: str = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_with_role),
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
            raise HTTPException(status_code=400, detail="Quantity must be a valid integer")
        update_data['quantity'] = quantity_int
    if category is not None:
        update_data['category'] = category

    image_path = None
    if image and isinstance(image, UploadFile):
        # Save the uploaded file
        file_location = f"app/media/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_path = f"/media/{image.filename}"

    book_update = BookUpdate(**update_data)
    updated_book = update_book_crud(db, book_id, book_update, image_path)
    updated_book_dict = {
        "id": updated_book.id,
        "title": updated_book.title,
        "author": updated_book.author,
        "quantity": updated_book.quantity,
        "category": updated_book.category,
        "image": updated_book.image
    }
    return success_response(updated_book_dict, "Book updated successfully")


# DELETE book
@router.delete("/books/{book_id}")
def delete_book_route(book_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    return delete_book(db, book_id)