/**
 * AICTE Sentinel - Supabase Authentication Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const authService = {
  /**
   * Authenticate user with Supabase Auth and fetch database profile.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) throw error

    // Fetch authorized role & metadata from public.profiles table (never trust client)
    const profile = await this.getUserProfile(data.user.id)
    return {
      user: data.user,
      session: data.session,
      profile,
    }
  },

  /**
   * Register new institution / applicant account.
   * Public registration is strictly restricted to institution role.
   */
  async signUp({
    email,
    password,
    fullName,
    phone,
    institutionName,
    permanentId,
    designation = 'Principal / Registrar',
    state = 'Maharashtra',
    district = 'Pune',
    address = '',
  }) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'institution', // Enforced server-side
          phone,
          institution_name: institutionName,
          aicte_permanent_id: permanentId,
          designation,
          state,
          district,
          address,
        },
      },
    })

    if (error) throw error
    return data
  },

  /**
   * Sign out current session and clear local storage tokens.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Retrieve active session.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  /**
   * Get authenticated user.
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const profile = await this.getUserProfile(user.id)
    return {
      ...user,
      profile,
    }
  },

  /**
   * Fetch profile from the public.profiles table with institution join.
   */
  async getUserProfile(userId) {
    if (!userId) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*, institutions(institution_name, aicte_permanent_id, state, district)')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.warn('[authService] Could not fetch profile:', error.message)
      return null
    }

    return data
  },

  /**
   * Request password reset email.
   */
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return data
  },

  /**
   * Update password for authenticated user.
   */
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  },

  /**
   * Listen to auth state transitions.
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

export default authService

