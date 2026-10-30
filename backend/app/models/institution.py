import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    institution_name = Column(String(255), nullable=False, index=True)
    aicte_permanent_id = Column(String(50), unique=True, nullable=False, index=True)
    institution_type = Column(String(100), nullable=False)  # University, Autonomous, Affiliated, Polytechnic
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False)
    address = Column(Text, nullable=True)
    official_email = Column(String(255), unique=True, nullable=False, index=True)
    contact_number = Column(String(20), nullable=True)
    verification_status = Column(String(50), default="PENDING_VERIFICATION", nullable=False)  # PENDING_VERIFICATION, VERIFIED, REJECTED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    users = relationship("InstitutionUser", back_populates="institution", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="institution", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="institution", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="institution", cascade="all, delete-orphan")

class InstitutionUser(Base):
    __tablename__ = "institution_users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    designation = Column(String(100), nullable=False)  # Principal, Director, Registrar, Compliance Officer

    institution = relationship("Institution", back_populates="users")
    user = relationship("User", back_populates="institution_association")

