import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import get_current_user, verify_institution_access
from app.models.user import User
from app.models.application import Application, ApplicationStage, ApplicationComment
from app.models.document import Document
from app.models.workflow import WorkflowHistory
from app.schemas.application import ApplicationCreate, ApplicationOut, CommentCreate, CommentOut, DeficiencyResponseRequest
from app.schemas.document import DocumentOut
from app.services.workflow_engine import WorkflowEngine
from app.services.document_service import DocumentService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def submit_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new AICTE regulatory application."""
    if not current_user.institution_association:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only registered institutions can submit statutory applications."
        )

    inst_id = current_user.institution_association.institution_id
    inst = current_user.institution_association.institution

    # Generate sequential unique application number: AICTE-2026-XXXXX
    count = db.query(Application).count() + 1
    app_number = f"AICTE-2026-{str(count).padStart(5, '0') if hasattr(str(count), 'padStart') else f'{count:05d}'}"

    now = datetime.now(timezone.utc)
    app = Application(
        application_number=app_number,
        institution_id=inst_id,
        application_type=app_data.application_type,
        academic_year=app_data.academic_year or "2026-27",
        current_stage="Application Ingestion & Payment",
        status="UNDER_REVIEW",
        submitted_at=now,
        updated_at=now
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    # Initialize workflow stages from configured template
    template = WorkflowEngine.get_template_for_application(db, app_data.application_type)
    if template and template.stages:
        for st in template.stages:
            stage_rec = ApplicationStage(
                application_id=app.id,
                stage_name=st.stage_name,
                stage_status="IN_PROGRESS" if st.sequence_number == 1 else "PENDING",
                started_at=now if st.sequence_number == 1 else now
            )
            db.add(stage_rec)
        db.commit()

    # Record initial history
    history = WorkflowHistory(
        application_id=app.id,
        previous_stage=None,
        new_stage="Application Ingestion & Payment",
        changed_by=current_user.id,
        reason="Initial electronic application submission",
        timestamp=now
    )
    db.add(history)
    db.commit()

    # Audit event
    AuditService.log_event(
        db=db,
        action="APPLICATION_SUBMITTED",
        entity_type="APPLICATION",
        entity_id=app.id,
        user_id=current_user.id,
        new_value={"app_number": app.application_number, "type": app.application_type}
    )

    db.refresh(app)
    return app

@router.get("/my", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all applications submitted by current institution."""
    if not current_user.institution_association:
        return []

    inst_id = current_user.institution_association.institution_id
    apps = db.query(Application).filter(Application.institution_id == inst_id).order_by(Application.submitted_at.desc()).all()
    
    # Attach institution name and officer name
    result = []
    for a in apps:
        out = ApplicationOut.model_validate(a)
        out.institution_name = a.institution.institution_name if a.institution else None
        out.assigned_officer_name = a.assigned_officer.full_name if a.assigned_officer else None
        result.append(out)
    return result

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application_detail(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full application detail with stages, history, and comments."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not verify_institution_access(current_user, app.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to another institution's dossier")

    out = ApplicationOut.model_validate(app)
    out.institution_name = app.institution.institution_name if app.institution else None
    out.assigned_officer_name = app.assigned_officer.full_name if app.assigned_officer else None
    return out

@router.post("/{application_id}/documents", response_model=DocumentOut)
def upload_application_document(
    application_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and attach a verified statutory document to an active application."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not verify_institution_access(current_user, app.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    doc = DocumentService.process_and_save_upload(
        db=db,
        file=file,
        institution_id=app.institution_id,
        uploaded_by_user_id=current_user.id,
        document_type=document_type,
        application_id=app.id
    )
    return doc

@router.get("/{application_id}/history")
def get_application_history(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve transparent workflow stage transitions and audit timestamp log."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not verify_institution_access(current_user, app.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    history_records = db.query(WorkflowHistory).filter(
        WorkflowHistory.application_id == application_id
    ).order_by(WorkflowHistory.timestamp.desc()).all()

    return [
        {
            "id": h.id,
            "previous_stage": h.previous_stage,
            "new_stage": h.new_stage,
            "changed_by": h.actor.full_name if h.actor else "System Worker",
            "reason": h.reason,
            "timestamp": h.timestamp.isoformat()
        }
        for h in history_records
    ]

@router.post("/{application_id}/deficiency-response")
def submit_deficiency_response(
    application_id: str,
    response_data: DeficiencyResponseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit applicant clarification or rectified documents to clear deficiency."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not verify_institution_access(current_user, app.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Add comment record
    comment = ApplicationComment(
        application_id=app.id,
        user_id=current_user.id,
        comment=f"[DEFICIENCY RESPONSE] {response_data.response_notes}"
    )
    db.add(comment)
    db.commit()

    # Advance stage back to Scrutiny Desk for re-evaluation
    WorkflowEngine.transition_stage(
        db=db,
        application_id=app.id,
        new_stage_name="Deficiency Review by Scrutiny Desk",
        changed_by_user_id=current_user.id,
        reason=response_data.response_notes
    )

    return {"message": "Deficiency response submitted successfully for officer re-scrutiny.", "status": "success"}

@router.post("/{application_id}/comments", response_model=CommentOut)
def add_application_comment(
    application_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a clarification comment or internal case note to an application."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not verify_institution_access(current_user, app.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    comment = ApplicationComment(
        application_id=app.id,
        user_id=current_user.id,
        comment=comment_data.comment,
        created_at=datetime.now(timezone.utc)
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentOut(
        id=comment.id,
        user_id=comment.user_id,
        author_name=current_user.full_name,
        comment=comment.comment,
        created_at=comment.created_at
    )

