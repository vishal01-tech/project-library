import datetime
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models import Users

# HTTPBearer scheme for Swagger
oauth2_scheme = HTTPBearer()

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_TIME = int(os.getenv("ACCESS_TOKEN_TIME"))


# Create the JWT access token
def create_access_token(data: dict, time_delta: datetime.timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + time_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Verify the access token
def verify_access_token(access_token: str):
    try:
        decode_jwt = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        return decode_jwt
    except JWTError:
        return None


# Get current user from the token
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(SessionLocal)):
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(Users).filter(Users.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


# Dependency to get current user with role check
def get_current_user_with_role(required_role: str = None, user: Users = Depends(get_current_user)):
    # Check if role is required and user has the correct role
    if required_role and user.role != required_role:
        raise HTTPException(status_code=403, detail="Insufficient role")
    return user
