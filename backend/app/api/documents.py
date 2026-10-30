import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import get_current_user, verify_institution_access
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentOut
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Document Repository"])

@router.post("/upload", response_model=DocumentOut)
def upload_standalone_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload institutional compliance document to secure document vault."""
    if not current_user.institution_association:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only registered institutions can upload statutory documents"
        )

    inst_id = current_user.institution_association.institution_id
    doc = DocumentService.process_and_save_upload(
        db=db,
        file=file,
        institution_id=inst_id,
        uploaded_by_user_id=current_user.id,
        document_type=document_type
    )
    return doc

@router.get("/{id}/download")
def download_document(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Securely download verified document bytes."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    if not verify_institution_access(current_user, doc.institution_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if not os.path.exists(doc.storage_key):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document file not found on storage")

    return FileResponse(
        path=doc.storage_key,
        filename=doc.document_name,
        media_type="application/octet-stream"
    )

