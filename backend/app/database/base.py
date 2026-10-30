from app.database.session import Base
# Import all models here so Alembic and Base.metadata can discover them cleanly
from app.models.user import User, Role, Permission, RolePermission
from app.models.institution import Institution, InstitutionUser
from app.models.application import Application, ApplicationStage, ApplicationComment
from app.models.document import Document, DocumentVerification
from app.models.obligation import Obligation, SLAConfiguration, EscalationRule
from app.models.workflow import WorkflowTemplate, WorkflowStage, WorkflowHistory
from app.models.notification import Notification, NotificationTemplate, NotificationLog
from app.models.ai import DelayPrediction, AIDocumentAnalysis
from app.models.audit import AuditLog, LoginHistory

