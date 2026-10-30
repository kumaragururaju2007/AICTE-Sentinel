import React, { useState } from 'react'
import {
  Sliders, FileCode, CheckCircle2, AlertTriangle, Save,
  Plus, Eye, Layers, ArrowRight, ShieldCheck, History, Info
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { WORKFLOW_CONFIGURATIONS } from '../../data/adminMockData'

export default function WorkflowConfiguration() {
  const [workflows, setWorkflows] = useState(WORKFLOW_CONFIGURATIONS)
  const [selectedWfId, setSelectedWfId] = useState(workflows[0]?.workflowId || 'WF-SCRUTINY-EVC-V1')
  const [editorYaml, setEditorYaml] = useState(workflows[0]?.yamlPolicy || '')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saveAlert, setSaveAlert] = useState(false)

  const activeWf = workflows.find(w => w.workflowId === selectedWfId) || workflows[0]

  const handleSelectWf = (wf) => {
    setSelectedWfId(wf.workflowId)
    setEditorYaml(wf.yamlPolicy)
    setSaveAlert(false)
  }

  const handleSaveAndValidate = () => {
    setSaveAlert(true)
    setTimeout(() => setSaveAlert(false), 4000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurable Regulatory Workflow Rules"
        subtitle="Version-controlled approval paths, transition conditions, and Obligation Clock policy parameters"
        badgeText="Approval Process Handbook 2024-25"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Workflow Configuration']}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewOpen(!previewOpen)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {previewOpen ? 'Hide Impact Preview' : 'Preview Affected Cases'}
            </button>
            <button
              onClick={handleSaveAndValidate}
              className="px-4 py-2 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Validate &amp; Request 2-Person Signoff
            </button>
          </div>
        }
      />

      {/* Impact Preview Drawer */}
      {previewOpen && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#102A56] font-bold">
            <Info className="w-4 h-4 text-[#1769E0]" />
            <span>Policy Change Impact Simulation:</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Publishing this configuration affects <strong>12 active applications</strong> currently in Scrutiny.
            Existing obligations created under <strong>v{activeWf.version}</strong> will preserve grandfathered SLA rules unless explicitly migrated by authorized administrative order.
          </p>
        </div>
      )}

      {/* Validation Banner */}
      {saveAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Workflow schema validated successfully! Pending second-person signoff by Member Secretary before activation.</span>
        </div>
      )}

      {/* 2-Column: Left Template Selector (4 cols), Right Workflow Builder & YAML (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registered Workflows */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Registered Route Templates ({workflows.length})
          </h3>

          <div className="space-y-2.5">
            {workflows.map(wf => {
              const isSelected = wf.workflowId === selectedWfId
              return (
                <div
                  key={wf.workflowId}
                  onClick={() => handleSelectWf(wf)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#1769E0] shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#102A56]">{wf.workflowId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-[#1769E0]">
                      v{wf.version}
                    </span>
                  </div>

                  <p className="font-bold text-xs text-slate-900 mt-1">{wf.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{wf.applicationType}</p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="font-bold text-[#159B68]">{wf.routeType}</span>
                    <span>{wf.stages.length} Stages</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Regulatory Rules Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Governance Safeguards</h4>
            <p className="text-slate-500 text-[11px]">&bull; <strong>Mandatory Reason:</strong> Officers must provide APH deficiency clauses when rejecting or reverting applications.</p>
            <p className="text-slate-500 text-[11px]">&bull; <strong>Two-Person Approval:</strong> Workflow authors cannot approve their own rule changes.</p>
            <p className="text-slate-500 text-[11px]">&bull; <strong>Grandfathering:</strong> In-flight cases keep the policy version they were submitted under.</p>
          </div>
        </div>

        {/* Right Column: Stage Sequence & YAML Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            {/* Template Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1769E0]">{activeWf.workflowId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">v{activeWf.version}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700">{activeWf.routeType}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeWf.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Effective: <strong>{activeWf.effectiveFrom}</strong> to <strong>{activeWf.effectiveTo}</strong> &bull; Signoff: {activeWf.approvedBy}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#159B68] border border-emerald-300 text-xs font-bold">
                {activeWf.publishedStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Visual Stage Sequence Pipeline */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configured Stage Lifecycle ({activeWf.stages.length} Steps)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeWf.stages.map((stage, idx) => (
                  <div key={stage.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-mono text-[10px] font-bold text-[#1769E0]">Step {idx + 1}</span>
                    <p className="font-bold text-slate-900 line-clamp-1">{stage.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{stage.ownerRole}</span>
                      <span className="font-mono font-bold text-slate-700">{stage.deadlineDays}d SLA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YAML Editor Area */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  YAML Workflow &amp; SLA Rule Schema
                </h4>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Schema Validated</span>
              </div>

              <textarea
                rows={10}
                value={editorYaml}
                onChange={e => setEditorYaml(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1769E0] leading-relaxed shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

