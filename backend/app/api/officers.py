from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.session import get_db
from app.core.permissions import get_current_user, require_roles
from app.models.user import User
from app.models.application import Application, ApplicationComment
from app.models.document import Document, DocumentVerification
from app.models.obligation import Obligation
from app.schemas.application import ApplicationOut, CommentCreate, StageTransitionRequest, RecommendationRequest
from app.schemas.document import DocumentVerifyRequest
from app.services.workflow_engine import WorkflowEngine
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/officer", tags=["AICTE Officer Desk"])

OFFICER_ROLES = ["REGIONAL_OFFICER", "BUREAU_OFFICER", "EVC_COORDINATOR", "ADMINISTRATOR", "SYSTEM_ADMIN"]

@router.get("/applications", response_model=List[ApplicationOut])
def get_officer_applications(
    stage: Optional[str] = None,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Retrieve applications assigned to the officer or available in regional queue."""
    query = db.query(Application)
    
    # Regional officers see cases assigned to them or unassigned in review
    if current_user.role.role_name in ["REGIONAL_OFFICER", "EVC_COORDINATOR"]:
        query = query.filter(
            or_(
                Application.assigned_officer_id == current_user.id,
                Application.assigned_officer_id.is_(None)
            )
        )

    if stage:
        query = query.filter(Application.current_stage == stage)

    apps = query.order_by(Application.submitted_at.desc()).all()
    result = []
    for a in apps:
        out = ApplicationOut.model_validate(a)
        out.institution_name = a.institution.institution_name if a.institution else None
        out.assigned_officer_name = a.assigned_officer.full_name if a.assigned_officer else None
        result.append(out)
    return result

@router.get("/applications/{id}", response_model=ApplicationOut)
def get_officer_application_detail(
    id: str,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Retrieve full scrutiny dossier for an application."""
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    out = ApplicationOut.model_validate(app)
    out.institution_name = app.institution.institution_name if app.institution else None
    out.assigned_officer_name = app.assigned_officer.full_name if app.assigned_officer else None
    return out

@router.post("/applications/{id}/review")
def submit_scrutiny_review(
    id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Record an official scrutiny remark or review finding."""
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    # If unassigned, assign to this officer
    if not app.assigned_officer_id:
        app.assigned_officer_id = current_user.id
        db.commit()

    comment = ApplicationComment(
        application_id=app.id,
        user_id=current_user.id,
        comment=f"[OFFICER REVIEW] {comment_data.comment}",
        created_at=datetime.now(timezone.utc)
    )
    db.add(comment)
    db.commit()

    AuditService.log_event(
        db=db,
        action="OFFICER_SCRUTINY_REMARK",
        entity_type="APPLICATION",
        entity_id=app.id,
        user_id=current_user.id,
        new_value={"comment": comment_data.comment}
    )

    return {"message": "Scrutiny review recorded successfully", "status": "success"}

@router.post("/applications/{id}/deficiency")
def issue_deficiency_notice(
    id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Issue formal regulatory deficiency notice and transition workflow stage."""
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    # Mandatory remarks required
    if not comment_data.comment or len(comment_data.comment.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Statutory regulations require a specific reason when raising a deficiency."
        )

    # Add comment
    comment = ApplicationComment(
        application_id=app.id,
        user_id=current_user.id,
        comment=f"[DEFICIENCY NOTICE] {comment_data.comment}",
        created_at=datetime.now(timezone.utc)
    )
    db.add(comment)
    db.commit()

    # Move application to Deficiency stage
    WorkflowEngine.transition_stage(
        db=db,
        application_id=app.id,
        new_stage_name="Deficiency Clarification Window",
        changed_by_user_id=current_user.id,
        reason=comment_data.comment
    )

    return {"message": "Deficiency notice issued and applicant notified.", "status": "success"}

@router.post("/applications/{id}/verify-document")
def verify_document(
    id: str,
    doc_id: str,
    request: DocumentVerifyRequest,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Verify or reject an uploaded statutory document."""
    doc = db.query(Document).filter(Document.id == doc_id, Document.application_id == id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    doc.verification_status = request.verification_result
    db.commit()

    # Record verification entry
    verif = DocumentVerification(
        document_id=doc.id,
        verified_by=current_user.id,
        verification_result=request.verification_result,
        remarks=request.remarks,
        verified_at=datetime.now(timezone.utc)
    )
    db.add(verif)
    db.commit()

    AuditService.log_event(
        db=db,
        action="DOCUMENT_VERIFIED",
        entity_type="DOCUMENT",
        entity_id=doc.id,
        user_id=current_user.id,
        new_value={"result": request.verification_result, "remarks": request.remarks}
    )

    return {"message": f"Document status updated to {request.verification_result}", "status": "success"}

@router.post("/applications/{id}/forward")
def forward_application(
    id: str,
    request: StageTransitionRequest,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Progress application to next authorized workflow stage."""
    app = WorkflowEngine.transition_stage(
        db=db,
        application_id=id,
        new_stage_name=request.new_stage,
        changed_by_user_id=current_user.id,
        reason=request.remarks
    )
    return {"message": f"Application advanced to stage: {request.new_stage}", "status": "success"}

@router.post("/applications/{id}/recommendation")
def submit_recommendation(
    id: str,
    request: RecommendationRequest,
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Submit final approval or rejection recommendation with justification."""
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    new_stage = "Final Approval / EoA Issuance" if request.decision == "RECOMMEND_APPROVAL" else "Application Rejected"

    WorkflowEngine.transition_stage(
        db=db,
        application_id=app.id,
        new_stage_name=new_stage,
        changed_by_user_id=current_user.id,
        reason=f"[{request.decision}] {request.justification}"
    )

    return {"message": f"Recommendation recorded: {request.decision}", "status": "success"}

@router.get("/workload")
def get_officer_workload(
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Retrieve officer active case queue and workload statistics."""
    active_cases = db.query(Application).filter(
        Application.assigned_officer_id == current_user.id,
        Application.status == "UNDER_REVIEW"
    ).count()

    completed_cases = db.query(Application).filter(
        Application.assigned_officer_id == current_user.id,
        Application.status.in_(["APPROVED", "REJECTED"])
    ).count()

    pending_docs = db.query(Document).join(Application).filter(
        Application.assigned_officer_id == current_user.id,
        Document.verification_status == "PENDING"
    ).count()

    return {
        "officer_name": current_user.full_name,
        "active_cases": active_cases,
        "completed_cases": completed_cases,
        "pending_document_scrutiny": pending_docs,
        "max_recommended_capacity": 60,
        "workload_utilization_pct": round((active_cases / 60) * 100, 1)
    }

@router.get("/deadlines")
def get_officer_deadlines(
    current_user: User = Depends(require_roles(OFFICER_ROLES)),
    db: Session = Depends(get_db)
):
    """Retrieve approaching statutory deadlines for assigned applications."""
    obligations = db.query(Obligation).filter(
        Obligation.status.in_(["PENDING", "IN_PROGRESS", "OVERDUE"])
    ).order_by(Obligation.due_date.asc()).limit(10).all()

    now = datetime.now(timezone.utc)
    results = []
    for obl in obligations:
        due = obl.due_date
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        results.append({
            "id": obl.id,
            "obligation_type": obl.obligation_type,
            "description": obl.description,
            "institution_name": obl.institution.institution_name if obl.institution else "Institution",
            "due_date": due.strftime("%d %b %Y"),
            "days_left": (due - now).days,
            "status": obl.status,
            "priority": obl.priority
        })
    return results

