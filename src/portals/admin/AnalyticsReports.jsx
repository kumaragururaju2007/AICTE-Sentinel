import React, { useState } from 'react'
import {
  TrendingUp, Download, BarChart2, CheckCircle2, Calendar,
  Building2, Users, FileText, ArrowRight, ShieldCheck, MapPin
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function AnalyticsReports() {
  const [downloadNotice, setDownloadNotice] = useState(null)

  const handleDownload = (reportName) => {
    setDownloadNotice(`Report "${reportName}" compiled with cryptographic validation and ready for download.`)
    setTimeout(() => setDownloadNotice(null), 4000)
  }

  const reports = [
    {
      title: 'National EoA Clearance Velocity & SLA Adherence',
      desc: 'Comprehensive breakdown of 1,248 applications across 8 Regional Bureaus with turnaround metrics.',
      period: 'AY 2026-27 (Q3)',
      fileSize: '4.2 MB'
    },
    {
      title: 'Regional Bureau Deficiency Patterns & Clause Heatmap',
      desc: 'Root-cause clustering of land deed mismatches, fire NOC expirations, and cadre ratios.',
      period: 'Last 12 Months',
      fileSize: '6.8 MB'
    },
    {
      title: 'EVC Expert Committee Roster & Physical Audit Logs',
      desc: 'GPS-verified inspection reports, geo-fence validations, and video archive checksums.',
      period: 'October 2026',
      fileSize: '8.1 MB'
    },
    {
      title: 'Cryptographic SHA-256 System Audit Trail Export',
      desc: 'Immutable append-only ledger of all administrative decisions, stage changes, and logins.',
      period: 'All Records',
      fileSize: '12.4 MB'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Analytics &amp; Statutory Reports Engine"
        subtitle="National intelligence reports, cross-bureau clearance velocity &amp; audit evidence compilation"
        badgeText="National AICTE Analytics"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Analytics & Reports']}
      />

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pan-India Approval Rate</span>
          <p className="text-2xl font-extrabold text-[#159B68] mt-1">86.7%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ 4.2% vs previous cycle</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Avg. Scrutiny Turnaround</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">9.4 Days</p>
          <span className="text-[11px] text-[#1E6DEB] font-semibold mt-1 block">Well within 14-day SLA</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active EVC Panels</span>
          <p className="text-2xl font-extrabold text-[#7738E8] mt-1">28</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Across 8 Regional Bureaus</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">SHA-256 Audit Integrity</span>
          <p className="text-2xl font-extrabold text-[#1E6DEB] mt-1">100%</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Zero hash chain tampering</span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Executive Compliance &amp; Governance Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1E6DEB] border border-blue-200 font-bold uppercase">
                  {r.period}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{r.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{r.fileSize} &bull; PDF / Excel</span>
                <button
                  onClick={() => handleDownload(r.title)}
                  className="px-3.5 py-1.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

