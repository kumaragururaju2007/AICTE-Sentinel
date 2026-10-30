import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=True, index=True)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    document_name = Column(String(255), nullable=False)
    document_type = Column(String(100), nullable=False, index=True)  # LAND_LEASE, FIRE_SAFETY, BUILDING_PLAN, FACULTY_AFFIDAVIT
    storage_key = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=False, index=True)  # SHA-256 for integrity verification
    extracted_data = Column(JSON, nullable=True)  # Extracted OCR fields
    verification_status = Column(String(50), default="PENDING", nullable=False, index=True)  # PENDING, VERIFIED, DEFICIENT, REJECTED
    issue_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    application = relationship("Application", back_populates="documents")
    institution = relationship("Institution", back_populates="documents")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    verifications = relationship("DocumentVerification", back_populates="document", cascade="all, delete-orphan")
    ai_analysis = relationship("AIDocumentAnalysis", back_populates="document", uselist=False, cascade="all, delete-orphan")

class DocumentVerification(Base):
    __tablename__ = "document_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    verified_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    verification_result = Column(String(50), nullable=False)  # APPROVED, DEFICIENT, REJECTED
    remarks = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    document = relationship("Document", back_populates="verifications")
    officer = relationship("User", foreign_keys=[verified_by])

