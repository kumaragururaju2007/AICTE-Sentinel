import React, { useState } from 'react'
import {
  Sliders, Sparkles, TrendingUp, Users, Clock, AlertTriangle,
  CheckCircle2, ArrowRight, RotateCcw, Cpu, BarChart2, Shield
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function WhatIfSimulation() {
  const [extraStaff, setExtraStaff] = useState(5)
  const [evcPanels, setEvcPanels] = useState(3)
  const [surgePercent, setSurgePercent] = useState(20)
  const [slaWindow, setSlaWindow] = useState(14)
  const [scenarioApplied, setScenarioApplied] = useState(false)

  // Simulation calculations based on sliders
  const baselineDays = 22.4
  const daysSaved = Math.min(12, Number((extraStaff * 0.9 + evcPanels * 1.2 - surgePercent * 0.1).toFixed(1)))
  const simulatedDays = Math.max(7.5, Number((baselineDays - daysSaved).toFixed(1)))
  const slaBreachProb = Math.max(2, Math.round(32 - extraStaff * 4 - evcPanels * 3 + surgePercent * 0.4))
  const queueClearanceDays = Math.max(3, Math.round(18 - evcPanels * 3 - extraStaff * 0.8))

  const handleReset = () => {
    setExtraStaff(5)
    setEvcPanels(3)
    setSurgePercent(20)
    setSlaWindow(14)
    setScenarioApplied(false)
  }

  const handleApplyScenario = () => {
    setScenarioApplied(true)
    setTimeout(() => setScenarioApplied(false), 4500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="What-If Simulation &amp; Dynamic Capacity Modeling"
        subtitle="Simulate staffing allocations, committee surge capacities, deadline shifts and forecast approval turnaround times"
        badgeText="Simulation Engine Ready"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'What-If Simulation']}
      />

      {scenarioApplied && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Simulated operating parameters successfully committed to Western Bureau Roster Manager.</span>
          </div>
          <button onClick={() => setScenarioApplied(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Main Grid: Control Sliders on Left, Live Projections on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1E6DEB]" /> Operational Scenario Variables
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Slider 1: Extra Scrutiny Officers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Auxiliary Scrutiny Officers Empanelled</span>
              <span className="font-mono text-[#1E6DEB] font-bold text-sm">+{extraStaff} Officers</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={extraStaff}
              onChange={e => setExtraStaff(Number(e.target.value))}
              className="w-full accent-[#1E6DEB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Baseline)</span>
              <span>+7</span>
              <span>+15 (Max surge)</span>
            </div>
          </div>

          {/* Slider 2: EVC Cross-Regional Panels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Cross-Regional EVC Committee Allocation</span>
              <span className="font-mono text-[#7738E8] font-bold text-sm">+{evcPanels} Panels</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={evcPanels}
              onChange={e => setEvcPanels(Number(e.target.value))}
              className="w-full accent-[#7738E8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 Panels</span>
              <span>+4 Panels</span>
              <span>+8 Panels</span>
            </div>
          </div>

          {/* Slider 3: Application Surge Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Projected Application Inflow Surge</span>
              <span className="font-mono text-[#F59E0B] font-bold text-sm">+{surgePercent}% Surge</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={surgePercent}
              onChange={e => setSurgePercent(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Normal)</span>
              <span>+50%</span>
              <span>+100% (Closing Day Surge)</span>
            </div>
          </div>

          {/* Slider 4: Statutory SLA Target */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Target Scrutiny SLA Window</span>
              <span className="font-mono text-slate-900 font-bold text-sm">{slaWindow} Business Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="21"
              value={slaWindow}
              onChange={e => setSlaWindow(Number(e.target.value))}
              className="w-full accent-[#102A56] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>7 Days (Express)</span>
              <span>14 Days (Standard)</span>
              <span>21 Days (Relaxed)</span>
            </div>
          </div>
        </div>

        {/* Projections Box on Right */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Projected Regulatory Velocity Impact
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                Live Model
              </span>
            </div>

            {/* Turnaround Time Comparison */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Average End-to-End Approval Cycle:</span>
                <span className="text-xs font-bold text-slate-400 line-through">{baselineDays} Days</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#159B68]">{simulatedDays} Days</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  ↓ {Math.round(((baselineDays - simulatedDays) / baselineDays) * 100)}% Acceleration
                </span>
              </div>
            </div>

            {/* Risk & Queue Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-slate-500 block text-[11px]">SLA Breach Probability</span>
                <p className="text-2xl font-bold text-blue-900 mt-1">{slaBreachProb}%</p>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Down from 32%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="text-slate-500 block text-[11px]">EVC Queue Clearance</span>
                <p className="text-2xl font-bold text-purple-900 mt-1">{queueClearanceDays} Days</p>
                <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">Down from 18 days</span>
              </div>
            </div>

            {/* AI Strategic Advisory */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">AI Recommendation:</strong>
              Empanelling <strong>{extraStaff} auxiliary officers</strong> and requesting <strong>{evcPanels} EVC cross-transfers</strong> absorbs the projected {surgePercent}% surge with negligible overtime cost.
            </div>
          </div>

          <button
            onClick={handleApplyScenario}
            className="w-full py-2.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Deploy Simulated Configuration to Active Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

