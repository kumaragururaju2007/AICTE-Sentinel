import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class DelayPrediction(Base):
    __tablename__ = "delay_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)  # 0.0 - 1.0
    risk_category = Column(String(20), nullable=False)  # LOW, MODERATE, HIGH, CRITICAL
    contributing_factors = Column(JSON, nullable=True)  # Key feature importances from LightGBM / SHAP
    predicted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    application = relationship("Application", back_populates="delay_predictions")

class AIDocumentAnalysis(Base):
    __tablename__ = "ai_document_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    extracted_text = Column(Text, nullable=True)
    detected_fields = Column(JSON, nullable=True)  # { institution_name, doc_no, issue_date, expiry_date, land_acres, ... }
    analysis_result = Column(String(50), default="COMPLIANT_PROBABLE", nullable=False)  # COMPLIANT_PROBABLE, DISCREPANCY_DETECTED, REVIEW_MANDATORY
    confidence_score = Column(Float, default=0.92, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    document = relationship("Document", back_populates="ai_analysis")

