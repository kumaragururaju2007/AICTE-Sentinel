import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AICTE Sentinel"
    PROJECT_TAGLINE: str = "Intelligent Approval & Compliance Automation"
    TEAM_NAME: str = "TEAM VALORA"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"

    # Database: Defaults to PostgreSQL on localhost with credentials confirmed on system
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:12345@localhost:5432/aicte_sentinel"
    )
    # Fallback to local SQLite if PostgreSQL is inaccessible during zero-dependency standalone runs
    SQLITE_FALLBACK_URL: str = f"sqlite:///{BASE_DIR}/aicte_sentinel.db"

    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aicte_sentinel_sih2026_super_secret_tamper_evident_key_valora")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for hackathon evaluation ease
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

    # File Uploads
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    MAX_FILE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS: set = {"pdf", "png", "jpg", "jpeg"}

    # MinIO / S3 Compatibility (Optional)
    S3_ENDPOINT: str = os.getenv("S3_ENDPOINT", "localhost:9000")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "aicte-sentinel-documents")
    USE_S3: bool = os.getenv("USE_S3", "false").lower() == "true"

    # SMTP Configuration (Optional)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "sentinel-notifications@aicte-india.org")
    EMAILS_ENABLED: bool = os.getenv("EMAILS_ENABLED", "false").lower() == "true"

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()

# Ensure uploads directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
