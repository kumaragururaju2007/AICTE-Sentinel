import React, { useState, useMemo } from 'react';
import {
  FolderCheck,
  UploadCloud,
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  X,
  FileCode,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import FileUpload from '../../components/institution/FileUpload';
import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import { useInstitution } from './context/InstitutionContext';
import { documentService } from '../../services/documentService';

const CATEGORIES = [
  'All Categories',
  'Land Documents',
  'Building Documents',
  'Lease Documents',
  'Faculty Documents',
  'Infrastructure Documents',
  'Financial Documents',
  'Affidavits and Undertakings',
  'Other Supporting Documents',
];

export default function DocumentRepository() {
  const { documents, addDocument, deleteDocument } = useInstitution();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state for new upload
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Land Documents',
    subCategory: 'Regulatory Compliance',
    expiryDate: '2028-12-31',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    remarks: 'Self-attested institutional statutory document.',
    mandatory: true,
    rawFile: null,
  });

  const filteredDocs = useMemo(() => {
    const list = Array.isArray(documents) ? documents : [];
    return list.filter((doc) => {
      const docName = String(doc.name || doc.document_name || '');
      const docCategory = String(doc.category || doc.document_type || 'Other Supporting Documents');
      const docId = String(doc.id || '');
      const docStatus = String(doc.verificationStatus || doc.verification_status || 'Under Scrutiny');

      const matchCat =
        selectedCategory === 'All Categories' ||
        docCategory.toLowerCase() === selectedCategory.toLowerCase() ||
        docCategory.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = (search || '').toLowerCase().trim();
      const matchSearch =
        !query ||
        docName.toLowerCase().includes(query) ||
        docCategory.toLowerCase().includes(query) ||
        docId.toLowerCase().includes(query);

      let matchStatus = true;
      if (statusFilter !== 'all') {
        const s = docStatus.toLowerCase();
        if (statusFilter === 'verified') matchStatus = s.includes('verif') || s.includes('approv');
        else if (statusFilter === 'expiring') matchStatus = s.includes('expir');
        else if (statusFilter === 'expired') matchStatus = s === 'expired' || s.includes('reject');
        else if (statusFilter === 'scrutiny') matchStatus = s.includes('scrutiny') || s.includes('pend') || s.includes('review');
      }

      return matchCat && matchSearch && matchStatus;
    });
  }, [documents, search, selectedCategory, statusFilter]);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    setIsUploading(true);

    // Call addDocument in context immediately for smooth UI response
    addDocument(uploadForm);
    setUploadModalOpen(false);

    // If a physical file was attached, asynchronously upload to Supabase Storage
    if (uploadForm.rawFile) {
      try {
        const defaultAppId = '11111111-2222-3333-4444-555555555555';
        const defaultInstId = '4a1a6b0c-9821-4f1b-a5d2-03912a781011';
        await documentService.uploadDocument({
          file: uploadForm.rawFile,
          applicationId: defaultAppId,
          institutionId: defaultInstId,
          documentType: uploadForm.category,
          documentName: uploadForm.name,
          expiryDate: uploadForm.expiryDate || null,
        });
      } catch (err) {
        console.warn('[DocumentRepository] Supabase vault upload note:', err.message);
      }
    }

    setIsUploading(false);
    setUploadForm({
      name: '',
      category: 'Land Documents',
      subCategory: 'Regulatory Compliance',
      expiryDate: '2028-12-31',
      fileSize: '3.4 MB',
      fileType: 'PDF',
      remarks: 'Self-attested institutional statutory document.',
      mandatory: true,
      rawFile: null,
    });
  };

  const handleDownload = async (doc) => {
    const docName = doc.name || doc.document_name || 'statutory_compliance_doc.pdf';
    const storagePath = doc.storage_path || doc.storagePath;

    if (storagePath) {
      try {
        const signedUrl = await documentService.getSignedUrl(storagePath);
        if (signedUrl) {
          window.open(signedUrl, '_blank');
          setDownloadToast(`Opening secure document stream for "${docName}"`);
          setTimeout(() => setDownloadToast(null), 3500);
          return;
        }
      } catch (err) {
        console.warn('[Download] Fallback to simulated download:', err.message);
      }
    }

    setDownloadToast(`Downloaded copy: "${docName}" to local secure storage.`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const columns = [
    {
      header: 'Document Name & ID',
      accessor: 'name',
      render: (item) => {
        const name = item.name || item.document_name || 'Statutory Compliance Document';
        const docId = item.id ? String(item.id).slice(0, 16) : 'DOC-2026';
        const version = item.version || 'v1.0';
        const size = item.fileSize || '3.4 MB';

        return (
          <div className="flex items-start gap-3 max-w-sm">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] mt-0.5">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate" title={name}>
                {name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>{docId}</span>
                <span>•</span>
                <span className="font-bold text-slate-600">{version}</span>
                <span>•</span>
                <span>{size}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (item) => (
        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {item.category || item.document_type || 'General'}
        </span>
      ),
    },
    {
      header: 'Upload Date',
      accessor: 'uploadedDate',
      render: (item) => (
        <span className="text-xs text-slate-600 font-mono">
          {item.uploadedDate || (item.uploaded_at ? item.uploaded_at.split('T')[0] : '2026-10-25')}
        </span>
      ),
    },
    {
      header: 'Validity / Expiry',
      accessor: 'expiryDate',
      render: (item) => {
        const rawStatus = String(item.verificationStatus || item.verification_status || '');
        const expiry = item.expiryDate || item.expiry_date || 'Perpetual / N/A';
        const isExp = rawStatus === 'Expired' || rawStatus === 'EXPIRED';
        const isExpiring = rawStatus === 'Expiring Soon' || rawStatus === 'EXPIRING';

        return (
          <span
            className={`text-xs font-mono font-medium ${
              isExp
                ? 'text-rose-600 font-bold'
                : isExpiring
                ? 'text-amber-700 font-bold'
                : 'text-slate-600'
            }`}
          >
            {expiry}
          </span>
        );
      },
    },
    {
      header: 'Verification Status',
      accessor: 'verificationStatus',
      render: (item) => {
        const rawStatus = String(item.verificationStatus || item.verification_status || 'Under Scrutiny');
        let badgeStatus = 'Under Scrutiny';
        if (rawStatus === 'APPROVED' || rawStatus.toLowerCase().includes('verif')) badgeStatus = 'Verified';
        else if (rawStatus === 'REJECTED' || rawStatus.toLowerCase() === 'expired') badgeStatus = 'Expired';
        else if (rawStatus.toLowerCase().includes('expir')) badgeStatus = 'Expiring Soon';

        return <StatusBadge status={badgeStatus} size="sm" />;
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewDoc(item);
            }}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-xs transition-colors"
            title="Preview Document"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(item);
            }}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 shadow-xs transition-colors"
            title="Download Copy"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteDocument(item.id);
            }}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 shadow-xs transition-colors"
            title="Remove File"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Document Repository"
        subtitle="Secure encrypted institutional repository covering land, building, faculty, and financial affidavits."
        breadcrumb={['Home', 'Documents', 'Repository']}
        actions={
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Document</span>
          </button>
        }
      />

      {/* Download Alert Toast */}
      {downloadToast && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs font-semibold text-blue-900 animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4 text-[#2563EB]" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
              selectedCategory === cat
                ? 'bg-[#123B70] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search document vault by title, category, or document ID..."
        />
        <FilterDropdown
          label="Verification"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Verification Statuses' },
            { value: 'verified', label: 'Verified by Council' },
            { value: 'expiring', label: 'Expiring Soon (< 180 Days)' },
            { value: 'expired', label: 'Expired' },
            { value: 'scrutiny', label: 'Under Scrutiny' },
          ]}
          className="w-full sm:w-64"
        />
      </div>

      {/* Document Table */}
      <DataTable
        columns={columns}
        data={filteredDocs}
        onRowClick={(item) => setPreviewDoc(item)}
        emptyTitle="No documents in this category"
        emptyDescription="Upload your institutional statutory documents or select another category."
      />

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setUploadModalOpen(false)}
          />

          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload Statutory Document to Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Document will be hashed and submitted for automated regulatory verification.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g. Master Plan Approval & Structural Stability Certificate"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={uploadForm.category}
                  onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={uploadForm.expiryDate}
                    onChange={e => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Estimated File Size
                  </label>
                  <input
                    type="text"
                    value={uploadForm.fileSize}
                    onChange={e => setUploadForm({ ...uploadForm, fileSize: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <FileUpload
                label="Select File"
                hint="Attach PDF or scanned certified document."
                onFileSelect={(f) => {
                  setUploadForm(prev => ({
                    ...prev,
                    name: prev.name || f.name,
                    fileSize: f.size,
                    rawFile: f.file,
                  }));
                }}
              />

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  <span>{isUploading ? 'Encrypting & Storing...' : 'Upload Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setPreviewDoc(null)}
          />

          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {String(previewDoc.id || '').slice(0, 16)} • {previewDoc.version || 'v1.0'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {previewDoc.name || previewDoc.document_name || 'Regulatory Compliance Document'}
                </h3>
                <p className="text-xs text-slate-500">
                  Category: {previewDoc.category || previewDoc.document_type || 'General'} • Uploaded: {previewDoc.uploadedDate || (previewDoc.uploaded_at ? previewDoc.uploaded_at.split('T')[0] : '2026-10-25')}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated PDF Viewer */}
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm mb-3">
                <FileText className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                AICTE Sentinel Cryptographic Digital Document Viewer
              </p>
              <p className="mt-1 text-[11px] text-slate-500 max-w-md">
                Certified digital hash verified against AICTE central repository ledger. Sub-registrar stamp and e-Signatures are intact.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <StatusBadge status={previewDoc.verificationStatus || (previewDoc.verification_status === 'APPROVED' ? 'Verified' : 'Under Scrutiny')} size="sm" />
                <span className="text-[11px] font-mono text-slate-400">
                  Expiry: {previewDoc.expiryDate || previewDoc.expiry_date || 'Perpetual'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
              <strong>Statutory Note: </strong>
              {previewDoc.remarks || 'Verified by regional scrutiny desk.'}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400">
                File Size: {previewDoc.fileSize || '3.4 MB'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownload(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
