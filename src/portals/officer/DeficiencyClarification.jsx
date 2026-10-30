import React, { useState } from 'react'
import {
  AlertTriangle, MessageSquare, Clock, Plus, Send, CheckCircle2,
  FileText, ArrowRight, ShieldAlert, Sparkles, Building2, User,
  Paperclip, ExternalLink, RefreshCw
} from 'lucide-react'
import { DEFICIENCY_TICKETS } from '../shared/sentinelData'

export default function DeficiencyClarification({ initialAppId = 'AICTE-2024-00145', onBack }) {
  const [tickets, setTickets] = useState(DEFICIENCY_TICKETS)
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.ticket_id || 'DEF-2026-081')
  const [replyText, setReplyText] = useState('')
  const [isRaisingNew, setIsRaisingNew] = useState(false)

  // New ticket state
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Safety & Fire')
  const [newAphClause, setNewAphClause] = useState('Chapter II, Clause 2.14.3')
  const [newSeverity, setNewSeverity] = useState('CRITICAL')
  const [newReason, setNewReason] = useState('')
  const [newAction, setNewAction] = useState('')

  const activeTicket = tickets.find(t => t.ticket_id === selectedTicketId) || tickets[0]

  // Send communication message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Dr. Rajesh Kumar (AICTE Scrutiny Officer)',
      role: 'officer',
      timestamp: 'Just now',
      content: replyText,
      attachment: null
    }

    setTickets(prev => prev.map(t => {
      if (t.ticket_id === selectedTicketId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        }
      }
      return t
    }))
    setReplyText('')
  }

  // Resolve / Close Deficiency
  const handleResolveTicket = () => {
    setTickets(prev => prev.map(t => {
      if (t.ticket_id === selectedTicketId) {
        return {
          ...t,
          status: 'RESOLVED',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'AICTE Sentinel Workflow Engine',
              role: 'system',
              timestamp: 'Just now',
              content: 'Deficiency verified and closed by Dr. Rajesh Kumar. Scrutiny stage unblocked.',
              attachment: null
            }
          ]
        }
      }
      return t
    }))
  }

  // Create New Deficiency Ticket
  const handleCreateDeficiency = (e) => {
    e.preventDefault()
    if (!newReason.trim() || !newTitle.trim()) {
      alert('Mandatory deficiency reason and title are required under AICTE regulations.')
      return
    }

    const createdTicket = {
      ticket_id: `DEF-2026-0${tickets.length + 85}`,
      application_id: initialAppId,
      institution_name: 'Apex Institute of Technology & Management',
      deficiency_code: `DEF-CUST-${tickets.length + 1}`,
      category: newCategory,
      aph_clause: newAphClause,
      severity: newSeverity,
      title: newTitle,
      mandatory_reason: newReason,
      suggested_action: newAction,
      status: 'AWAITING_INSTITUTION_RESPONSE',
      raised_by: 'Dr. Rajesh Kumar',
      raised_at: new Date().toISOString(),
      deadline: '2026-11-09T17:00:00Z',
      days_remaining: 10,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'Dr. Rajesh Kumar (AICTE Officer)',
          role: 'officer',
          timestamp: 'Just now',
          content: `Deficiency raised under ${newAphClause}: ${newReason}. Action required: ${newAction}`,
          attachment: null
        }
      ],
      resubmitted_evidence: []
    }

    setTickets([createdTicket, ...tickets])
    setSelectedTicketId(createdTicket.ticket_id)
    setIsRaisingNew(false)
    setNewTitle('')
    setNewReason('')
    setNewAction('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Dashboard
            </button>
            <span>/</span>
            <span>Deficiency &amp; Revert Hub</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Deficiency Communication &amp; Compliance Interface</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory deficiency tagging with APH clause references, institutional clarifications, and evidence resubmission.
          </p>
        </div>

        <button
          onClick={() => setIsRaisingNew(!isRaisingNew)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          {isRaisingNew ? 'Cancel New Ticket' : 'Raise New Deficiency'}
        </button>
      </div>

      {/* Modal / Form: Raise New Deficiency Ticket */}
      {isRaisingNew && (
        <div className="p-5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 shadow-md">
          <div className="flex items-center gap-2 pb-3 border-b border-orange-200 dark:border-orange-900 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Issue Official Deficiency Notice (Mandatory Reason Required)
            </h3>
          </div>

          <form onSubmit={handleCreateDeficiency} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deficiency Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Shortfall in Laboratory Equipment / Land Survey mismatch"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                AICTE APH Clause Reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Chapter II, Clause 2.14.3"
                value={newAphClause}
                onChange={e => setNewAphClause(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Safety & Fire">Safety &amp; Fire NOC</option>
                <option value="Land & Legal Title">Land &amp; Legal Title Deed</option>
                <option value="Faculty Cadre & Ratio">Faculty Cadre &amp; Ratio</option>
                <option value="Laboratory Infrastructure">Laboratory Infrastructure</option>
                <option value="Financial & Audit">Financial &amp; Audit Balance Sheet</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity Level
              </label>
              <select
                value={newSeverity}
                onChange={e => setNewSeverity(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="CRITICAL">Critical (Halts Approval Cycle)</option>
                <option value="HIGH">High (Mandatory Clarification)</option>
                <option value="MEDIUM">Medium (Provisional Notice)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Reason &amp; Specific Finding <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Detail the exact finding, why the submitted evidence is deficient, and statutory violation..."
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Suggested Rectification / Evidence Required
              </label>
              <input
                type="text"
                placeholder="e.g., Provide Sub-Registrar stamped lease deed or valid CFO fire certificate."
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRaisingNew(false)}
                className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md"
              >
                Dispatch Deficiency Notice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main 2-Column: Tickets List on Left, Thread & Evidence on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tickets List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Deficiency Tickets ({tickets.length})
          </h2>

          <div className="space-y-2">
            {tickets.map((t) => {
              const isSelected = t.ticket_id === selectedTicketId
              const isOverdue = t.days_remaining < 0
              return (
                <div
                  key={t.ticket_id}
                  onClick={() => setSelectedTicketId(t.ticket_id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-400 dark:border-orange-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                      {t.ticket_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      isOverdue ? 'bg-red-100 text-red-800' :
                      t.status === 'RESUBMITTED_UNDER_REVIEW' ? 'bg-sky-100 text-sky-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {t.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{t.institution_name}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <span className="text-slate-400 font-mono">{t.aph_clause}</span>
                    <span className={`font-mono font-bold ${isOverdue ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`}>
                      {isOverdue ? `Overdue by ${Math.abs(t.days_remaining)}d` : `${t.days_remaining}d left`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Selected Ticket Clarification Thread & Resubmitted Evidence (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            {/* Ticket Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-600">{activeTicket.ticket_id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{activeTicket.application_id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{activeTicket.category}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeTicket.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raised by: <strong>{activeTicket.raised_by}</strong> &bull; Governing APH Rule: <span className="font-mono font-bold text-indigo-600">{activeTicket.aph_clause}</span>
                </p>
              </div>

              {activeTicket.status !== 'RESOLVED' && (
                <button
                  onClick={handleResolveTicket}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Deficiency Resolved
                </button>
              )}
            </div>

            {/* Mandatory Reason Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Official AICTE Deficiency Finding:
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {activeTicket.mandatory_reason}
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                <strong>Action Prescribed:</strong> {activeTicket.suggested_action}
              </p>
            </div>

            {/* Resubmitted Evidence (if any) */}
            {activeTicket.resubmitted_evidence && activeTicket.resubmitted_evidence.length > 0 && (
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    Resubmitted Institution Evidence
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[10px]">
                    Requires Officer Verification
                  </span>
                </div>

                {activeTicket.resubmitted_evidence.map(evi => (
                  <div key={evi.id} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900 text-xs">
                    <div>
                      <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{evi.file_name}</p>
                      <p className="text-[10px] text-slate-400">Uploaded: {evi.uploaded_at} &bull; {evi.file_size}</p>
                    </div>
                    <button
                      onClick={() => alert(`Reviewing candidate evidence: ${evi.file_name}`)}
                      className="px-2.5 py-1 text-xs rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                    >
                      Inspect File
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Communication Thread */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Audit-Logged Communication Trail
              </h3>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activeTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.role === 'officer'
                        ? 'bg-slate-100 dark:bg-slate-800 ml-4 border border-slate-200 dark:border-slate-700'
                        : msg.role === 'system'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-indigo-50/70 dark:bg-indigo-950/30 mr-4 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <span>{msg.sender}</span>
                      <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{msg.content}</p>
                    {msg.attachment && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-[10px] font-mono text-indigo-600">
                        <Paperclip className="w-3 h-3" />
                        {msg.attachment}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              {activeTicket.status !== 'RESOLVED' && (
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official clarification, instruction or status update..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Notice
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
