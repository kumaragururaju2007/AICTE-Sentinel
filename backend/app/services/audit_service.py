from typing import Optional, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        user_id: Optional[str] = None,
        previous_value: Optional[Any] = None,
        new_value: Optional[Any] = None,
        ip_address: Optional[str] = "127.0.0.1"
    ) -> AuditLog:
        """Record an immutable, cryptographically chained audit log entry."""
        # Find latest audit log for previous hash continuity
        last_log = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).first()
        prev_hash = last_log.event_hash if last_log and last_log.event_hash else "0" * 64
        
        now = datetime.now(timezone.utc)
        now_str = now.isoformat()
        
        event_hash = AuditLog.compute_hash(
            prev_hash=prev_hash,
            user_id=str(user_id or "SYSTEM"),
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id or ""),
            ts=now_str
        )

        audit_entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            previous_value=previous_value,
            new_value=new_value,
            ip_address=ip_address,
            timestamp=now,
            previous_hash=prev_hash,
            event_hash=event_hash
        )

        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

