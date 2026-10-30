import React, { useState } from 'react'
import {
  Calendar, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  UserCheck, Users, Sparkles, Building2, MapPin, Check, X,
  FileCheck, Video, HelpCircle, ArrowRight
} from 'lucide-react'
import { EVC_ROSTER_DATA, AVAILABLE_EXPERTS } from '../shared/sentinelData'

export default function EVCScheduling({ onBack }) {
  const [roster, setRoster] = useState(EVC_ROSTER_DATA)
  const [selectedEvcId, setSelectedEvcId] = useState(roster[0]?.evc_id || 'EVC-2026-901')
  const [showOptimizerModal, setShowOptimizerModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('2026-11-16')

  const activeEvc = roster.find(r => r.evc_id === selectedEvcId) || roster[0]

  // Confirm schedule handler
  const handleConfirmSchedule = (evcId) => {
    setRoster(prev => prev.map(item => {
      if (item.evc_id === evcId) {
        return {
          ...item,
          status: 'CONFIRMED',
          confirmed_date: item.proposed_date,
          coordinator_notes: 'Schedule confirmed by EVC Coordinator. Official orders dispatched.'
        }
      }
      return item
    }))
  }

  // Toggle checklist item
  const handleToggleChecklist = (field) => {
    setRoster(prev => prev.map(item => {
      if (item.evc_id === selectedEvcId) {
        return {
          ...item,
          checklist_status: {
            ...item.checklist_status,
            [field]: !item.checklist_status[field]
          }
        }
      }
      return item
    }))
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Dashboard
            </button>
            <span>/</span>
            <span>EVC Queue &amp; Scheduling Optimizer</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Expert Visit Committee (EVC) Logistics &amp; Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent constraint-based committee matching, conflict-of-interest clearance, and onsite inspection tracking.
          </p>
        </div>

        <button
          onClick={() => setShowOptimizerModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Run Committee Optimizer
        </button>
      </div>

      {/* Main 2-Col Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: EVC Caseload Pipeline (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Scheduled EVC Inspections ({roster.length})
          </h2>

          <div className="space-y-2">
            {roster.map(item => {
              const isSelected = item.evc_id === selectedEvcId
              return (
                <div
                  key={item.evc_id}
                  onClick={() => setSelectedEvcId(item.evc_id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {item.evc_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'PROPOSED' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {item.institution_name}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.address}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <span className="text-slate-400 font-medium">
                      Date: {item.confirmed_date || item.proposed_date}
                    </span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      COI Cleared
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Committee Capacity Widget */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Regional Expert Capacity
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Western Bureau Empanelled</span>
                  <span className="font-bold text-indigo-600">8 / 12 Slots Booked</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Northern Bureau Empanelled</span>
                  <span className="font-bold text-emerald-600">5 / 10 Slots Booked</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed EVC Inspection View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600">{activeEvc.evc_id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-500 font-mono">{activeEvc.application_id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{activeEvc.region} Region</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeEvc.institution_name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeEvc.address}
                </p>
              </div>

              {activeEvc.status === 'PROPOSED' ? (
                <button
                  onClick={() => handleConfirmSchedule(activeEvc.evc_id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  Confirm Visit Schedule
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Visit Confirmed
                </span>
              )}
            </div>

            {/* Conflict of Interest Badge Box */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AICTE Automated Conflict-of-Interest (COI) Verification: PASSED</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-6">
                {activeEvc.conflict_notes}
              </p>
            </div>

            {/* Committee Composition */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Empanelled Committee Roster
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeEvc.experts.map(exp => (
                  <div key={exp.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{exp.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold">
                        {exp.role}
                      </span>
                    </div>
                    <p className="text-slate-500">{exp.specialization}</p>
                    <p className="text-slate-400 font-mono text-[11px]">{exp.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Onsite Inspection Statutory Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                Onsite Physical Verification Checklist (APH 2024-25)
              </h3>

              <div className="space-y-2">
                {[
                  { key: 'laboratories_verified', label: 'Computer & Hardware Labs Verified against intake curriculum' },
                  { key: 'faculty_biometric_checked', label: 'Faculty biometric attendance & cadre credentials matched' },
                  { key: 'library_volumes_audited', label: 'Library titles, e-journals subscription and reading hall audited' },
                  { key: 'hostel_safety_cleared', label: 'Hostel, barrier-free ramps and CCTV surveillance verified' },
                  { key: 'video_recording_uploaded', label: 'Continuous geotagged inspection video uploaded to portal' }
                ].map(item => {
                  const isChecked = activeEvc.checklist_status[item.key]
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleChecklist(item.key)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer hover:bg-indigo-50/50 transition-colors"
                    >
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.label}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
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
      {showOptimizerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Constraint-Based EVC Roster Optimizer
                </h3>
              </div>
              <button onClick={() => setShowOptimizerModal(false)} className="text-slate-400 font-bold">&times;</button>
            </div>

            <p className="text-xs text-slate-500">
              The optimizer solves committee availability, institutional conflict-of-interest distance matrix, and regional capacity constraints.
            </p>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                Top Suggested Experts from Unallocated Pool:
              </h4>

              <div className="space-y-2">
                {AVAILABLE_EXPERTS.map(exp => (
                  <div key={exp.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{exp.name}</p>
                      <p className="text-[11px] text-slate-500">{exp.specialization} &bull; {exp.affiliation}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {exp.visits_this_cycle}/{exp.max_capacity} Visits
                      </span>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">COI Clearance 100%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowOptimizerModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Apply Selected Committee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
