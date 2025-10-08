from sqlalchemy.orm import Session
from app.models.users import Users
from app.schemas.users import UserCreate, ForgotPasswordRequest, ResetPasswordRequest
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random
import string
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(Users).filter(Users.email == email).first()

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def hash_password(password: str):
    return pwd_context.hash(password)

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_user(db: Session, user: UserCreate):
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = hash_password(user.password)

    # Create new user
    new_user = Users(
        fullname=user.fullname,
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def users_exist(db: Session):
    user_count = db.query(Users).count()
    return user_count > 0

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def forgot_password(db: Session, request: ForgotPasswordRequest):
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate OTP
    otp = generate_otp()
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)

    # Save OTP to user
    user.otp = otp
    user.otp_expiry = otp_expiry
    db.commit()

    # TODO: Send email with OTP
    # For now, return OTP for testing
    return otp

def reset_password(db: Session, request: ResetPasswordRequest):
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.otp != request.otp or user.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Hash new password
    hashed_password = hash_password(request.new_password)
    user.password = hashed_password
    user.otp = None
    user.otp_expiry = None
    db.commit()

    return {"message": "Password reset successfully"}
