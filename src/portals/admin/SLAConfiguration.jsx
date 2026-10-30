import React, { useState } from 'react'
import {
  Clock, Shield, AlertTriangle, Calendar, CheckCircle2,
  Sliders, Save, RotateCcw, ArrowRight, Play, Check,
  Layers, Users, Bell, FileText, HelpCircle, ChevronRight,
  Info, ExternalLink
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { SLA_REMINDER_LADDER, WORKFLOW_CONFIGURATIONS } from '../../data/adminMockData'

// Default statutory SLA streams under AICTE Approval Process Handbook (APH 2026-27)
const INITIAL_STREAMS = [
  {
    id: 'eoa',
    name: 'Extension of Approval (EoA)',
    sub: 'Standard annual re-validation for existing technical institutes',
    totalDays: 30,
    category: 'Fast-Track Desk Scrutiny',
    status: 'ACTIVE_PUBLISHED',
    stages: [
      { id: 'ingestion', name: 'Application Ingestion & AI Verification', days: 2, role: 'SYSTEM_AUTOMATION' },
      { id: 'scrutiny', name: 'Document Scrutiny Desk', days: 10, role: 'REGIONAL_OFFICER' },
      { id: 'deficiency', name: 'Deficiency Correction Window', days: 8, role: 'APPLYING_INSTITUTION' },
      { id: 'committee', name: 'Standing Hearing / Bureau Review', days: 6, role: 'BUREAU_OFFICER' },
      { id: 'dispatch', name: 'Executive Approval & EoA Letter Dispatch', days: 4, role: 'COMPETENT_AUTHORITY' }
    ]
  },
  {
    id: 'new_inst',
    name: 'Establishment of New Technical Institute',
    sub: 'Comprehensive verification including physical EVC inspection & land verification',
    totalDays: 60,
    category: 'Full Physical & Legal Scrutiny',
    status: 'ACTIVE_PUBLISHED',
    stages: [
      { id: 'ingestion', name: 'Application Ingestion & Payment Validation', days: 3, role: 'SYSTEM_AUTOMATION' },
      { id: 'scrutiny', name: 'Preliminary Document Scrutiny', days: 15, role: 'REGIONAL_OFFICER' },
      { id: 'deficiency', name: 'Deficiency Resolution Window', days: 10, role: 'APPLYING_INSTITUTION' },
      { id: 'evc', name: 'Expert Visit Committee (EVC) Physical Audit', days: 18, role: 'EVC_COORDINATOR' },
      { id: 'sac', name: 'Standing Appellate Committee Hearing', days: 8, role: 'BUREAU_OFFICER' },
      { id: 'dispatch', name: 'Council Final Order & LoI/LoA Issuance', days: 6, role: 'COMPETENT_AUTHORITY' }
    ]
  },
  {
    id: 'intake_expansion',
    name: 'Increase in Intake / Additional Course Programs',
    sub: 'Scrutiny of faculty cadre ratio, lab infrastructure & NBA eligibility',
    totalDays: 45,
    category: 'Academic Cadre & Infrastructure Audit',
    status: 'ACTIVE_PUBLISHED',
    stages: [
      { id: 'ingestion', name: 'Application Ingestion', days: 2, role: 'SYSTEM_AUTOMATION' },
      { id: 'scrutiny', name: 'Cadre Ratio & Lab Scrutiny', days: 14, role: 'REGIONAL_OFFICER' },
      { id: 'deficiency', name: 'Clarification & Document Upload', days: 10, role: 'APPLYING_INSTITUTION' },
      { id: 'evc', name: 'Targeted Lab / Faculty Verification', days: 12, role: 'EVC_COORDINATOR' },
      { id: 'dispatch', name: 'Final Decision & Intake Amendment Letter', days: 7, role: 'COMPETENT_AUTHORITY' }
    ]
  },
  {
    id: 'relocation',
    name: 'Institutional Relocation / Site Alteration',
    sub: 'Land title validation, municipal Master Plan compliance & NOC audit',
    totalDays: 45,
    category: 'Legal & Municipal Audit',
    status: 'ACTIVE_PUBLISHED',
    stages: [
      { id: 'ingestion', name: 'Application Ingestion', days: 3, role: 'SYSTEM_AUTOMATION' },
      { id: 'scrutiny', name: 'Revenue & Land Title Legal Scrutiny', days: 15, role: 'REGIONAL_OFFICER' },
      { id: 'deficiency', name: 'Survey Document Corrections', days: 10, role: 'APPLYING_INSTITUTION' },
      { id: 'evc', name: 'New Site Physical Demarcation EVC', days: 12, role: 'EVC_COORDINATOR' },
      { id: 'dispatch', name: 'Final Order for Change of Site', days: 5, role: 'COMPETENT_AUTHORITY' }
    ]
  }
]

export default function SLAConfiguration() {
  const [streams, setStreams] = useState(INITIAL_STREAMS)
  const [selectedStreamId, setSelectedStreamId] = useState('eoa')
  const [ladder, setLadder] = useState(SLA_REMINDER_LADDER)
  const [toastMessage, setToastMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('stages') // 'stages' | 'calendar' | 'ladder' | 'simulator'

  // Business Calendar Rules State
  const [calendarRules, setCalendarRules] = useState({
    excludeHolidays: true,
    excludeSundays: true,
    excludeSecondSaturdays: true,
    pauseClockOnDeficiency: true,
    autoEscalateOnBreach: true,
    gracePeriodDays: 3,
    forceMajeureBuffer: 5
  })

  // SLA Timeline Simulator State
  const [simAppType, setSimAppType] = useState('eoa')
  const [simStartDate, setSimStartDate] = useState('2026-11-02')
  const [simResults, setSimResults] = useState(null)

  const currentStream = streams.find(s => s.id === selectedStreamId) || streams[0]

  // Calculate live total sum for current stream
  const currentTotalCalculated = currentStream.stages.reduce((acc, st) => acc + Number(st.days || 0), 0)

  // Handle stage days change
  const handleStageDaysChange = (stageId, newDays) => {
    const parsed = Math.max(1, parseInt(newDays) || 1)
    setStreams(prev => prev.map(stream => {
      if (stream.id !== selectedStreamId) return stream
      const updatedStages = stream.stages.map(st => st.id === stageId ? { ...st, days: parsed } : st)
      const newTotal = updatedStages.reduce((acc, st) => acc + st.days, 0)
      return {
        ...stream,
        stages: updatedStages,
        totalDays: newTotal
      }
    }))
  }

  // Handle ladder toggle
  const handleToggleLadder = (idx) => {
    setLadder(prev => prev.map((item, i) => i === idx ? { ...item, active: !item.active } : item))
  }

  // Handle ladder offset change
  const handleLadderOffsetChange = (idx, newOffset) => {
    const val = parseInt(newOffset) || 0
    setLadder(prev => prev.map((item, i) => i === idx ? { ...item, offsetDays: val } : item))
  }

  // Save SLA Configuration
  const handleSaveConfig = () => {
    setToastMessage(`SLA Policy configuration for "${currentStream.name}" saved and committed to statutory workflow rules.`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Reset to Defaults
  const handleResetDefaults = () => {
    setStreams(INITIAL_STREAMS)
    setLadder(SLA_REMINDER_LADDER)
    setToastMessage('SLA settings successfully reset to AICTE APH 2026-27 statutory benchmarks.')
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Run Milestone Simulator
  const handleRunSimulation = () => {
    const stream = streams.find(s => s.id === simAppType) || streams[0]
    let curDate = new Date(simStartDate)
    const milestones = []

    stream.stages.forEach((st, idx) => {
      const stageStart = new Date(curDate)
      // add business days
      let daysToAdd = st.days
      while (daysToAdd > 0) {
        curDate.setDate(curDate.getDate() + 1)
        const dayOfWeek = curDate.getDay()
        // Skip Sunday (0) and if rule active, Saturday (6)
        if (calendarRules.excludeSundays && dayOfWeek === 0) continue
        if (calendarRules.excludeSecondSaturdays && dayOfWeek === 6) continue
        daysToAdd--
      }
      const stageEnd = new Date(curDate)

      milestones.push({
        order: idx + 1,
        stage: st.name,
        role: st.role,
        durationDays: st.days,
        startDate: stageStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        deadlineDate: stageEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      })
    })

    setSimResults({
      streamName: stream.name,
      totalWorkingDays: stream.totalDays,
      finalCompletionDate: curDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      milestones
    })
  }

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* ── Page Header ── */}
      <PageHeader
        title="Statutory SLA Policy & Approval Clock Configuration"
        subtitle="Configure stage-by-stage service level agreements, business-calendar rules, and automated escalation ladders under AICTE APH 2026-27."
        badgeText="AICTE APH 2026-27 Active"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Obligation Management', 'SLA Configuration']}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Save SLA Rules
            </button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#159B68] text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#159B68] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
        </div>
      )}

      {/* ── Stream Selector Cards ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Select Application Approval Stream</h3>
            <p className="text-xs text-slate-500">Each statutory stream carries an independent legally binding maximum approval duration.</p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-50 text-[#1E6DEB] font-bold">
            {streams.length} Configured Streams
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {streams.map((stream) => {
            const isSelected = stream.id === selectedStreamId
            return (
              <div
                key={stream.id}
                onClick={() => setSelectedStreamId(stream.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                  ? 'bg-blue-50/70 border-[#1E6DEB] shadow-xs ring-1 ring-[#1E6DEB]/50'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-white border border-slate-200 text-slate-700">
                      {stream.category}
                    </span>
                    <span className="text-xs font-extrabold text-[#1E6DEB] font-mono">
                      {stream.totalDays} Days
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{stream.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{stream.sub}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{stream.stages.length} Stages</span>
                  <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-[#1E6DEB]' : 'text-slate-400'}`}>
                    {isSelected ? 'Active Stream' : 'Configure'} &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'stages'
            ? 'bg-[#1E6DEB] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Stage-by-Stage SLA Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'calendar'
            ? 'bg-[#1E6DEB] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Business Calendar &amp; Clock Pausing</span>
        </button>

        <button
          onClick={() => setActiveTab('ladder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'ladder'
            ? 'bg-[#1E6DEB] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Escalation Ladder (T-30 to T+3)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'simulator'
            ? 'bg-[#1E6DEB] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Timeline Simulator</span>
        </button>
      </div>

      {/* ── TAB 1: STAGE-BY-STAGE SLA BREAKDOWN ── */}
      {activeTab === 'stages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">{currentStream.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust allocated working days per statutory stage. Sum of stages updates the cumulative statutory clock.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total SLA Cycle</span>
                <span className="text-lg font-extrabold text-[#1E6DEB] font-mono leading-none">
                  {currentTotalCalculated} Working Days
                </span>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar of Stages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>SLA Budget Allocation Proportion</span>
              <span>100% of cycle ({currentTotalCalculated}d)</span>
            </div>
            <div className="h-4 rounded-full bg-slate-100 flex overflow-hidden border border-slate-200 p-0.5 gap-0.5">
              {currentStream.stages.map((st, i) => {
                const pct = currentTotalCalculated > 0 ? (st.days / currentTotalCalculated) * 100 : 0
                const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500']
                return (
                  <div
                    key={st.id}
                    style={{ width: `${pct}%` }}
                    className={`${colors[i % colors.length]} rounded-sm transition-all relative group flex items-center justify-center text-[9px] text-white font-bold font-mono`}
                    title={`${st.name}: ${st.days} days (${Math.round(pct)}%)`}
                  >
                    {pct > 12 && `${st.days}d`}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stage Editors List */}
          <div className="space-y-3 pt-2">
            {currentStream.stages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E6DEB] flex items-center justify-center font-bold font-mono text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{stage.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        Role: {stage.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Statutory milestone owner responsible for progressing or raising clarification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`days-${stage.id}`} className="text-xs text-slate-600 font-medium whitespace-nowrap">
                      Allocated Working Days:
                    </label>
                    <input
                      id={`days-${stage.id}`}
                      type="number"
                      min="1"
                      max="45"
                      value={stage.days}
                      onChange={(e) => handleStageDaysChange(stage.id, e.target.value)}
                      className="w-18 px-2.5 py-1.5 text-xs font-mono font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6DEB] text-slate-900 shadow-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: BUSINESS CALENDAR RULES ── */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Statutory Business-Calendar Calculation Engine</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify non-working day exclusions and statutory clock freezing rules for legal defensibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rule 1: Central & State Gazetted Holidays */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Exclude National &amp; Gazetted Holidays</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically syncs with the Ministry of Personnel official annual gazette. SLA clocks freeze during official holidays.
                </p>
              </div>
              <input
                type="checkbox"
                checked={calendarRules.excludeHolidays}
                onChange={e => setCalendarRules(p => ({ ...p, excludeHolidays: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6DEB] focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            {/* Rule 2: Sundays & Second Saturdays */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Exclude Sundays &amp; Second Saturdays</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statutory counting counts official government working days exclusively.
                </p>
              </div>
              <input
                type="checkbox"
                checked={calendarRules.excludeSundays}
                onChange={e => setCalendarRules(p => ({ ...p, excludeSundays: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6DEB] focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            {/* Rule 3: Auto-Freeze on Deficiencies */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Freeze Officer Clock on Deficiency Notice</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  When an officer issues a deficiency ticket, the internal officer SLA pauses until the applicant submits compliant evidence.
                </p>
              </div>
              <input
                type="checkbox"
                checked={calendarRules.pauseClockOnDeficiency}
                onChange={e => setCalendarRules(p => ({ ...p, pauseClockOnDeficiency: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6DEB] focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            {/* Rule 4: Automatic Escalation on Breach */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Auto-Escalate Upon Due Date Breach</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Immediately flags application in Regional Supervisor dashboard and generates a Level-1 administrative alert.
                </p>
              </div>
              <input
                type="checkbox"
                checked={calendarRules.autoEscalateOnBreach}
                onChange={e => setCalendarRules(p => ({ ...p, autoEscalateOnBreach: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6DEB] focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label htmlFor="grace-period" className="font-bold text-xs text-slate-900 block">
                Administrative Grace Period (Days)
              </label>
              <p className="text-xs text-slate-500">
                Grace period before a statutory breach triggers punitive escalation to the Member Secretary.
              </p>
              <input
                id="grace-period"
                type="number"
                min="0"
                max="10"
                value={calendarRules.gracePeriodDays}
                onChange={e => setCalendarRules(p => ({ ...p, gracePeriodDays: parseInt(e.target.value) || 0 }))}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label htmlFor="force-majeure" className="font-bold text-xs text-slate-900 block">
                Force Majeure Buffer Window (Days)
              </label>
              <p className="text-xs text-slate-500">
                Extension allowed in cases of state emergency, natural disasters, or severe telecommunication outages.
              </p>
              <input
                id="force-majeure"
                type="number"
                min="0"
                max="30"
                value={calendarRules.forceMajeureBuffer}
                onChange={e => setCalendarRules(p => ({ ...p, forceMajeureBuffer: parseInt(e.target.value) || 0 }))}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ESCALATION LADDER ── */}
      {activeTab === 'ladder' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Multi-Channel SLA Reminder &amp; Escalation Ladder</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated reminders dispatched at statutory intervals relative to deadline (Offset days from due date).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ladder.map((rule, idx) => {
              const isOverdue = rule.trigger.includes('OVERDUE') || rule.trigger.includes('Overdue') || rule.trigger === 'Due Date (T+0)'
              const isUrgent = rule.trigger.includes('T-1') || rule.trigger.includes('T-7')

              return (
                <div
                  key={rule.trigger || idx}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${rule.active ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-200 opacity-60'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${isOverdue ? 'bg-rose-100 text-rose-700' :
                      isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-[#1E6DEB]'
                      }`}>
                      {rule.trigger.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{rule.trigger}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                          Target: {rule.targetRole}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-[#1E6DEB] font-semibold">
                          Channel: {rule.channel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                    <div className="flex items-center gap-1.5">
                      <label htmlFor={`offset-${idx}`} className="text-[11px] text-slate-500 font-medium">Offset Days:</label>
                      <input
                        id={`offset-${idx}`}
                        type="number"
                        value={rule.offsetDays}
                        onChange={(e) => handleLadderOffsetChange(idx, e.target.value)}
                        className="w-14 px-2 py-1 text-xs font-mono font-bold text-center bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <span className={`text-[10px] font-bold uppercase ${rule.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {rule.active ? 'Active' : 'Disabled'}
                    </span>

                    <button
                      onClick={() => handleToggleLadder(idx)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${rule.active ? 'bg-[#159B68]' : 'bg-slate-300'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: SLA TIMELINE SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">SLA Calendar Simulation &amp; Milestone Forecaster</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate exact statutory deadlines for any upcoming application intake date based on current working day configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label htmlFor="sim-stream" className="block text-xs font-bold text-slate-700 mb-1">Approval Stream</label>
              <select
                id="sim-stream"
                value={simAppType}
                onChange={e => setSimAppType(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                {streams.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.totalDays} Days)</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sim-date" className="block text-xs font-bold text-slate-700 mb-1">Simulated Ingestion Date</label>
              <input
                id="sim-date"
                type="date"
                value={simStartDate}
                onChange={e => setSimStartDate(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunSimulation}
                className="w-full py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Calculate Milestone Calendar
              </button>
            </div>
          </div>

          {/* Simulation Results Display */}
          {simResults && (
            <div className="space-y-4 pt-2 animate-fade-in-up">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-[#102A56]">{simResults.streamName}</h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Statutory Cycle: <strong>{simResults.totalWorkingDays} working days</strong> (excluding gazetted holidays &amp; weekends)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-blue-600 uppercase font-bold block">Final Order Statutory Deadline</span>
                  <span className="text-sm font-extrabold text-[#102A56] font-mono">{simResults.finalCompletionDate}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Stage #</th>
                      <th className="py-2.5 px-3">Statutory Milestone Stage</th>
                      <th className="py-2.5 px-3">Assigned Role</th>
                      <th className="py-2.5 px-3">Working Days</th>
                      <th className="py-2.5 px-3">Start Date</th>
                      <th className="py-2.5 px-3">Statutory Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {simResults.milestones.map((m) => (
                      <tr key={m.order} className="hover:bg-slate-50 font-medium">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#1E6DEB]">{m.order}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{m.stage}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {m.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{m.durationDays}d</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">{m.startDate}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold font-mono">{m.deadlineDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

