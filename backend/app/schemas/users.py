from pydantic import BaseModel
from pydantic import EmailStr

# Login pydantic model
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    email: str
    username: str
    role: str

class UserCreate(BaseModel):
    fullname: str
    # username: str
    email: EmailStr
    password: str
    role: str = "admin" 

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
