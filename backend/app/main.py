# main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import SessionLocal
from .models import Users , Members , Books, Borrowed
from app.schemas import UserLogin, TokenResponse , UserCreate  , MemberCreate , BookCreate, BorrowedCreate
from app.utils.auth import create_access_token
from datetime import timedelta

app = FastAPI()

# CORS setup for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Verify password
def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)


# POST Login
@app.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == user_login.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user_login.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {"sub": user.email}
    access_token = create_access_token(data=token_data, time_delta=timedelta(minutes=30))

    return {"access_token": access_token,"token_type": "bearer","email": user.email,"username": user.username}


# Signup API

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create new user
    new_user = Users(
        fullname=user.fullname,
        username=user.username,
        email=user.email,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}



# add member api
@app.post("/addmember")
def add_member(member : MemberCreate , db: Session = Depends(get_db)):
    # check if member already exists
    existing_member = db.query(Members).filter(Members.email == member.email).first()

    if existing_member:
        raise HTTPException(status_code=400,detail="Member already exist")
    

    # create new member
    new_member = Members(
        name = member.name,
        phone = member.phone,
        email = member.email,
        address = member.address
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)


    
# add books api
@app.post("/addbooks")
def add_books(books : BookCreate , db: Session = Depends(get_db)):
    # create new member
    new_books = Books(
        title = books.title,
        author = books.author,
        quantity = books.quantity,
        category = books.category
    )

    db.add(new_books)
    db.commit()
    db.refresh(new_books)


# GET members
@app.get("/members")
def get_members(db: Session = Depends(get_db)):
    members = db.query(Members).all()
    return members


# GET books
@app.get("/books")
def get_books(db: Session = Depends(get_db)):
    books = db.query(Books).all()
    return books


# POST issue book
@app.post("/issuebook")
def issue_book(borrowed: BorrowedCreate, db: Session = Depends(get_db)):
    # Check if member exists
    member = db.query(Members).filter(Members.id == borrowed.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Check if book exists and has quantity > 0
    book = db.query(Books).filter(Books.id == borrowed.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.quantity <= 0:
        raise HTTPException(status_code=400, detail="Book not available")

    # Check if already borrowed (optional, but good to check)
    existing = db.query(Borrowed).filter(Borrowed.member_id == borrowed.member_id, Borrowed.book_id == borrowed.book_id, Borrowed.returned_at.is_(None)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Book already borrowed by this member")

    # Create borrowed record
    new_borrowed = Borrowed(
        member_id=borrowed.member_id,
        book_id=borrowed.book_id
    )

    db.add(new_borrowed)
    db.commit()
    db.refresh(new_borrowed)

    # Decrease quantity
