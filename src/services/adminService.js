/**
 * AICTE Sentinel - Supabase Administrator Governance Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const adminService = {
  /**
   * Fetch all registered users with their profiles and institutions.
   */
  async getUsers({ role, isActive } = {}) {
    let query = supabase
      .from('profiles')
      .select('*, institutions(id, institution_name, aicte_permanent_id)')
      .order('created_at', { ascending: false })

    if (role) query = query.eq('role', role)
    if (isActive !== undefined) query = query.eq('is_active', isActive)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  /**
   * Update user profile metadata.
   */
  async updateUser(id, updateData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Activate or deactivate a user account.
   */
  async setUserActive(id, isActive) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log administrative action
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entity_type: 'USER',
      entity_id: id,
      new_value: { is_active: isActive },
    })

    return data
  },

  /**
   * Assign or modify user role through administrator operation.
   */
  async assignRole(id, role) {
    const validRoles = ['institution', 'regional_officer', 'bureau_officer', 'administrator']
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}`)
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log privileged role assignment
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'ROLE_ASSIGNED',
      entity_type: 'USER',
      entity_id: id,
      new_value: { role },
    })

    return data
  },

  /**
   * Fetch cryptographic audit trail.
   */
  async getAuditLogs({ limit = 50, action = null, entityType = null } = {}) {
    let query = supabase
      .from('audit_logs')
      .select('*, profiles(full_name, email, role)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (action) query = query.eq('action', action)
    if (entityType) query = query.eq('entity_type', entityType)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  /**
   * Record an administrative or operational audit event.
   */
  async logAuditEvent(action, entityType, entityId = null, previousValue = null, newValue = null) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      previous_value: previousValue,
      new_value: newValue,
    })

    if (error) console.warn('[adminService] Audit log write failed:', error.message)
    return data
  },
}

export default adminService

