from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class WorkflowStageCreate(BaseModel):
    stage_name: str
    sequence_number: int
    sla_duration: int = 15
    next_stage: Optional[str] = None
    approval_required: bool = True

class WorkflowTemplateCreate(BaseModel):
    template_name: str
    application_type: str
    version: str = "1.0.0"
    stages: List[WorkflowStageCreate]

class WorkflowStageOut(BaseModel):
    id: str
    stage_name: str
    sequence_number: int
    sla_duration: int
    next_stage: Optional[str] = None
    approval_required: bool

    model_config = ConfigDict(from_attributes=True)

class WorkflowOut(BaseModel):
    id: str
    template_name: str
    application_type: str
    version: str
    is_active: bool
    created_at: datetime
    stages: List[WorkflowStageOut] = []

    model_config = ConfigDict(from_attributes=True)
