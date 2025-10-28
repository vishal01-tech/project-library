from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.borrowed_books import BorrowedCreate, ReturnBook
from app.crud.borrowed_books import issue_book, return_book, get_borrowed_books
from app.utils.auth import oauth2_scheme
from app.utils.responses import success_response
from app.models.members import Members


router = APIRouter(dependencies=[Depends(oauth2_scheme)])

# POST issue book
@router.post("/issuebook")
def issue_book_route(member_phone: str = Form(...), book_id: int = Form(...), db: Session = Depends(get_db)):
    # Find member by phone
    member = db.query(Members).filter(Members.phone == member_phone).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    borrowed = BorrowedCreate(member_id=member.id, book_id=book_id)
    new_borrowed = issue_book(db, borrowed)
    return success_response(data=None , message="Issue Book Successfully")


# POST return book
@router.post("/returnbook")
def return_book_route(return_data: ReturnBook, db: Session = Depends(get_db)):
    return return_book(db, return_data)


# GET borrowed books
@router.get("/borrowed")
def get_borrowed_books_route(page: int = 1, limit: int = 10, search: str = None, db: Session = Depends(get_db)):
    return get_borrowed_books(db, page, limit, search)
