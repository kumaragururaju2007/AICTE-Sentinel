import React, { useState } from 'react'
import {
  TrendingUp, AlertTriangle, Clock, Sparkles, ShieldAlert,
  ArrowRight, Users, CheckCircle2, ChevronRight, BarChart2,
  Cpu, Sliders, RefreshCw
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { BOTTLENECK_ALERTS } from '../../data/officerMockData'

export default function BottleneckEngine({ onNavigateToSimulation }) {
  const [alerts, setAlerts] = useState([
    ...BOTTLENECK_ALERTS,
    {
      id: 'BTN-03',
      severity: 'CRITICAL',
      title: 'SLA Breach Risk (6 Applications)',
      description: '6 applications in Scrutiny stage will breach statutory 14-day APH limit within next 72 hours unless processed.',
      reason: 'Surge of EoA applications from Western Maharashtra region received on deadline closing day.',
      recommendedAction: 'Trigger emergency Scrutiny Taskforce and delegate review to secondary officer panel.'
    },
    {
      id: 'BTN-04',
      severity: 'MEDIUM',
      title: 'Structural Stability Certificate Renewal Lag',
      description: 'Institutions submitting PWD fitness certificates without registered structural engineer endorsement.',
      reason: 'Ambiguity in local municipal vs state PWD empanelment lists.',
      recommendedAction: 'Auto-dispatch standard advisory checklist to all 28 Western region polytechnics.'
    }
  ])

  const [appliedAction, setAppliedAction] = useState(null)

  const handleApplyRecommendation = (btnId, title) => {
    setAppliedAction(`Recommendation for "${title}" dispatched to Regional Director & System Coordinator.`)
    setTimeout(() => setAppliedAction(null), 4000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Intelligence &amp; Bottleneck Engine"
        subtitle="Predictive AI pipeline diagnostics, delay risk modeling &amp; automated root-cause mitigation"
        badgeText="AI Engine Online &bull; 99.4% Uptime"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Intelligence & Bottlenecks']}
        actions={
          onNavigateToSimulation && (
            <button
              onClick={onNavigateToSimulation}
              className="px-4 py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" /> Launch What-If Simulator
            </button>
          )
        }
      />

      {appliedAction && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{appliedAction}</span>
          </div>
          <button onClick={() => setAppliedAction(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Critical Bottlenecks</span>
          <p className="text-2xl font-extrabold text-[#EF4444] mt-1">1</p>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Immediate action required</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Moderate Friction</span>
          <p className="text-2xl font-extrabold text-[#F59E0B] mt-1">3</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Under monitoring</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Average Stage Delay</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">2.4 Days</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↓ 18% vs last cycle</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Prediction Accuracy</span>
          <p className="text-2xl font-extrabold text-[#1E6DEB] mt-1">94.8%</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Calibrated on 12,000+ EoAs</span>
        </div>
      </div>

      {/* Detailed Bottleneck Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Detected Bottlenecks &amp; Prescriptive AI Actions ({alerts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map(b => {
            const isCritical = b.severity === 'CRITICAL' || b.severity === 'HIGH'
            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border bg-white shadow-xs space-y-4 flex flex-col justify-between ${
                  isCritical ? 'border-rose-200' : 'border-amber-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">{b.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                      isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.severity} PRIORITY
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <span className="font-bold text-slate-800 block text-[11px]">Underlying Root Cause:</span>
                    <p className="text-slate-600 mt-0.5">{b.reason}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#1E6DEB]" /> AI Prescriptive Action:
                    </span>
                    <p className="text-blue-950 font-medium leading-relaxed">{b.recommendedAction}</p>
                  </div>

                  <button
                    onClick={() => handleApplyRecommendation(b.id, b.title)}
                    className="w-full py-2 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Execute Prescriptive Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

