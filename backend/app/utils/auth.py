import datetime
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from app.models import Users


# load from environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_TIME = int(os.getenv("ACCESS_TOKEN_TIME"))


# to create the jwt access token
def create_access_token(data : dict, time_delta : None):
    to_encode = data.copy()
    expire = datetime.datetime.now() + time_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# to verify the access token
def verify_access_token(access_token: str):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# to get the current user
def get_current_user(request: Request):
    # Try cookie first
    token = request.cookies.get("access_token")
    if not token:
        # Try Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    if not token:
        return None
    return verify_access_token(token)


# Dependency to get current user from token
def get_current_user_from_token(token: str = Depends(lambda: None)):
    if not token:
        raise HTTPException(status_code=401, detail="Token not provided")
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


# Dependency to get current user with role check
def get_current_user_with_role(required_role: str = None):
    def dependency(request: Request, db: Session = Depends(lambda: SessionLocal())):
        # Try cookie first
        token = request.cookies.get("access_token")
        if not token:
            # Try Authorization header
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        payload = verify_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(Users).filter(Users.email == payload.get("sub")).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        if required_role and user.role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        return user
    return dependency














