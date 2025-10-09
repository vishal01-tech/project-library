from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.members import MemberCreate
from app.crud.members import create_member, get_members
from app.utils.auth import get_current_user_with_role
from app.responses import success_response


router = APIRouter()

# POST add member
@router.post("/addmember")
def add_member(member: MemberCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    new_member = create_member(db, member)
    return success_response({"message": "Member added successfully"})

# GET members
@router.get("/members")
def get_members_route(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    members = get_members(db)
    return members
