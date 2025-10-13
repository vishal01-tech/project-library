from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.borrowed_books import BorrowedCreate, ReturnBook
from app.crud.borrowed_books import issue_book, return_book, get_borrowed_books
from app.utils.auth import get_current_user_with_role
from app.responses import success_response


router = APIRouter()

# POST issue book
@router.post("/issuebook")
def issue_book_route(borrowed: BorrowedCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    new_borrowed = issue_book(db, borrowed)
    return success_response({"message": "Book issued successfully"})


# POST return book
@router.post("/returnbook")
def return_book_route(return_data: ReturnBook, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    return return_book(db, return_data)


# GET borrowed books
@router.get("/borrowed")
def get_borrowed_books_route(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    borrowed = get_borrowed_books(db)
    return borrowed
