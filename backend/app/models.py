from sqlalchemy import Column, Integer, String , TIMESTAMP , ForeignKey
from .database import Base
from sqlalchemy.sql import func  

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fullname = Column(String(100), nullable=False)
    username = Column(String(100), nullable=False)
    email = Column(String(100),nullable=False)
    password = Column(String(255),nullable=False)
    created_at = Column(TIMESTAMP,default=func.now())
    updated_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())

class Members(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    phone = Column(String(10), nullable=False)
    email = Column(String(50),nullable=False)
    address = Column(String(200),nullable=False)
    created_at = Column(TIMESTAMP,default=func.now())
    updated_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())


class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    author = Column(String(50), nullable=False)
    quantity = Column(Integer,nullable=False)
    available_quantity = Column(Integer,nullable=False)
    category = Column(String(50),nullable=False)
    user_id = Column(Integer,ForeignKey('users.id'))

class Borrowed(Base):
    __tablename__ = "borrowed_books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))  
    book_id = Column(Integer, ForeignKey('books.id'))  
    borrowed_at = Column(TIMESTAMP,default=func.now())
    returned_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())


    





    










