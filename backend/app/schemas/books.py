from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    quantity: int
    category: str
