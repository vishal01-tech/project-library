from sqlalchemy import Column, Integer, String
from app.database.database import Base

class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    author = Column(String(50), nullable=False,index=True)
    quantity = Column(Integer,nullable=False)
    category = Column(String(50),nullable=False)
    image = Column(String(255), nullable=True) 
