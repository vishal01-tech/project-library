from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    quantity: int
    category: str
    image: str = None

class BookUpdate(BaseModel):
    title: str = None
    author: str = None
    quantity: int = None
    category: str = None
