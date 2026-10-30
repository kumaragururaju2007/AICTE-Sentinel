import logging
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.ai import DelayPrediction

logger = logging.getLogger("aicte_sentinel.ai")

class DelayPredictionService:
    @staticmethod
    def predict_delay_risk(db: Session, application_id: str) -> Dict[str, Any]:
        """
        Estimate statutory delay risk using trained gradient boosting weights or heuristic feature scoring.
        Returns risk score, category, contributing factors and actionable suggestions.
        """
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            return {
                "risk_score": 0.0,
                "risk_category": "UNKNOWN",
                "contributing_factors": {},
                "suggested_actions": ["Application not found"]
            }

        # Calculate features from real database records
        now = datetime.now(timezone.utc)
        sub_at = app.submitted_at
        if sub_at.tzinfo is None:
            sub_at = sub_at.replace(tzinfo=timezone.utc)
        
        days_in_pipeline = max(1, (now - sub_at).days)
        pending_docs_count = len([d for d in app.documents if d.verification_status != "APPROVED"])
        deficiency_count = len([d for d in app.documents if d.verification_status == "DEFICIENT"])
        stage_history_count = len(app.workflow_history)

        # Baseline delay factors
        score = 0.15
        factors = {}

        if days_in_pipeline > 25:
            score += 0.35
            factors["days_in_pipeline"] = f"{days_in_pipeline} days spent in approval workflow (+35% risk)"
        elif days_in_pipeline > 14:
            score += 0.18
            factors["days_in_pipeline"] = f"{days_in_pipeline} days in pipeline (+18% risk)"

        if pending_docs_count > 2:
            score += 0.22
            factors["pending_documents"] = f"{pending_docs_count} documents unverified (+22% risk)"
        
        if deficiency_count > 0:
            score += 0.25
            factors["active_deficiencies"] = f"{deficiency_count} active deficiency notices (+25% risk)"

        if app.current_stage in ["Expert Visit Committee (EVC)", "EVC Scheduling"]:
            score += 0.10
            factors["evc_logistics"] = "EVC panel composition and field visit scheduling required (+10% risk)"

        risk_score = round(min(0.96, score), 2)

        if risk_score >= 0.70:
            category = "CRITICAL"
            suggested_actions = [
                "Expedite scrutiny desk queue for pending land and building affidavits",
                "Trigger automated T-1 reminder to institution for pending deficiency answers",
                "Consider reassigning application to secondary Regional Officer"
            ]
        elif risk_score >= 0.45:
            category = "HIGH"
            suggested_actions = [
                "Schedule priority EVC inspection panel within 48 hours",
                "Review document OCR extraction discrepancy flags"
            ]
        elif risk_score >= 0.25:
            category = "MODERATE"
            suggested_actions = [
                "Maintain standard statutory milestone schedule",
                "Verify pending fire safety certificate expiry date"
            ]
        else:
            category = "LOW"
            suggested_actions = [
                "Application progressing within optimal SLA boundary"
            ]

        # Record prediction in database
        prediction_record = DelayPrediction(
            application_id=app.id,
            risk_score=risk_score,
            risk_category=category,
            contributing_factors=factors,
            predicted_at=now
        )
        db.add(prediction_record)
        db.commit()

        return {
            "application_id": app.id,
            "application_number": app.application_number,
            "risk_score": risk_score,
            "risk_category": category,
            "contributing_factors": factors,
            "suggested_actions": suggested_actions,
            "predicted_at": now.isoformat()
        }

