/**
 * AICTE Sentinel - Supabase Application Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const applicationService = {
  /**
   * Fetch applications subject to Supabase RLS policies.
   */
  async getApplications({ status, stage, institutionId } = {}) {
    let query = supabase
      .from('applications')
      .select(`
        *,
        institutions (
          id,
          institution_name,
          aicte_permanent_id,
          state,
          district,
          institution_type
        ),
        profiles:assigned_officer_id (
          id,
          full_name,
          email,
          designation
        ),
        application_stages (*)
      `)
      .order('submitted_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (stage) query = query.eq('current_stage', stage)
    if (institutionId) query = query.eq('institution_id', institutionId)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  /**
   * Get application by ID with full details, stages, and documents.
   */
  async getApplicationById(id) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        institutions (*),
        profiles:assigned_officer_id (*),
        application_stages (*),
        documents (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Submit new statutory approval application.
   */
  async submitApplication({
    institutionId,
    applicationType = 'Extension of Approval',
    academicYear = '2026-27',
  }) {
    // Generate sequential application number
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    const nextSeq = String((count || 0) + 1).padStart(5, '0')
    const appNumber = `AICTE-2026-${nextSeq}`

    const { data, error } = await supabase
      .from('applications')
      .insert({
        application_number: appNumber,
        institution_id: institutionId,
        application_type: applicationType,
        academic_year: academicYear,
        current_stage: 'Application Ingestion & Payment',
        status: 'UNDER_REVIEW',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Create initial stage entry
    await supabase.from('application_stages').insert({
      application_id: data.id,
      stage_name: 'Application Ingestion & Payment',
      stage_status: 'COMPLETED',
      remarks: 'Application dossier submitted via Portal gateway.',
    })

    // Advance to Document Scrutiny Desk
    await supabase.from('application_stages').insert({
      application_id: data.id,
      stage_name: 'Document Scrutiny Desk',
      stage_status: 'IN_PROGRESS',
      remarks: 'Dossier routed to Regional Officer scrutiny queue.',
    })

    // Record in Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'APPLICATION_SUBMITTED',
      entity_type: 'APPLICATION',
      entity_id: data.id,
      new_value: { application_number: appNumber, type: applicationType },
    })

    return data
  },

  /**
   * Update workflow stage, transition status, and record audit log.
   */
  async updateStage({
    applicationId,
    newStage,
    newStatus = 'UNDER_REVIEW',
    remarks = '',
    officerId = null,
  }) {
    const { data, error } = await supabase
      .from('applications')
      .update({
        current_stage: newStage,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    // Record stage history
    await supabase.from('application_stages').insert({
      application_id: applicationId,
      stage_name: newStage,
      stage_status: newStatus === 'APPROVED' ? 'COMPLETED' : 'IN_PROGRESS',
      assigned_officer_id: officerId,
      remarks,
    })

    // Record in Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'STAGE_TRANSITION',
      entity_type: 'APPLICATION',
      entity_id: applicationId,
      new_value: { stage: newStage, status: newStatus, remarks },
    })

    return data
  },

  /**
   * Subscribe to real-time changes on applications table.
   */
  subscribeToApplications(callback) {
    return supabase
      .channel('public:applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => callback(payload)
      )
      .subscribe()
  },
}

export default applicationService

