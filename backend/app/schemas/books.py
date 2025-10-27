from pydantic import BaseModel
from typing import Optional

class BookCreate(BaseModel):
    title: str
    author: str
    quantity: int
    category: str
    image: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    quantity: Optional[int] = None
    category: Optional[str] = None
    image: Optional[str] = None

