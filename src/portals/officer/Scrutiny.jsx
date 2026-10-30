import React, { useState, useEffect } from 'react'
import {
  FileText, CheckCircle2, AlertTriangle, XCircle, ShieldCheck,
  Eye, Download, FileSearch, ArrowRight, Sparkles, Building2,
  Calendar, Check, X, ShieldAlert, ArrowLeft, Send, ChevronDown,
  Clock, RefreshCw
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { SCRUTINY_DETAILS, ASSIGNED_APPLICATIONS_LIST } from '../../data/officerMockData'
import { useApplicationContext } from '../../context/ApplicationContext'

// Comprehensive application database fallback to support all IDs
const FALLBACK_APPLICATION_SCRUTINY = {
  'APP-2024-00145': SCRUTINY_DETAILS['APP-2024-00145'],
  'AICTE-2025-00123': {
    institution: {
      name: 'Sunrise Engineering College',
      permanentId: '1-74891024',
      address: 'Survey 142/2A, Hinjawadi Phase 2, Pune, Maharashtra 411057',
      headOfInstitute: 'Dr. Anand M. Joshi (Director)',
      contactEmail: 'director@sunriseeng.edu.in',
      contactPhone: '+91 20 2589 1100',
      universityAffiliation: 'Savitribai Phule Pune University (SPPU)',
      category: 'Technical Engineering (UG/PG)'
    },
    application: {
      id: 'AICTE-2025-00123',
      type: 'Extension of Approval (EoA)',
      academicYear: '2025-26',
      submittedAt: '2025-10-18 11:30 IST',
      governingWorkflow: 'WF-SCRUTINY-EVC-V1',
      currentStage: 'Document Scrutiny Desk',
      slaDue: '2025-11-28',
      riskScore: 78,
      riskBand: 'HIGH'
    },
    documents: [
      {
        id: 'DOC-101',
        title: 'Land Ownership / Registered 30-Year Lease Deed',
        category: 'Legal & Infrastructure',
        fileName: 'sunrise_30yr_lease_deed_registered.pdf',
        fileSize: '4.8 MB',
        uploadedAt: '2025-10-18 11:35',
        mandatory: true,
        verificationStatus: 'VERIFIED',
        extractedOcr: {
          titleHolder: 'Sunrise Education Foundation',
          surveyNumber: 'Survey 142/2A, Hinjawadi',
          landArea: '5.20 Acres (Norm: 4.0 Acres)',
          leaseValidTill: '2055-03-31',
          registrationNo: 'MH-PN-2015-8912',
          confidenceScore: 98.4
        },
        masterRecord: {
          titleHolder: 'Sunrise Education Foundation',
          surveyNumber: 'Survey 142/2A',
          landArea: '4.0 Acres Minimum',
          leaseValidTill: '30 Years Minimum',
          registrationNo: 'MH-PN-2015-8912'
        },
        flagReasons: [],
        officerRemarks: 'Title deed matches AICTE Gazette land norms. Sub-Registrar stamp verified.'
      },
      {
        id: 'DOC-102',
        title: 'Building Completion & PWD Structural Stability Certificate',
        category: 'Infrastructure',
        fileName: 'structural_stability_pwd_certified.pdf',
        fileSize: '6.1 MB',
        uploadedAt: '2025-10-18 11:40',
        mandatory: true,
        verificationStatus: 'FLAGGED_MISMATCH',
        extractedOcr: {
          engineerName: 'Er. S. N. Joshi (PWD Empanelled #412)',
          builtUpArea: '14,250 sq.m',
          fitnessCertificateExpiry: '2025-10-15 (Grace period exceeded)',
          confidenceScore: 92.1
        },
        masterRecord: {
          engineerName: 'Class-1 PWD Empanelled Engineer',
          builtUpArea: 'Min 12,000 sq.m for 300 intake',
          fitnessCertificateExpiry: 'Must be active on application date'
        },
        flagReasons: [
          'PWD Structural Fitness Certificate expired on 15 Oct 2025 prior to submission.'
        ],
        officerRemarks: 'Expired certificate submitted. Requires updated municipal stability endorsement.'
      },
      {
        id: 'DOC-103',
        title: 'State Fire & Emergency Services NOC Certificate',
        category: 'Safety & Environmental',
        fileName: 'pcmc_fire_clearance_noc_2025.pdf',
        fileSize: '2.4 MB',
        uploadedAt: '2025-10-18 11:45',
        mandatory: true,
        verificationStatus: 'VERIFIED',
        extractedOcr: {
          issuingAuthority: 'Chief Fire Officer, Pune Municipal Corp',
          certificateNo: 'PMC/FIRE/2024/9912',
          validTill: '2026-12-31',
          confidenceScore: 96.8
        },
        masterRecord: {
          issuingAuthority: 'Chief Fire Officer / Competent Authority',
          validTill: 'Must cover academic session 2025-26'
        },
        flagReasons: [],
        officerRemarks: 'Fire NOC verified active and valid through 2026.'
      },
      {
        id: 'DOC-104',
        title: 'Joint FDR Fixed Deposit Receipt (Lien to AICTE)',
        category: 'Financial Reserves',
        fileName: 'sbi_joint_fdr_35lakhs_lien.pdf',
        fileSize: '1.9 MB',
        uploadedAt: '2025-10-18 11:50',
        mandatory: true,
        verificationStatus: 'VERIFIED',
        extractedOcr: {
          bankName: 'State Bank of India (Main Branch, Pune)',
          fdrAmount: '₹ 35,00,000 (Thirty-Five Lakhs)',
          tenure: '8 Years Lien to Member Secretary, AICTE',
          confidenceScore: 99.2
        },
        masterRecord: {
          bankName: 'Scheduled Commercial Bank',
          fdrAmount: '₹ 35 Lakhs Required',
          tenure: '8 Years Minimum Joint Lien'
        },
        flagReasons: [],
        officerRemarks: 'Joint FDR verified with SBI lien certificate.'
      }
    ]
  }
}

export default function Scrutiny({ appId = 'APP-2024-00145', onBack, onNavigateToCompliance }) {
  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  // Active application ID state
  const [currentAppId, setCurrentAppId] = useState(appId)

  useEffect(() => {
    if (appId) {
      setCurrentAppId(appId)
    }
  }, [appId])

  // Resolve application data safely
  const getScrutinyData = (id) => {
    // 1. Check known mock details
    if (FALLBACK_APPLICATION_SCRUTINY[id]) {
      return FALLBACK_APPLICATION_SCRUTINY[id]
    }
    if (SCRUTINY_DETAILS[id]) {
      return SCRUTINY_DETAILS[id]
    }

    // 2. Check context applications or assigned applications
    const foundApp = (appContext?.applications || ASSIGNED_APPLICATIONS_LIST).find(a => a.id === id) ||
      ASSIGNED_APPLICATIONS_LIST[0]

    return {
      institution: {
        name: foundApp.institutionName || 'Apex Institute of Technology & Management',
        permanentId: foundApp.permanentId || '1-43219081',
        address: `${foundApp.district || 'Pune'}, ${foundApp.region || 'Western'} Region`,
        headOfInstitute: 'Dr. Ramesh S. Patil (Principal)',
        contactEmail: 'principal@institution.edu.in',
        contactPhone: '+91 22 2285 5412',
        universityAffiliation: 'State Technical University',
        category: foundApp.courseType || 'Technical Degree (UG/PG)'
      },
      application: {
        id: foundApp.id,
        type: foundApp.applicationType || 'Extension of Approval (EoA)',
        academicYear: foundApp.academicYear || '2025-26',
        submittedAt: foundApp.submissionDate || '2025-10-14 14:20 IST',
        governingWorkflow: 'WF-SCRUTINY-EVC-V1',
        currentStage: foundApp.currentStage || 'Document Scrutiny Desk',
        slaDue: foundApp.dueDate || '2025-11-28',
        riskScore: foundApp.riskScore || 74,
        riskBand: foundApp.priority || 'HIGH'
      },
      documents: FALLBACK_APPLICATION_SCRUTINY['APP-2024-00145']?.documents || []
    }
  }

  const scrutinyData = getScrutinyData(currentAppId)
  const [documents, setDocuments] = useState(scrutinyData.documents)
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 'DOC-101')
  const [officerRemarks, setOfficerRemarks] = useState('')
  const [actionNotice, setActionNotice] = useState(null)

  // Sync documents whenever currentAppId changes
  useEffect(() => {
    const freshData = getScrutinyData(currentAppId)
    setDocuments(freshData.documents)
    setSelectedDocId(freshData.documents[0]?.id || 'DOC-101')
    setOfficerRemarks('')
  }, [currentAppId])

  // Deficiency / Clarification modal state
  const [activeModalAction, setActiveModalAction] = useState(null) // 'DEFICIENCY' | 'CLARIFICATION' | 'FORWARD'
  const [modalReason, setModalReason] = useState('')
  const [clauseRef, setClauseRef] = useState('Chapter II, Clause 2.14.3')

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0] || {
    id: 'DOC-101',
    title: 'Statutory Land Deed',
    category: 'Legal',
    extractedOcr: {},
    masterRecord: {},
    flagReasons: []
  }

  // Mark as verified
  const handleMarkVerified = () => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocId) {
        return {
          ...doc,
          verificationStatus: 'VERIFIED',
          flagReasons: [],
          officerRemarks: officerRemarks || 'Verified as compliant against AICTE APH master record.'
        }
      }
      return doc
    }))
    setActionNotice({ type: 'success', text: `Document "${activeDoc.title}" marked as VERIFIED.` })
    setOfficerRemarks('')
    setTimeout(() => setActionNotice(null), 3500)
  }

  // Handle deficiency or clarification submission
  const handleSubmitAction = (e) => {
    e.preventDefault()
    if (!modalReason.trim()) {
      alert('Mandatory justification remarks are required under AICTE statutory governance.')
      return
    }

    if (activeModalAction === 'DEFICIENCY') {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === selectedDocId) {
          return {
            ...doc,
            verificationStatus: 'FLAGGED_MISMATCH',
            flagReasons: [modalReason],
            officerRemarks: `Deficiency Ticket Issued: ${modalReason} (Clause ${clauseRef})`
          }
        }
        return doc
      }))
      if (appContext && appContext.raiseDeficiency) {
        appContext.raiseDeficiency({
          applicationId: currentAppId,
          title: `Deficiency in ${activeDoc.title}`,
          description: modalReason,
          category: activeDoc.title,
          clauseRef
        })
      }
      setActionNotice({ type: 'warning', text: `Deficiency Ticket issued under ${clauseRef}. Institution notified.` })
    } else if (activeModalAction === 'CLARIFICATION') {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === selectedDocId) {
          return {
            ...doc,
            officerRemarks: `Clarification Requested: ${modalReason}`
          }
        }
        return doc
      }))
      setActionNotice({ type: 'info', text: 'Clarification query dispatched to Institution Principal.' })
    } else if (activeModalAction === 'FORWARD') {
      if (appContext && appContext.updateApplicationStage) {
        appContext.updateApplicationStage(currentAppId, 'EVC / Inspection', 'EVC Scheduled', 'Officer completed scrutiny and recommended EVC committee')
      }
      setActionNotice({ type: 'success', text: 'Application recommended and forwarded to EVC Scheduling Committee.' })
      setTimeout(() => {
        if (onNavigateToCompliance) onNavigateToCompliance()
      }, 1500)
    }

    setActiveModalAction(null)
    setModalReason('')
    setTimeout(() => setActionNotice(null), 4000)
  }

  const verifiedCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length
  const totalCount = documents.length
  const isAllVerified = totalCount > 0 && verifiedCount === totalCount

  // Available applications list for dropdown
  const availableApps = [
    { id: 'AICTE-2025-00123', name: 'Sunrise Engineering College' },
    { id: 'APP-2024-00145', name: 'Apex Institute of Technology & Management' },
    { id: 'AICTE-2025-00145', name: 'Vidya Institute of Technology' },
    { id: 'AICTE-2025-00167', name: 'Global Polytechnic' },
    { id: 'APP-2024-00146', name: 'Delhi Institute of Engineering' },
    { id: 'APP-2024-00147', name: 'Kalinga Institute of Polytechnic' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${scrutinyData.institution.name} — Scrutiny Desk`}
        subtitle={`Application ID: ${scrutinyData.application.id} • SLA Due: ${scrutinyData.application.slaDue}`}
        badgeText={`Risk Index: ${scrutinyData.application.riskScore}/100 (${scrutinyData.application.riskBand})`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Application Scrutiny', scrutinyData.application.id]}
        actions={
          <div className="flex items-center gap-2">
            {/* Quick Switch Application Selector */}
            <div className="relative">
              <select
                value={currentAppId}
                onChange={e => setCurrentAppId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 outline-none cursor-pointer"
              >
                {availableApps.map(a => (
                  <option key={a.id} value={a.id} className="text-slate-900 bg-white">
                    {a.id} - {a.name}
                  </option>
                ))}
              </select>
            </div>

            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={() => setActiveModalAction('FORWARD')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                isAllVerified
                  ? 'bg-[#159B68] text-white hover:bg-emerald-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> Recommend Forwarding
            </button>
          </div>
        }
      />

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
          actionNotice.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
          actionNotice.type === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
          'bg-blue-100 text-[#1769E0] border border-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice.text}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-500 font-bold">&times;</button>
        </div>
      )}

      {/* Top Details Card: Institution Info + Application Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution Head</span>
          <p className="font-bold text-slate-900">{scrutinyData.institution.headOfInstitute}</p>
          <p className="text-slate-500 font-mono text-[11px] truncate">{scrutinyData.institution.contactEmail}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">University Affiliation</span>
          <p className="font-bold text-slate-900 truncate">{scrutinyData.institution.universityAffiliation}</p>
          <p className="text-slate-500 text-[11px]">Permanent ID: {scrutinyData.institution.permanentId}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Governing Workflow</span>
          <p className="font-bold text-[#102A56] font-mono">{scrutinyData.application.governingWorkflow}</p>
          <p className="text-slate-500 text-[11px]">Submitted: {scrutinyData.application.submittedAt}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Scrutiny Progress</span>
            <span className="font-mono font-bold text-[#1769E0]">{verifiedCount}/{totalCount} Verified</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#159B68] h-full rounded-full transition-all"
              style={{ width: `${totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 pt-0.5">
            {isAllVerified ? 'All documents verified. Ready for EVC.' : `${totalCount - verifiedCount} documents pending review.`}
          </p>
        </div>
      </div>

      {/* Main Scrutiny Area: Left Document Checklist (4 cols), Right Side-by-Side Review (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Checklist Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Statutory Document Verification List ({documents.length})
          </h3>

          <div className="space-y-2">
            {documents.map(doc => {
              const isSelected = doc.id === selectedDocId
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900 line-clamp-1">{doc.title}</span>
                    {doc.verificationStatus === 'VERIFIED' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#159B68] shrink-0" />
                    ) : doc.verificationStatus === 'FLAGGED_MISMATCH' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">{doc.fileName || `${doc.id}.pdf`}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400">{doc.category}</span>
                    <span className={`font-bold ${
                      doc.verificationStatus === 'VERIFIED' ? 'text-[#159B68]' :
                      doc.verificationStatus === 'FLAGGED_MISMATCH' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {(doc.verificationStatus || 'PENDING').replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Side-by-Side Verification Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
            {/* Active Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#1E6DEB]">{activeDoc.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeDoc.title}</h3>
                <p className="text-xs text-slate-500">
                  Uploaded: {activeDoc.uploadedAt || '2025-10-18'} &bull; Size: {activeDoc.fileSize || '3.5 MB'}
                </p>
              </div>

              <StatusBadge status={activeDoc.verificationStatus || 'PENDING'} size="sm" />
            </div>

            {/* AI / Discrepancy Warnings */}
            {activeDoc.flagReasons && activeDoc.flagReasons.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Statutory Discrepancy Flagged by Verification Check:</span>
                </div>
                <ul className="list-disc pl-5 text-rose-700 space-y-1">
                  {activeDoc.flagReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side-by-Side Comparison: Candidate OCR vs AICTE Master Record */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Candidate OCR Extractions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E6DEB] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Candidate OCR Output (Demo)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#1E6DEB] font-bold">
                    Conf: {activeDoc.extractedOcr?.confidenceScore || 94.5}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Extracted via PaddleOCR engine prototype. Values subject to officer human verification.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  {Object.entries(activeDoc.extractedOcr || {}).map(([key, val]) => {
                    if (key === 'confidenceScore' || key === 'qrVerified') return null
                    const isMismatch = activeDoc.flagReasons && activeDoc.flagReasons.length > 0 &&
                      (key.toLowerCase().includes('area') || key.toLowerCase().includes('valid') || key.toLowerCase().includes('title') || key.toLowerCase().includes('expiry'))
                    return (
                      <div
                        key={key}
                        className={`p-2 rounded-lg border ${
                          isMismatch ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{key}</span>
                        <span className={`font-mono font-medium ${isMismatch ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                          {String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Master Record Benchmark */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#159B68] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    AICTE Master Benchmark Record
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-[#159B68] font-bold">
                    APH Standard
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Official criteria from Approval Process Handbook (APH 2024-25).
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  {Object.entries(activeDoc.masterRecord || {}).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{key}</span>
                      <span className="font-mono font-medium text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Officer Scrutiny Remarks */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Officer Scrutiny Remarks / Verification Notes
              </label>
              <textarea
                rows={2}
                value={officerRemarks || activeDoc.officerRemarks || ''}
                onChange={e => setOfficerRemarks(e.target.value)}
                placeholder="Enter remarks, specific clause references, or inspection directives..."
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#1E6DEB] outline-none"
              />

              {/* Action Buttons: Verified, Raise Deficiency, Request Clarification */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-400">
                  Officer: <strong>R. Sharma</strong> (Western Bureau)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalAction('CLARIFICATION')}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                  >
                    Request Clarification
                  </button>

                  <button
                    onClick={() => setActiveModalAction('DEFICIENCY')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Raise Deficiency
                  </button>

                  <button
                    onClick={handleMarkVerified}
                    className="px-4 py-2 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark as Verified
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deficiency / Clarification / Forwarding Action Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {activeModalAction === 'DEFICIENCY' ? 'Issue Official Deficiency Notice' :
                  activeModalAction === 'CLARIFICATION' ? 'Request Clarification from Institution' :
                    'Recommend Application for EVC Committee Scheduling'}
              </h3>
              <button
                onClick={() => setActiveModalAction(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-3.5 text-xs">
              {activeModalAction === 'DEFICIENCY' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    AICTE APH Clause Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clauseRef}
                    onChange={e => setClauseRef(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mandatory Justification Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={modalReason}
                  onChange={e => setModalReason(e.target.value)}
                  placeholder="Detail the exact finding, why submitted evidence is deficient, and statutory rectification required..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#102A56] hover:bg-[#1E6DEB] text-white font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Confirm &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
