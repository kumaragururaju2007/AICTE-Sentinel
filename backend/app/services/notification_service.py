from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationLog
from app.models.user import User

class NotificationService:
    @staticmethod
    def send_notification(
        db: Session,
        recipient_id: str,
        title: str,
        message: str,
        notification_type: str = "SYSTEM",
        priority: str = "INFO",
        channel: str = "IN_APP"
    ) -> Notification:
        """Create an in-app notification and delivery log."""
        notif = Notification(
            recipient_id=recipient_id,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)

        log = NotificationLog(
            notification_id=notif.id,
            delivery_channel=channel,
            delivery_status="DELIVERED",
            sent_at=datetime.now(timezone.utc)
        )
        db.add(log)
        db.commit()

        return notif

    @staticmethod
    def broadcast_to_role(
        db: Session,
        role_name: str,
        title: str,
        message: str,
        notification_type: str = "DIRECTIVE",
        priority: str = "HIGH"
    ) -> int:
        """Broadcast notification to all active users of a specific role (or ALL users)."""
        query = db.query(User).filter(User.is_active == True)
        if role_name != "ALL":
            query = query.join(User.role).filter(User.role.has(role_name=role_name))
        
        users = query.all()
        count = 0
        for u in users:
            NotificationService.send_notification(
                db=db,
                recipient_id=u.id,
                title=title,
                message=message,
                notification_type=notification_type,
                priority=priority
            )
            count += 1
        return count

