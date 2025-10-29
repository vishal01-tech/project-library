from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.members import MemberCreate
from app.crud.members import create_member, get_members
from app.utils.auth import oauth2_scheme
from app.utils.responses import success_response



router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# POST add member
@router.post("/addmember")
def add_member(member: MemberCreate, db: Session = Depends(get_db)):
    new_member = create_member(db, member)
    return success_response(data = None , message="Member added successfully")


# GET members
@router.get("/members")
def get_members_route(page: int = 1, limit: int = 10, search: str = None, db: Session = Depends(get_db)):
    return get_members(db, page, limit, search)
