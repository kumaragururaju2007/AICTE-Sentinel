import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_number = Column(String(50), unique=True, nullable=False, index=True)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    application_type = Column(String(100), nullable=False)  # Extension of Approval, New Institution, Course Expansion, Relocation
    academic_year = Column(String(20), default="2026-27", nullable=False)
    current_stage = Column(String(100), default="Application Submitted", nullable=False, index=True)
    status = Column(String(50), default="UNDER_REVIEW", nullable=False, index=True)  # UNDER_REVIEW, DEFICIENT, APPROVED, REJECTED
    assigned_officer_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    institution = relationship("Institution", back_populates="applications")
    assigned_officer = relationship("User", back_populates="assigned_applications", foreign_keys=[assigned_officer_id])
    stages = relationship("ApplicationStage", back_populates="application", cascade="all, delete-orphan", order_by="ApplicationStage.started_at")
    comments = relationship("ApplicationComment", back_populates="application", cascade="all, delete-orphan", order_by="ApplicationComment.created_at.desc()")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="application", cascade="all, delete-orphan")
    workflow_history = relationship("WorkflowHistory", back_populates="application", cascade="all, delete-orphan", order_by="WorkflowHistory.timestamp.desc()")
    delay_predictions = relationship("DelayPrediction", back_populates="application", cascade="all, delete-orphan")

class ApplicationStage(Base):
    __tablename__ = "application_stages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    stage_name = Column(String(100), nullable=False)
    stage_status = Column(String(50), default="IN_PROGRESS", nullable=False)  # IN_PROGRESS, COMPLETED, DEFICIENT, SKIPPED
    assigned_officer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    remarks = Column(Text, nullable=True)

    application = relationship("Application", back_populates="stages")

class ApplicationComment(Base):
    __tablename__ = "application_comments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    application = relationship("Application", back_populates="comments")
    author = relationship("User")

