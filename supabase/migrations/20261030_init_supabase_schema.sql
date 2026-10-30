-- ========================================================
-- AICTE Sentinel - Supabase PostgreSQL Database Schema
-- Smart India Hackathon 2026 | Team Valora
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────
-- 1. INSTITUTIONS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name TEXT NOT NULL,
    aicte_permanent_id TEXT UNIQUE NOT NULL,
    institution_type TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    official_email TEXT NOT NULL,
    contact_number TEXT,
    verification_status TEXT DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────
-- 2. PROFILES TABLE (Extends auth.users)
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('institution', 'regional_officer', 'bureau_officer', 'administrator')),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    designation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for role & institution lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON public.profiles(institution_id);

-- ────────────────────────────────────────────────────────
-- 3. APPLICATIONS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    application_type TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2026-27',
    current_stage TEXT NOT NULL DEFAULT 'Document Scrutiny Desk',
    status TEXT NOT NULL DEFAULT 'UNDER_REVIEW' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'DEFICIENT', 'APPROVED', 'REJECTED')),
    assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_institution_id ON public.applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_applications_assigned_officer ON public.applications(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- ────────────────────────────────────────────────────────
-- 4. APPLICATION_STAGES TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.application_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    stage_status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (stage_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    remarks TEXT
);

CREATE INDEX IF NOT EXISTS idx_app_stages_application_id ON public.application_stages(application_id);

-- ────────────────────────────────────────────────────────
-- 5. DOCUMENTS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'DEFICIENT', 'REJECTED')),
    expiry_date DATE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_app_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_inst_id ON public.documents(institution_id);

-- ────────────────────────────────────────────────────────
-- 6. OBLIGATIONS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    obligation_type TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    completion_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assigned_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_obligations_inst_id ON public.obligations(institution_id);
CREATE INDEX IF NOT EXISTS idx_obligations_status ON public.obligations(status);
CREATE INDEX IF NOT EXISTS idx_obligations_due_date ON public.obligations(due_date);

-- ────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'SYSTEM',
    priority TEXT DEFAULT 'INFO' CHECK (priority IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);

-- ────────────────────────────────────────────────────────
-- 8. WORKFLOW_RULES TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workflow_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    stage_name TEXT NOT NULL,
    sequence_number INTEGER NOT NULL,
    sla_duration INTEGER NOT NULL DEFAULT 15,
    approval_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- ────────────────────────────────────────────────────────
-- 9. AUDIT_LOGS TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    previous_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ────────────────────────────────────────────────────────
-- 10. ESCALATION_RULES TABLE
-- ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.escalation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obligation_type TEXT NOT NULL,
    reminder_days INTEGER NOT NULL,
    escalation_level INTEGER NOT NULL,
    target_role TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- ────────────────────────────────────────────────────────
-- 11. STORAGE BUCKET CONFIGURATION
-- ────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'aicte-documents',
    'aicte-documents',
    false,
    26214400, -- 25 MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

-- ────────────────────────────────────────────────────────
-- 12. SECURITY HELPER FUNCTIONS
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_institution_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT institution_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ────────────────────────────────────────────────────────
-- 13. AUTO-PROFILE CREATION ON AUTH SIGNUP (TRIGGER)
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    inst_id UUID;
    inst_name TEXT;
    inst_aicte_id TEXT;
BEGIN
    -- Public signups can only ever be 'institution'
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'institution');
    IF user_role NOT IN ('institution', 'regional_officer', 'bureau_officer', 'administrator') THEN
        user_role := 'institution';
    END IF;

    -- If this is an institution registering, create or link institution
    IF user_role = 'institution' AND NEW.raw_user_meta_data->>'institution_name' IS NOT NULL THEN
        inst_name := NEW.raw_user_meta_data->>'institution_name';
        inst_aicte_id := COALESCE(NEW.raw_user_meta_data->>'aicte_permanent_id', 'AICTE-' || SUBSTRING(gen_random_uuid()::text, 1, 8));

        INSERT INTO public.institutions (
            institution_name,
            aicte_permanent_id,
            institution_type,
            state,
            district,
            address,
            official_email,
            contact_number
        ) VALUES (
            inst_name,
            inst_aicte_id,
            COALESCE(NEW.raw_user_meta_data->>'institution_type', 'Technical Institute'),
            COALESCE(NEW.raw_user_meta_data->>'state', 'Maharashtra'),
            COALESCE(NEW.raw_user_meta_data->>'district', 'Pune'),
            NEW.raw_user_meta_data->>'address',
            NEW.email,
            NEW.raw_user_meta_data->>'phone'
        )
        ON CONFLICT (aicte_permanent_id) DO UPDATE SET official_email = EXCLUDED.official_email
        RETURNING id INTO inst_id;
    END IF;

    -- Insert profile
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        role,
        institution_id,
        designation,
        is_active
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        user_role,
        inst_id,
        NEW.raw_user_meta_data->>'designation',
        TRUE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────
-- 14. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_rules ENABLE ROW LEVEL SECURITY;

-- ── Profiles RLS ──
DROP POLICY IF EXISTS "Users can read profiles" ON public.profiles;
CREATE POLICY "Users can read profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid() OR
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.current_user_role() = 'administrator');

-- ── Institutions RLS ──
DROP POLICY IF EXISTS "Read institutions" ON public.institutions;
CREATE POLICY "Read institutions" ON public.institutions
    FOR SELECT TO authenticated
    USING (
        id = public.current_user_institution_id() OR
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

DROP POLICY IF EXISTS "Admin modify institutions" ON public.institutions;
CREATE POLICY "Admin modify institutions" ON public.institutions
    FOR ALL TO authenticated
    USING (public.current_user_role() = 'administrator');

-- ── Applications RLS ──
DROP POLICY IF EXISTS "Read applications" ON public.applications;
CREATE POLICY "Read applications" ON public.applications
    FOR SELECT TO authenticated
    USING (
        institution_id = public.current_user_institution_id() OR
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

DROP POLICY IF EXISTS "Institution submit applications" ON public.applications;
CREATE POLICY "Institution submit applications" ON public.applications
    FOR INSERT TO authenticated
    WITH CHECK (
        institution_id = public.current_user_institution_id() OR
        public.current_user_role() = 'administrator'
    );

DROP POLICY IF EXISTS "Officers and Admins update applications" ON public.applications;
CREATE POLICY "Officers and Admins update applications" ON public.applications
    FOR UPDATE TO authenticated
    USING (
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

-- ── Application Stages RLS ──
DROP POLICY IF EXISTS "Read application stages" ON public.application_stages;
CREATE POLICY "Read application stages" ON public.application_stages
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_id AND (
                a.institution_id = public.current_user_institution_id() OR
                public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
            )
        )
    );

DROP POLICY IF EXISTS "Modify application stages" ON public.application_stages;
CREATE POLICY "Modify application stages" ON public.application_stages
    FOR ALL TO authenticated
    USING (
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

-- ── Documents RLS ──
DROP POLICY IF EXISTS "Read documents" ON public.documents;
CREATE POLICY "Read documents" ON public.documents
    FOR SELECT TO authenticated
    USING (
        institution_id = public.current_user_institution_id() OR
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

DROP POLICY IF EXISTS "Upload documents" ON public.documents;
CREATE POLICY "Upload documents" ON public.documents
    FOR INSERT TO authenticated
    WITH CHECK (
        institution_id = public.current_user_institution_id() OR
        public.current_user_role() IN ('administrator', 'regional_officer')
    );

DROP POLICY IF EXISTS "Verify documents" ON public.documents;
CREATE POLICY "Verify documents" ON public.documents
    FOR UPDATE TO authenticated
    USING (
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

-- ── Obligations RLS ──
DROP POLICY IF EXISTS "Read obligations" ON public.obligations;
CREATE POLICY "Read obligations" ON public.obligations
    FOR SELECT TO authenticated
    USING (
        institution_id = public.current_user_institution_id() OR
        public.current_user_role() IN ('administrator', 'regional_officer', 'bureau_officer')
    );

DROP POLICY IF EXISTS "Admin manage obligations" ON public.obligations;
CREATE POLICY "Admin manage obligations" ON public.obligations
    FOR ALL TO authenticated
    USING (public.current_user_role() IN ('administrator', 'regional_officer'));

-- ── Notifications RLS ──
DROP POLICY IF EXISTS "Read own notifications" ON public.notifications;
CREATE POLICY "Read own notifications" ON public.notifications
    FOR SELECT TO authenticated
    USING (recipient_id = auth.uid() OR public.current_user_role() = 'administrator');

DROP POLICY IF EXISTS "Update own notifications" ON public.notifications;
CREATE POLICY "Update own notifications" ON public.notifications
    FOR UPDATE TO authenticated
    USING (recipient_id = auth.uid());

-- ── Workflow & Escalation Rules RLS ──
DROP POLICY IF EXISTS "Read workflow rules" ON public.workflow_rules;
CREATE POLICY "Read workflow rules" ON public.workflow_rules
    FOR SELECT TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "Admin manage workflow rules" ON public.workflow_rules;
CREATE POLICY "Admin manage workflow rules" ON public.workflow_rules
    FOR ALL TO authenticated
    USING (public.current_user_role() = 'administrator');

DROP POLICY IF EXISTS "Read escalation rules" ON public.escalation_rules;
CREATE POLICY "Read escalation rules" ON public.escalation_rules
    FOR SELECT TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "Admin manage escalation rules" ON public.escalation_rules;
CREATE POLICY "Admin manage escalation rules" ON public.escalation_rules
    FOR ALL TO authenticated
    USING (public.current_user_role() = 'administrator');

-- ── Audit Logs RLS ──
DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.current_user_role() = 'administrator');

DROP POLICY IF EXISTS "Insert audit logs" ON public.audit_logs;
CREATE POLICY "Insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────
-- 15. ENABLE REALTIME REPLICATION
-- ────────────────────────────────────────────────────────
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.obligations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.application_stages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

