from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.obligation import Obligation, EscalationRule
from app.models.notification import Notification
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService

class ObligationEngine:
    @staticmethod
    def calculate_days_remaining(due_date: datetime) -> int:
        now = datetime.now(timezone.utc)
        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)
        diff = due_date - now
        return diff.days

    @staticmethod
    def run_deadline_scan(db: Session) -> Dict[str, Any]:
        """
        Idempotent background scan for obligation deadlines and SLA reminders.
        Dispatches T-30, T-7, T-0 due date, and overdue escalation notifications.
        Prevents duplicate dispatches within 24 hours.
        """
        now = datetime.now(timezone.utc)
        active_obligations = db.query(Obligation).filter(
            Obligation.status.in_(["PENDING", "IN_PROGRESS", "OVERDUE"])
        ).all()

        scanned_count = len(active_obligations)
        alerts_generated = 0
        escalations_triggered = 0

        for obl in active_obligations:
            due_date = obl.due_date
            if due_date.tzinfo is None:
                due_date = due_date.replace(tzinfo=timezone.utc)
            
            days_left = (due_date - now).days

            # Determine trigger condition
            trigger_tag = None
            if days_left <= 0 and obl.status != "OVERDUE":
                obl.status = "OVERDUE"
                trigger_tag = "OVERDUE_T+0"
            elif days_left < -3 and obl.status != "ESCALATED":
                obl.status = "ESCALATED"
                trigger_tag = "OVERDUE_T+3"
            elif days_left in [1, 0]:
                trigger_tag = "T-1_DAY"
            elif 2 <= days_left <= 7:
                trigger_tag = "T-7_DAYS"
            elif 8 <= days_left <= 30:
                trigger_tag = "T-30_DAYS"

            if not trigger_tag:
                continue

            # Idempotency check: Don't dispatch if an alert for this obligation with this trigger was sent today
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            existing_alert = db.query(Notification).filter(
                Notification.title.contains(f"[{obl.obligation_type}]"),
                Notification.created_at >= today_start
            ).first()

            if existing_alert:
                continue  # Skip to ensure idempotency

            # Recipient targets: Institution user and assigned officer
            recipients = []
            if obl.institution and obl.institution.users:
                recipients.extend([u.user_id for u in obl.institution.users])
            if obl.assigned_user_id:
                recipients.append(obl.assigned_user_id)

            title = f"[{obl.obligation_type}] {trigger_tag}: Action Required for {obl.institution.institution_name if obl.institution else 'Institution'}"
            message = f"Obligation '{obl.description}' due on {due_date.strftime('%d %b %Y')}. Days remaining: {days_left} days. Status: {obl.status}."
            priority = "CRITICAL" if days_left <= 1 else "HIGH" if days_left <= 7 else "WARNING"

            for r_id in set(recipients):
                NotificationService.send_notification(
                    db=db,
                    recipient_id=r_id,
                    title=title,
                    message=message,
                    notification_type="SLA",
                    priority=priority
                )
                alerts_generated += 1

            if trigger_tag in ["OVERDUE_T+0", "OVERDUE_T+3"]:
                escalations_triggered += 1
                AuditService.log_event(
                    db=db,
                    action="OBLIGATION_ESCALATED",
                    entity_type="OBLIGATION",
                    entity_id=obl.id,
                    previous_value={"status": "PENDING"},
                    new_value={"status": obl.status, "days_left": days_left}
                )

        db.commit()
        return {
            "scanned_count": scanned_count,
            "alerts_generated": alerts_generated,
            "escalations_triggered": escalations_triggered,
            "timestamp": now.isoformat()
        }

