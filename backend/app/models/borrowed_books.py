from sqlalchemy import Column, Integer, TIMESTAMP , ForeignKey
from app.database import Base
from sqlalchemy.sql import func  


class Borrowed(Base):
    __tablename__ = "borrowed_books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))  
    book_id = Column(Integer, ForeignKey('books.id'))  
    borrowed_at = Column(TIMESTAMP,default=func.now())
    returned_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())
