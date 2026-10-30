import React, { useState } from 'react'
import {
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, FileSearch,
  Calendar, ArrowUpRight, TrendingUp, Filter, Search, ChevronRight,
  Eye, RefreshCw, BarChart3, Building2, UserCheck, Sparkles, Layers
} from 'lucide-react'
import { INITIAL_OBLIGATIONS, ASSIGNED_APPLICATIONS } from '../shared/sentinelData'

export default function OfficerDashboard({ onNavigateToApp, onNavigateToEvc, onNavigateToDeficiency }) {
  const [obligations, setObligations] = useState(INITIAL_OBLIGATIONS)
  const [filterRisk, setFilterRisk] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // KPI calculations
  const totalAssigned = ASSIGNED_APPLICATIONS.length
  const inScrutiny = ASSIGNED_APPLICATIONS.filter(a => a.status === 'in_scrutiny').length
  const evcPending = ASSIGNED_APPLICATIONS.filter(a => a.status === 'evc_scheduled').length
  const deficientCases = ASSIGNED_APPLICATIONS.filter(a => a.status === 'deficient').length
  const highRiskCases = ASSIGNED_APPLICATIONS.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length
  const overdueCount = obligations.filter(o => o.state === 'Overdue' || o.days_left < 0).length

  // Filtered obligations
  const filteredObligations = obligations.filter(o => {
    const matchesRisk = filterRisk === 'ALL' || o.risk_band === filterRisk
    const matchesSearch = o.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.application_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.obligation_id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRisk && matchesSearch
  })

  // Quick State Handler for frontend simulation
  const handleAcknowledgeObligation = (id) => {
    setObligations(prev => prev.map(o => {
      if (o.obligation_id === id) {
        return {
          ...o,
          escalation_level: 'ACKNOWLEDGED_BY_OFFICER',
          reminders_sent: o.reminders_sent + 1
        }
      }
      return o
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Regional Scrutiny Workspace &bull; Western Bureau
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AICTE Sentinel Scrutiny Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time regulatory obligation tracker, explainable SLA risk indicators, and scrutiny decision support.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-right">
              <p className="text-xs text-slate-400">Current Bureau Time</p>
              <p className="text-sm font-mono font-bold text-emerald-400">2026-10-30 10:30 IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Assigned</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{totalAssigned}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">Western Bureau</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>In Scrutiny</span>
            <FileSearch className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-2">{inScrutiny}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Active review</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>EVC Pending</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{evcPending}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">Logistics needed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Deficiencies</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{deficientCases}</p>
          <span className="text-[11px] text-orange-600 font-medium mt-1 inline-block">Awaiting response</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>High Risk Cases</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{highRiskCases}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-1 inline-block">SLA score &ge; 70</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Overdue SLA</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{overdueCount}</p>
          <span className="text-[11px] text-red-600 font-medium mt-1 inline-block">Action required</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Obligation Clock Engine */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">
                    Active Obligation Clocks
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controlled state machine tracking deadlines, evidence, reminders &amp; escalation status
                </p>
              </div>

              {/* Risk Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Risk:</span>
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(risk => (
                  <button
                    key={risk}
                    onClick={() => setFilterRisk(risk)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      filterRisk === risk
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search obligation ID, application, or institution..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Obligation Cards */}
            <div className="mt-4 space-y-3">
              {filteredObligations.map((obl) => {
                const isOverdue = obl.days_left < 0
                return (
                  <div
                    key={obl.obligation_id}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                      isOverdue
                        ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
                        : obl.risk_band === 'HIGH'
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {obl.obligation_id}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {obl.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          obl.state === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          obl.state === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                          obl.state === 'Under Verification' ? 'bg-sky-100 text-sky-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {obl.state}
                        </span>
                      </div>

                      {/* Due Countdown */}
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono flex items-center gap-1 ${
                          isOverdue
                            ? 'bg-red-600 text-white animate-pulse'
                            : obl.days_left <= 7
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          {isOverdue ? `OVERDUE (${Math.abs(obl.days_left)}d)` : `${obl.days_left}d remaining`}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          obl.risk_band === 'HIGH' ? 'bg-rose-600 text-white' :
                          obl.risk_band === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          Risk {obl.risk_score}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {obl.institution_name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Stage:</span> {obl.stage} | <span className="font-semibold text-slate-700 dark:text-slate-300">Ref:</span> {obl.application_id}
                      </p>
                    </div>

                    {/* Next Best Action & Risk Explanation */}
                    <div className="mt-3 p-2.5 bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Next-Best-Action: </span>
                          <span className="text-slate-700 dark:text-slate-300">{obl.next_best_action}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Evidence: {obl.verified_evidence_count}/{obl.evidence_count} verified &bull; Reminders: {obl.reminders_sent}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcknowledgeObligation(obl.obligation_id)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => onNavigateToApp && onNavigateToApp(obl.application_id)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1 shadow-sm"
                        >
                          Open Review
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: SLA Adherence, Risk Insights & Quick Actions */}
        <div className="space-y-6">
          {/* Explainable SLA Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              SLA Compliance Health
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Transparent rule-based scoring (Deadline 35% + Dependencies 25% + Workload 20% + Delay 20%)
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">On-Time Scrutiny Rate</span>
                  <span className="text-emerald-600 font-bold">87.5%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Bureau Capacity Utilization</span>
                  <span className="text-amber-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Deficiency Turnaround</span>
                  <span className="text-indigo-600 font-bold">4.2 Days Avg</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p>&bull; <strong>Low Risk (&lt;40):</strong> Normal statutory processing.</p>
              <p>&bull; <strong>Medium (40-69):</strong> Approaching SLA or incomplete doc.</p>
              <p>&bull; <strong>High (&ge;70):</strong> Imminent SLA breach or critical mismatch.</p>
            </div>
          </div>

          {/* Quick Regulatory Shortcuts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Officer Workflows
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateToApp && onNavigateToApp('AICTE-2024-00145')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600">
                    Document Scrutiny Desk
                  </p>
                  <p className="text-[11px] text-slate-500">OCR side-by-side verification</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onNavigateToDeficiency && onNavigateToDeficiency()}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-orange-600">
                    Deficiency &amp; Revert Hub
                  </p>
                  <p className="text-[11px] text-slate-500">Mandatory reason deficiency raising</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600" />
              </button>

              <button
                onClick={() => onNavigateToEvc && onNavigateToEvc()}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600">
                    EVC Scheduling &amp; Optimizer
                  </p>
                  <p className="text-[11px] text-slate-500">Conflict-free committee allocation</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
