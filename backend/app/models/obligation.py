import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=True, index=True)
    obligation_type = Column(String(100), nullable=False, index=True)  # LEASE_RENEWAL, DEFICIENCY_CORRECTION, EVC_COMPLIANCE, AFFIDAVIT
    description = Column(Text, nullable=False)
    assigned_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime, nullable=False, index=True)
    completion_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="PENDING", nullable=False, index=True)  # PENDING, IN_PROGRESS, COMPLETED, OVERDUE, ESCALATED
    priority = Column(String(20), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    institution = relationship("Institution", back_populates="obligations")
    application = relationship("Application", back_populates="obligations")
    assigned_user = relationship("User", foreign_keys=[assigned_user_id])

class SLAConfiguration(Base):
    __tablename__ = "sla_configurations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workflow_stage = Column(String(100), unique=True, nullable=False, index=True)
    allowed_duration = Column(Integer, nullable=False)  # Working days
    warning_threshold = Column(Integer, default=7, nullable=False)  # Days before due date to alert
    escalation_threshold = Column(Integer, default=1, nullable=False)  # Days before/after breach to escalate
    is_active = Column(Boolean, default=True, nullable=False)

class EscalationRule(Base):
    __tablename__ = "escalation_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    obligation_type = Column(String(100), nullable=False, index=True)
    trigger_condition = Column(String(100), nullable=False)  # T-7_DAYS, T-1_DAY, OVERDUE_T+0, OVERDUE_T+3
    escalation_level = Column(Integer, default=1, nullable=False)  # 1: Desk Officer, 2: Bureau Supervisor, 3: Member Secretary
    target_role = Column(String(50), nullable=False)  # REGIONAL_OFFICER, BUREAU_OFFICER, ADMINISTRATOR
    is_active = Column(Boolean, default=True, nullable=False)

