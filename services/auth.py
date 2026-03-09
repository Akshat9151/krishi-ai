from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


class UserCreate(BaseModel):
    username: str
    password: str


# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# REGISTER
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.username == user.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists ❌")

    new_user = User(username=user.username, password=user.password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"status": "success", "message": "Registration successful ✅"}


# LOGIN
@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found ❌")

    if db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Incorrect password ❌")

    return {"status": "success", "message": f"Welcome {user.username} 🌱"}