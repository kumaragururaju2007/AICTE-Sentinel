import React, { useState } from 'react'
import {
  Calendar, Clock, AlertTriangle, CheckCircle2, Search, Filter,
  Building2, Send, ExternalLink, ShieldAlert, Check
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'

export default function ObligationsDeadlines() {
  const [searchTerm, setSearchTerm] = useState('')
  const [noticeSentMsg, setNoticeSentMsg] = useState(null)

  const [obligations, setObligations] = useState([
    {
      id: 'OBL-2026-901',
      institution: 'ABC Engineering College',
      obligation: 'EVC Compliance Remediation',
      clauseRef: 'APH Chapter III, Clause 3.12',
      dueDate: '02 Nov 2026',
      daysLeft: 5,
      status: 'CRITICAL',
      severityBadge: 'bg-rose-100 text-rose-700',
      owner: 'Principal & Management'
    },
    {
      id: 'OBL-2026-902',
      institution: 'XYZ Polytechnic',
      obligation: 'Undertaking Renewal & Anti-Ragging',
      clauseRef: 'Supreme Court Mandate 2009',
      dueDate: '10 Nov 2026',
      daysLeft: 13,
      status: 'UPCOMING',
      severityBadge: 'bg-amber-100 text-amber-700',
      owner: 'Trust Secretary'
    },
    {
      id: 'OBL-2026-903',
      institution: 'RVS College of Pharmacy',
      obligation: 'Land Document Validity Extension',
      clauseRef: 'APH Chapter I, Clause 1.8.2',
      dueDate: '18 Nov 2026',
      daysLeft: 21,
      status: 'NORMAL',
      severityBadge: 'bg-emerald-100 text-emerald-700',
      owner: 'Chairman'
    },
    {
      id: 'OBL-2026-904',
      institution: 'Modern Institute of Management',
      obligation: 'SLA Response on Faculty Cadre Ratio',
      clauseRef: 'AICTE Gazette Cadre 1:2:6',
      dueDate: '25 Nov 2026',
      daysLeft: 28,
      status: 'NORMAL',
      severityBadge: 'bg-emerald-100 text-emerald-700',
      owner: 'Director'
    },
    {
      id: 'OBL-2026-905',
      institution: 'NKM Engineering College',
      obligation: 'Affidavit Submission on Non-Capitation Fee',
      clauseRef: 'Fee Regulatory Committee Norms',
      dueDate: '30 Nov 2026',
      daysLeft: 33,
      status: 'NORMAL',
      severityBadge: 'bg-emerald-100 text-emerald-700',
      owner: 'Trustee Board'
    }
  ])

  const handleDispatchReminder = (id, institution) => {
    setNoticeSentMsg(`Statutory reminder notice dispatched to ${institution} (Obligation ID: ${id}).`)
    setTimeout(() => setNoticeSentMsg(null), 4000)
  }

  const filtered = obligations.filter(ob =>
    ob.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ob.obligation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ob.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Obligations &amp; Statutory Deadlines"
        subtitle="National tracking of mandatory compliance milestones, SLA clocks, and automated statutory escalation ladders"
        badgeText="156 Total Upcoming Deadlines"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Obligations & Deadlines']}
      />

      {noticeSentMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{noticeSentMsg}</span>
          </div>
          <button onClick={() => setNoticeSentMsg(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by institution, obligation, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden md:block">
          Showing {filtered.length} of {obligations.length} Active Obligations
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <th className="py-3 px-4">Obligation ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Statutory Obligation</th>
                <th className="py-3 px-4">Governing Clause</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(ob => (
                <tr key={ob.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1E6DEB]">{ob.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{ob.institution}</td>
                  <td className="py-3 px-4 text-slate-700">{ob.obligation}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{ob.clauseRef}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{ob.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${ob.severityBadge}`}>
                      {ob.daysLeft} Days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDispatchReminder(ob.id, ob.institution)}
                      className="px-3 py-1 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ml-auto shadow-xs"
                    >
                      <Send className="w-3 h-3" /> Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

