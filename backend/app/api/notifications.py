from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import get_current_user, require_roles
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationOut, BroadcastNotificationRequest
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/my", response_model=List[NotificationOut])
def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all notifications for the current user."""
    return db.query(Notification).filter(
        Notification.recipient_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()

@router.patch("/{id}/read", response_model=NotificationOut)
def mark_notification_read(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a specific notification as read."""
    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.recipient_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.post("/read-all")
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications for current user as read."""
    db.query(Notification).filter(
        Notification.recipient_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read", "status": "success"}

@router.post("/broadcast")
def broadcast_notification(
    request: BroadcastNotificationRequest,
    current_user: User = Depends(require_roles(["ADMINISTRATOR", "SYSTEM_ADMIN"])),
    db: Session = Depends(get_db)
):
    """Broadcast an official announcement across all or specific stakeholder roles."""
    count = NotificationService.broadcast_to_role(
        db=db,
        role_name=request.target_role or "ALL",
        title=request.title,
        message=request.message,
        notification_type=request.notification_type,
        priority=request.priority
    )
    return {
        "message": f"Broadcast notification dispatched to {count} users.",
        "recipients_count": count,
        "status": "success"
    }

