from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.models.institution import Institution
from app.schemas.institution import InstitutionOut, InstitutionUpdate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.get("/me", response_model=InstitutionOut)
def get_my_institution(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve institution profile for currently logged in institution user."""
    if not current_user.institution_association:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not affiliated with any registered institution"
        )
    
    inst = current_user.institution_association.institution
    return inst

@router.put("/me", response_model=InstitutionOut)
def update_my_institution(
    update_data: InstitutionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details for current institution."""
    if not current_user.institution_association:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not affiliated with any registered institution"
        )

    inst = current_user.institution_association.institution
    prev_val = {"name": inst.institution_name, "address": inst.address, "contact": inst.contact_number}

    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(inst, key, value)

    db.commit()
    db.refresh(inst)

    AuditService.log_event(
        db=db,
        action="INSTITUTION_PROFILE_UPDATED",
        entity_type="INSTITUTION",
        entity_id=inst.id,
        user_id=current_user.id,
        previous_value=prev_val,
        new_value=update_data.model_dump(exclude_unset=True)
    )

    return inst

