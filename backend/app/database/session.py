import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger("aicte_sentinel.database")

Base = declarative_base()

def get_engine():
    """Create engine with primary PostgreSQL and resilient SQLite fallback."""
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=10,
            max_overflow=20
        )
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info(f"Connected to primary database: {settings.DATABASE_URL.split('@')[-1]}")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to primary database ({e}). Falling back to SQLite: {settings.SQLITE_FALLBACK_URL}")
        fallback_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return fallback_engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

