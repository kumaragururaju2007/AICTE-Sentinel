from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.services.ai_service import AIService
from app.services.prediction_service import DelayPredictionService

router = APIRouter(prefix="/ai", tags=["AI & Predictive Intelligence"])

class RAGQueryRequest(BaseModel):
    query: str

@router.post("/rag-query")
def query_regulatory_handbook(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_user)
):
    """
    RAG Assistant query over AICTE Approval Process Handbook (APH 2026-27).
    Returns grounded regulatory clauses with verifiable source page citations.
    """
    if not request.query or len(request.query.strip()) < 3:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Query must be at least 3 characters")

    result = AIService.query_aph_rag(request.query)
    return result

@router.get("/predict-delay/{application_id}")
def predict_application_delay(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    LightGBM statutory delay risk forecaster.
    Evaluates pipeline duration, pending verification items, and active deficiency burden.
    """
    result = DelayPredictionService.predict_delay_risk(db, application_id)
    return result

