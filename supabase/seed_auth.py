import psycopg2
import httpx

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

# Clear out any previous incomplete demo users
cur.execute("""
    DELETE FROM auth.identities WHERE email IN ('admin@aicte.gov.in', 'officer@aicte-india.org', 'principal@institution.ac.in');
    DELETE FROM auth.users WHERE email IN ('admin@aicte.gov.in', 'officer@aicte-india.org', 'principal@institution.ac.in');
""")

# Use bcrypt hash for password123
working_hash = "$2a$10$ocM1AliSkxRlDi177.tRqOCQ2eZxdzRxeGRvmHgSpn9u8//ZmTI6O"

users = [
    ("11111111-1111-4111-8111-111111111111", "admin@aicte.gov.in", "Shri Amitabh Sharma", "administrator", "+91 11 2958 1000", "National Regulatory Administrator", None),
    ("22222222-2222-4222-8222-222222222222", "officer@aicte-india.org", "Dr. Rajesh Kumar", "regional_officer", "+91 22 2285 5412", "Senior Regional Scrutiny Officer", None),
    ("33333333-3333-4333-8333-333333333333", "principal@institution.ac.in", "Dr. Ramesh S. Patil", "institution", "+91 20 2567 8901", "Principal & Professor", "4a1a6b0c-9821-4f1b-a5d2-03912a781011")
]

for uid, email, name, role, phone, designation, inst_id in users:
    cur.execute("""
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, confirmation_token, confirmation_sent_at,
            recovery_token, email_change_token_new, email_change,
            raw_app_meta_data, raw_user_meta_data,
            is_super_admin, created_at, updated_at,
            phone_change, phone_change_token,
            email_change_token_current, email_change_confirm_status,
            reauthentication_token, is_sso_user, is_anonymous
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', %s, 'authenticated', 'authenticated', %s, %s,
            NOW(), encode(gen_random_bytes(32), 'hex'), NOW(),
            '', '', '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('sub', %s, 'email', %s, 'full_name', %s, 'role', %s, 'phone', %s, 'designation', %s),
            FALSE, NOW(), NOW(),
            '', '',
            '', 0,
            '', FALSE, FALSE
        );
    """, (uid, email, working_hash, uid, email, name, role, phone, designation))

    cur.execute("""
        INSERT INTO auth.identities (
            id, provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), %s, %s,
            jsonb_build_object('sub', %s, 'email', %s),
            'email', NOW(), NOW(), NOW()
        );
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

print("[OK] Auth users seeded!")
conn.close()

# Test login for each of the 3 users
print("[*] Testing Supabase Auth login for all 3 roles...")
for _, email, _, _, _, _, _ in users:
    res = httpx.post(
        "https://dsycvemejarzneqxitui.supabase.co/auth/v1/token?grant_type=password",
        json={"email": email, "password": "password123"},
        headers={"apikey": "sb_publishable_rSivIYYdV0J2VzCUqYRDug_5_trgkgk", "Content-Type": "application/json"},
        timeout=15.0
    )
    print(f"Login {email}: Status {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print(f"   User: {data['user']['email']} | Role: {data['user']['user_metadata'].get('role')} | Token: {data['access_token'][:20]}...")
    else:
        print(f"   Error: {res.text}")
