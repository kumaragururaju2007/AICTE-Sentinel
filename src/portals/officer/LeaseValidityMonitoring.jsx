import React, { useState } from 'react'
import {
  Building2, Clock, CheckCircle2, AlertTriangle, ShieldAlert,
  Search, Filter, ExternalLink, Calendar, MapPin, Check, X, Send
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { LEASE_VALIDITY_DATA } from '../../data/officerMockData'

export default function LeaseValidityMonitoring() {
  const [leases, setLeases] = useState(LEASE_VALIDITY_DATA)
  const [selectedLease, setSelectedLease] = useState(leases[0])
  const [filterState, setFilterState] = useState('ALL')
  const [search, setSearch] = useState('')
  const [noticeSentMsg, setNoticeSentMsg] = useState(null)

  const handleSendRenewalNotice = (id) => {
    setNoticeSentMsg(`Statutory 30-Year Lease Renewal Notice dispatched to Trust Chairman for record ${id}.`)
    setTimeout(() => setNoticeSentMsg(null), 4000)
  }

  const filtered = leases.filter(item => {
    const matchSearch = item.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      item.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    const matchState = filterState === 'ALL' || item.status === filterState
    return matchSearch && matchState
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Land Title &amp; 30-Year Registered Lease Validity Monitor"
        subtitle="Mandatory APH Chapter I Clause 1.8.2 scrutiny of continuous title deeds, sub-registrar registrations &amp; non-encumbrance"
        badgeText={`${leases.length} Campus Parcels`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Lease Validity Monitoring']}
      />

      {noticeSentMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{noticeSentMsg}</span>
          </div>
          <button onClick={() => setNoticeSentMsg(null)} className="text-amber-700 font-bold">&times;</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Monitored Leases</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">8</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Western Bureau Zone</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Fully Compliant (&gt; 25 yrs)</span>
          <p className="text-2xl font-extrabold text-[#159B68] mt-1">6</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Clear unexpired tenure</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Critical (&lt; 5 yrs remaining)</span>
          <p className="text-2xl font-extrabold text-[#EF4444] mt-1">1</p>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Renewal notice mandatory</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Encumbrance Clearances</span>
          <p className="text-2xl font-extrabold text-[#7738E8] mt-1">100%</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Verified via IGR portal</span>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Registered Parcels ({filtered.length})
          </span>

          <div className="space-y-2.5">
            {filtered.map(lease => {
              const isSelected = selectedLease.id === lease.id
              const isCritical = lease.yearsRemaining < 10
              return (
                <div
                  key={lease.id}
                  onClick={() => setSelectedLease(lease)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E6DEB]">{lease.id}</span>
                    <StatusBadge status={lease.status} size="xs" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{lease.institutionName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{lease.surveyNumber} &bull; {lease.district}</p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400">Expires: {lease.expiryDate}</span>
                    <span className={`font-mono font-bold ${isCritical ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {lease.yearsRemaining} years remaining
                    </span>
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
                  <span className="font-mono text-xs font-bold text-[#1E6DEB]">{selectedLease.id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{selectedLease.surveyNumber}</span>
                  <StatusBadge status={selectedLease.status} size="xs" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedLease.institutionName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedLease.district}, Western Region</p>
              </div>

              <button
                onClick={() => handleSendRenewalNotice(selectedLease.id)}
                className="px-4 py-2 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Issue Notice
              </button>
            </div>

            {/* Tenure Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">30-Year Statutory Period Run</span>
                <span className="font-mono text-[#1E6DEB]">{selectedLease.yearsRemaining} / 30 Years Remaining</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#159B68] h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((selectedLease.yearsRemaining / 30) * 100))}%` }}
                />
              </div>
            </div>

            {/* Land Registry Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sub-Registrar Jurisdiction</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedLease.subRegistrarOffice || 'Haveli Sub-Registrar (Pune)'}</p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">✓ Stamp &amp; Registration Fee Paid</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Encumbrance &amp; Title Verification</span>
                <p className="font-bold text-slate-900 mt-0.5">Form No. 15 Nil Encumbrance</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Searched across 30 years registry records</span>
              </div>
            </div>

            {/* Regulatory Clause Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
              <p className="font-bold text-blue-950">AICTE Approval Process Handbook Clause 1.8.2 Norm:</p>
              <p className="text-blue-900 leading-relaxed">
                "Land for technical institutions shall be in lawful possession of the Society / Trust either through ownership or registered lease for a minimum unexpired period of 30 years from the date of application submission."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
