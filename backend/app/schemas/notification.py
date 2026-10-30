from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    recipient_id: str
    title: str
    message: str
    notification_type: str = "SYSTEM"
    priority: str = "INFO"

class NotificationOut(BaseModel):
    id: str
    recipient_id: str
    title: str
    message: str
    notification_type: str
    priority: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BroadcastNotificationRequest(BaseModel):
    title: str
    message: str
    target_role: Optional[str] = "ALL"  # ALL, INSTITUTION, REGIONAL_OFFICER, ADMINISTRATOR
    notification_type: str = "SYSTEM"
    priority: str = "HIGH"
