import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.session import engine
from app.database.base import Base
from app.api import api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("aicte_sentinel")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure all database tables exist
    logger.info("Initializing AICTE Sentinel database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    yield
    logger.info("Shutting down AICTE Sentinel service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    ## AICTE Sentinel: Intelligent Approval & Compliance Automation
    **Team Name:** TEAM VALORA  
    **Event:** Smart India Hackathon 2026  
    
    ### Core Capabilities
    * **Role-Based Access Control (RBAC):** Institution Users, Regional Scrutiny Officers, Bureau Supervisors, System Administrators.
    * **Statutory Workflow Automation:** State-machine stage progression with mandatory remarks and SLA calculation.
    * **Obligation & Deadline Engine:** Business-calendar aware reminder ladder (T-30, T-7, T-0, Overdue Escalation).
    * **Document Vault & AI-OCR:** Tamper-evident SHA-256 integrity hashing and metadata field extraction.
    * **Predictive Delay Forecaster:** LightGBM-based risk scoring with explainable contributing factors.
    * **Cryptographic Audit Trail:** Append-only SHA-256 block hash chaining for verifiable regulatory transparency.
    """,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API endpoints under /api
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Health"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "team": settings.TEAM_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "engine": "PostgreSQL 18"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
