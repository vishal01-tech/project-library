from sqlalchemy import Column, Integer, String , TIMESTAMP
from app.database.database import Base
from sqlalchemy.sql import func  

class Members(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False,unique=True,index= True)
    phone = Column(String(10), nullable=False,unique=True)
    email = Column(String(50),nullable=False, unique=True)
    address = Column(String(200),nullable=False)
    created_at = Column(TIMESTAMP,default=func.now())
    updated_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())