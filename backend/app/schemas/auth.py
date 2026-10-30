from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_info: Optional[str] = "Web Browser"

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    user_id: str
    full_name: str
    email: str
    role: str
    institution_id: Optional[str] = None
    institution_name: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RegisterRequest(BaseModel):
    # User fields
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6, max_length=128)
    # Institution fields
    institution_name: str = Field(..., min_length=3, max_length=255)
    aicte_permanent_id: str = Field(..., min_length=3, max_length=50)
    institution_type: str = "Affiliated College"
    state: str
    district: str
    address: Optional[str] = None
    designation: str = "Principal"

class PasswordForgotRequest(BaseModel):
    email: EmailStr

class PasswordResetRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6, max_length=128)

class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    institution_id: Optional[str] = None
    institution_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
