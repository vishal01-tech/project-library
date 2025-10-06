from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
import shutil
import random
import string
from datetime import datetime, timedelta
from app.utils.email import send_otp_email

# Ensure uploads directory exists
os.makedirs("app/uploads", exist_ok=True)
from app.database import SessionLocal
from .models import Users , Members , Books, Borrowed
from app.schemas import UserLogin, TokenResponse , UserCreate  , MemberCreate , BookCreate, BookUpdate, BorrowedCreate, ReturnBook, ForgotPasswordRequest, ResetPasswordRequest
from app.utils.auth import create_access_token, get_current_user_with_role, verify_access_token
from datetime import timedelta

app = FastAPI()

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

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

    return {"access_token": access_token,"token_type": "bearer","email": user.email,"username": user.username,"role": user.role}


# Signup API - for admin
@app.post("/signup")
def signup(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if any users exist
    user_count = db.query(Users).count()
    if user_count == 0:
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
            current_user = db.query(Users).filter(Users.email == payload.get("sub")).first()
            if not current_user or current_user.role != "super_admin":
                raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create new user
    new_user = Users(
        fullname=user.fullname,
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
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
def add_books(
    title: str = Form(...),
    author: str = Form(...),
    quantity: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        quantity_int = int(quantity)
    except ValueError:
        raise HTTPException(status_code=400, detail="Quantity must be a valid integer")

    image_path = None
    if image:
        # Save the uploaded file
        file_location = f"app/uploads/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_path = f"/uploads/{image.filename}"

    # create new book
    new_books = Books(
        title=title,
        author=author,
        quantity=quantity_int,
        category=category,
        image=image_path
    )

    db.add(new_books)
    db.commit()
    db.refresh(new_books)
    return {"message": "Book added successfully"}


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

    # Check if already borrowed
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
    book.quantity -= 1
    db.commit()

    return {"message": "Book issued successfully"}


# PUT update book
@app.put("/books/{book_id}")
def update_book(
    book_id: int,
    title: str = Form(None),
    author: str = Form(None),
    quantity: str = Form(None),
    category: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    book = db.query(Books).filter(Books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if title is not None:
        book.title = title
    if author is not None:
        book.author = author
    if quantity is not None:
        try:
            quantity_int = int(quantity)
        except ValueError:
            raise HTTPException(status_code=400, detail="Quantity must be a valid integer")
        book.quantity = quantity_int
    if category is not None:
        book.category = category
    if image:
        # Save the uploaded file
        file_location = f"app/uploads/{image.filename}"
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(image.file, file_object)
        book.image = f"/uploads/{image.filename}"

    db.commit()
    db.refresh(book)
    return book


# DELETE book
@app.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Books).filter(Books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if the book is currently borrowed
    borrowed_count = db.query(Borrowed).filter(Borrowed.book_id == book_id, Borrowed.returned_at.is_(None)).count()
    if borrowed_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete book that is currently borrowed.")

    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}


# POST return book
@app.post("/returnbook")
def return_book(return_data: ReturnBook, db: Session = Depends(get_db)):
    borrowed_id = return_data.borrowed_id
    borrowed = db.query(Borrowed).filter(Borrowed.id == borrowed_id, Borrowed.returned_at.is_(None)).first()
    if not borrowed:
        raise HTTPException(status_code=404, detail="Borrowed record not found or already returned")

    # Update return date
    from datetime import datetime
    borrowed.returned_at = datetime.utcnow()

    # Increase book quantity
    book = db.query(Books).filter(Books.id == borrowed.book_id).first()
    if book:
        book.quantity += 1

    db.commit()
    return {"message": "Book returned successfully"}


# GET borrowed books
@app.get("/borrowed")
def get_borrowed_books(db: Session = Depends(get_db)):
    borrowed = db.query(Borrowed).filter(Borrowed.returned_at.is_(None)).all()
    return borrowed

# GET check if any users exist
@app.get("/users/exists")
def users_exist(db: Session = Depends(get_db)):
    user_count = db.query(Users).count()
    return {"exists": user_count > 0}


# POST forgot password
@app.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate OTP
    otp = ''.join(random.choices(string.digits, k=6))
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)

    # Save OTP to user
    user.otp = otp
    user.otp_expiry = otp_expiry
    db.commit()

    # Send email
    try:
        email_sent = send_otp_email(email, otp)
    except Exception as e:
        email_sent = False
        print(f"Email send error: {e}")

    if email_sent:
        return {"message": "OTP sent to your email"}
    else:
        # For testing, return OTP even if email fails
        return {"message": "OTP generated (email failed, check logs)", "otp": otp}


# POST reset password
@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = request.email
    otp = request.otp
    new_password = request.new_password
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.otp != otp or user.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Hash new password
    hashed_password = pwd_context.hash(new_password)
    user.password = hashed_password
    user.otp = None
    user.otp_expiry = None
    db.commit()

    return {"message": "Password reset successfully"}








