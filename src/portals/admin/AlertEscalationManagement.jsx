import React, { useState } from 'react'
import {
  Bell, AlertTriangle, Clock, ShieldAlert, CheckCircle2,
  Calendar, Check, X, RefreshCw, Send, Mail, MessageSquare,
  Smartphone, Filter, Search
} from 'lucide-react'
import { ESCALATION_RULES, NOTIFICATION_JOBS_LOG } from '../shared/sentinelData'

export default function AlertEscalationManagement({ onBack }) {
  const [rules, setRules] = useState(ESCALATION_RULES)
  const [logs, setLogs] = useState(NOTIFICATION_JOBS_LOG)
  const [activeTab, setActiveTab] = useState('rules') // rules | queue
  const [searchLog, setSearchLog] = useState('')

  // Toggle rule status
  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(r => {
      if (r.rule_id === ruleId) {
        return { ...r, active: !r.active }
      }
      return r
    }))
  }

  // Filtered notification queue
  const filteredLogs = logs.filter(l => {
    return l.recipient.toLowerCase().includes(searchLog.toLowerCase()) ||
           l.event.toLowerCase().includes(searchLog.toLowerCase()) ||
           l.idempotency_key.toLowerCase().includes(searchLog.toLowerCase())
  })

  // Simulated re-trigger scan
  const handleTriggerSchedulerScan = () => {
    alert('Scheduler executed: 0 duplicate alerts generated due to unique idempotency constraints (IDEMP-***).')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Admin Overview
            </button>
            <span>/</span>
            <span>Automated Notification &amp; Escalation Subsystem</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Alert Ladders &amp; Idempotent Escalation Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Business-calendar aware notification thresholds (T-30, T-7, T-1, T+0) with duplicate prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSchedulerScan}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Test Scheduler Scan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rules'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Escalation Ladder Rules ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'queue'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Idempotent Delivery Log ({logs.length})
        </button>
      </div>

      {/* View 1: Rules Configuration */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rules.map(rule => (
              <div
                key={rule.rule_id}
                className={`p-4 rounded-2xl border transition-all ${
                  rule.active
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {rule.rule_id}
                  </span>
                  <button
                    onClick={() => handleToggleRule(rule.rule_id)}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      rule.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {rule.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Trigger: {rule.trigger}
                  </p>
                  <p className="text-xs text-slate-500">
                    Target: <strong>{rule.target_role}</strong>
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {rule.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Channel: {rule.channel}</span>
                  <span className="text-emerald-600 font-semibold">Calendar Aware</span>
                </div>
              </div>
            ))}
          </div>

          {/* Operational Governance Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Regulatory Safeguards &amp; Anti-Spam Design
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              &bull; <strong>Idempotency Keys:</strong> Calculated as <code className="font-mono text-indigo-600">IDEMP-&#123;OBLIGATION_ID&#125;-&#123;OFFSET&#125;-&#123;DATE&#125;</code> to guarantee zero duplicate alerts upon scheduler restarts.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              &bull; <strong>Notification Digest:</strong> Low-priority reminders grouped into daily summaries; critical T-1 &amp; Overdue escalations remain instantaneous.
            </p>
          </div>
        </div>
      )}

      {/* View 2: Notification Queue & Delivery Log */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by recipient, event type, or idempotency hash..."
                value={searchLog}
                onChange={e => setSearchLog(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Job ID &amp; Event</th>
                    <th className="py-3 px-3">Recipient &amp; Channel</th>
                    <th className="py-3 px-3">Idempotency Key</th>
                    <th className="py-3 px-3">Dispatched Time</th>
                    <th className="py-3 px-3">Delivery Status</th>
                    <th className="py-3 px-4">Acknowledgement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map(job => (
                    <tr key={job.job_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-amber-600">{job.job_id}</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{job.event}</p>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{job.recipient}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Via {job.channel}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {job.idempotency_key}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500">
                        {job.dispatched_at}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          {job.delivery_status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.acknowledgement_status === 'ACKNOWLEDGED_BY_USER'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {job.acknowledgement_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
