from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    email: EmailStr
    phone: str | None = None
    password: str
    role: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
