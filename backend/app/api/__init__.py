from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.institutions import router as institutions_router
from app.api.applications import router as applications_router
from app.api.officers import router as officers_router
from app.api.admin import router as admin_router
from app.api.obligations import router as obligations_router
from app.api.notifications import router as notifications_router
from app.api.analytics import router as analytics_router
from app.api.documents import router as documents_router
from app.api.ai import router as ai_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(institutions_router)
api_router.include_router(applications_router)
api_router.include_router(officers_router)
api_router.include_router(admin_router)
api_router.include_router(obligations_router)
api_router.include_router(notifications_router)
api_router.include_router(analytics_router)
api_router.include_router(documents_router)
api_router.include_router(ai_router)

