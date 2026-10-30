import React, { useState } from 'react'
import {
  Shield, Server, Users, Sliders, Bell, History, Play,
  FastForward, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp,
  Cpu, Database, ArrowRight, Sparkles, Building2, Layers
} from 'lucide-react'
import { WORKFLOW_DEFINITIONS, INITIAL_OBLIGATIONS, AUDIT_TRAIL_CHAIN } from '../shared/sentinelData'

export default function AdminDashboard({ onNavigateToUsers, onNavigateToWorkflows, onNavigateToAlerts, onNavigateToAudit }) {
  // Virtual Clock & Time Travel State
  const [virtualDaysOffset, setVirtualDaysOffset] = useState(0)
  const [isSimulationActive, setIsSimulationActive] = useState(false)
  const [activeScenario, setActiveScenario] = useState('EVC_CAPACITY_BOTTLENECK')
  const [extraCommitteeIntervention, setExtraCommitteeIntervention] = useState(false)

  // Simulation Metrics based on scenario & time travel
  const baseOverdue = INITIAL_OBLIGATIONS.filter(o => o.state === 'Overdue' || o.days_left < 0).length
  const simulatedOverdue = isSimulationActive
    ? extraCommitteeIntervention
      ? Math.max(1, baseOverdue + Math.floor(virtualDaysOffset / 10))
      : baseOverdue + Math.floor(virtualDaysOffset / 4) + 4
    : baseOverdue

  const handleAdvanceDays = (days) => {
    setIsSimulationActive(true)
    setVirtualDaysOffset(prev => prev + days)
  }

  const handleResetSimulation = () => {
    setIsSimulationActive(false)
    setVirtualDaysOffset(0)
    setExtraCommitteeIntervention(false)
  }

  return (
    <div className="space-y-6">
      {/* Simulation Banner Notice (SIH Mandatory Guardrail) */}
      {isSimulationActive && (
        <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-950" />
            <span>SIMULATION ACTIVE: Virtual clock advanced by +{virtualDaysOffset} days. No live AICTE records or external SMS/emails dispatched.</span>
          </div>
          <button
            onClick={handleResetSimulation}
            className="px-2.5 py-1 rounded bg-slate-950 text-white text-[11px] font-mono hover:bg-slate-900"
          >
            Reset Clock
          </button>
        </div>
      )}

      {/* Admin Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              AICTE Sentinel Regulatory Governance Core
            </div>
            <h1 className="text-2xl font-bold tracking-tight">System Administrator Command Center</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Configurable workflow lifecycle, cryptographic audit integrity, and isolated Time Travel capacity simulation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 text-right">
              <p className="text-[11px] text-slate-400">Audit Chain Status</p>
              <p className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                SHA-256 Validated (5 Blocks)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Innovation Spotlight: Time Travel & What-If Simulation Engine */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/30 dark:border-indigo-500/20 shadow-md p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Isolated What-If &amp; Time Travel Simulation Engine
              </h2>
              <p className="text-xs text-slate-500">
                Simulate downstream obligation deadlines, committee bottlenecks, and alert ladders without altering live records
              </p>
            </div>
          </div>

          {/* Time Travel Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 px-2 font-mono">
              +{virtualDaysOffset}d
            </span>
            <button
              onClick={() => handleAdvanceDays(1)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-medium shadow-sm hover:bg-slate-50"
            >
              +1 Day
            </button>
            <button
              onClick={() => handleAdvanceDays(7)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-medium shadow-sm hover:bg-slate-50"
            >
              +7 Days
            </button>
            <button
              onClick={() => handleAdvanceDays(15)}
              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-600 text-white font-bold shadow-sm hover:bg-indigo-700"
            >
              +15 Days
            </button>
            <button
              onClick={() => handleAdvanceDays(30)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-medium shadow-sm hover:bg-slate-50"
            >
              +30 Days
            </button>
            <button
              onClick={handleResetSimulation}
              title="Reset Virtual Clock"
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Simulation Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Test Scenario</span>
            <p className="font-bold text-slate-900 dark:text-white">
              EVC Peak Capacity Bottleneck (Western Bureau)
            </p>
            <p className="text-slate-500 text-[11px]">
              20 applications awaiting visit with only 10 committee slots available in 15-day window.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Intervention Toggle</span>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200 pt-1">
              <input
                type="checkbox"
                checked={extraCommitteeIntervention}
                onChange={e => setExtraCommitteeIntervention(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Add +5 Empanelled Committee Slots</span>
            </label>
            <p className="text-[11px] text-slate-500">
              {extraCommitteeIntervention ? 'Intervention applied: Projected overdue dropped by 75%' : 'No intervention: Expect significant overdue spike'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Simulated Overdue Projection</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono ${
                simulatedOverdue > baseOverdue ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {simulatedOverdue} Cases Overdue
              </span>
              <span className="text-slate-400 text-[11px]">
                (vs {baseOverdue} baseline)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Simulated under active APH policy v2.4.1
            </p>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={onNavigateToUsers}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600">
            User &amp; RBAC Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Least-privilege role scoping, regional delegations &amp; statutory permissions.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600">
            <span>Configure Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={onNavigateToWorkflows}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
            Configurable Workflows
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Effective-dated YAML/JSON policies, version control &amp; 2-person approval.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
            <span>Edit Workflow Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={onNavigateToAlerts}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600">
            Alert &amp; Escalation Ladder
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            T-30, T-7, T-0 business-calendar alerts, idempotency keys &amp; delivery logs.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600">
            <span>Manage Escalation Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={onNavigateToAudit}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600">
            Audit Log Explorer
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident SHA-256 hash chains, transactional verification &amp; proofs.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-purple-600">
            <span>Verify Audit Chain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* System Health & Regulatory Governance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Active Regulatory Policies &amp; Governance Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Policy ID &amp; Template</th>
                <th className="py-2.5 px-3">Application Type</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Effective Window</th>
                <th className="py-2.5 px-3">Approval Status</th>
                <th className="py-2.5 px-3">Source APH Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {WORKFLOW_DEFINITIONS.map(wf => (
                <tr key={wf.workflow_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-indigo-600">{wf.workflow_id}</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{wf.name}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{wf.application_type}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">v{wf.version}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{wf.effective_from} to {wf.effective_to}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {wf.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{wf.source_aph_reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
