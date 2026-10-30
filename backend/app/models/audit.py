import uuid
import hashlib
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Integer
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)  # LOGIN, APP_SUBMIT, STAGE_TRANSITION, DOC_VERIFY, SLA_CHANGE
    entity_type = Column(String(100), nullable=False, index=True)  # APPLICATION, DOCUMENT, OBLIGATION, USER, WORKFLOW
    entity_id = Column(String(36), nullable=True, index=True)
    previous_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    
    # Cryptographic SHA-256 Tamper-Evident Hash Chaining
    previous_hash = Column(String(64), nullable=False, default="0"*64)
    event_hash = Column(String(64), nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")

    @staticmethod
    def compute_hash(prev_hash: str, user_id: str, action: str, entity_type: str, entity_id: str, ts: str) -> str:
        payload = f"{prev_hash}|{user_id}|{action}|{entity_type}|{entity_id}|{ts}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    login_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    device_information = Column(String(255), nullable=True)
    login_status = Column(String(50), default="SUCCESS", nullable=False)  # SUCCESS, FAILED_CREDENTIALS, ACCOUNT_LOCKED

    user = relationship("User", back_populates="login_history")

