import React, { useState } from 'react'
import {
  FileText, CheckCircle2, AlertTriangle, XCircle, ShieldCheck,
  Eye, Download, FileSearch, ArrowRight, Sparkles, Building2,
  Calendar, Award, Info, Check, X, ShieldAlert, FileCode
} from 'lucide-react'
import { SCRUTINY_DOCUMENTS, ASSIGNED_APPLICATIONS } from '../shared/sentinelData'

export default function ApplicationScrutiny({ appId = 'AICTE-2024-00145', onBack, onRaiseDeficiency }) {
  const application = ASSIGNED_APPLICATIONS.find(a => a.id === appId) || ASSIGNED_APPLICATIONS[0]
  const [docList, setDocList] = useState(SCRUTINY_DOCUMENTS[appId] || SCRUTINY_DOCUMENTS['AICTE-2024-00145'])
  const [selectedDocId, setSelectedDocId] = useState(docList[0]?.doc_id || 'DOC-101')
  const [officerNoteInput, setOfficerNoteInput] = useState('')
  const [evidencePackGenerated, setEvidencePackGenerated] = useState(false)

  const activeDoc = docList.find(d => d.doc_id === selectedDocId) || docList[0]

  // Action handlers
  const handleVerifyDoc = () => {
    setDocList(prev => prev.map(d => {
      if (d.doc_id === selectedDocId) {
        return {
          ...d,
          verification_status: 'VERIFIED',
          flag_reasons: [],
          officer_notes: officerNoteInput || 'Verified as compliant by Scrutiny Officer.'
        }
      }
      return d
    }))
    setOfficerNoteInput('')
  }

  const handleFlagMismatch = () => {
    setDocList(prev => prev.map(d => {
      if (d.doc_id === selectedDocId) {
        return {
          ...d,
          verification_status: 'FLAGGED_MISMATCH',
          officer_notes: officerNoteInput || 'Flagged for statutory mismatch against APH guidelines.'
        }
      }
      return d
    }))
    setOfficerNoteInput('')
  }

  const handleGenerateEvidencePack = () => {
    setEvidencePackGenerated(true)
    setTimeout(() => {
      alert(`Digital Evidence Pack for ${appId} compiled with SHA-256 audit-chain validation.\nFile: AICTE-SENTINEL-EVIDENCE-${appId}.pdf`)
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Applications Queue
            </button>
            <span>/</span>
            <span className="font-mono text-indigo-600">{appId}</span>
            <span>/</span>
            <span>Document Scrutiny Desk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{application.institutionName}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              application.riskLevel === 'CRITICAL' || application.riskLevel === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              Risk: {application.riskScore}/100
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateEvidencePack}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            {evidencePackGenerated ? 'Evidence Pack Ready (PDF)' : 'Generate Evidence Pack'}
          </button>
          <button
            onClick={() => onRaiseDeficiency && onRaiseDeficiency(appId, activeDoc)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Raise Deficiency Ticket
          </button>
        </div>
      </div>

      {/* Main Scrutiny Layout: Document Selector on Left, Comparison in Center/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Checklist Sidebar (3 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Mandatory Statutory Documents ({docList.length})
          </h2>

          <div className="space-y-2">
            {docList.map((doc) => {
              const isSelected = doc.doc_id === selectedDocId
              return (
                <div
                  key={doc.doc_id}
                  onClick={() => setSelectedDocId(doc.doc_id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                      {doc.name}
                    </span>
                    {doc.verification_status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : doc.verification_status === 'FLAGGED_MISMATCH' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 font-mono">{doc.file_name}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                    <span className="text-slate-400">{doc.category}</span>
                    <span className={`font-bold ${
                      doc.verification_status === 'VERIFIED' ? 'text-emerald-600' :
                      doc.verification_status === 'FLAGGED_MISMATCH' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {doc.verification_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Scrutiny Progress Meter */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Scrutiny Completion</span>
              <span className="text-indigo-600 font-bold">
                {Math.round((docList.filter(d => d.verification_status === 'VERIFIED').length / docList.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{
                  width: `${(docList.filter(d => d.verification_status === 'VERIFIED').length / docList.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Center / Right: Side-by-Side Comparison Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600">{activeDoc.doc_id}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDoc.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Uploaded: {activeDoc.upload_date} &bull; Size: {activeDoc.file_size}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${
                  activeDoc.verification_status === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeDoc.verification_status === 'FLAGGED_MISMATCH'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {activeDoc.verification_status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {activeDoc.verification_status === 'FLAGGED_MISMATCH' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {activeDoc.verification_status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* AI Flag Alert Box (if discrepancies exist) */}
            {activeDoc.flag_reasons.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Statutory Discrepancy Flagged by OCR Cross-Check:</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-rose-700 dark:text-rose-400 space-y-1">
                  {activeDoc.flag_reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: OCR Extracted Fields */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Candidate OCR Extractions
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold">
                    Conf: {activeDoc.extracted_ocr.confidence_score || '92.4'}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Extracted via PaddleOCR engine. Highlighted for officer human-in-the-loop validation.
                </p>

                <div className="space-y-2.5 pt-2 text-xs">
                  {Object.entries(activeDoc.extracted_ocr).map(([key, val]) => {
                    if (key === 'confidence_score' || key === 'qr_code_verified') return null
                    const isMismatch = activeDoc.flag_reasons.length > 0 && (key.includes('area') || key.includes('date') || key.includes('name'))
                    return (
                      <div key={key} className={`p-2 rounded-lg border ${
                        isMismatch
                          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className={`font-mono font-medium ${isMismatch ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                          {String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: AICTE Master Registry Benchmark */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    AICTE Master Registry Data
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Official Reference
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Statutory benchmark from AICTE Approval Process Handbook (APH 2024-25).
                </p>

                <div className="space-y-2.5 pt-2 text-xs">
                  {Object.entries(activeDoc.master_record).map(([key, val]) => {
                    return (
                      <div key={key} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Officer Scrutiny Remarks & Verification Decision */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Officer Scrutiny Remarks / Justification
              </label>
              <textarea
                rows={2}
                value={officerNoteInput || activeDoc.officer_notes}
                onChange={e => setOfficerNoteInput(e.target.value)}
                placeholder="Enter remarks, specific clause references, or inspection directives..."
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-400">
                  Logged under Officer ID: <strong>Dr. Rajesh Kumar</strong> (Western Bureau)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFlagMismatch}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Flag Statutory Mismatch
                  </button>

                  <button
                    onClick={handleVerifyDoc}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Verify &amp; Accept Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
