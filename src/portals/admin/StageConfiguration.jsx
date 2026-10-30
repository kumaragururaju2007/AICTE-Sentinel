import React, { useState } from 'react'
import {
  Sliders, Save, CheckCircle2, Clock, ShieldCheck,
  AlertTriangle, Settings, ArrowRight, Layers, Check
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function StageConfiguration() {
  const [stages, setStages] = useState([
    {
      id: 'STAGE-1',
      name: 'Application Ingestion & Auto-Validation',
      slaDays: 2,
      owner: 'Automated Gateway',
      mandatoryGates: ['PAN/GST Validation', 'Processing Fee Clearance', 'Digital Signature Check'],
      autoEscalateHours: 24,
      active: true
    },
    {
      id: 'STAGE-2',
      name: 'Regional Document Scrutiny Desk',
      slaDays: 14,
      owner: 'Senior Scrutiny Officer',
      mandatoryGates: ['30-Year Lease Deed Stamp', 'State PWD Stability', 'Fire CFO Clearance', 'Joint FDR AICTE Lien'],
      autoEscalateHours: 72,
      active: true
    },
    {
      id: 'STAGE-3',
      name: 'Deficiency & Clarification Remediation',
      slaDays: 10,
      owner: 'Applying Institution Principal',
      mandatoryGates: ['Notarized Compliance Affidavit', 'Fee Penalty Receipt (if applicable)'],
      autoEscalateHours: 48,
      active: true
    },
    {
      id: 'STAGE-4',
      name: 'EVC Physical / Hybrid Inspection',
      slaDays: 14,
      owner: '3-Member Expert Committee',
      mandatoryGates: ['GPS Geofence Match (<15m)', '1080p Tamper-Evident Video Log', 'Divyangjan Ramp RPwD Check'],
      autoEscalateHours: 72,
      active: true
    },
    {
      id: 'STAGE-5',
      name: 'Standing Appeals Committee (SAC/SHC)',
      slaDays: 7,
      owner: 'National Appellate Bureau',
      mandatoryGates: ['Hearing Minutes Recording', 'Quorum Verification (>3 members)'],
      autoEscalateHours: 48,
      active: true
    },
    {
      id: 'STAGE-6',
      name: 'Final Statutory Approval & EoA Issuance',
      slaDays: 5,
      owner: 'Competent Approval Authority',
      mandatoryGates: ['Council Digital Watermark', 'QR Code Verification Seal', 'National Registry Publication'],
      autoEscalateHours: 24,
      active: true
    }
  ])

  const [savedNotice, setSavedNotice] = useState(false)

  const handleSlaChange = (id, newDays) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, slaDays: Number(newDays) } : s))
  }

  const handleSave = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Stage &amp; SLA Guardrail Configuration"
        subtitle="Manage statutory turnaround windows, automated escalation triggers and mandatory scrutiny compliance gates"
        badgeText="Approval Process Handbook 2026-27"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Stage Configuration']}
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </button>
        }
      />

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Updated stage SLAs and gate parameters saved into versioned policy registry.</span>
          </div>
          <button onClick={() => setSavedNotice(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Stages Cards */}
      <div className="space-y-4">
        {stages.map((st, i) => (
          <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#1E6DEB] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Stage ID: {st.id} &bull; Managed by: <strong className="text-slate-600">{st.owner}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#1E6DEB]" />
                  <span className="text-slate-500 font-medium">SLA Limit:</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={st.slaDays}
                    onChange={e => handleSlaChange(st.id, e.target.value)}
                    className="w-12 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-md py-0.5"
                  />
                  <span className="font-semibold text-slate-700">Days</span>
                </div>
              </div>
            </div>

            {/* Mandatory Gates */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mandatory Regulatory Gates:
              </span>
              <div className="flex flex-wrap gap-2">
                {st.mandatoryGates.map((gate, gIdx) => (
                  <span key={gIdx} className="px-3 py-1 rounded-lg bg-blue-50 text-[#1E6DEB] border border-blue-200 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6DEB]" />
                    {gate}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

