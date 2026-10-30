from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime

class DocumentOut(BaseModel):
    id: str
    application_id: Optional[str] = None
    institution_id: str
    document_name: str
    document_type: str
    file_hash: str
    verification_status: str
    extracted_data: Optional[Any] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    uploaded_at: datetime
    uploaded_by: str

    model_config = ConfigDict(from_attributes=True)

class DocumentVerifyRequest(BaseModel):
    verification_result: str  # APPROVED, DEFICIENT, REJECTED
    remarks: Optional[str] = "Document verified under statutory checklist."
