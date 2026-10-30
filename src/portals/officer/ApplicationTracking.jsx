import React, { useState } from 'react'
import {
  GitBranch, Search, Filter, CheckCircle2, Clock, AlertTriangle,
  Building2, ArrowRight, Eye, ChevronRight, FileText, Calendar,
  Shield, Check, UserCheck, Layers, RefreshCw
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { ASSIGNED_APPLICATIONS_LIST } from '../../data/officerMockData'

export default function ApplicationTracking({ onSelectApp, onNavigateToScrutiny }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('ALL')
  const [selectedApp, setSelectedApp] = useState(ASSIGNED_APPLICATIONS_LIST[0])

  const stages = [
    { key: 'ALL', label: 'All Stages' },
    { key: 'SCRUTINY', label: 'Scrutiny' },
    { key: 'DEFICIENCY', label: 'Deficiency' },
    { key: 'EVC', label: 'EVC Inspection' },
    { key: 'SAC_REVIEW', label: 'Committee Review' },
    { key: 'APPROVED', label: 'Final Decision' }
  ]

  const filteredApps = ASSIGNED_APPLICATIONS_LIST.filter(app => {
    const matchSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.district.toLowerCase().includes(searchTerm.toLowerCase())
    const curStage = (app.stageKey || '').toUpperCase()
    const matchStage = stageFilter === 'ALL' || curStage === stageFilter ||
      (stageFilter === 'SCRUTINY' && curStage.includes('SCRUTINY')) ||
      (stageFilter === 'DEFICIENCY' && curStage.includes('DEFIC')) ||
      (stageFilter === 'EVC' && curStage.includes('EVC'))
    return matchSearch && matchStage
  })

  const currentStageKey = (selectedApp.stageKey || '').toUpperCase()

  const stageMilestones = [
    { id: 1, name: 'Application Ingestion', status: 'completed', date: '10 Nov 2025', actor: 'Automated Ingestion Engine' },
    {
      id: 2,
      name: 'Document Scrutiny',
      status: currentStageKey.includes('SCRUTINY') ? 'current' : 'completed',
      date: '18 Nov 2025',
      actor: 'Dr. Rajesh Kumar (SSO)'
    },
    {
      id: 3,
      name: 'Deficiency Clarification',
      status: currentStageKey.includes('DEFIC') ? 'current' : currentStageKey.includes('SCRUTINY') ? 'pending' : 'completed',
      date: currentStageKey.includes('DEFIC') ? '22 Nov 2025 (In Progress)' : '20 Nov 2025',
      actor: 'Regional Scrutiny Panel'
    },
    {
      id: 4,
      name: 'EVC Physical Inspection',
      status: currentStageKey.includes('EVC') ? 'current' : (currentStageKey.includes('SCRUTINY') || currentStageKey.includes('DEFIC')) ? 'pending' : 'completed',
      date: currentStageKey.includes('EVC') ? 'Pending Committee Visit' : '28 Nov 2025',
      actor: 'Western Bureau EVC Panel #4'
    },
    {
      id: 5,
      name: 'SAC / SHC Review',
      status: currentStageKey.includes('SAC') ? 'current' : ['APPROVED'].includes(currentStageKey) ? 'completed' : 'pending',
      date: 'Expected 05 Dec 2025',
      actor: 'Standing Hearing Committee'
    },
    {
      id: 6,
      name: 'Final EoA Decision',
      status: currentStageKey === 'APPROVED' ? 'completed' : 'pending',
      date: 'Expected 15 Dec 2025',
      actor: 'Competent Approval Authority'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Stage & SLA Lifecycle Tracking"
        subtitle="End-to-end transparent monitoring of statutory approval stages, SLA timers, and escalation triggers"
        badgeText={`${ASSIGNED_APPLICATIONS_LIST.length} Active Tracks`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Application Tracking']}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, institution, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {stages.map(st => (
            <button
              key={st.key}
              onClick={() => setStageFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                stageFilter === st.key
                  ? 'bg-[#1E6DEB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Layout: Master Application List & Detailed Stage Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications list */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Applications ({filteredApps.length})
          </p>
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredApps.map(app => {
              const isSelected = selectedApp.id === app.id
              const daysLeft = app.daysLeft !== undefined ? app.daysLeft : (app.slaRemainingDays ?? 6)
              const daysInStage = app.daysInStage !== undefined ? app.daysInStage : Math.max(1, 14 - daysLeft)
              const isSlaRisk = daysLeft <= 3

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/60 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E6DEB]">{app.id}</span>
                    <StatusBadge status={app.stageKey || 'scrutiny'} size="xs" />
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{app.institutionName}</h4>
                  <p className="text-[11px] text-slate-500">{app.courseType} &bull; {app.district}</p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {daysInStage} days in stage
                    </span>
                    <span className={`font-mono font-bold ${isSlaRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isSlaRisk ? `⚠️ SLA: ${daysLeft}d left` : `SLA: ${daysLeft}d left`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Deep Stage Timeline & Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E6DEB]">{selectedApp.id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-mono text-slate-500">PID: {selectedApp.permanentId}</span>
                  <StatusBadge status={selectedApp.stageKey || 'scrutiny'} size="xs" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedApp.institutionName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedApp.courseType} &bull; {selectedApp.district}, {selectedApp.region}</p>
              </div>

              {onNavigateToScrutiny && (
                <button
                  onClick={() => onNavigateToScrutiny(selectedApp.id)}
                  className="px-4 py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" /> Open Scrutiny
                </button>
              )}
            </div>

            {/* Stage Progress Bar Overview */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Approval Lifecycle Progression</span>
                <span className="text-[#1E6DEB]">{currentStageKey === 'APPROVED' ? '100% Completed' : '65% Complete'}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#1E6DEB] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: currentStageKey === 'APPROVED' ? '100%' : '65%' }}
                />
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Milestone Progress &amp; Audit Timestamps
              </h4>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {stageMilestones.map((st) => {
                  const isDone = st.status === 'completed'
                  const isCur = st.status === 'current'
                  return (
                    <div key={st.id} className="relative group">
                      {/* Milestone Icon */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                          isDone
                            ? 'bg-[#159B68] text-white'
                            : isCur
                            ? 'bg-[#1E6DEB] text-white animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-slate-900">{st.name}</h5>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                            isDone
                              ? 'bg-emerald-100 text-[#159B68]'
                              : isCur
                              ? 'bg-blue-100 text-[#1E6DEB]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {st.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>Handled by: <strong className="text-slate-700">{st.actor}</strong></span>
                          <span className="font-mono text-slate-400">{st.date}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SLA Alert Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">APH 2024-25 Statutory SLA Guardrail</p>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Western Bureau Regional Scrutiny deadline is capped at 14 business days. AICTE Sentinel SLA engine alerts regional coordinators 72 hours before automatic escalation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
