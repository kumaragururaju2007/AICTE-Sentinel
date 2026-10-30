from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class InstitutionCreate(BaseModel):
    institution_name: str
    aicte_permanent_id: str
    institution_type: str
    state: str
    district: str
    address: Optional[str] = None
    official_email: EmailStr
    contact_number: Optional[str] = None

class InstitutionUpdate(BaseModel):
    institution_name: Optional[str] = None
    institution_type: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    contact_number: Optional[str] = None

class InstitutionOut(BaseModel):
    id: str
    institution_name: str
    aicte_permanent_id: str
    institution_type: str
    state: str
    district: str
    address: Optional[str] = None
    official_email: str
    contact_number: Optional[str] = None
    verification_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
