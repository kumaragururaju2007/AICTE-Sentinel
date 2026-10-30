import React, { useState } from 'react'
import {
  CheckSquare, CheckCircle2, AlertTriangle, FileText, Shield,
  Search, Filter, ExternalLink, Download, Check, X, Building2, User
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { UNDERTAKINGS_DATA } from '../../data/officerMockData'

export default function UndertakingVerification() {
  const [undertakings, setUndertakings] = useState(UNDERTAKINGS_DATA)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [activeItem, setActiveItem] = useState(undertakings[0])
  const [notificationMsg, setNotificationMsg] = useState(null)

  const handleVerify = (id) => {
    setUndertakings(prev => prev.map(u => u.id === id ? { ...u, status: 'VERIFIED' } : u))
    setNotificationMsg(`Undertaking ${id} officially marked as VERIFIED and sealed into audit trail.`)
    setTimeout(() => setNotificationMsg(null), 3500)
  }

  const handleFlag = (id) => {
    setUndertakings(prev => prev.map(u => u.id === id ? { ...u, status: 'FLAGGED' } : u))
    setNotificationMsg(`Undertaking ${id} FLAGGED for missing notary stamp / statutory clause discrepancy.`)
    setTimeout(() => setNotificationMsg(null), 3500)
  }

  const filtered = undertakings.filter(u => {
    const matchSearch = u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.undertakingTitle.toLowerCase().includes(search.toLowerCase()) ||
      u.clauseRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Undertakings &amp; Affidavit Compliance"
        subtitle="Mandatory statutory declarations under AICTE Act 1987, anti-ragging commitments &amp; trust affidavits"
        badgeText={`${undertakings.length} Undertakings Registered`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Undertaking Verification']}
      />

      {notificationMsg && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-blue-700 hover:text-blue-900 font-bold">&times;</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, clause, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'VERIFIED', 'SUBMITTED', 'PENDING_UPLOAD', 'FLAGGED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#1E6DEB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Undertakings' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Undertakings Queue ({filtered.length})
          </span>

          <div className="space-y-2.5">
            {filtered.map(item => {
              const isSelected = activeItem.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E6DEB]">{item.id}</span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{item.undertakingTitle}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Clause: <strong className="text-slate-700 font-mono">{item.clauseRef}</strong></p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>Due: {item.dueDate}</span>
                    <span className="font-mono">{item.signedBy}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E6DEB]">{activeItem.id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{activeItem.clauseRef}</span>
                  <StatusBadge status={activeItem.status} size="xs" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeItem.undertakingTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Statutory compliance governing approval grant under APH 2024-25</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleVerify(activeItem.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Verify
                </button>
                <button
                  onClick={() => handleFlag(activeItem.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Flag Deficient
                </button>
              </div>
            </div>

            {/* Legal Affidavit Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Signatory</span>
                <p className="font-bold text-slate-900 mt-0.5">{activeItem.signedBy}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Secretary &bull; Registered Trust / Society</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Digital Signature &amp; e-Stamp</span>
                <p className="font-mono font-bold text-emerald-700 mt-0.5">DSC Class-3 Valid (e-Mudhra / CCA)</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Notary Reg: MH/BOM/2024/98124</span>
              </div>
            </div>

            {/* Statutory Compliance Text */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Solemn Affirmation Statement:</span>
              <p className="text-slate-600 leading-relaxed italic">
                "The Institute hereby solemnly affirms and declares under oath that no donation, capitation fee or non-statutory charges are levied from candidates. We further confirm strict adherence to AICTE Anti-Ragging regulations and 7th Central Pay Commission guidelines for approved faculty."
              </p>
            </div>

            {/* Audit Trail Stamp */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900">
                <Shield className="w-4 h-4 text-[#1E6DEB]" />
                <span>SHA-256 Hash: <strong className="font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</strong></span>
              </div>
              <span className="text-[10px] text-blue-700 font-bold uppercase">Immutable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

