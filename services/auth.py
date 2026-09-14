import hashlib
import json
import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import OTPChallenge, User
from services.auth_utils import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    create_access_token,
    create_refresh_token,
    get_current_user_token,
    get_password_hash,
    verify_password,
)
from services.config import settings
from services.otp import provider_status, send_otp

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer()

class UserCreate(BaseModel):
    username: Optional[str] = None
    password: str = Field(min_length=6)
    email: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    username: Optional[str] = None
    identifier: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: Optional[str] = None
    message: str

class OtpRequest(BaseModel):
    identifier: str
    password: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class OtpVerify(BaseModel):
    challenge_id: str
    code: str = Field(min_length=6, max_length=6)

class PasswordResetRequest(BaseModel):
    identifier: str

class PasswordResetConfirm(BaseModel):
    challenge_id: str
    code: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=6)

class GoogleAuthRequest(BaseModel):
    credential: str

class RefreshRequest(BaseModel):
    refresh_token: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return get_current_user_token(f"Bearer {credentials.credentials}")


def _clean(value: Optional[str]) -> Optional[str]:
    return value.strip().lower() if value else None


def _identifier_filter(identifier: str):
    value = _clean(identifier)
    return or_(User.username == value, User.email == value, User.phone == value)


def _issue_tokens(user: User) -> Token:
    subject = user.username or user.email or user.phone
    access = create_access_token(data={"sub": subject}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh = create_refresh_token({"sub": subject})
    return Token(access_token=access, refresh_token=refresh)


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def _new_challenge(db: Session, purpose: str, destination: str, payload: Optional[dict] = None):
    code = f"{secrets.randbelow(1_000_000):06d}"
    challenge = OTPChallenge(
        id=secrets.token_urlsafe(32),
        purpose=purpose,
        destination=destination,
        code_hash=_hash_code(code),
        payload_json=json.dumps(payload or {}),
        expires_at=datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    db.add(challenge)
    db.commit()
    try:
        send_otp(destination, code)
    except Exception as exc:
        db.delete(challenge)
        db.commit()
        raise HTTPException(status_code=503, detail=f"OTP delivery failed: {exc}")
    response = {"challenge_id": challenge.id, "destination": destination, "expires_in": settings.OTP_EXPIRE_MINUTES * 60}
    if settings.SMS_PROVIDER == "mock" and "@" not in destination or settings.EMAIL_PROVIDER == "mock" and "@" in destination:
        response["dev_code"] = code
    return response


def _take_challenge(db: Session, challenge_id: str, code: str, purpose: str) -> OTPChallenge:
    challenge = db.query(OTPChallenge).filter(OTPChallenge.id == challenge_id, OTPChallenge.purpose == purpose).first()
    if not challenge or challenge.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP challenge is missing or expired")
    if challenge.attempts >= settings.OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many OTP attempts")
    challenge.attempts += 1
    if not secrets.compare_digest(challenge.code_hash, _hash_code(code.strip())):
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP")
    db.delete(challenge)
    db.commit()
    return challenge


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    identifier = _clean(user.username or user.email or user.phone)
    if not identifier:
        raise HTTPException(status_code=400, detail="Username, email, or phone is required")
    if db.query(User).filter(or_(User.username == _clean(user.username), User.email == _clean(user.email), User.phone == _clean(user.phone))).first():
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = User(
        username=_clean(user.username) or identifier,
        email=_clean(user.email),
        phone=_clean(user.phone),
        password=get_password_hash(user.password),
        is_verified=False,
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    db.refresh(new_user)
    return UserResponse(id=new_user.id, username=new_user.username, message="Registration successful")


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    identifier = user.identifier or user.username
    if not identifier:
        raise HTTPException(status_code=400, detail="Username, email, or phone is required")
    db_user = db.query(User).filter(_identifier_filter(identifier)).first()
    if not db_user or not db_user.password or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return _issue_tokens(db_user)


@router.post("/signup/request-otp")
def request_signup_otp(data: OtpRequest, db: Session = Depends(get_db)):
    destination = _clean(data.email or data.phone or data.identifier)
    if not destination or not data.password:
        raise HTTPException(status_code=400, detail="Destination and password are required")
    if db.query(User).filter(or_(User.email == destination, User.phone == destination, User.username == destination)).first():
        raise HTTPException(status_code=400, detail="User already exists")
    payload = {"username": _clean(data.username) or destination.split("@")[0], "email": _clean(data.email), "phone": _clean(data.phone), "password": get_password_hash(data.password)}
    return _new_challenge(db, "signup", destination, payload)


@router.post("/signup/verify-otp", response_model=Token)
def verify_signup_otp(data: OtpVerify, db: Session = Depends(get_db)):
    challenge = _take_challenge(db, data.challenge_id, data.code, "signup")
    payload = json.loads(challenge.payload_json or "{}")
    new_user = User(**payload, is_verified=True)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return _issue_tokens(new_user)


@router.post("/login/request-otp")
def request_login_otp(data: OtpRequest, db: Session = Depends(get_db)):
    identifier = data.identifier or data.email or data.phone
    user = db.query(User).filter(_identifier_filter(identifier or "")).first()
    if not user or not data.password or not user.password or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    destination = user.email or user.phone or user.username
    return _new_challenge(db, "login", destination, {"user_id": user.id})


@router.post("/login/verify-otp", response_model=Token)
def verify_login_otp(data: OtpVerify, db: Session = Depends(get_db)):
    challenge = _take_challenge(db, data.challenge_id, data.code, "login")
    user = db.query(User).filter(User.id == json.loads(challenge.payload_json or "{}").get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    return _issue_tokens(user)


@router.post("/forgot-password/request-otp")
@router.post("/forgot-password")
def forgot_password(data: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(_identifier_filter(data.identifier)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
    return _new_challenge(db, "password_reset", user.email or user.phone or user.username, {"user_id": user.id})


@router.post("/reset-password")
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    challenge = _take_challenge(db, data.challenge_id, data.code, "password_reset")
    user_id = json.loads(challenge.payload_json or "{}").get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
    user.password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.post("/google", response_model=Token)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google Sign-In is not configured")
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        info = id_token.verify_oauth2_token(data.credential, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Invalid Google credential: {exc}")
    email = _clean(info.get("email"))
    if not email:
        raise HTTPException(status_code=400, detail="Google credential has no email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        username = email.split("@")[0]
        if db.query(User).filter(User.username == username).first():
            username = f"{username}-{secrets.token_hex(3)}"
        user = User(username=username, email=email, google_sub=info.get("sub"), is_verified=True, password=None)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_sub:
        user.google_sub = info.get("sub")
        user.is_verified = True
        db.commit()
    return _issue_tokens(user)


@router.post("/refresh", response_model=Token)
def refresh_token(data: RefreshRequest):
    from services.auth_utils import verify_token
    payload = verify_token(data.refresh_token)
    if payload.get("token_type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    subject = payload.get("sub")
    return Token(access_token=create_access_token({"sub": subject}), refresh_token=data.refresh_token)


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.get("/providers")
def auth_providers():
    return provider_status()


@router.get("/me")
def get_current_user_info(current_user: str = Depends(get_current_user)):
    return {"username": current_user, "message": "Successfully authenticated"}
