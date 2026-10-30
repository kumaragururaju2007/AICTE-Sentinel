from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class ApplicationCreate(BaseModel):
    application_type: str = Field(..., description="Extension of Approval, New Institution, Course Expansion, Relocation")
    academic_year: Optional[str] = "2026-27"
    course_type: Optional[str] = "Engineering & Technology (UG/PG)"
    intake_requested: Optional[int] = 120

class StageOut(BaseModel):
    id: str
    stage_name: str
    stage_status: str
    assigned_officer_id: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    remarks: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CommentCreate(BaseModel):
    comment: str = Field(..., min_length=2)

class CommentOut(BaseModel):
    id: str
    user_id: str
    author_name: Optional[str] = None
    comment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ApplicationOut(BaseModel):
    id: str
    application_number: str
    institution_id: str
    institution_name: Optional[str] = None
    application_type: str
    academic_year: str
    current_stage: str
    status: str
    assigned_officer_id: Optional[str] = None
    assigned_officer_name: Optional[str] = None
    submitted_at: datetime
    updated_at: datetime
    stages: Optional[List[StageOut]] = []
    comments: Optional[List[CommentOut]] = []

    model_config = ConfigDict(from_attributes=True)

class DeficiencyResponseRequest(BaseModel):
    deficiency_id: Optional[str] = None
    response_notes: str = Field(..., min_length=5)
    document_ids: Optional[List[str]] = []

class StageTransitionRequest(BaseModel):
    new_stage: str
    remarks: str = Field(..., min_length=3)

class RecommendationRequest(BaseModel):
    decision: str = Field(..., description="RECOMMEND_APPROVAL, RECOMMEND_REJECTION, ISSUE_DEFICIENCY")
    justification: str = Field(..., min_length=5)
