from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.security import decode_token
from app.models.user import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Validate Bearer token and retrieve authenticated user."""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Access token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been deactivated by administrator",
        )

    return user

def require_roles(allowed_roles: List[str]):
    """Role-Based Access Control dependency factory."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role_name = current_user.role.role_name if current_user.role else ""
        if user_role_name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}. User role: {user_role_name}",
            )
        return current_user
    return role_checker

def verify_institution_access(user: User, institution_id: str) -> bool:
    """Enforce data isolation: Institution users can only access their own institution."""
    if not user.role:
        return False
    # Admins and Officers have system-wide regulatory jurisdiction
    if user.role.role_name in ["ADMINISTRATOR", "SYSTEM_ADMIN", "REGIONAL_OFFICER", "BUREAU_OFFICER", "EVC_COORDINATOR"]:
        return True
    
    # Institution users must match the associated institution ID
    if user.institution_association and user.institution_association.institution_id == institution_id:
        return True
    
    return False

