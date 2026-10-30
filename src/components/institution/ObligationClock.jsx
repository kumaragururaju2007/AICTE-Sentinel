import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';
import StatusBadge from '../common/StatusBadge';

export default function ObligationClock() {
  const navigate = useNavigate();
  const { deficiencies, leaseDocuments, undertakings } = useInstitution();

  // Aggregate obligations
  const activeDeficiencies = deficiencies.filter(d => d.status === 'Pending Response').map(d => ({
    id: d.id,
    title: `Respond to Scrutiny Deficiency: ${d.id}`,
    subtext: `Related App: ${d.applicationId} • ${d.category}`,
    dueDate: d.responseDeadline,
    daysLeft: Math.ceil((new Date(d.responseDeadline) - new Date()) / (1000 * 60 * 60 * 24)),
    category: 'Scrutiny Deficiency',
    owner: 'Principal / Registrar',
    path: '/institution/deficiencies',
    priority: 'critical',
  }));

  const expiringLeases = leaseDocuments.filter(l => l.remainingDays <= 180).map(l => ({
    id: l.id,
    title: `Renew Lease Agreement: ${l.name}`,
    subtext: `${l.landArea} • ${l.issuingAuthority}`,
    dueDate: l.expiryDate,
    daysLeft: l.remainingDays,
    category: 'Lease Validity',
    owner: 'Legal / Trust Trustee',
    path: '/institution/lease-validity',
    priority: l.remainingDays < 60 ? 'critical' : 'high',
  }));

  const pendingUndertakings = undertakings.filter(u => u.complianceStatus === 'Pending' || u.complianceStatus === 'Overdue').map(u => ({
    id: u.id,
    title: `Submit Evidence: ${u.title}`,
    subtext: `Category: ${u.category}`,
    dueDate: u.dueDate,
    daysLeft: Math.ceil((new Date(u.dueDate) - new Date()) / (1000 * 60 * 60 * 24)),
    category: 'Undertaking Compliance',
    owner: 'AICTE Compliance Officer',
    path: '/institution/undertakings',
    priority: u.complianceStatus === 'Overdue' ? 'critical' : 'high',
  }));

  const allObligations = [...activeDeficiencies, ...expiringLeases, ...pendingUndertakings]
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Obligation Clock
            </h3>
            <p className="text-xs text-slate-500">
              Active regulatory obligations and countdown SLA trackers
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {allObligations.length} Mandatory Actions
        </span>
      </div>

      <div className="space-y-3">
        {allObligations.slice(0, 4).map((ob) => {
          const isOverdue = ob.daysLeft < 0;
          return (
            <div
              key={ob.id}
              onClick={() => navigate(ob.path)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                isOverdue
                  ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isOverdue
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ob.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Due: {ob.dueDate}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#2563EB] transition-colors truncate">
                  {ob.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Owner: {ob.owner} • {ob.subtext}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      isOverdue
                        ? 'bg-rose-600 text-white'
                        : ob.daysLeft <= 14
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isOverdue && <AlertTriangle className="h-3 w-3" />}
                    {isOverdue
                      ? `${Math.abs(ob.daysLeft)}d Overdue`
                      : `${ob.daysLeft}d Remaining`}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
