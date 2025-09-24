from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User Pydantic Models
class UserCreate(BaseModel):
    fullname: str
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    fullname: str
    username: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Tells Pydantic to treat SQLAlchemy models like dicts

# Member Pydantic Models
class MemberCreate(BaseModel):
    name: str
    phone: str
    email: str

class MemberResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Book Pydantic Models
class BookCreate(BaseModel):
    title: str
    author: str
    quantity: int
    available_quantity: int
    category: str
    user_id: int

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    quantity: int
    available_quantity: int
    category: str
    user_id: int  # Reference to the user who created the book

    class Config:
        orm_mode = True

# Borrowed Pydantic Models
class BorrowedCreate(BaseModel):
    user_id: int
    book_id: int

class BorrowedResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    borrowed_at: datetime
    returned_at: Optional[datetime]

    class Config:
        orm_mode = True
