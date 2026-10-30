/**
 * AICTE Sentinel - Supabase Institution Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const institutionService = {
  /**
   * Fetch institutions with real-time compliance status.
   */
  async getInstitutions() {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('institution_name', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * Get institution profile by ID.
   */
  async getInstitutionById(id) {
    const { data, error } = await supabase
      .from('institutions')
      .select('*, applications(*), obligations(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Update institution details.
   */
  async updateInstitution(id, updateData) {
    const { data, error } = await supabase
      .from('institutions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Administrator verification of technical institution.
   */
  async setVerificationStatus(id, status = 'VERIFIED') {
    const { data, error } = await supabase
      .from('institutions')
      .update({ verification_status: status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log audit event
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'INSTITUTION_VERIFIED',
      entity_type: 'INSTITUTION',
      entity_id: id,
      new_value: { verification_status: status },
    })

    return data
  },
}

export default institutionService

