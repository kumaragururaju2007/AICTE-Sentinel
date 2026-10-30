from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.permissions import get_current_user
from app.models.user import User, Role
from app.models.institution import Institution, InstitutionUser
from app.models.audit import LoginHistory
from app.schemas.auth import LoginRequest, TokenResponse, RefreshTokenRequest, RegisterRequest, UserOut, PasswordForgotRequest, PasswordResetRequest
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with Argon2 verification and issue access & refresh tokens."""
    user = db.query(User).filter(User.email == request.email.lower()).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        if user:
            # Record failed login attempt
            log = LoginHistory(
                user_id=user.id,
                ip_address="127.0.0.1",
                device_information=request.device_info or "Web Browser",
                login_status="FAILED_CREDENTIALS",
                login_time=datetime.now(timezone.utc)
            )
            db.add(log)
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact AICTE Administrator."
        )

    # Record successful login
    now = datetime.now(timezone.utc)
    user.last_login = now
    log = LoginHistory(
        user_id=user.id,
        ip_address="127.0.0.1",
        device_information=request.device_info or "Web Browser",
        login_status="SUCCESS",
        login_time=now
    )
    db.add(log)
    db.commit()

    role_name = user.role.role_name if user.role else "INSTITUTION"
    inst_id = user.institution_association.institution_id if user.institution_association else None
    inst_name = user.institution_association.institution.institution_name if user.institution_association and user.institution_association.institution else None

    # Audit event
    AuditService.log_event(
        db=db,
        action="USER_LOGIN",
        entity_type="USER",
        entity_id=user.id,
        user_id=user.id,
        new_value={"role": role_name, "device": request.device_info}
    )

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": role_name,
        "institution_id": inst_id
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role_name,
        institution_id=inst_id,
        institution_name=inst_name
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Public institution registration endpoint."""
    # Check if email exists
    if db.query(User).filter(User.email == request.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # Check if PID exists
    if db.query(Institution).filter(Institution.aicte_permanent_id == request.aicte_permanent_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An institution with AICTE Permanent ID '{request.aicte_permanent_id}' is already registered"
        )

    # Get institution role
    role = db.query(Role).filter(Role.role_name == "INSTITUTION").first()
    if not role:
        role = Role(role_name="INSTITUTION", description="Applying Institution Principal/Director")
        db.add(role)
        db.commit()
        db.refresh(role)

    # Create Institution
    inst = Institution(
        institution_name=request.institution_name,
        aicte_permanent_id=request.aicte_permanent_id,
        institution_type=request.institution_type,
        state=request.state,
        district=request.district,
        address=request.address,
        official_email=request.email.lower(),
        contact_number=request.phone,
        verification_status="VERIFIED"  # For demonstration readiness
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)

    # Create User
    now = datetime.now(timezone.utc)
    user = User(
        full_name=request.full_name,
        email=request.email.lower(),
        phone=request.phone,
        password_hash=hash_password(request.password),
        role_id=role.id,
        is_active=True,
        is_verified=True,
        created_at=now,
        last_login=now
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create Institution-User Link
    inst_user = InstitutionUser(
        institution_id=inst.id,
        user_id=user.id,
        designation=request.designation
    )
    db.add(inst_user)
    db.commit()

    # Audit event
    AuditService.log_event(
        db=db,
        action="INSTITUTION_REGISTERED",
        entity_type="INSTITUTION",
        entity_id=inst.id,
        user_id=user.id,
        new_value={"institution_name": inst.institution_name, "pid": inst.aicte_permanent_id}
    )

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": role.role_name,
        "institution_id": inst.id
    }

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role.role_name,
        institution_id=inst.id,
        institution_name=inst.institution_name
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Exchange valid refresh token for a new access token."""
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account deactivated"
        )

    role_name = user.role.role_name if user.role else "INSTITUTION"
    inst_id = user.institution_association.institution_id if user.institution_association else None
    inst_name = user.institution_association.institution.institution_name if user.institution_association and user.institution_association.institution else None

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": role_name,
        "institution_id": inst_id
    }

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role_name,
        institution_id=inst_id,
        institution_name=inst_name
    )

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Session logout endpoint with security audit logging."""
    AuditService.log_event(
        db=db,
        action="USER_LOGOUT",
        entity_type="USER",
        entity_id=current_user.id,
        user_id=current_user.id
    )
    return {"message": "Logged out successfully", "status": "success"}

@router.post("/forgot-password")
def forgot_password(request: PasswordForgotRequest, db: Session = Depends(get_db)):
    """Password recovery link request."""
    user = db.query(User).filter(User.email == request.email.lower()).first()
    if user:
        AuditService.log_event(
            db=db,
            action="PASSWORD_RESET_REQUESTED",
            entity_type="USER",
            entity_id=user.id,
            user_id=user.id
        )
    return {
        "message": "If an account exists with this email, password reset instructions have been dispatched.",
        "status": "success"
    }

@router.post("/reset-password")
def reset_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Reset password with token verification."""
    payload = decode_token(request.token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.password_hash = hash_password(request.new_password)
    user.updated_at = datetime.now(timezone.utc)
    db.commit()

    AuditService.log_event(
        db=db,
        action="PASSWORD_RESET_COMPLETED",
        entity_type="USER",
        entity_id=user.id,
        user_id=user.id
    )

    return {"message": "Password updated successfully. Please log in.", "status": "success"}

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Return profile data of currently authenticated user."""
    inst_id = current_user.institution_association.institution_id if current_user.institution_association else None
    inst_name = current_user.institution_association.institution.institution_name if current_user.institution_association and current_user.institution_association.institution else None

    return UserOut(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        phone=current_user.phone,
        role=current_user.role.role_name if current_user.role else "USER",
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        institution_id=inst_id,
        institution_name=inst_name
    )

