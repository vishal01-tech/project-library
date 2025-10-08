from sqlalchemy import Column, Integer, TIMESTAMP , ForeignKey
from backend.app.database.database import Base
from sqlalchemy.sql import func  


class Borrowed(Base):
    __tablename__ = "borrowed_books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(Integer, ForeignKey('members.id'))
    book_id = Column(Integer, ForeignKey('books.id'))  
    borrowed_at = Column(TIMESTAMP,default=func.now())
    returned_at = Column(TIMESTAMP, nullable=True)
