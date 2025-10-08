from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from app.schemas.users import UserLogin, UserCreate, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.crud.users import authenticate_user, create_user, users_exist, forgot_password, reset_password
from app.utils.auth import create_access_token, get_current_user_with_role, verify_access_token
from datetime import timedelta

router = APIRouter()

# POST Login
@router.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {"sub": user.email}
    access_token = create_access_token(data=token_data, time_delta=timedelta(minutes=30))

    return {"access_token": access_token, "token_type": "bearer", "email": user.email, "username": user.username, "role": user.role}

# Signup API
@router.post("/signup")
def signup(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    # Check if any users exist
    if not users_exist(db):
        # First user, allow super_admin role
        if user.role != "super_admin":
            raise HTTPException(status_code=400, detail="First user must be super_admin")
    else:
        # Allow creation of 'user' role without authentication
        if user.role == "user":
            pass
        else:
            # Subsequent users require super_admin authentication for other roles
            token = request.cookies.get("access_token")
            if not token:
                raise HTTPException(status_code=401, detail="Not authenticated")
            payload = verify_access_token(token)
            if not payload:
                raise HTTPException(status_code=401, detail="Invalid token")
            from app.crud.users import get_user_by_email
            current_user = get_user_by_email(db, payload.get("sub"))
            if not current_user or current_user.role != "super_admin":
                raise HTTPException(status_code=403, detail="Insufficient permissions")

    new_user = create_user(db, user)
    return {"message": "User created successfully", "user_id": new_user.id}

# GET check if any users exist
@router.get("/users/exists")
def check_users_exist(db: Session = Depends(get_db)):
    exists = users_exist(db)
    return {"exists": exists}

# POST forgot password
@router.post("/forgot-password")
def forgot_password_route(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    otp = forgot_password(db, request)
    # TODO: Send email
    return {"message": "OTP sent to your email", "otp": otp}  # For testing

# POST reset password
@router.post("/reset-password")
def reset_password_route(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password(db, request)
