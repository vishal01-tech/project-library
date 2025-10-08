from sqlalchemy.orm import Session
from app.models.books import Books
from app.schemas.books import BookCreate, BookUpdate
from fastapi import HTTPException
import shutil
import os

def create_book(db: Session, book: BookCreate, image_path: str = None):
    # Create new book
    new_book = Books(
        title=book.title,
        author=book.author,
        quantity=book.quantity,
        category=book.category,
        image=image_path
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

def get_books(db: Session, page: int = 1, limit: int = 12):
    offset = (page - 1) * limit
    books = db.query(Books).offset(offset).limit(limit).all()
    total = db.query(Books).count()
    return {"data": books, "total": total, "page": page, "limit": limit}

def get_book_by_id(db: Session, book_id: int):
    return db.query(Books).filter(Books.id == book_id).first()

def update_book(db: Session, book_id: int, book_update: BookUpdate, image_path: str = None):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data = book_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(book, key, value)
    if image_path:
        book.image = image_path

    db.commit()
    db.refresh(book)
    return book

def delete_book(db: Session, book_id: int):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if the book is currently borrowed
    from app.models.borrowed_books import Borrowed
    borrowed_count = db.query(Borrowed).filter(Borrowed.book_id == book_id, Borrowed.returned_at.is_(None)).count()
    if borrowed_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete book that is currently borrowed.")

    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}
