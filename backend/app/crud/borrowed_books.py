from sqlalchemy.orm import Session
from app.models.borrowed_books import Borrowed
from app.models.members import Members
from app.models.books import Books
from app.schemas.borrowed_books import BorrowedCreate, ReturnBook
from fastapi import HTTPException
from datetime import datetime

def issue_book(db: Session, borrowed: BorrowedCreate):
    # Check if member exists
    member = db.query(Members).filter(Members.id == borrowed.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Check if book exists and has quantity > 0
    book = db.query(Books).filter(Books.id == borrowed.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.quantity <= 0:
        raise HTTPException(status_code=400, detail="Book not available")

    # Check if already borrowed
    existing = db.query(Borrowed).filter(Borrowed.member_id == borrowed.member_id, Borrowed.book_id == borrowed.book_id, Borrowed.returned_at.is_(None)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Book already borrowed by this member")

    # Create borrowed record
    new_borrowed = Borrowed(
        member_id=borrowed.member_id,
        book_id=borrowed.book_id
    )

    db.add(new_borrowed)
    db.commit()
    db.refresh(new_borrowed)

    # Decrease quantity
    book.quantity -= 1
    db.commit()

    return new_borrowed

def return_book(db: Session, return_data: ReturnBook):
    borrowed_id = return_data.borrowed_id
    borrowed = db.query(Borrowed).filter(Borrowed.id == borrowed_id, Borrowed.returned_at.is_(None)).first()
    if not borrowed:
        raise HTTPException(status_code=404, detail="Borrowed record not found or already returned")

    # Update return date
    borrowed.returned_at = datetime.utcnow()

    # Increase book quantity
    book = db.query(Books).filter(Books.id == borrowed.book_id).first()
    if book:
        book.quantity += 1

    db.commit()
    return {"message": "Book returned successfully"}

def get_borrowed_books(db: Session, page: int = 1, limit: int = 10, search: str = None):
    from app.models.members import Members
    query = db.query(Borrowed).join(Members, Borrowed.member_id == Members.id).filter(Borrowed.returned_at.is_(None))
    if search:
        search_term = f"%{search}%"
        query = query.filter(Members.name.ilike(search_term))
    total = query.count()
    offset = (page - 1) * limit
    borrowed = query.offset(offset).limit(limit).all()
    return {"data": borrowed, "total": total, "page": page, "limit": limit}
