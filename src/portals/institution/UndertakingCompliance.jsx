import React, { useState } from 'react';
import {
  CheckSquare,
  FileCheck2,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  X,
  FileText
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import FileUpload from '../../components/institution/FileUpload';
import { useInstitution } from './context/InstitutionContext';

export default function UndertakingCompliance() {
  const { undertakings, submitUndertakingEvidence } = useInstitution();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUndertaking, setSelectedUndertaking] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Compliance Statuses' },
    { value: 'verified', label: 'Verified by AICTE' },
    { value: 'submitted', label: 'Submitted (In Verification)' },
    { value: 'pending', label: 'Pending Action' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const filteredUndertakings = undertakings.filter(u => {
    const matchSearch =
      !search ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.category.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && u.complianceStatus === 'Verified') ||
      (statusFilter === 'submitted' && u.complianceStatus === 'Submitted') ||
      (statusFilter === 'pending' && u.complianceStatus === 'Pending') ||
      (statusFilter === 'overdue' && u.complianceStatus === 'Overdue');

    return matchSearch && matchStatus;
  });

  const handleUploadEvidence = (e) => {
    e.preventDefault();
    if (!evidenceFiles.length) return;

    setSubmitting(true);
    setTimeout(() => {
      submitUndertakingEvidence(selectedUndertaking.id, evidenceFiles[0]);
      setSubmitting(false);
      setSelectedUndertaking(null);
      setEvidenceFiles([]);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Undertakings & Statutory Compliance"
        subtitle="Mandatory AICTE compliance undertakings, affidavits, and evidence uploads."
        breadcrumb={['Home', 'Compliance', 'Undertakings']}
      />

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>
            Undertaking evidence uploaded and submitted for regional scrutiny cell review!
          </span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search undertakings by title, category, or code..."
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          className="w-full sm:w-60"
        />
      </div>

      {/* Undertakings Grid */}
      <div className="space-y-3.5">
        {filteredUndertakings.map((und) => {
          const isPending = und.complianceStatus === 'Pending' || und.complianceStatus === 'Overdue';

          return (
            <div
              key={und.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                und.complianceStatus === 'Overdue'
                  ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {und.id}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {und.category}
                    </span>
                    <StatusBadge status={und.complianceStatus} size="sm" />
                    {und.relatedApplication && (
                      <span className="text-[11px] font-mono text-slate-500">
                        App: {und.relatedApplication}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {und.title}
                  </h3>

                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>
                      Submission Date: <strong className="text-slate-700 font-mono">{und.submissionDate || 'Pending'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Compliance Deadline: <strong className="text-slate-700 font-mono">{und.dueDate}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Evidence Status: <strong className="text-slate-800">{und.evidenceStatus}</strong>
                    </span>
                  </div>

                  {und.officerRemark && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <strong>Verification Note: </strong>
                      {und.officerRemark}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => setSelectedUndertaking(und)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Evidence</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedUndertaking(und)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>View Evidence Status</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Evidence Modal */}
      {selectedUndertaking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedUndertaking(null)}
          />

          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedUndertaking.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Upload Compliance Evidence
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedUndertaking.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedUndertaking(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700 border border-slate-200/70 mb-4">
              <span className="font-bold text-slate-900 block mb-0.5">Council Guideline:</span>
              Upload statutory proof (photographs, bank scrolls, gazette notification, or committee resolution) in PDF or image format.
            </div>

            <form onSubmit={handleUploadEvidence} className="space-y-4">
              <FileUpload
                label="Attach Certified Proof / Affidavit"
                hint="Upload signed and stamped verification evidence."
                selectedFiles={evidenceFiles}
                onFileSelect={(f) => setEvidenceFiles([f])}
                onRemoveFile={() => setEvidenceFiles([])}
              />

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedUndertaking(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !evidenceFiles.length}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting && (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>Submit Evidence to Council</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
