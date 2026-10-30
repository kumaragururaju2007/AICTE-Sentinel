import React, { useState } from 'react'
import {
  FileText, CheckCircle2, AlertTriangle, Eye, Download, Search,
  Filter, Layers, ShieldCheck, Sparkles, Building2, Check, X,
  ExternalLink, ArrowRight
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'

export default function DocumentVerification() {
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-101',
      title: 'Land Ownership / Registered 30-Year Lease Deed',
      category: 'Land & Infrastructure',
      appId: 'AICTE-2025-00123',
      institutionName: 'Sunrise Engineering College',
      uploadedAt: '15 Nov 2025',
      fileSize: '4.8 MB',
      ocrMatchScore: 98,
      status: 'VERIFIED',
      extracted: {
        'Survey Number': 'Survey 142/2A, Haveli',
        'Area in Acres': '5.20 Acres (Norm: 4.0 Acres)',
        'Lease Validity': '30 Years (Expires 2054)',
        'Sub-Registrar Stamp': 'Verified (Ref: SR-HAV-8912)',
        'Encumbrance Status': 'Nil Encumbrance Certificate Verified'
      },
      flaggedDiscrepancies: []
    },
    {
      id: 'DOC-102',
      title: 'Building Completion & Structural Stability Certificate',
      category: 'Civil Infrastructure',
      appId: 'AICTE-2025-00145',
      institutionName: 'Vidya Institute of Technology',
      uploadedAt: '18 Nov 2025',
      fileSize: '7.2 MB',
      ocrMatchScore: 82,
      status: 'FLAGGED',
      extracted: {
        'Built-up Carpet Area': '14,250 sq.m (Norm: 12,000 sq.m)',
        'Structural Engineer': 'Er. S. N. Joshi (PWD Empanelled #412)',
        'Municipal Occupancy': 'Occupancy Certificate Attached',
        'PWD Fitness Certificate': 'Expired on 15 Oct 2025 (Grace period exceeded)'
      },
      flaggedDiscrepancies: ['PWD Fitness Certificate expired prior to application submission date.']
    },
    {
      id: 'DOC-103',
      title: 'Joint FDR Fixed Deposit Receipt in name of AICTE & Trust',
      category: 'Financial Reserves',
      appId: 'AICTE-2025-00167',
      institutionName: 'Global Polytechnic',
      uploadedAt: '20 Nov 2025',
      fileSize: '2.1 MB',
      ocrMatchScore: 95,
      status: 'VERIFIED',
      extracted: {
        'FDR Amount': '₹ 35,00,000 (Thirty-Five Lakhs)',
        'Bank Name': 'State Bank of India (Main Branch)',
        'Tenure': '8 Years Lien to AICTE (Valid till 2033)',
        'Joint Account Holder': 'Member Secretary, AICTE & Trust Chairman'
      },
      flaggedDiscrepancies: []
    },
    {
      id: 'DOC-104',
      title: 'State Fire & Rescue Services NOC Certificate',
      category: 'Safety & Building',
      appId: 'AICTE-2025-00189',
      institutionName: 'National College of Engineering',
      uploadedAt: '22 Nov 2025',
      fileSize: '3.4 MB',
      ocrMatchScore: 88,
      status: 'PENDING_REVIEW',
      extracted: {
        'Issuing Authority': 'Chief Fire Officer, Pune Municipal Corp',
        'Valid Till': '31 Dec 2026',
        'Hydrant Pressure': '4.5 kg/cm² verified',
        'Evacuation Plan': 'Approved G+3 Floor Plan'
      },
      flaggedDiscrepancies: []
    }
  ])

  const [activeDoc, setActiveDoc] = useState(documents[0])
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [search, setSearch] = useState('')
  const [actionNotice, setActionNotice] = useState(null)

  const handleApprove = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'VERIFIED', flaggedDiscrepancies: [] } : d))
    setActionNotice(`Document ${id} successfully approved by Officer R. Sharma.`)
    setTimeout(() => setActionNotice(null), 3500)
  }

  const handleFlag = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? {
      ...d,
      status: 'FLAGGED',
      flaggedDiscrepancies: ['Flagged by Officer: Missing annexure verification or stamp illegibility.']
    } : d))
    setActionNotice(`Document ${id} flagged with deficiency alert.`)
    setTimeout(() => setActionNotice(null), 3500)
  }

  const filtered = documents.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      d.appId.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'ALL' || d.category === filterCategory
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Repository &amp; AI-OCR Verification Desk"
        subtitle="Automated cross-validation of land deeds, structural stability, financial FDRs and fire NOCs"
        badgeText={`${documents.length} Verification Dossiers`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Document Verification']}
      />

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title, institution..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'Land & Infrastructure', 'Civil Infrastructure', 'Financial Reserves', 'Safety & Building'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-[#1E6DEB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Mandatory Documents ({filtered.length})
          </span>

          <div className="space-y-2.5">
            {filtered.map(doc => {
              const isSelected = activeDoc.id === doc.id
              return (
                <div
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E6DEB]">{doc.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                      doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'FLAGGED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.institutionName}</p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>OCR Score: <strong className="text-blue-600">{doc.ocrMatchScore}%</strong></span>
                    <span>{doc.fileSize} &bull; {doc.uploadedAt}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Detail Panel: AI OCR Extracted vs Master Validation */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E6DEB]">{activeDoc.id}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{activeDoc.appId}</span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-medium text-slate-600">{activeDoc.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeDoc.institutionName}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(activeDoc.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Approve Doc
                </button>
                <button
                  onClick={() => handleFlag(activeDoc.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Raise Deficiency
                </button>
              </div>
            </div>

            {/* OCR Engine Match Pill */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Sparkles className="w-4 h-4 text-[#1E6DEB]" />
                <span>AI Sentinel OCR Confidence Score: <strong className="text-blue-700 font-bold">{activeDoc.ocrMatchScore}% Match</strong></span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                Tesseract v5.3 / LayoutLM
              </span>
            </div>

            {/* Extracted Key-Value Pair Audit Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Metadata vs Regulatory Norms
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {Object.entries(activeDoc.extracted).map(([key, val]) => (
                  <div key={key} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/40">
                    <span className="font-semibold text-slate-700 sm:w-1/3">{key}</span>
                    <span className="font-mono text-slate-900 sm:w-2/3">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discrepancies Alert */}
            {activeDoc.flaggedDiscrepancies.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Statutory Discrepancy Flagged:</span>
                </div>
                <ul className="list-disc pl-5 text-rose-800 space-y-0.5">
                  {activeDoc.flaggedDiscrepancies.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

