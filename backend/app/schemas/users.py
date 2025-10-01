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

class UserCreate(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: str
