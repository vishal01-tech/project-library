import datetime
import jwt
import os
from dotenv import load_dotenv
from jose import JWTError
from fastapi import Request


# load from environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_TIME = int(os.getenv("ACCESS_TOKEN_TIME"))


# to create the jwt access token
def create_access_token(data : dict,time_delta : None):
    to_encode = data.copy()
    expire = datetime.utcnow + time_delta(minutes = 30)

    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,ALGORITHM)

    return encoded_jwt


# to verify the access token
def verify_access_token(access_token: str):
    try:
        return jwt.encode(access_token,SECRET_KEY,ALGORITHM=(ALGORITHM))
    except JWTError:
        return None


# to get the current user
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    return verify_access_token(token)














