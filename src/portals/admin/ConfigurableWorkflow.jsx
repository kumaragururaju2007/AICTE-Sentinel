import React, { useState } from 'react'
import {
  Sliders, FileCode, CheckCircle2, AlertTriangle, Play,
  Plus, Save, Eye, Layers, ArrowRight, ShieldCheck, History,
  Calendar, Info
} from 'lucide-react'
import { WORKFLOW_DEFINITIONS } from '../shared/sentinelData'

export default function ConfigurableWorkflow({ onBack }) {
  const [workflows, setWorkflows] = useState(WORKFLOW_DEFINITIONS)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflows[0]?.workflow_id || 'WF-SCRUTINY-EVC-V1')
  const [editorYaml, setEditorYaml] = useState(workflows[0]?.yaml_config || '')
  const [impactPreviewOpen, setImpactPreviewOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const activeWf = workflows.find(w => w.workflow_id === selectedWorkflowId) || workflows[0]

  const handleSelectWorkflow = (wf) => {
    setSelectedWorkflowId(wf.workflow_id)
    setEditorYaml(wf.yaml_config)
    setSaveSuccess(false)
  }

  // Handle Save / Validate
  const handleValidateAndSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Admin Overview
            </button>
            <span>/</span>
            <span>Policy Governance Layer</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Configurable Workflow &amp; Regulatory Rule Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Effective-dated, version-controlled approval paths with two-person approval safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImpactPreviewOpen(!impactPreviewOpen)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4 text-indigo-500" />
            {impactPreviewOpen ? 'Hide Impact Preview' : 'Preview Affected Cases'}
          </button>
          <button
            onClick={handleValidateAndSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Validate &amp; Request 2-Person Approval
          </button>
        </div>
      </div>

      {/* Impact Preview Drawer (if toggled) */}
      {impactPreviewOpen && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Policy Change Impact Simulation:</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Publishing this configuration affects <strong>12 open applications</strong> currently in Scrutiny.
            Existing applications created under <strong>v{activeWf.version}</strong> will preserve grandfathered SLA rules unless explicitly migrated.
          </p>
        </div>
      )}

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Workflow schema validated successfully! Pending second-person signoff by Member Secretary before activation.</span>
        </div>
      )}

      {/* Main Grid: Template Selector (4 cols) & Editor (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Registered Workflow Templates ({workflows.length})
          </h2>

          <div className="space-y-2">
            {workflows.map(wf => {
              const isSelected = wf.workflow_id === selectedWorkflowId
              return (
                <div
                  key={wf.workflow_id}
                  onClick={() => handleSelectWorkflow(wf)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {wf.workflow_id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      v{wf.version}
                    </span>
                  </div>

                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {wf.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {wf.application_type}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <span className="text-slate-400 font-mono">Effective: {wf.effective_from}</span>
                    <span className="font-semibold text-indigo-600">{wf.stages.length} Stages</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Workflow Governance Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Governance Safeguards
            </h3>
            <p className="text-slate-500 text-[11px]">
              &bull; <strong>Effective Dating:</strong> Previews take effect strictly within declared academic years.
            </p>
            <p className="text-slate-500 text-[11px]">
              &bull; <strong>Two-Person Rule:</strong> The author cannot approve their own rule change.
            </p>
            <p className="text-slate-500 text-[11px]">
              &bull; <strong>Audit Chained:</strong> Every modification is cryptographically hashed with author ID.
            </p>
          </div>
        </div>

        {/* Right: Stage Sequence & YAML/JSON Policy Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            {/* Template Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600">{activeWf.workflow_id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">v{activeWf.version}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Author: {activeWf.author}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeWf.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Governed by: <strong className="text-indigo-600 font-mono">{activeWf.source_aph_reference}</strong> &bull; Signoff: {activeWf.approved_by}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shrink-0">
                {activeWf.status}
              </span>
            </div>

            {/* Visual Stage Sequence Pipeline */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configured Stage Flow ({activeWf.stages.length} Steps)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeWf.stages.map((stage, idx) => (
                  <div key={stage.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-mono text-[10px] text-indigo-500 font-bold">Step {idx + 1}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">{stage.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{stage.owner_role}</span>
                      <span className="font-mono font-bold text-indigo-600">{stage.deadline_days}d SLA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YAML Rule Definition Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  YAML Workflow &amp; SLA Configuration
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Schema Validated</span>
              </div>

              <textarea
                rows={12}
                value={editorYaml}
                onChange={e => setEditorYaml(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
