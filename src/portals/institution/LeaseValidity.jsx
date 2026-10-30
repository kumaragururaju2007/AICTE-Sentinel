import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Calendar,
  Building,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useInstitution } from './context/InstitutionContext';

export default function LeaseValidity() {
  const { leaseDocuments, renewLeaseDocument } = useInstitution();
  const [search, setSearch] = useState('');
  const [selectedLease, setSelectedLease] = useState(null);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewalYears, setRenewalYears] = useState(30);
  const [successToast, setSuccessToast] = useState(false);

  const filteredLeases = leaseDocuments.filter(l =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.issuingAuthority.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenRenew = (lease) => {
    setSelectedLease(lease);
    setRenewModalOpen(true);
  };

  const handleConfirmRenewal = () => {
    if (!selectedLease) return;
    setRenewLoading(true);
    setTimeout(() => {
      renewLeaseDocument(selectedLease.id, renewalYears);
      setRenewLoading(false);
      setRenewModalOpen(false);
      setSelectedLease(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Land Lease & Document Validity Monitor"
        subtitle="Proactive countdown tracking of land tenure, building leases, and statutory validity periods."
        breadcrumb={['Home', 'Compliance', 'Lease Validity']}
      />

      {/* Success Notification */}
      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>
            Lease record renewed successfully with 30-year sub-registrar endorsement extension!
          </span>
        </div>
      )}

      {/* AICTE Regulatory Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="block text-amber-950 font-bold mb-0.5">
            AICTE Regulatory Norm (APH Chapter I Clause 1.4):
          </strong>
          Technical institutions functioning on leased land must possess a registered lease deed of minimum <strong>30 years</strong> duration from the date of submission. Any lease expiring in fewer than 180 days must submit registered renewal deeds before final approval orders.
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search lease agreements by parcel name, authority, or type..."
        />
      </div>

      {/* Lease Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeases.map((lease) => {
          const isExpired = lease.remainingDays <= 0;
          const isExpiringSoon = lease.remainingDays > 0 && lease.remainingDays <= 180;

          const cardBorder = isExpired
            ? 'border-rose-300 bg-rose-50/20'
            : isExpiringSoon
            ? 'border-amber-300 bg-amber-50/20'
            : 'border-slate-200 bg-white';

          return (
            <div
              key={lease.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {lease.id}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {lease.landArea}
                    </span>
                  </div>
                  <StatusBadge status={lease.validityStatus} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {lease.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Type: <strong>{lease.type}</strong> • Authority: <strong>{lease.issuingAuthority}</strong>
                </p>

                {/* Survey & Land Details */}
                <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] font-mono text-slate-600 border border-slate-200/60">
                  <span>Land Parcel Identifiers: {lease.surveyNumbers}</span>
                </div>

                {/* Timeline Countdown Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">Tenure Window:</span>
                    <span
                      className={`font-mono font-bold ${
                        isExpired
                          ? 'text-rose-600'
                          : isExpiringSoon
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {isExpired
                        ? 'Lease Expired!'
                        : `${lease.remainingDays.toLocaleString()} Days Remaining`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isExpired
                          ? 'bg-rose-500'
                          : isExpiringSoon
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: isExpired
                          ? '100%'
                          : `${Math.min(100, Math.max(10, (lease.remainingDays / 10000) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Issued: {lease.issueDate}</span>
                  <span className="font-bold text-slate-800">Expires: {lease.expiryDate}</span>
                </div>

                {lease.actionRequired && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
                    <strong>Action Required: </strong>
                    {lease.actionRequired}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Sub-Registrar Digital Record
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenRenew(lease)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Execute Renewal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Renewal Confirmation Modal */}
      {selectedLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedLease(null)}
          />

          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Renew Campus Land Lease Agreement
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Simulate Sub-Registrar registered renewal deed endorsement for {selectedLease.name}.
            </p>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200 mb-4">
              <span className="text-slate-400 block">Issuing Authority:</span>
              <strong className="text-slate-900">{selectedLease.issuingAuthority}</strong>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Renewal Term Duration:
              </label>
              <select
                value={renewalYears}
                onChange={e => setRenewalYears(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
              >
                <option value={30}>30 Years (Mandatory AICTE Norm Duration)</option>
                <option value={50}>50 Years (Long Term Institutional Extension)</option>
                <option value={99}>99 Years (Perpetual Lease Hold)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedLease(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                disabled={renewLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                {renewLoading && (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>Confirm & Update Validity</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
