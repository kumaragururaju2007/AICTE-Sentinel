import React from 'react'
import {
  HelpCircle, BookOpen, Shield, Phone, Mail,
  ExternalLink, FileText, CheckCircle2
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function AdminHelpSupport() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help &amp; Administrative Governance Support"
        subtitle="Technical documentation, regulatory manuals (APH 2026-27), escalation protocols &amp; support desk"
        badgeText="National AICTE Helpdesk"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Help & Support']}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E6DEB] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">APH 2026-27 Regulatory Handbook</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Statutory Approval Process Handbook published by AICTE governing norms, standards, land sizes, and cadre ratios.
          </p>
          <button
            onClick={() => alert('Opening AICTE Approval Process Handbook (Official Gazette)...')}
            className="text-xs font-bold text-[#1E6DEB] flex items-center gap-1 hover:underline pt-2"
          >
            Read Manual <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7738E8] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Security &amp; Cryptographic Audit</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Documentation on SHA-256 tamper-evident logs, zero-trust RBAC access controls, and digital signature validation.
          </p>
          <button
            onClick={() => alert('Opening Security Specification Dossier...')}
            className="text-xs font-bold text-[#7738E8] flex items-center gap-1 hover:underline pt-2"
          >
            Security Guide <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159B68] flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">National Emergency Escalation Desk</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct priority support channel for Regional Directors, Member Secretary, and NIC Server Ops.
          </p>
          <div className="text-xs font-mono text-slate-700 pt-2 space-y-1">
            <p>Hotline: +91 11 2958 1000</p>
            <p>Email: admin-support@aicte-india.org</p>
          </div>
        </div>
      </div>
    </div>
  )
}

