import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, Sparkles, FileWarning } from 'lucide-react';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';

export default function SmartAlertsBanner() {
  const navigate = useNavigate();
  const { deficiencies, leaseDocuments, undertakings, documents } = useInstitution();

  const activeDeficiency = deficiencies.find(d => d.status === 'Pending Response');
  const expiringLease = leaseDocuments.find(l => l.remainingDays <= 180);
  const overdueUndertaking = undertakings.find(u => u.complianceStatus === 'Overdue');
  const expiredDocument = documents.find(d => d.verificationStatus === 'Expired');

  const alerts = [
    activeDeficiency && {
      id: 'alert-def',
      type: 'critical',
      icon: ShieldAlert,
      title: `Critical Scrutiny Deficiency (${activeDeficiency.id})`,
      message: `${activeDeficiency.requiredAction} Due in ${Math.ceil((new Date(activeDeficiency.responseDeadline) - new Date()) / (1000 * 60 * 60 * 24))} days.`,
      actionText: 'Submit Clarification',
      path: '/institution/deficiencies',
    },
    expiringLease && {
      id: 'alert-lease',
      type: 'warning',
      icon: Clock,
      title: `Lease Agreement Approaching Expiry (${expiringLease.name})`,
      message: `${expiringLease.remainingDays} days remaining. Minimum 30-year active lease required for ongoing AICTE approvals.`,
      actionText: 'View Validity Details',
      path: '/institution/lease-validity',
    },
    overdueUndertaking && {
      id: 'alert-und',
      type: 'danger',
      icon: AlertTriangle,
      title: `Overdue Institutional Undertaking: ${overdueUndertaking.title}`,
      message: 'Upload required barrier-free PwD photographic evidence to maintain compliant institutional status.',
      actionText: 'Upload Evidence',
      path: '/institution/undertakings',
    },
    expiredDocument && {
      id: 'alert-doc',
      type: 'warning',
      icon: FileWarning,
      title: `Expired Document in Vault: ${expiredDocument.name}`,
      message: 'NABL equipment calibration certificate expired. Upload current certificate to clear validation gates.',
      actionText: 'Update Document',
      path: '/institution/documents',
    },
  ].filter(Boolean);

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {alerts.slice(0, 2).map((alert) => {
        const Icon = alert.icon;
        const isCritical = alert.type === 'critical' || alert.type === 'danger';

        return (
          <div
            key={alert.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-all ${
              isCritical
                ? 'border-rose-200 bg-rose-50/70 text-rose-950'
                : 'border-amber-200 bg-amber-50/70 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                  isCritical ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/70 border border-black/5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Smart Sentinel Alert
                  </span>
                  <h4 className="text-sm font-bold">{alert.title}</h4>
                </div>
                <p className="mt-1 text-xs opacity-90 leading-relaxed max-w-3xl">
                  {alert.message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(alert.path)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold shadow-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                isCritical
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <span>{alert.actionText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
