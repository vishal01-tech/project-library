from fastapi import FastAPI, Depends , HTTPException
from fastapi.responses import LoginResponse
from sqlalchemy.orm import Session
from schemas import UserCreate, UserResponse

from models import Users
from database import SessionLocal
from passlib.context import CryptContext
from auth import ACCESS_TOKEN_TIME , create_access_token 


app = FastAPI()

# create a password context with bcrypt algorithm
pwd_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")

# function to hash a plain password
def hash_password(password : str):
    return pwd_context.hash(password)

# to verify entered password with the stored password
def verify_password(plain_password: str ,hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)


# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# ---------------Login Api-------------
# Login API Route
@app.post("/login", response_model=LoginResponse)
async def login_user(login_request: UserResponse, db: Session = Depends(get_db)):
    # Query the user from the database by email
    user = db.query(Users).filter(Users.email == login_request.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify the password
    if not verify_password(login_request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # If credentials are valid, create an access token
    access_token = create_access_token(data={"sub": user.email}, expires_delta=ACCESS_TOKEN_TIME)
    
    return {"access_token": access_token, "token_type": "bearer"}