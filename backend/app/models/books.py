from sqlalchemy import Column, Integer, String
from app.database import Base

class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    author = Column(String(50), nullable=False)
    quantity = Column(Integer,nullable=False)
    category = Column(String(50),nullable=False)
    image = Column(String(255), nullable=True)  # URL or path to book image
