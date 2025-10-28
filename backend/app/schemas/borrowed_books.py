from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BorrowedBase(BaseModel):
    member_id: int
    book_id: int

class BorrowedCreate(BorrowedBase):
    pass

class Borrowed(BorrowedBase):
    id: int
    borrowed_at: Optional[datetime]
    returned_at: Optional[datetime]

    class Config:
        from_attributes = True

class ReturnBook(BaseModel):
    borrowed_id: int
