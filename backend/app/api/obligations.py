from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.models.obligation import Obligation, SLAConfiguration, EscalationRule
from app.schemas.obligation import ObligationOut, SLAConfigOut, SLAConfigUpdate
from app.services.obligation_engine import ObligationEngine
from app.services.audit_service import AuditService

router = APIRouter(prefix="/obligations", tags=["Obligations & SLAs"])

@router.get("/my", response_model=List[ObligationOut])
def get_my_obligations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve obligations for current institution or assigned user."""
    query = db.query(Obligation)
    
    if current_user.institution_association:
        inst_id = current_user.institution_association.institution_id
        query = query.filter(Obligation.institution_id == inst_id)
    else:
        query = query.filter(Obligation.assigned_user_id == current_user.id)

    obls = query.order_by(Obligation.due_date.asc()).all()
    now = datetime.now(timezone.utc)
    result = []
    for o in obls:
        due = o.due_date
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        out = ObligationOut.model_validate(o)
        out.institution_name = o.institution.institution_name if o.institution else None
        out.application_number = o.application.application_number if o.application else None
        out.days_left = (due - now).days
        result.append(out)
    return result

@router.get("/sla-ladder", response_model=List[SLAConfigOut])
def get_sla_ladder(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all configured statutory stage SLA rules."""
    return db.query(SLAConfiguration).order_by(SLAConfiguration.workflow_stage.asc()).all()

@router.put("/sla-ladder/{id}", response_model=SLAConfigOut)
def update_sla_stage(
    id: str,
    update_data: SLAConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update statutory SLA stage duration."""
    sla = db.query(SLAConfiguration).filter(SLAConfiguration.id == id).first()
    if not sla:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SLA stage rule not found")

    prev = {"allowed_duration": sla.allowed_duration, "is_active": sla.is_active}
    for k, v in update_data.model_dump(exclude_unset=True).items():
        if v is not None:
            setattr(sla, k, v)

    db.commit()
    db.refresh(sla)

    AuditService.log_event(
        db=db,
        action="SLA_CONFIG_UPDATED",
        entity_type="SLA_CONFIGURATION",
        entity_id=sla.id,
        user_id=current_user.id,
        previous_value=prev,
        new_value=update_data.model_dump(exclude_unset=True)
    )
    return sla

@router.post("/scan")
def trigger_cron_scan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Trigger an immediate idempotent statutory deadline & escalation scan."""
    result = ObligationEngine.run_deadline_scan(db)
    return {"message": "Statutory deadline scan executed successfully.", "scan_result": result, "status": "success"}

