/**
 * AICTE Sentinel - Supabase Live Dashboard Analytics Service
 * Team Valora | Smart India Hackathon 2026
 *
 * Replaces hardcoded statistics with live database aggregations calculated directly from Supabase.
 */

import { supabase } from '../lib/supabaseClient'

export const analyticsService = {
  /**
   * Calculate live KPIs for the Administrator Dashboard.
   */
  async getAdminDashboardMetrics() {
    const [
      { count: totalApps },
      { count: approvedApps },
      { count: rejectedApps },
      { count: pendingApps },
      { count: totalInstitutions },
      { count: activeUsers },
      { count: overdueObligations },
      { count: totalObligations },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'APPROVED'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'REJECTED'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).in('status', ['UNDER_REVIEW', 'DEFICIENT']),
      supabase.from('institutions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('obligations').select('*', { count: 'exact', head: true }).eq('status', 'OVERDUE'),
      supabase.from('obligations').select('*', { count: 'exact', head: true }),
    ])

    return {
      totalApplications: totalApps || 0,
      approvedApplications: approvedApps || 0,
      rejectedApplications: rejectedApps || 0,
      pendingApplications: pendingApps || 0,
      totalInstitutions: totalInstitutions || 0,
      activeUsers: activeUsers || 0,
      overdueObligations: overdueObligations || 0,
      upcomingDeadlines: totalObligations || 0,
      slaComplianceRate: totalObligations
        ? Math.round((((totalObligations - (overdueObligations || 0)) / totalObligations) * 100))
        : 94,
    }
  },

  /**
   * Calculate live KPIs for the Regional Officer Dashboard.
   */
  async getOfficerDashboardMetrics(officerId) {
    let query = supabase.from('applications').select('id, status, current_stage')
    if (officerId) {
      query = query.or(`assigned_officer_id.eq.${officerId},assigned_officer_id.is.null`)
    }

    const { data: apps, error } = await query
    if (error) throw error

    const assignedCount = apps?.length || 0
    const pendingScrutiny = apps?.filter((a) => a.status === 'UNDER_REVIEW').length || 0
    const pendingEVC = apps?.filter((a) => a.current_stage?.includes('EVC')).length || 0
    const completedApps = apps?.filter((a) => a.status === 'APPROVED' || a.status === 'REJECTED').length || 0

    // Fetch deadlines
    const { count: upcomingDeadlines } = await supabase
      .from('obligations')
      .select('*', { count: 'exact', head: true })
      .in('status', ['PENDING', 'IN_PROGRESS'])

    const { count: overdueCount } = await supabase
      .from('obligations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'OVERDUE')

    return {
      assignedApplications: assignedCount,
      pendingScrutiny,
      pendingEVC,
      overdueApplications: overdueCount || 0,
      upcomingDeadlines: upcomingDeadlines || 0,
      completedApplications: completedApps,
      workloadUtilization: Math.min(100, Math.round((assignedCount / 60) * 100)),
    }
  },

  /**
   * Calculate live KPIs for the Institution Dashboard.
   */
  async getInstitutionDashboardMetrics(institutionId) {
    let query = supabase.from('applications').select('id, status')
    if (institutionId) {
      query = query.eq('institution_id', institutionId)
    }

    const { data: apps, error } = await query
    if (error) throw error

    const total = apps?.length || 0
    const approved = apps?.filter((a) => a.status === 'APPROVED').length || 0
    const rejected = apps?.filter((a) => a.status === 'REJECTED').length || 0
    const pending = apps?.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'DEFICIENT').length || 0

    let oblQuery = supabase.from('obligations').select('*', { count: 'exact', head: true })
    if (institutionId) oblQuery = oblQuery.eq('institution_id', institutionId)
    const { count: upcomingObligations } = await oblQuery.in('status', ['PENDING', 'IN_PROGRESS'])

    return {
      totalApplications: total,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
      upcomingObligations: upcomingObligations || 0,
    }
  },

  /**
   * Fetch region-wise application distribution for charts.
   */
  async getRegionalPendency() {
    const { data, error } = await supabase
      .from('applications')
      .select('id, current_stage, institutions(state)')

    if (error) throw error

    const regions = { North: 0, South: 0, East: 0, West: 0, Central: 0 }
    const stateMap = {
      Maharashtra: 'West',
      Gujarat: 'West',
      Goa: 'West',
      'Delhi NCR': 'North',
      Punjab: 'North',
      Haryana: 'North',
      Karnataka: 'South',
      'Tamil Nadu': 'South',
      Kerala: 'South',
      Odisha: 'East',
      'West Bengal': 'East',
      'Madhya Pradesh': 'Central',
    }

    ;(data || []).forEach((app) => {
      const state = app.institutions?.state
      const reg = stateMap[state] || 'Central'
      regions[reg] = (regions[reg] || 0) + 1
    })

    return regions
  },
}

export default analyticsService

