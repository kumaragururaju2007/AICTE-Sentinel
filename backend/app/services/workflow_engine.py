from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.application import Application, ApplicationStage
from app.models.workflow import WorkflowTemplate, WorkflowStage, WorkflowHistory
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService

class WorkflowEngine:
    @staticmethod
    def get_template_for_application(db: Session, application_type: str) -> Optional[WorkflowTemplate]:
        """Find active workflow template matching application type, or fallback to default."""
        template = db.query(WorkflowTemplate).filter(
            WorkflowTemplate.application_type == application_type,
            WorkflowTemplate.is_active == True
        ).first()
        if not template:
            template = db.query(WorkflowTemplate).filter(WorkflowTemplate.is_active == True).first()
        return template

    @staticmethod
    def transition_stage(
        db: Session,
        application_id: str,
        new_stage_name: str,
        changed_by_user_id: str,
        reason: Optional[str] = None
    ) -> Application:
        """Perform verified, transaction-safe workflow stage transition."""
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

        prev_stage = app.current_stage

        # Close current stage record if open
        current_active_stage = db.query(ApplicationStage).filter(
            ApplicationStage.application_id == application_id,
            ApplicationStage.stage_name == prev_stage,
            ApplicationStage.completed_at.is_(None)
        ).first()

        now = datetime.now(timezone.utc)
        if current_active_stage:
            current_active_stage.completed_at = now
            current_active_stage.stage_status = "COMPLETED"
            if reason:
                current_active_stage.remarks = reason

        # Create new active stage
        new_stage_record = ApplicationStage(
            application_id=application_id,
            stage_name=new_stage_name,
            stage_status="IN_PROGRESS",
            assigned_officer_id=app.assigned_officer_id,
            started_at=now,
            remarks=f"Transitioned from {prev_stage}"
        )
        db.add(new_stage_record)

        # Update application current stage
        app.current_stage = new_stage_name
        app.updated_at = now

        # Update global status if reaching terminal stages
        if "Approved" in new_stage_name or "Completed" in new_stage_name or "Final Decision" in new_stage_name:
            app.status = "APPROVED"
        elif "Deficiency" in new_stage_name:
            app.status = "DEFICIENT"
        elif "Reject" in new_stage_name:
            app.status = "REJECTED"
        else:
            app.status = "UNDER_REVIEW"

        # Record workflow history
        history = WorkflowHistory(
            application_id=application_id,
            previous_stage=prev_stage,
            new_stage=new_stage_name,
            changed_by=changed_by_user_id,
            reason=reason or "Standard statutory stage progression",
            timestamp=now
        )
        db.add(history)
        db.commit()
        db.refresh(app)

        # Log audit entry
        AuditService.log_event(
            db=db,
            action="STAGE_TRANSITION",
            entity_type="APPLICATION",
            entity_id=application_id,
            user_id=changed_by_user_id,
            previous_value={"stage": prev_stage},
            new_value={"stage": new_stage_name, "status": app.status, "reason": reason}
        )

        # Notify institution users about stage movement
        if app.institution and app.institution.users:
            for inst_user in app.institution.users:
                NotificationService.send_notification(
                    db=db,
                    recipient_id=inst_user.user_id,
                    title=f"Application {app.application_number} Stage Update",
                    message=f"Application progressed from '{prev_stage}' to '{new_stage_name}'. Status: {app.status}.",
                    notification_type="APPLICATION",
                    priority="HIGH" if app.status in ["DEFICIENT", "APPROVED", "REJECTED"] else "INFO"
                )

        return app

