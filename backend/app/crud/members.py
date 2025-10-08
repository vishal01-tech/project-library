from sqlalchemy.orm import Session
from app.models.members import Members
from app.schemas.members import MemberCreate
from fastapi import HTTPException

def get_member_by_email(db: Session, email: str):
    return db.query(Members).filter(Members.email == email).first()

def create_member(db: Session, member: MemberCreate):
    # Check if member already exists
    existing_member = get_member_by_email(db, member.email)
    if existing_member:
        raise HTTPException(status_code=400, detail="Member already exists")

    # Create new member
    new_member = Members(
        name=member.name,
        phone=member.phone,
        email=member.email,
        address=member.address
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

def get_members(db: Session):
    return db.query(Members).all()

def get_member_by_id(db: Session, member_id: int):
    return db.query(Members).filter(Members.id == member_id).first()
