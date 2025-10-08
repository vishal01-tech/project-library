from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from app.schemas.members import MemberCreate
from app.crud.members import create_member, get_members
from app.utils.auth import get_current_user_with_role

router = APIRouter()

# POST add member
@router.post("/addmember")
def add_member(member: MemberCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    new_member = create_member(db, member)
    return {"message": "Member added successfully"}

# GET members
@router.get("/members")
def get_members_route(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    members = get_members(db)
    return members
