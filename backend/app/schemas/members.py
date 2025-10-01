from pydantic import BaseModel
from pydantic import EmailStr

class MemberCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    address: str
