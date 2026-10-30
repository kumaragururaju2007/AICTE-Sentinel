import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Upload,
  Send,
  FileText,
  AlertTriangle,
  User,
  Calendar,
  X,
  Eye,
  Filter,
  Check
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import FileUpload from '../../components/institution/FileUpload';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useInstitution } from './context/InstitutionContext';

export default function DeficiencyClarifications() {
  const { deficiencies, submitDeficiencyResponse } = useInstitution();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeficiency, setSelectedDeficiency] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorText, setErrorText] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Deficiency Statuses' },
    { value: 'pending', label: 'Pending Response' },
    { value: 'in_review', label: 'Submitted / Under Review' },
    { value: 'resolved', label: 'Resolved & Verified' },
  ];

  const filteredDeficiencies = deficiencies.filter(def => {
    const matchSearch =
      !search ||
      def.id.toLowerCase().includes(search.toLowerCase()) ||
      def.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      def.officerRemarks.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && def.status === 'Pending Response') ||
      (statusFilter === 'in_review' && def.status === 'Submitted / Under Review') ||
      (statusFilter === 'resolved' && def.status === 'Resolved & Verified');

    return matchSearch && matchStatus;
  });

  const handleOpenResponseModal = (def) => {
    setSelectedDeficiency(def);
    setResponseText(def.response || '');
    setAttachedFiles(def.submittedFiles ? def.submittedFiles.map(f => ({ name: f })) : []);
    setErrorText('');
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      setErrorText('Please enter a clarification statement for the scrutiny officer.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitDeficiencyResponse(selectedDeficiency.id, responseText, attachedFiles);
      setSubmitting(false);
      setSelectedDeficiency(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deficiency & Scrutiny Clarifications"
        subtitle="Address and resolve compliance remarks raised by AICTE regional scrutiny officers."
        breadcrumb={['Home', 'Compliance', 'Deficiencies']}
      />

      {/* Success Banner */}
      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>
            Clarification statement and supporting files submitted successfully! The scrutiny officer has been notified.
          </span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by Deficiency ID, Application Ref, or Officer Remark..."
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          className="w-full sm:w-60"
        />
      </div>

      {/* Deficiency Cards List */}
      <div className="space-y-4">
        {filteredDeficiencies.map((def) => {
          const isPending = def.status === 'Pending Response';
          const isOverdue =
            isPending &&
            new Date(def.responseDeadline) < new Date();

          return (
            <div
              key={def.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition-all ${
                isPending
                  ? 'border-amber-300 hover:border-amber-400'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {def.id}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Ref: {def.applicationId}
                    </span>
                    <StatusBadge status={def.status} size="sm" />
                    <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                      Severity: {def.severity}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {def.applicationTitle}
                  </h3>

                  {/* Officer Remarks Box */}
                  <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span>{def.officerName} ({def.officerDesignation}):</span>
                    </div>
                    <p className="italic bg-white p-2.5 rounded-lg border border-slate-200/60 text-slate-800">
                      "{def.officerRemarks}"
                    </p>
                  </div>

                  {/* Required action */}
                  <div className="mt-3 text-xs text-slate-600">
                    <strong className="text-slate-800">Required Remedy: </strong>
                    <span>{def.requiredAction}</span>
                  </div>

                  {/* Submitted response if present */}
                  {def.response && (
                    <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-950">
                      <strong className="text-emerald-900 flex items-center gap-1 mb-1">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Institution Clarification Submitted:
                      </strong>
                      <p>{def.response}</p>
                      {def.submittedFiles && def.submittedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-emerald-800">
                          {def.submittedFiles.map((fn, idx) => (
                            <span key={idx} className="bg-white px-2 py-0.5 rounded border border-emerald-200">
                              📎 {fn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Block */}
                <div className="flex flex-col sm:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 flex-shrink-0">
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-slate-400 block">Response Deadline</span>
                    <strong
                      className={`font-mono text-sm ${
                        isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {def.responseDeadline}
                    </strong>
                    <span
                      className={`block text-[11px] font-semibold mt-0.5 ${
                        isOverdue ? 'text-rose-600' : 'text-amber-700'
                      }`}
                    >
                      {isOverdue ? 'Action Overdue!' : '12 Days Remaining'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => handleOpenResponseModal(def)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Response</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenResponseModal(def)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>View Submission</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Modal */}
      {selectedDeficiency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedDeficiency(null)}
          />

          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedDeficiency.id}
                  </span>
                  <StatusBadge status={selectedDeficiency.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Respond to Scrutiny Deficiency
                </h3>
                <p className="text-xs text-slate-500">
                  Related: {selectedDeficiency.applicationTitle} ({selectedDeficiency.applicationId})
                </p>
              </div>
              <button
                onClick={() => setSelectedDeficiency(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Officer Notice Quote */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs mb-5">
              <span className="text-slate-500 font-bold block mb-1">
                Scrutiny Officer Remark ({selectedDeficiency.officerName}):
              </span>
              <p className="text-slate-800 italic">
                "{selectedDeficiency.officerRemarks}"
              </p>
              <div className="mt-2 text-slate-500">
                <strong>Remedy Mandate: </strong>
                {selectedDeficiency.requiredAction}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clarification Statement *
                </label>
                <textarea
                  rows={4}
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="Detail the remedial actions taken, reference document registration numbers, and explanation for the officer..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
                {errorText && (
                  <p className="mt-1 text-xs text-rose-600 font-semibold">{errorText}</p>
                )}
              </div>

              {/* Upload supporting files */}
              <div>
                <FileUpload
                  label="Upload Supporting Evidence / Rectified Deeds"
                  hint="Attach renewed sub-registrar copies, calibration reports, or bank receipts."
                  multiple={true}
                  selectedFiles={attachedFiles}
                  onFileSelect={(files) => {
                    const arr = Array.isArray(files) ? files : [files];
                    setAttachedFiles([...attachedFiles, ...arr]);
                  }}
                  onRemoveFile={(idx) => {
                    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
                  }}
                />
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDeficiency(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting && (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>Submit Clarification to Officer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
