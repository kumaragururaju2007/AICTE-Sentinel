import React, { useState } from 'react'
import {
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, FileText,
  Building2, Calendar, Sparkles, Plus, Send, Check, X,
  Layers, Filter, ArrowRight, RotateCcw, TrendingUp, Sliders
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import {
  DEFICIENCY_TICKETS,
  LEASE_VALIDITY_DATA,
  UNDERTAKINGS_DATA
} from '../../data/officerMockData'
import { useApplicationContext } from '../../context/ApplicationContext'

export default function ComplianceReview() {
  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  const [activeTab, setActiveTab] = useState('deficiencies') // 'deficiencies' | 'undertakings' | 'leases' | 'simulation'
  const [localDeficiencies, setLocalDeficiencies] = useState(DEFICIENCY_TICKETS)
  const deficiencies = appContext ? appContext.deficiencies : localDeficiencies
  const [undertakings, setUndertakings] = useState(UNDERTAKINGS_DATA)
  const [leases, setLeases] = useState(LEASE_VALIDITY_DATA)
  const [selectedTicketId, setSelectedTicketId] = useState(deficiencies[0]?.id || 'DEF-2026-081')
  const [replyText, setReplyText] = useState('')

  // What-If Simulation State (Section L)
  const [simExtraCapacity, setSimExtraCapacity] = useState(5)
  const [simActive, setSimActive] = useState(false)

  const activeTicket = deficiencies.find(t => t.id === selectedTicketId) || deficiencies[0]

  // Send message in clarification thread
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newMsg = {
      sender: 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
      role: 'officer',
      timestamp: 'Just now',
      content: replyText
    }

    setDeficiencies(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        }
      }
      return t
    }))
    setReplyText('')
  }

  // Accept resubmission & resolve deficiency
  const handleResolveTicket = (ticketId) => {
    if (appContext && appContext.resolveDeficiency) {
      appContext.resolveDeficiency(ticketId, 'Deficiency verified and closed by Dr. Rajesh Kumar. Scrutiny stage unblocked.')
    }
    setLocalDeficiencies(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'RESOLVED',
          messages: [
            ...t.messages,
            {
              sender: 'AICTE Sentinel Workflow Engine',
              role: 'system',
              timestamp: 'Just now',
              content: 'Deficiency verified and closed by Dr. Rajesh Kumar. Scrutiny stage unblocked.'
            }
          ]
        }
      }
      return t
    }))
  }

  // Undertaking verification action
  const handleVerifyUndertaking = (undId, newStatus) => {
    setUndertakings(prev => prev.map(u => {
      if (u.id === undId) {
        return { ...u, status: newStatus }
      }
      return u
    }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance &amp; Deficiency Monitoring Hub"
        subtitle="Manage institution clarifications, institutional undertakings, lease validity, and What-If capacity models"
        badgeText="Statutory Compliance Core"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Compliance Review']}
      />

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5">
        {[
          { id: 'deficiencies', label: `Deficiency Tickets (${deficiencies.length})` },
          { id: 'undertakings', label: `Undertaking Verification (${undertakings.length})` },
          { id: 'leases', label: `Lease & Document Validity (${leases.length})` },
          { id: 'simulation', label: 'What-If Simulation Engine' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#102A56] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DEFICIENCY MANAGEMENT */}
      {activeTab === 'deficiencies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets Queue */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Active Deficiency Tickets
            </h3>

            <div className="space-y-2">
              {deficiencies.map(t => {
                const isSelected = t.id === selectedTicketId
                const isOverdue = t.daysRemaining < 0
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700">{t.id}</span>
                      <StatusBadge status={t.status} size="xs" />
                    </div>

                    <p className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{t.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{t.institutionName}</p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-400 font-mono">{t.aphClause}</span>
                      <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                        {isOverdue ? `Overdue by ${Math.abs(t.daysRemaining)}d` : `${t.daysRemaining}d left`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Ticket Clarification Thread */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600">{activeTicket.id}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="font-mono text-xs text-slate-500">{activeTicket.applicationId}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-semibold text-slate-700">{activeTicket.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{activeTicket.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Governed by: <strong className="text-[#1769E0] font-mono">{activeTicket.aphClause}</strong> &bull; Deadline: {activeTicket.responseDeadline}
                  </p>
                </div>

                {activeTicket.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolveTicket(activeTicket.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept &amp; Close Deficiency
                  </button>
                )}
              </div>

              {/* Finding Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">Official AICTE Deficiency Finding:</p>
                <p className="text-slate-600 leading-relaxed">{activeTicket.description}</p>
              </div>

              {/* Resubmitted Evidence */}
              {activeTicket.resubmittedEvidence && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#102A56]">
                    <span>Resubmitted Corrective Evidence:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1769E0] text-[10px]">
                      Pending Officer Verification
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-blue-100">
                    <div>
                      <p className="font-mono font-bold text-slate-900">{activeTicket.resubmittedEvidence.fileName}</p>
                      <p className="text-[10px] text-slate-400">
                        Uploaded: {activeTicket.resubmittedEvidence.uploadedAt} &bull; {activeTicket.resubmittedEvidence.fileSize}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`Reviewing candidate evidence: ${activeTicket.resubmittedEvidence.fileName}`)}
                      className="px-3 py-1 rounded-lg bg-[#102A56] text-white text-xs font-bold"
                    >
                      Inspect File
                    </button>
                  </div>
                </div>
              )}

              {/* Message Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audit-Logged Clarification History
                </h4>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeTicket.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        msg.role === 'officer'
                          ? 'bg-slate-100 border border-slate-200 ml-4'
                          : msg.role === 'system'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-blue-50 border border-blue-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>{msg.sender}</span>
                        <span className="font-mono text-[10px]">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-800">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {activeTicket.status !== 'RESOLVED' && (
                  <form onSubmit={handleSendMessage} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type clarification query or official directive..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1769E0]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#102A56] hover:bg-[#1769E0] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNDERTAKING VERIFICATION */}
      {activeTab === 'undertakings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            Institutional Undertakings &amp; Affidavit Compliance
          </h3>
          <p className="text-xs text-slate-500">Track mandatory compliance undertakings with associated due dates</p>

          <div className="space-y-3">
            {undertakings.map(und => (
              <div key={und.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1769E0]">{und.id}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="font-mono text-slate-500">{und.clauseRef}</span>
                    <StatusBadge status={und.status} size="xs" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{und.undertakingTitle}</h4>
                  <p className="text-slate-500 mt-0.5">{und.institutionName}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Submitted Evidence: <strong>{und.evidenceFile}</strong> &bull; Due: {und.dueDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerifyUndertaking(und.id, 'DEFICIENT_OVERDUE')}
                    className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold"
                  >
                    Mark Deficient
                  </button>
                  <button
                    onClick={() => handleVerifyUndertaking(und.id, 'VERIFIED_COMPLIANT')}
                    className="px-4 py-1.5 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold"
                  >
                    Verify Evidence
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEASE VALIDITY MONITORING */}
      {activeTab === 'leases' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            Campus Land Lease &amp; Infrastructure Deed Validity
          </h3>
          <p className="text-xs text-slate-500">
            Green: Valid &bull; Orange: Expiring Soon (&lt; 90 days) &bull; Red: Expired
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leases.map(lease => {
              const borderClass =
                lease.badgeColor === 'green' ? 'border-emerald-200 bg-emerald-50/40' :
                lease.badgeColor === 'orange' ? 'border-amber-200 bg-amber-50/40' :
                'border-rose-200 bg-rose-50/40'

              const statusColor =
                lease.badgeColor === 'green' ? 'text-emerald-700 bg-emerald-100' :
                lease.badgeColor === 'orange' ? 'text-amber-800 bg-amber-100' :
                'text-rose-700 bg-rose-100'

              return (
                <div key={lease.id} className={`p-4 rounded-xl border ${borderClass} text-xs space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-bold">{lease.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColor}`}>
                      {lease.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{lease.institutionName}</h4>
                  <p className="text-slate-600 text-[11px] font-mono">{lease.leaseDocument}</p>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-600">
                    <div>Start Date: <strong>{lease.startDate}</strong></div>
                    <div>Expiry Date: <strong>{lease.expiryDate}</strong></div>
                    <div>
                      Remaining Term:{' '}
                      <strong className={lease.remainingDays < 0 ? 'text-rose-600' : 'text-slate-800'}>
                        {lease.remainingDays < 0 ? `EXPIRED (${Math.abs(lease.remainingDays)}d ago)` : `${lease.remainingDays} Days`}
                      </strong>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WHAT-IF SIMULATION ENGINE */}
      {activeTab === 'simulation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1769E0]" />
                <h3 className="font-bold text-sm text-slate-900">What-If Capacity &amp; Bottleneck Simulator</h3>
              </div>
              <p className="text-xs text-slate-500">
                Estimate how capacity bottlenecks affect downstream obligations and compare administrative interventions
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              Prototype Estimates (Demo Data Assumptions)
            </div>
          </div>

          {/* Scenario Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Scenario</span>
              <p className="font-bold text-slate-900 text-sm">20 Applications in EVC Queue</p>
              <p className="text-slate-600">Available committees can handle 10 visits within the selected 15-day window.</p>
              <p className="text-rose-600 font-bold pt-1">Projected Overdue Without Intervention: 10 Cases</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Interactive Capacity Slider</span>
              <div>
                <div className="flex justify-between font-bold text-xs mb-1">
                  <span>Additional Slots:</span>
                  <span className="text-[#1769E0]">+{simExtraCapacity} Committees</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simExtraCapacity}
                  onChange={e => {
                    setSimExtraCapacity(parseInt(e.target.value))
                    setSimActive(true)
                  }}
                  className="w-full accent-[#1769E0]"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Adjust committee allocation to observe real-time projected backlog reduction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-blue-900 block text-[10px] uppercase font-bold">Simulated Projection</span>
                <p className="text-2xl font-black text-[#102A56] mt-1">
                  {Math.max(0, 10 - simExtraCapacity)} Overdue Cases
                </p>
                <p className="text-[11px] text-slate-600">
                  Estimated Average Waiting Time:{' '}
                  <strong>{Math.round(18 - (simExtraCapacity * 1.2))} Days</strong> (vs 18 baseline)
                </p>
              </div>

              <button
                onClick={() => {
                  setSimExtraCapacity(5)
                  setSimActive(false)
                }}
                className="text-[11px] text-[#1769E0] font-bold hover:underline self-start flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

