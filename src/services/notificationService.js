/**
 * AICTE Sentinel - Supabase Notifications Service
 * Team Valora | Smart India Hackathon 2026
 */

import { supabase } from '../lib/supabaseClient'

export const notificationService = {
  /**
   * Fetch notifications for current user.
   */
  async getMyNotifications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    return data || []
  },

  /**
   * Mark notification as read.
   */
  async markAsRead(id) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Mark all notifications as read for current user.
   */
  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)

    if (error) throw error
  },

  /**
   * Create notification record for a specific user.
   */
  async createNotification({
    recipientId,
    title,
    message,
    notificationType = 'SYSTEM',
    priority = 'INFO',
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        title,
        message,
        notification_type: notificationType,
        priority,
        is_read: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Broadcast alert notification to all users or role targets.
   */
  async broadcastNotification({
    title,
    message,
    targetRole = 'ALL',
    priority = 'HIGH',
  }) {
    let query = supabase.from('profiles').select('id')
    if (targetRole !== 'ALL') {
      query = query.eq('role', targetRole.toLowerCase())
    }

    const { data: users, error: userError } = await query
    if (userError) throw userError

    const notifEntries = (users || []).map((u) => ({
      recipient_id: u.id,
      title,
      message,
      notification_type: 'BROADCAST',
      priority,
      is_read: false,
    }))

    if (notifEntries.length > 0) {
      const { error } = await supabase.from('notifications').insert(notifEntries)
      if (error) throw error
    }

    return { sentCount: notifEntries.length }
  },

  /**
   * Subscribe to real-time incoming notifications.
   */
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel(`public:notifications:${userId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: userId ? `recipient_id=eq.${userId}` : undefined,
        },
        (payload) => callback(payload)
      )
      .subscribe()
  },
}

export default notificationService

