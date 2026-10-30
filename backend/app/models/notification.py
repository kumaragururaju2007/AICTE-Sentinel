import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recipient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="SYSTEM", nullable=False, index=True)  # SLA, EVC, DEFICIENCY, APPLICATION, SYSTEM
    priority = Column(String(20), default="INFO", nullable=False)  # INFO, WARNING, HIGH, CRITICAL
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    recipient = relationship("User")
    logs = relationship("NotificationLog", back_populates="notification", cascade="all, delete-orphan")

class NotificationTemplate(Base):
    __tablename__ = "notification_templates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    template_name = Column(String(100), unique=True, nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    message_body = Column(Text, nullable=False)
    channel = Column(String(50), default="IN_APP", nullable=False)  # IN_APP, EMAIL, SMS, ALL

class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    notification_id = Column(String(36), ForeignKey("notifications.id", ondelete="CASCADE"), nullable=False, index=True)
    delivery_channel = Column(String(50), nullable=False)  # IN_APP, EMAIL, SMS
    delivery_status = Column(String(50), default="SENT", nullable=False)  # SENT, DELIVERED, FAILED
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    error_message = Column(Text, nullable=True)

    notification = relationship("Notification", back_populates="logs")

