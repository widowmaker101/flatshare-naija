from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.db import SessionLocal, Base, engine
from backend.app.models.user import User, Role
from backend.app.schemas.auth import RegisterIn, LoginIn, TokenOut
from backend.app.utils.security import hash_password, verify_password, create_access_token

Base.metadata.create_all(bind=engine)
router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email exists")
    user = User(email=payload.email, phone=payload.phone, password_hash=hash_password(payload.password), role=Role(payload.role))
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token(str(user.id))
    return TokenOut(access_token=token)

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return TokenOut(access_token=token)
