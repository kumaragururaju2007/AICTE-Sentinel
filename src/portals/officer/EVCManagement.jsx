import React, { useState } from 'react'
import {
  Calendar, Users, ShieldCheck, CheckCircle2, Clock, Sparkles,
  MapPin, Check, X, FileText, ChevronRight, AlertTriangle, ArrowRight
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { EVC_MANAGEMENT_DATA } from '../../data/officerMockData'

export default function EVCManagement() {
  const [queue, setQueue] = useState(EVC_MANAGEMENT_DATA.queue)
  const [selectedEvcId, setSelectedEvcId] = useState(queue[0]?.evcId || 'EVC-2026-901')
  const [optimizerModalOpen, setOptimizerModalOpen] = useState(false)
  const [confirmationNotice, setConfirmationNotice] = useState(null)

  const activeEvc = queue.find(q => q.evcId === selectedEvcId) || queue[0]

  // Authorized Human-in-the-Loop Confirmation
  const handleConfirmSchedule = (evcId) => {
    setQueue(prev => prev.map(item => {
      if (item.evcId === evcId) {
        return {
          ...item,
          status: 'CONFIRMED',
          confirmedDate: item.proposedDate
        }
      }
      return item
    }))
    setConfirmationNotice(`Inspection for ${activeEvc.institutionName} on ${activeEvc.proposedDate} officially CONFIRMED by Authorized Coordinator.`)
    setTimeout(() => setConfirmationNotice(null), 4000)
  }

  // Toggle physical inspection checklist item
  const handleToggleChecklist = (field) => {
    setQueue(prev => prev.map(item => {
      if (item.evcId === selectedEvcId) {
        return {
          ...item,
          checklist: {
            ...item.checklist,
            [field]: !item.checklist[field]
          }
        }
      }
      return item
    }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expert Visit Committee (EVC) Logistics &amp; Scheduling"
        subtitle="Transparent constraint-based committee allocation, conflict-of-interest clearance &amp; inspection monitoring"
        badgeText={`${queue.length} EVC Panels Active in Western Bureau`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'EVC Management']}
        actions={
          <button
            onClick={() => setOptimizerModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Run Committee Optimizer
          </button>
        }
      />

      {/* Confirmation Alert Banner */}
      {confirmationNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{confirmationNotice}</span>
          </div>
          <button onClick={() => setConfirmationNotice(null)} className="text-slate-500">&times;</button>
        </div>
      )}

      {/* Main 2-Column: EVC Caseload Queue on Left, Inspection Detail & Roster on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Scheduled Queue */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            EVC Pipeline Caseload ({queue.length})
          </h3>

          <div className="space-y-2.5">
            {queue.map(item => {
              const isSelected = item.evcId === selectedEvcId
              return (
                <div
                  key={item.evcId}
                  onClick={() => setSelectedEvcId(item.evcId)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#1769E0] shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1769E0]">{item.evcId}</span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>

                  <p className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{item.institutionName}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.address}</p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500 font-mono">Date: {item.confirmedDate || item.proposedDate}</span>
                    <span className="font-bold text-[#159B68] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> COI Cleared
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Regional Committee Capacity Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-3">
            <h4 className="font-bold text-slate-800">Regional Committee Capacity Pool</h4>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Western Bureau Slots</span>
                  <span className="font-bold text-[#1769E0]">8 / 12 Empanelled</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1769E0] h-full rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Northern Bureau Slots</span>
                  <span className="font-bold text-[#159B68]">5 / 10 Empanelled</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#159B68] h-full rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Selected EVC Details, Roster & Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1769E0]">{activeEvc.evcId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{activeEvc.applicationId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700">{activeEvc.region} Bureau</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeEvc.institutionName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeEvc.address}
                </p>
              </div>

              {activeEvc.status === 'CONFIRMED' ? (
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#159B68] border border-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Visit Confirmed
                </span>
              ) : (
                <button
                  onClick={() => handleConfirmSchedule(activeEvc.evcId)}
                  className="px-4 py-2 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" /> Authorize &amp; Confirm Schedule
                </button>
              )}
            </div>

            {/* Conflict of Interest Safeguard Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#159B68] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Automated Conflict-of-Interest (COI) Verification: PASSED</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                {activeEvc.conflictDetails}
              </p>
            </div>

            {/* Committee Members Roster */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Empanelled Committee Roster ({activeEvc.assignedCommittee.length} Members)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeEvc.assignedCommittee.map((expert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{expert.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-[#1769E0] font-bold">
                        {expert.role}
                      </span>
                    </div>
                    <p className="text-slate-600">{expert.discipline}</p>
                    <p className="text-slate-400 font-mono text-[11px]">{expert.inst}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Onsite Inspection Physical Checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Onsite Physical Verification Checklist (APH 2024-25)
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'labsVerified', label: 'Computer and Hardware Labs verified against curriculum norms' },
                  { key: 'biometricAttendanceAudited', label: 'Faculty biometric attendance & credential master verified' },
                  { key: 'libraryVolumesChecked', label: 'Library book volumes, e-journals subscription and reading hall audited' },
                  { key: 'hostelSafetyCleared', label: 'Hostel facilities, barrier-free ramps, and CCTV surveillance inspected' },
                  { key: 'videoRecordingUploaded', label: 'Continuous geotagged inspection video uploaded to AICTE server' }
                ].map(item => {
                  const isChecked = activeEvc.checklist[item.key]
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleChecklist(item.key)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors"
                    >
                      <span className="text-slate-800 font-medium">{item.label}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-[#159B68] border-[#159B68] text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimizer Modal */}
      {optimizerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1769E0]" />
                <h3 className="font-bold text-slate-900 text-sm">Constraint-Based Committee Optimizer</h3>
              </div>
              <button onClick={() => setOptimizerModalOpen(false)} className="text-slate-400 font-bold">&times;</button>
            </div>

            <p className="text-xs text-slate-500">
              The optimizer checks committee availability, geographic region, travel distance, and conflict-of-interest distance matrix.
            </p>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800">Suggested Experts from Available Pool:</h4>
              {EVC_MANAGEMENT_DATA.availableExpertsPool.map(exp => (
                <div key={exp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{exp.name}</p>
                    <p className="text-[11px] text-slate-500">{exp.specialization} &bull; {exp.affiliation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-[#159B68] font-bold">
                      {exp.visitsThisCycle}/{exp.maxCapacity} Visits
                    </span>
                    <p className="text-[10px] text-[#159B68] font-bold mt-0.5">COI Clearance 100%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setOptimizerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#102A56] hover:bg-[#1769E0] text-white text-xs font-bold"
              >
                Apply Suggested Committee Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

