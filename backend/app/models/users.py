from sqlalchemy import Column, Integer, String , TIMESTAMP , ForeignKey
from backend.app.database.database import Base
from sqlalchemy.sql import func

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fullname = Column(String(100), nullable=False)
    username = Column(String(100), nullable=False)
    email = Column(String(100),nullable=False)
    password = Column(String(255),nullable=False)
    role = Column(String(50), nullable=False, default='user')  # 'user' or 'super_admin'
    otp = Column(String(6), nullable=True)
    otp_expiry = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP,default=func.now())
    updated_at = Column(TIMESTAMP,default=func.now(),onupdate=func.now())
