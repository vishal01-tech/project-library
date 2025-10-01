from sqlalchemy import Column, Integer, String , TIMESTAMP , ForeignKey
from app.database import Base
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
