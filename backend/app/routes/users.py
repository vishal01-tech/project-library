from fastapi import APIRouter, Depends, Request, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.users import UserLogin, UserCreate, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.crud.users import authenticate_user, create_user, users_exist, forgot_password, reset_password
from app.utils.auth import create_access_token, verify_access_token
from app.utils.responses import success_response, error_response
from datetime import timedelta, datetime
from app.models.users import Users

router = APIRouter()

# POST Login
@router.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        return error_response(message="Invalid email or password", status_code=401)

    token_data = {"sub": user.email}
    access_token = create_access_token(data=token_data, time_delta=timedelta(hours=3))

    return success_response(data={"access_token": access_token, "token_type": "bearer", "email": user.email, "username": user.fullname, "role": user.role})

# Signup API
@router.post("/signup")
def signup(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    # Check if any users exist
    if not users_exist(db):
        # First user, allow super_admin role
        pass
        # if user.role != "super_admin":
        #     return error_response(message="First user must be super_admin", status_code=400)
    else:
        # Allow creation of 'user' role without authentication
        if user.role == "user":
            pass
        else:
            # Subsequent users require super_admin authentication for other roles
            token = request.cookies.get("access_token")
            if not token:
                return error_response(message="Not authenticated", status_code=401)
            payload = verify_access_token(token)
            if not payload:
                return error_response(message="Invalid token", status_code=401)
            from app.crud.users import get_user_by_email
            current_user = get_user_by_email(db, payload.get("sub"))
            if not current_user or current_user.role != "super_admin":
                return error_response(message="Insufficient permissions", status_code=403)

    new_user = create_user(db, user)
    return success_response(message="User created successfully", data={"user_id": new_user.id})

# GET check if any users exist
@router.get("/users/exists")
def check_users_exist(db: Session = Depends(get_db)):
    exists = users_exist(db)
    return success_response(data={"exists": exists})


# POST forgot password
@router.post("/forgot-password")
def forgot_password_route(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    forgot_password(db, request)
    return success_response(data=None, message="OTP sent to your email")


# POST verify OTP
@router.post("/verify-otp")
def verify_otp_route(request: dict = Body(...), db: Session = Depends(get_db)):
    email = request.get("email")
    otp = request.get("otp")
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return error_response(message="User not found", status_code=404)
    if user.otp != otp or user.otp_expiry < datetime.utcnow():
        return error_response(message="Invalid or expired OTP", status_code=400)
    return success_response(data=None, message="OTP verified")


# POST reset password
@router.post("/reset-password")
def reset_password_route(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    result = reset_password(db, request)
    if result.get("success"):
        return success_response(data= None,message=result.get("message", "Password reset successful"))
    else:
        return error_response(message=result.get("message", "Password reset failed"))
