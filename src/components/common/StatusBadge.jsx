import React from 'react'
import {
  CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck,
  ShieldAlert, RefreshCw, FileSearch, Check, FileText
} from 'lucide-react'

const MAP = {
  // Developer 1 statuses
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  'under review': { label: 'Under Review', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  'initial scrutiny': { label: 'Initial Scrutiny', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: Clock },
  'deficiency review': { label: 'Deficiency Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  'application submitted': { label: 'Submitted', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: FileText },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
  'pending response': { label: 'Pending Response', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertTriangle },
  'submitted / under review': { label: 'Submitted / In Review', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  'resolved & verified': { label: 'Resolved & Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: ShieldCheck },
  resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Check },
  verified: { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: ShieldCheck },
  valid: { label: 'Valid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  'expiring soon': { label: 'Expiring Soon', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: AlertTriangle },
  expired: { label: 'Expired', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
  'under scrutiny': { label: 'Under Scrutiny', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  compliant: { label: 'Compliant', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: ShieldCheck },
  'needs attention': { label: 'Needs Attention', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  'non-compliant': { label: 'Non-Compliant', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
  overdue: { label: 'Overdue', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', icon: AlertTriangle },
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Check },
  pending: { label: 'Pending', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: Clock },
  critical: { label: 'Critical', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertTriangle },
  high: { label: 'High', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  medium: { label: 'Medium', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  low: { label: 'Low', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: Clock },

  // Developer 2 normalized statuses
  clean: { label: 'Clean / Verified', bg: 'bg-emerald-50', text: 'text-[#159B68]', border: 'border-emerald-200', icon: CheckCircle2 },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-[#159B68]', border: 'border-emerald-200', icon: CheckCircle2 },
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-[#159B68]', border: 'border-emerald-200', icon: CheckCircle2 },
  in_scrutiny: { label: 'In Scrutiny', bg: 'bg-blue-50', text: 'text-[#1769E0]', border: 'border-blue-200', icon: FileSearch },
  pending_scrutiny: { label: 'Pending Scrutiny', bg: 'bg-blue-50', text: 'text-[#1769E0]', border: 'border-blue-200', icon: FileSearch },
  under_verification: { label: 'Under Verification', bg: 'bg-blue-50', text: 'text-[#1769E0]', border: 'border-blue-200', icon: FileSearch },
  evc_scheduled: { label: 'EVC Scheduled', bg: 'bg-indigo-50', text: 'text-[#7738E8]', border: 'border-indigo-200', icon: Clock },
  confirmed: { label: 'Confirmed', bg: 'bg-indigo-50', text: 'text-[#7738E8]', border: 'border-indigo-200', icon: CheckCircle2 },
  deficient: { label: 'Deficient', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  flagged_mismatch: { label: 'Mismatch Flagged', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  issues_found: { label: 'Issues Found', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  resubmitted: { label: 'Resubmitted', bg: 'bg-purple-50', text: 'text-[#7738E8]', border: 'border-purple-200', icon: RefreshCw },
  resubmitted_under_review: { label: 'Resubmitted Under Review', bg: 'bg-purple-50', text: 'text-[#7738E8]', border: 'border-purple-200', icon: RefreshCw },
  tampered: { label: 'Tampered / Invalid', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
}

export default function StatusBadge({ status, label, customLabel, size = 'sm', className = '' }) {
  if (!status) return null
  const key = String(status).toLowerCase().trim()
  const altKey = key.replace(/[\s-]/g, '_')

  const cfg = MAP[key] || MAP[altKey] || {
    label: customLabel || label || status,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: Clock,
  }

  const Icon = cfg.icon
  const displayLabel = customLabel || label || cfg.label || status

  const sizeClass = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5 gap-1'
    : size === 'lg'
    ? 'text-sm px-3 py-1 gap-2'
    : size === 'md'
    ? 'text-xs px-2.5 py-1 gap-1.5'
    : 'text-xs px-2.5 py-0.5 gap-1.5'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClass} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span className="truncate">{displayLabel}</span>
    </span>
  )
}
