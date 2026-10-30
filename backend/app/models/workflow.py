import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    template_name = Column(String(150), nullable=False, index=True)
    application_type = Column(String(100), nullable=False, index=True)
    version = Column(String(20), default="1.0.0", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    stages = relationship("WorkflowStage", back_populates="template", cascade="all, delete-orphan", order_by="WorkflowStage.sequence_number")

class WorkflowStage(Base):
    __tablename__ = "workflow_stages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workflow_id = Column(String(36), ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False, index=True)
    stage_name = Column(String(100), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    sla_duration = Column(Integer, default=15, nullable=False)  # Allowed business days
    next_stage = Column(String(100), nullable=True)
    approval_required = Column(Boolean, default=True, nullable=False)

    template = relationship("WorkflowTemplate", back_populates="stages")

class WorkflowHistory(Base):
    __tablename__ = "workflow_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_stage = Column(String(100), nullable=True)
    new_stage = Column(String(100), nullable=False)
    changed_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    application = relationship("Application", back_populates="workflow_history")
    actor = relationship("User")

