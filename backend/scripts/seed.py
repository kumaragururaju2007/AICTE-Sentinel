import os
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Ensure backend directory is in python path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.core.security import hash_password
from app.models.user import User, Role, Permission, RolePermission
from app.models.institution import Institution, InstitutionUser
from app.models.application import Application, ApplicationStage, ApplicationComment
from app.models.document import Document, DocumentVerification
from app.models.obligation import Obligation, SLAConfiguration, EscalationRule
from app.models.workflow import WorkflowTemplate, WorkflowStage, WorkflowHistory
from app.models.notification import Notification, NotificationTemplate, NotificationLog
from app.models.ai import DelayPrediction, AIDocumentAnalysis
from app.models.audit import AuditLog
from app.services.audit_service import AuditService

def seed_database():
    print("[*] Initializing AICTE Sentinel database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Role).count() > 0 and db.query(User).count() > 0:
            print("[INFO] Database already seeded with sample regulatory data. Skipping seed.")
            return

        print("[*] Seeding Roles & Permissions...")
        roles_data = [
            ("ADMINISTRATOR", "National Central IT & Regulatory Governance Administrator"),
            ("SYSTEM_ADMIN", "System Administrator with infrastructure privileges"),
            ("REGIONAL_OFFICER", "Regional Scrutiny Officer handling desk document audit"),
            ("BUREAU_OFFICER", "Bureau Officer & Approval Committee Supervisor"),
            ("EVC_COORDINATOR", "Expert Visit Committee Logistics & Inspection Coordinator"),
            ("INSTITUTION", "Applying Institution Principal, Director, or Authorized Registrar")
        ]
        roles = {}
        for r_name, r_desc in roles_data:
            role = Role(role_name=r_name, description=r_desc)
            db.add(role)
            roles[r_name] = role
        db.commit()

        # ── Seed Demo Users ──
        print("[*] Seeding Demo User Accounts (Argon2 Hashed)...")
        now = datetime.now(timezone.utc)
        default_pass = hash_password("password123")

        admin_user = User(
            full_name="Shri Amitabh Sharma",
            email="admin@aicte.gov.in",
            phone="+91 11 2958 1000",
            password_hash=default_pass,
            role_id=roles["ADMINISTRATOR"].id,
            is_active=True,
            is_verified=True,
            created_at=now,
            last_login=now
        )
        officer_user = User(
            full_name="Dr. Rajesh Kumar",
            email="officer@aicte-india.org",
            phone="+91 22 2285 5412",
            password_hash=default_pass,
            role_id=roles["REGIONAL_OFFICER"].id,
            is_active=True,
            is_verified=True,
            created_at=now,
            last_login=now
        )
        institution_user = User(
            full_name="Dr. Ramesh S. Patil",
            email="principal@institution.ac.in",
            phone="+91 20 2567 8901",
            password_hash=default_pass,
            role_id=roles["INSTITUTION"].id,
            is_active=True,
            is_verified=True,
            created_at=now,
            last_login=now
        )

        db.add_all([admin_user, officer_user, institution_user])
        db.commit()

        # ── Seed Demo Institutions ──
        print("[*] Seeding Demo Technical Institutions...")
        inst_list = [
            Institution(
                institution_name="Apex Institute of Technology & Management",
                aicte_permanent_id="1-43219081",
                institution_type="Autonomous College",
                state="Maharashtra",
                district="Pune",
                address="Sector 28, Pradhikaran, Akurdi, Pune - 411044",
                official_email="principal@institution.ac.in",
                contact_number="+91 20 2567 8901",
                verification_status="VERIFIED"
            ),
            Institution(
                institution_name="Delhi Institute of Engineering & Advanced Sciences",
                aicte_permanent_id="1-89765412",
                institution_type="Affiliated College",
                state="Delhi NCR",
                district="New Delhi",
                address="Institutional Area, Sector 5, Dwarka, New Delhi - 110078",
                official_email="director@dieas.ac.in",
                contact_number="+91 11 2808 3400",
                verification_status="VERIFIED"
            ),
            Institution(
                institution_name="Kalinga Institute of Polytechnic & Technology",
                aicte_permanent_id="1-99882314",
                institution_type="Polytechnic",
                state="Odisha",
                district="Bhubaneswar",
                address="Chandrasekharpur, Bhubaneswar - 751024",
                official_email="principal@kalingapoly.edu.in",
                contact_number="+91 674 274 1998",
                verification_status="VERIFIED"
            ),
            Institution(
                institution_name="St. Xavier Institute of Management Studies",
                aicte_permanent_id="1-33445511",
                institution_type="Stand-alone Institution",
                state="Goa",
                district="North Goa",
                address="Campal, Panaji, Goa - 403001",
                official_email="director@stxaviers-mgmt.ac.in",
                contact_number="+91 832 242 0910",
                verification_status="VERIFIED"
            ),
            Institution(
                institution_name="Sunrise Engineering College",
                aicte_permanent_id="1-11223344",
                institution_type="Affiliated College",
                state="Karnataka",
                district="Bengaluru",
                address="Whitefield Main Road, Bengaluru - 560066",
                official_email="principal@sunrise.edu.in",
                contact_number="+91 80 2845 0012",
                verification_status="VERIFIED"
            )
        ]
        db.add_all(inst_list)
        db.commit()

        # Link institution user to Apex Institute
        inst_user_link = InstitutionUser(
            institution_id=inst_list[0].id,
            user_id=institution_user.id,
            designation="Principal & Professor"
        )
        db.add(inst_user_link)
        db.commit()

        # ── Seed Workflow Templates ──
        print("[*] Seeding Statutory Approval Workflow Templates...")
        wf1 = WorkflowTemplate(
            template_name="Standard Technical Degree (UG/PG) Approval Flow",
            application_type="Extension of Approval",
            version="1.2.0",
            is_active=True
        )
        db.add(wf1)
        db.commit()

        stages_wf1 = [
            ("Application Ingestion & Payment", 1, 2, "Document Scrutiny Desk", False),
            ("Document Scrutiny Desk", 2, 10, "Deficiency Correction Window", True),
            ("Deficiency Clarification Window", 3, 8, "Expert Visit Committee (EVC)", True),
            ("Expert Visit Committee (EVC)", 4, 15, "Standing Hearing Committee", True),
            ("Standing Hearing Committee (SAC/SHC)", 5, 8, "Final Decision & EoA Dispatch", True),
            ("Final Approval / EoA Issuance", 6, 4, None, True)
        ]
        for s_name, seq, sla, next_s, req_app in stages_wf1:
            stage_rec = WorkflowStage(
                workflow_id=wf1.id,
                stage_name=s_name,
                sequence_number=seq,
                sla_duration=sla,
                next_stage=next_s,
                approval_required=req_app
            )
            db.add(stage_rec)
        db.commit()

        # ── Seed SLA Configurations ──
        print("[*] Seeding SLA Configurations...")
        sla_configs = [
            ("Document Scrutiny Desk", 10, 5, 1, True),
            ("Deficiency Clarification Window", 8, 3, 0, True),
            ("Expert Visit Committee (EVC)", 15, 5, 2, True),
            ("Standing Hearing Committee (SAC/SHC)", 8, 3, 1, True),
            ("Final Approval / EoA Issuance", 4, 2, 0, True)
        ]
        for st_name, dur, warn, esc, act in sla_configs:
            db.add(SLAConfiguration(
                workflow_stage=st_name,
                allowed_duration=dur,
                warning_threshold=warn,
                escalation_threshold=esc,
                is_active=act
            ))
        db.commit()

        # ── Seed Escalation Rules ──
        escalation_rules = [
            ("T-30_DAYS", "T-30 Days Advance Reminder", 1, "INSTITUTION", True),
            ("T-15_DAYS", "T-15 Days Planning Alert", 1, "INSTITUTION", True),
            ("T-7_DAYS", "T-7 Days Critical Threshold Notice", 1, "REGIONAL_OFFICER", True),
            ("T-1_DAY", "T-1 Day Imminent Breach Alert", 2, "REGIONAL_OFFICER", True),
            ("OVERDUE_T+0", "Due Date Statutory Breach Flag", 2, "BUREAU_OFFICER", True),
            ("OVERDUE_T+3", "Overdue Level-1 Administrative Escalation", 3, "ADMINISTRATOR", True)
        ]
        for trig, typ, lvl, role_tgt, act in escalation_rules:
            db.add(EscalationRule(
                obligation_type=typ,
                trigger_condition=trig,
                escalation_level=lvl,
                target_role=role_tgt,
                is_active=act
            ))
        db.commit()

        # ── Seed Applications ──
        print("[*] Seeding Demonstration Applications...")
        demo_apps = [
            Application(
                application_number="AICTE-2026-00123",
                institution_id=inst_list[0].id,
                application_type="Extension of Approval",
                academic_year="2026-27",
                current_stage="Document Scrutiny Desk",
                status="UNDER_REVIEW",
                assigned_officer_id=officer_user.id,
                submitted_at=now - timedelta(days=5),
                updated_at=now
            ),
            Application(
                application_number="AICTE-2026-00145",
                institution_id=inst_list[1].id,
                application_type="Extension of Approval",
                academic_year="2026-27",
                current_stage="Expert Visit Committee (EVC)",
                status="UNDER_REVIEW",
                assigned_officer_id=officer_user.id,
                submitted_at=now - timedelta(days=12),
                updated_at=now
            ),
            Application(
                application_number="AICTE-2026-00167",
                institution_id=inst_list[2].id,
                application_type="Course Expansion",
                academic_year="2026-27",
                current_stage="Deficiency Clarification Window",
                status="DEFICIENT",
                assigned_officer_id=officer_user.id,
                submitted_at=now - timedelta(days=18),
                updated_at=now
            ),
            Application(
                application_number="AICTE-2026-00189",
                institution_id=inst_list[3].id,
                application_type="Extension of Approval",
                academic_year="2026-27",
                current_stage="Standing Hearing Committee (SAC/SHC)",
                status="UNDER_REVIEW",
                assigned_officer_id=officer_user.id,
                submitted_at=now - timedelta(days=22),
                updated_at=now
            ),
            Application(
                application_number="AICTE-2026-00190",
                institution_id=inst_list[4].id,
                application_type="Extension of Approval",
                academic_year="2026-27",
                current_stage="Final Approval / EoA Issuance",
                status="APPROVED",
                assigned_officer_id=officer_user.id,
                submitted_at=now - timedelta(days=28),
                updated_at=now
            )
        ]
        db.add_all(demo_apps)
        db.commit()

        # Seed initial stages & comments for demo apps
        for app in demo_apps:
            stage_rec = ApplicationStage(
                application_id=app.id,
                stage_name=app.current_stage,
                stage_status="IN_PROGRESS" if app.status != "APPROVED" else "COMPLETED",
                assigned_officer_id=app.assigned_officer_id,
                started_at=app.submitted_at,
                remarks=f"Demonstration regulatory stage: {app.current_stage}"
            )
            db.add(stage_rec)

            comment_rec = ApplicationComment(
                application_id=app.id,
                user_id=officer_user.id,
                comment=f"Dossier assigned for statutory review under APH 2026 Clause 2.14.",
                created_at=app.submitted_at + timedelta(hours=2)
            )
            db.add(comment_rec)

            # Workflow history
            hist_rec = WorkflowHistory(
                application_id=app.id,
                previous_stage="Application Ingestion & Payment",
                new_stage=app.current_stage,
                changed_by=officer_user.id,
                reason="Regular statutory progression",
                timestamp=app.submitted_at + timedelta(days=1)
            )
            db.add(hist_rec)
        db.commit()

        # ── Seed Demonstration Obligations ──
        print("[*] Seeding Regulatory Obligations & Deadlines...")
        obligations_data = [
            (inst_list[0].id, demo_apps[0].id, "DOCUMENT_VERIFICATION", "Submission of Municipal Fire Safety Clearance Renewal", now + timedelta(days=1), "HIGH"),
            (inst_list[1].id, demo_apps[1].id, "EVC_COMPLIANCE", "Expert Visit Committee On-Site Readiness Verification", now + timedelta(days=3), "CRITICAL"),
            (inst_list[2].id, demo_apps[2].id, "DEFICIENCY_RESPONSE", "Deficiency Clarification: 30-Year Registered Lease Deed Verification", now + timedelta(days=5), "HIGH"),
            (inst_list[3].id, demo_apps[3].id, "AFFIDAVIT_SUBMISSION", "Anti-Ragging Committee Affidavit & Grievance Redressal Portal Setup", now + timedelta(days=8), "MEDIUM"),
            (inst_list[4].id, demo_apps[4].id, "CADRE_RATIO_AFFIDAVIT", "Faculty Cadre Ratio Verification & NBA Compliance Proof", now - timedelta(days=2), "CRITICAL")
        ]
        for inst_id, app_id, obl_type, desc, due, prio in obligations_data:
            obl = Obligation(
                institution_id=inst_id,
                application_id=app_id,
                obligation_type=obl_type,
                description=desc,
                assigned_user_id=officer_user.id,
                due_date=due,
                priority=prio,
                status="OVERDUE" if due < now else "PENDING",
                created_at=now - timedelta(days=10)
            )
            db.add(obl)
        db.commit()

        # ── Seed Notifications ──
        print("[*] Seeding System & Regulatory Notifications...")
        notifs = [
            (admin_user.id, "New application submitted", "SVS College of Engineering submitted EoA application for AY 2026-27.", "APPLICATION", "INFO", False),
            (admin_user.id, "EVC deadline approaching", "ABC Engineering College inspection report submission window closing in 48 hours.", "EVC", "CRITICAL", False),
            (admin_user.id, "Document verification pending", "GreenTech Polytechnic uploaded revised 30-year lease deed.", "DOCUMENT", "HIGH", False),
            (admin_user.id, "Stage delay detected", "Skyline Institute of Management reached 85% of scrutiny SLA budget.", "SLA", "CRITICAL", False),
            (admin_user.id, "System update completed", "Workflow rules updated successfully to APH 2026-27 statutory directives.", "SYSTEM", "INFO", True),
            (officer_user.id, "New Application Assigned", "AICTE-2026-00123 assigned to your scrutiny desk.", "APPLICATION", "HIGH", False),
            (officer_user.id, "SLA Breach Warning (T-1)", "Vidya Institute of Technology EVC window closing in 24 hours.", "SLA", "CRITICAL", False),
            (institution_user.id, "Scrutiny Status Update", "Your application AICTE-2026-00123 has been accepted for Document Scrutiny.", "APPLICATION", "INFO", False)
        ]
        for rec_id, title, msg, typ, prio, is_read in notifs:
            notif = Notification(
                recipient_id=rec_id,
                title=title,
                message=msg,
                notification_type=typ,
                priority=prio,
                is_read=is_read,
                created_at=now - timedelta(minutes=15)
            )
            db.add(notif)
        db.commit()

        # ── Seed Tamper-Evident Audit Trail Blocks ──
        print("[*] Seeding Cryptographic Tamper-Evident Audit Trail...")
        AuditService.log_event(
            db=db,
            action="GENESIS_BLOCK",
            entity_type="SYSTEM",
            entity_id="AICTE_SENTINEL_2026",
            user_id=admin_user.id,
            new_value={"message": "AICTE Sentinel Genesis Regulatory Chain Initialized by Team Valora"}
        )
        AuditService.log_event(
            db=db,
            action="POLICY_COMMITTED",
            entity_type="WORKFLOW",
            entity_id=wf1.id,
            user_id=admin_user.id,
            new_value={"policy": "APH 2026-27 Statutory Guidelines Committed"}
        )
        AuditService.log_event(
            db=db,
            action="OFFICER_ASSIGNED",
            entity_type="APPLICATION",
            entity_id=demo_apps[0].id,
            user_id=admin_user.id,
            new_value={"officer": officer_user.full_name}
        )

        print("[OK] DATABASE SEEDED SUCCESSFULLY WITH PRODUCTION DEMONSTRATION DATA!")
        print("="*60)
        print("[KEY] DEMO CREDENTIALS (Argon2 Hashed):")
        print("   Administrator:     admin@aicte.gov.in       | password: password123")
        print("   Regional Officer:  officer@aicte-india.org  | password: password123")
        print("   Institution:       principal@institution.ac.in | password: password123")
        print("="*60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
