from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class ObligationCreate(BaseModel):
    institution_id: str
    application_id: Optional[str] = None
    obligation_type: str
    description: str
    due_date: datetime
    priority: Optional[str] = "MEDIUM"

class ObligationOut(BaseModel):
    id: str
    institution_id: str
    institution_name: Optional[str] = None
    application_id: Optional[str] = None
    application_number: Optional[str] = None
    obligation_type: str
    description: str
    due_date: datetime
    completion_date: Optional[datetime] = None
    status: str
    priority: str
    days_left: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SLAConfigOut(BaseModel):
    id: str
    workflow_stage: str
    allowed_duration: int
    warning_threshold: int
    escalation_threshold: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class SLAConfigUpdate(BaseModel):
    allowed_duration: Optional[int] = None
    warning_threshold: Optional[int] = None
    escalation_threshold: Optional[int] = None
    is_active: Optional[bool] = None
