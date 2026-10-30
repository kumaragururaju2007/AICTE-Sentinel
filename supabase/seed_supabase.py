import psycopg2
import httpx
from datetime import datetime, timezone, timedelta

SUPABASE_URL = "https://dsycvemejarzneqxitui.supabase.co"
ANON_KEY = "sb_publishable_rSivIYYdV0J2VzCUqYRDug_5_trgkgk"

# 1. Connect via direct PostgreSQL pooler to seed base institutions, users, and apps
conn = psycopg2.connect(
    host="aws-0-eu-west-2.pooler.supabase.com",
    port=5432,
    user="postgres.dsycvemejarzneqxitui",
    password="Guru@2007200",
    dbname="postgres",
    connect_timeout=15
)
conn.autocommit = True
cur = conn.cursor()

print("[*] 1. Seeding institutions...")
institutions = [
    (
        "4a1a6b0c-9821-4f1b-a5d2-03912a781011",
        "Apex Institute of Technology & Management",
        "1-43219081",
        "Autonomous College",
        "Maharashtra",
        "Pune",
        "Sector 28, Pradhikaran, Akurdi, Pune - 411044",
        "principal@institution.ac.in",
        "+91 20 2567 8901",
        "VERIFIED"
    ),
    (
        "5b2b7c1d-1932-4e2c-b6e3-14023b892122",
        "Delhi Institute of Engineering & Advanced Sciences",
        "1-89765412",
        "Affiliated College",
        "Delhi NCR",
        "New Delhi",
        "Institutional Area, Sector 5, Dwarka, New Delhi - 110078",
        "director@dieas.ac.in",
        "+91 11 2808 3400",
        "VERIFIED"
    ),
    (
        "6c3c8d2e-2043-4d3d-c7f4-25134c903233",
        "Kalinga Institute of Polytechnic & Technology",
        "1-99882314",
        "Polytechnic",
        "Odisha",
        "Bhubaneswar",
        "Chandrasekharpur, Bhubaneswar - 751024",
        "principal@kalingapoly.edu.in",
        "+91 674 274 1998",
        "VERIFIED"
    ),
    (
        "7d4d9e3f-3154-4c4e-d8a5-36245da14344",
        "St. Xavier Institute of Management Studies",
        "1-33445511",
        "Stand-alone Institution",
        "Goa",
        "North Goa",
        "Campal, Panaji, Goa - 403001",
        "director@stxaviers-mgmt.ac.in",
        "+91 832 242 0910",
        "VERIFIED"
    ),
    (
        "8e5e0f4a-4265-4b5f-e9b6-47356eb25455",
        "Sunrise Engineering College",
        "1-11223344",
        "Affiliated College",
        "Karnataka",
        "Bengaluru",
        "Whitefield Main Road, Bengaluru - 560066",
        "principal@sunrise.edu.in",
        "+91 80 2845 0012",
        "VERIFIED"
    )
]

for inst in institutions:
    cur.execute("""
        INSERT INTO public.institutions (
            id, institution_name, aicte_permanent_id, institution_type,
            state, district, address, official_email, contact_number, verification_status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (aicte_permanent_id) DO UPDATE SET
            institution_name = EXCLUDED.institution_name,
            verification_status = EXCLUDED.verification_status;
    """, inst)

print("[*] 2. Seeding auth.users & identities directly with bcrypt...")
users_to_seed = [
    (
        "11111111-1111-4111-8111-111111111111",
        "admin@aicte.gov.in",
        "Shri Amitabh Sharma",
        "administrator",
        "+91 11 2958 1000",
        "National Regulatory Administrator",
        None
    ),
    (
        "22222222-2222-4222-8222-222222222222",
        "officer@aicte-india.org",
        "Dr. Rajesh Kumar",
        "regional_officer",
        "+91 22 2285 5412",
        "Senior Regional Scrutiny Officer",
        None
    ),
    (
        "33333333-3333-4333-8333-333333333333",
        "principal@institution.ac.in",
        "Dr. Ramesh S. Patil",
        "institution",
        "+91 20 2567 8901",
        "Principal & Professor",
        "4a1a6b0c-9821-4f1b-a5d2-03912a781011"
    )
]

for uid, email, name, role, phone, designation, inst_id in users_to_seed:
    cur.execute("""
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
            created_at, updated_at
        ) VALUES (
            %s, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', %s,
            crypt('password123', gen_salt('bf', 10)),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('full_name', %s, 'role', %s, 'phone', %s, 'designation', %s),
            NOW(), NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            encrypted_password = crypt('password123', gen_salt('bf', 10)),
            email_confirmed_at = NOW(),
            raw_user_meta_data = jsonb_build_object('full_name', %s, 'role', %s, 'phone', %s, 'designation', %s);
    """, (uid, email, name, role, phone, designation, name, role, phone, designation))

    cur.execute("""
        INSERT INTO auth.identities (
            id, provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), %s, %s,
            jsonb_build_object('sub', %s, 'email', %s),
            'email', NOW(), NOW(), NOW()
        ) ON CONFLICT (provider, provider_id) DO UPDATE SET
            updated_at = NOW();
    """, (uid, uid, uid, email))

    cur.execute("""
        INSERT INTO public.profiles (
            id, full_name, email, phone, role, designation, institution_id, is_active
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE)
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            designation = EXCLUDED.designation,
            institution_id = EXCLUDED.institution_id;
    """, (uid, name, email, phone, role, designation, inst_id))

print("[*] 3. Seeding Workflow Rules...")
wf_rules = [
    ("Standard Technical Approval", "Application Ingestion & Payment", 1, 3, False),
    ("Standard Technical Approval", "Document Scrutiny Desk", 2, 10, True),
    ("Standard Technical Approval", "Deficiency Clarification Window", 3, 8, True),
    ("Standard Technical Approval", "Expert Visit Committee (EVC)", 4, 15, True),
    ("Standard Technical Approval", "Standing Hearing Committee (SAC/SHC)", 5, 8, True),
    ("Standard Technical Approval", "Final Approval / EoA Issuance", 6, 4, True)
]
for wf in wf_rules:
    cur.execute("""
        INSERT INTO public.workflow_rules (
            workflow_name, stage_name, sequence_number, sla_duration, approval_required
        ) VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, wf)

print("[*] 4. Seeding Escalation Rules...")
esc_rules = [
    ("DOCUMENT_VERIFICATION", 30, 1, "institution"),
    ("DOCUMENT_VERIFICATION", 7, 2, "regional_officer"),
    ("EVC_COMPLIANCE", 7, 2, "regional_officer"),
    ("DEFICIENCY_RESPONSE", 3, 3, "bureau_officer"),
    ("STATUTORY_BREACH", 0, 4, "administrator")
]
for esc in esc_rules:
    cur.execute("""
        INSERT INTO public.escalation_rules (
            obligation_type, reminder_days, escalation_level, target_role
        ) VALUES (%s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, esc)

admin_id = "11111111-1111-4111-8111-111111111111"
officer_id = "22222222-2222-4222-8222-222222222222"
inst_user_id = "33333333-3333-4333-8333-333333333333"

print("[*] 5. Seeding Applications...")
now = datetime.now(timezone.utc)
demo_apps = [
    (
        "e1a12345-0001-4000-8000-000000000001",
        "AICTE-2026-00123",
        "4a1a6b0c-9821-4f1b-a5d2-03912a781011",
        "Extension of Approval",
        "2026-27",
        "Document Scrutiny Desk",
        "UNDER_REVIEW",
        officer_id,
        now - timedelta(days=5),
        now
    ),
    (
        "e1a12345-0002-4000-8000-000000000002",
        "AICTE-2026-00145",
        "5b2b7c1d-1932-4e2c-b6e3-14023b892122",
        "Extension of Approval",
        "2026-27",
        "Expert Visit Committee (EVC)",
        "UNDER_REVIEW",
        officer_id,
        now - timedelta(days=12),
        now
    ),
    (
        "e1a12345-0003-4000-8000-000000000003",
        "AICTE-2026-00167",
        "6c3c8d2e-2043-4d3d-c7f4-25134c903233",
        "Course Expansion",
        "2026-27",
        "Deficiency Clarification Window",
        "DEFICIENT",
        officer_id,
        now - timedelta(days=18),
        now
    ),
    (
        "e1a12345-0004-4000-8000-000000000004",
        "AICTE-2026-00189",
        "7d4d9e3f-3154-4c4e-d8a5-36245da14344",
        "Extension of Approval",
        "2026-27",
        "Standing Hearing Committee (SAC/SHC)",
        "UNDER_REVIEW",
        officer_id,
        now - timedelta(days=22),
        now
    ),
    (
        "e1a12345-0005-4000-8000-000000000005",
        "AICTE-2026-00190",
        "8e5e0f4a-4265-4b5f-e9b6-47356eb25455",
        "Extension of Approval",
        "2026-27",
        "Final Approval / EoA Issuance",
        "APPROVED",
        officer_id,
        now - timedelta(days=28),
        now
    )
]

for app in demo_apps:
    cur.execute("""
        INSERT INTO public.applications (
            id, application_number, institution_id, application_type,
            academic_year, current_stage, status, assigned_officer_id,
            submitted_at, updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (application_number) DO UPDATE SET
            current_stage = EXCLUDED.current_stage,
            status = EXCLUDED.status,
            assigned_officer_id = EXCLUDED.assigned_officer_id;
    """, app)

# Seed Application Stages
for app in demo_apps:
    cur.execute("""
        INSERT INTO public.application_stages (
            application_id, stage_name, stage_status, assigned_officer_id, started_at, remarks
        ) VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, (app[0], app[5], "IN_PROGRESS" if app[6] != "APPROVED" else "COMPLETED", app[7], app[8], "Statutory stage progression under AICTE norms."))

print("[*] 6. Seeding Obligations...")
demo_obligations = [
    ("4a1a6b0c-9821-4f1b-a5d2-03912a781011", demo_apps[0][0], "DOCUMENT_VERIFICATION", "Submission of Municipal Fire Safety Clearance Renewal", now + timedelta(days=1), "HIGH", officer_id),
    ("5b2b7c1d-1932-4e2c-b6e3-14023b892122", demo_apps[1][0], "EVC_COMPLIANCE", "Expert Visit Committee On-Site Readiness Verification", now + timedelta(days=3), "CRITICAL", officer_id),
    ("6c3c8d2e-2043-4d3d-c7f4-25134c903233", demo_apps[2][0], "DEFICIENCY_RESPONSE", "Deficiency Clarification: 30-Year Registered Lease Deed Verification", now + timedelta(days=5), "HIGH", officer_id),
    ("7d4d9e3f-3154-4c4e-d8a5-36245da14344", demo_apps[3][0], "AFFIDAVIT_SUBMISSION", "Anti-Ragging Committee Affidavit & Grievance Redressal Portal Setup", now + timedelta(days=8), "MEDIUM", officer_id),
    ("8e5e0f4a-4265-4b5f-e9b6-47356eb25455", demo_apps[4][0], "CADRE_RATIO_AFFIDAVIT", "Faculty Cadre Ratio Verification & NBA Compliance Proof", now - timedelta(days=2), "CRITICAL", officer_id)
]

for obl in demo_obligations:
    cur.execute("""
        INSERT INTO public.obligations (
            institution_id, application_id, obligation_type, description,
            due_date, status, priority, assigned_user_id
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, (obl[0], obl[1], obl[2], obl[3], obl[4], "OVERDUE" if obl[4] < now else "PENDING", obl[5], obl[6]))

print("[*] 7. Seeding Notifications...")
demo_notifs = [
    (admin_id, "New application submitted", "SVS College of Engineering submitted EoA application for AY 2026-27.", "APPLICATION", "INFO"),
    (admin_id, "EVC deadline approaching", "ABC Engineering College inspection report submission window closing in 48 hours.", "EVC", "CRITICAL"),
    (admin_id, "Document verification pending", "GreenTech Polytechnic uploaded revised 30-year lease deed.", "DOCUMENT", "HIGH"),
    (officer_id, "New Application Assigned", "AICTE-2026-00123 assigned to your scrutiny desk.", "APPLICATION", "HIGH"),
    (officer_id, "SLA Breach Warning (T-1)", "Vidya Institute of Technology EVC window closing in 24 hours.", "SLA", "CRITICAL"),
    (inst_user_id, "Scrutiny Status Update", "Your application AICTE-2026-00123 has been accepted for Document Scrutiny.", "APPLICATION", "INFO")
]
for n in demo_notifs:
    cur.execute("""
        INSERT INTO public.notifications (
            recipient_id, title, message, notification_type, priority, is_read
        ) VALUES (%s, %s, %s, %s, %s, FALSE)
        ON CONFLICT DO NOTHING;
    """, n)

print("[*] 8. Seeding Audit Logs...")
cur.execute("""
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, new_value)
    VALUES (%s, 'GENESIS_CHAIN_INITIALIZED', 'SYSTEM', gen_random_uuid(), '{"system": "AICTE Sentinel Supabase Integration by Team Valora"}'::jsonb);
""", (admin_id,))

conn.close()
print("[OK] Supabase Database fully seeded and ready for production!")
