import React, { useState } from 'react'
import {
  FileText, Download, Edit3, Plus, Search, Filter,
  CheckCircle2, AlertTriangle, Eye, ShieldCheck, Check
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function DocumentTemplates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [templates, setTemplates] = useState([
    {
      id: 'TMP-001',
      title: '30-Year Registered Land Lease Deed Verification Schema',
      category: 'Land & Infrastructure',
      version: 'v4.2',
      clauseRef: 'APH Chapter I, Clause 1.8.2',
      format: 'PDF / OCR Schema',
      downloads: 412,
      lastUpdated: '15 Oct 2026'
    },
    {
      id: 'TMP-002',
      title: 'Statutory Anti-Ragging Affidavit & Supreme Court Undertaking',
      category: 'Statutory Undertakings',
      version: 'v3.0',
      clauseRef: 'AICTE Act 1987 Section 10',
      format: 'e-Stamp Paper Template',
      downloads: 1205,
      lastUpdated: '10 Oct 2026'
    },
    {
      id: 'TMP-003',
      title: 'Joint Fixed Deposit Receipt (FDR) Lien Mandate to AICTE',
      category: 'Financial Reserves',
      version: 'v2.1',
      clauseRef: 'APH Chapter II, Clause 2.16',
      format: 'Bank Lien Letter',
      downloads: 380,
      lastUpdated: '01 Oct 2026'
    },
    {
      id: 'TMP-004',
      title: 'State PWD Structural Stability & Fitness Certificate Format',
      category: 'Civil Infrastructure',
      version: 'v3.5',
      clauseRef: 'National Building Code 2016',
      format: 'PWD Engineer Stamp Form',
      downloads: 650,
      lastUpdated: '20 Sep 2026'
    },
    {
      id: 'TMP-005',
      title: 'Fire Safety & CFO Clearance No-Objection Certificate Checklist',
      category: 'Safety & Hazard Mitigation',
      version: 'v2.8',
      clauseRef: 'Fire Prevention & Life Safety Act',
      format: 'Fire CFO Annexure',
      downloads: 520,
      lastUpdated: '15 Sep 2026'
    }
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory Document Templates &amp; OCR Schemas"
        subtitle="Version-controlled legal affidavit formats, bank lien covenants &amp; automated OCR parsing rules"
        badgeText={`${templates.length} Active Templates`}
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Document Templates']}
        actions={
          <button
            onClick={() => alert('New statutory template editor will open in draft mode.')}
            className="px-4 py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Template
          </button>
        }
      />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tmpl => (
          <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1E6DEB]">{tmpl.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1E6DEB] border border-blue-200 font-mono font-bold">
                  {tmpl.version}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{tmpl.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{tmpl.category} &bull; <strong className="text-slate-700">{tmpl.clauseRef}</strong></p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{tmpl.format} &bull; Updated {tmpl.lastUpdated}</span>
              <button
                onClick={() => alert(`Downloading official AICTE template: ${tmpl.title}`)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

