/**
 * AICTE Sentinel - Supabase Obligations & SLA Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const obligationService = {
  /**
   * Fetch obligations with institution and application joins.
   */
  async getObligations({ institutionId, status, priority } = {}) {
    let query = supabase
      .from('obligations')
      .select(`
        *,
        institutions (
          id,
          institution_name,
          aicte_permanent_id
        ),
        applications (
          id,
          application_number,
          current_stage
        )
      `)
      .order('due_date', { ascending: true })

    if (institutionId) query = query.eq('institution_id', institutionId)
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  /**
   * Create regulatory obligation or deadline.
   */
  async createObligation({
    institutionId,
    applicationId = null,
    obligationType,
    description,
    dueDate,
    priority = 'MEDIUM',
    assignedUserId = null,
  }) {
    const { data, error } = await supabase
      .from('obligations')
      .insert({
        institution_id: institutionId,
        application_id: applicationId,
        obligation_type: obligationType,
        description,
        due_date: dueDate,
        priority,
        status: new Date(dueDate) < new Date() ? 'OVERDUE' : 'PENDING',
        assigned_user_id: assignedUserId,
      })
      .select()
      .single()

    if (error) throw error

    // Log audit event
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'OBLIGATION_CREATED',
      entity_type: 'OBLIGATION',
      entity_id: data.id,
      new_value: { obligation_type: obligationType, due_date: dueDate },
    })

    return data
  },

  /**
   * Complete or resolve an obligation.
   */
  async completeObligation(id) {
    const { data, error } = await supabase
      .from('obligations')
      .update({
        status: 'COMPLETED',
        completion_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get statutory workflow SLA rules ladder.
   */
  async getWorkflowRules() {
    const { data, error } = await supabase
      .from('workflow_rules')
      .select('*')
      .order('sequence_number', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * Update SLA duration for a workflow stage.
   */
  async updateSLAStage(id, slaDuration) {
    const { data, error } = await supabase
      .from('workflow_rules')
      .update({ sla_duration: slaDuration })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log audit event
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'SLA_DURATION_UPDATED',
      entity_type: 'WORKFLOW_RULE',
      entity_id: id,
      new_value: { sla_duration: slaDuration },
    })

    return data
  },

  /**
   * Get configured escalation rules.
   */
  async getEscalationRules() {
    const { data, error } = await supabase
      .from('escalation_rules')
      .select('*')
      .order('escalation_level', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * Subscribe to real-time changes on obligations table.
   */
  subscribeToObligations(callback) {
    return supabase
      .channel('public:obligations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'obligations' },
        (payload) => callback(payload)
      )
      .subscribe()
  },
}

export default obligationService

