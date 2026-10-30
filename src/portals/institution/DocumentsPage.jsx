import React, { useState, useMemo } from 'react';
import {
  Upload, FileText, CheckCircle, AlertCircle, Clock,
  Search, Filter, ChevronDown, Trash2, Eye, Download,
  X, File, Image, Sheet, AlertTriangle
} from 'lucide-react';
import { mockDocuments, documentCategories } from '../../data/mockData';

const STATUS_CFG = {
  approved: { label: 'Approved', cls: 'badge-green', color: '#10b981' },
  pending_upload: { label: 'Pending Upload', cls: 'badge-red', color: '#f87171' },
  under_review: { label: 'Under Review', cls: 'badge-gold', color: '#fbbf24' },
  rejected: { label: 'Rejected', cls: 'badge-red', color: '#f87171' },
};

const FILE_RULES = {
  'application/pdf': { icon: FileText, color: '#f87171', label: 'PDF' },
  'image/jpeg': { icon: Image, color: '#6b93f0', label: 'JPG' },
  'image/png': { icon: Image, color: '#6b93f0', label: 'PNG' },
  'application/vnd.ms-excel': { icon: FileText, color: '#34d399', label: 'XLS' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileText, color: '#34d399', label: 'XLSX' },
};

const MAX_SIZE_MB = 20;
const ALLOWED_TYPES = Object.keys(FILE_RULES);

function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateFiles = (files) => {
    const valid = [];
    const errs = [];
    Array.from(files).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`${file.name}: Invalid file type. Use PDF, JPG, PNG, or Excel.`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`${file.name}: File too large. Max ${MAX_SIZE_MB}MB allowed.`);
      } else {
        valid.push(file);
      }
    });
    setErrors(errs);
    if (valid.length) onUpload(valid);
  };

  return (
    <div className="mb-6">
      <label
        className="flex flex-col items-center justify-center w-full min-h-40 rounded-2xl cursor-pointer transition-all duration-300"
        style={{
          border: dragging ? '2px solid #2457d4' : '2px dashed rgba(59,110,232,0.3)',
          background: dragging ? 'rgba(36,87,212,0.08)' : 'rgba(6,15,46,0.4)',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); validateFiles(e.dataTransfer.files); }}
      >
        <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
          onChange={e => validateFiles(e.target.files)} />
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(36,87,212,0.1)', border: '1px solid rgba(59,110,232,0.2)' }}>
            <Upload size={26} style={{ color: dragging ? '#2457d4' : '#6b93f0' }} />
          </div>
          <div>
            <div className="text-base font-semibold text-white mb-1">
              {dragging ? 'Drop files here' : 'Drag & drop or click to upload'}
            </div>
            <div className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Supports PDF, JPG, PNG, Excel • Max {MAX_SIZE_MB}MB per file
            </div>
          </div>
          <div className="btn-secondary text-sm py-2 px-4">Browse Files</div>
        </div>
      </label>

      {errors.length > 0 && (
        <div className="mt-3 space-y-2">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
              <span className="text-sm" style={{ color: '#f87171' }}>{err}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentCard({ doc, onView, onDelete }) {
  const sc = STATUS_CFG[doc.status] || STATUS_CFG.pending_upload;

  return (
    <div className="rounded-xl p-4 transition-all duration-200"
      style={{ border: '1px solid rgba(59,110,232,0.15)', background: 'rgba(6,15,46,0.5)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,110,232,0.3)'; e.currentTarget.style.background = 'rgba(10,24,64,0.7)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,110,232,0.15)'; e.currentTarget.style.background = 'rgba(6,15,46,0.5)'; }}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: doc.status === 'pending_upload' ? 'rgba(239,68,68,0.1)' : 'rgba(36,87,212,0.1)', border: `1px solid ${sc.color}30` }}>
          {doc.status === 'pending_upload' ? <Upload size={18} style={{ color: '#f87171' }} /> : <FileText size={18} style={{ color: '#6b93f0' }} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{doc.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(36,87,212,0.1)', color: 'rgba(240,244,255,0.5)' }}>{doc.category}</span>
                {doc.required && <span className="text-xs" style={{ color: '#f87171' }}>Required</span>}
              </div>
            </div>
            <div className={sc.cls} style={{ flexShrink: 0 }}>{sc.label}</div>
          </div>

          {doc.uploadedDate ? (
            <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>
              <span>Uploaded: {doc.uploadedDate}</span>
              <span>•</span>
              <span>{doc.fileSize}</span>
              <span>•</span>
              <span>{doc.fileType}</span>
            </div>
          ) : (
            <div className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
              {doc.remarks || 'Document not yet uploaded'}
            </div>
          )}

          {doc.remarks && doc.uploadedDate && (
            <div className="text-xs mt-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(10,24,64,0.6)', color: 'rgba(240,244,255,0.5)' }}>
              Note: {doc.remarks}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(59,110,232,0.1)' }}>
        {doc.uploadedDate ? (
          <>
            <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors"
              style={{ background: 'rgba(36,87,212,0.1)', color: '#6b93f0', border: 'none', cursor: 'pointer' }}
              onClick={() => onView(doc)}>
              <Eye size={12} /> View
            </button>
            <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'none', cursor: 'pointer' }}>
              <Download size={12} /> Download
            </button>
            <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors ml-auto"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'none', cursor: 'pointer' }}
              onClick={() => onDelete(doc.id)}>
              <Trash2 size={12} /> Remove
            </button>
          </>
        ) : (
          <label className="cursor-pointer">
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" />
            <div className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg btn-primary text-xs py-1.5 px-3">
              <Upload size={12} /> Upload Now
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

function UploadedFilePreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className="mb-6 space-y-2">
      <div className="text-sm font-medium text-white mb-2">Uploaded Files</div>
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <FileText size={14} style={{ color: '#34d399' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{f.name}</div>
            <div className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>{(f.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: '#34d399' }}>Ready</span>
          </div>
          <button onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState(mockDocuments);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewDoc, setViewDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveUploaded = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeleteDoc = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const filtered = useMemo(() => {
    return docs.filter(d => {
      const matchCat = categoryFilter === 'All' || d.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || (activeTab === 'pending' && d.status === 'pending_upload') ||
        (activeTab === 'uploaded' && d.uploadedDate);
      return matchCat && matchStatus && matchSearch && matchTab;
    });
  }, [docs, categoryFilter, statusFilter, search, activeTab]);

  const pendingCount = docs.filter(d => d.status === 'pending_upload').length;
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const reviewCount = docs.filter(d => d.status === 'under_review').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Document Management</h2>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Upload and manage all institutional documents</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={16} style={{ color: '#f87171' }} />
            <span className="text-sm font-medium" style={{ color: '#f87171' }}>{pendingCount} documents pending upload</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Documents', value: docs.length, color: '#6b93f0' },
          { label: 'Approved', value: approvedCount, color: '#10b981' },
          { label: 'Pending Upload', value: pendingCount, color: '#f87171' },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center py-4">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Outfit,sans-serif' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h3 className="text-sm font-semibold text-white mb-4">Upload Documents</h3>
            <UploadZone onUpload={handleUpload} />
            <UploadedFilePreview files={uploadedFiles} onRemove={handleRemoveUploaded} />
            {uploadedFiles.length > 0 && (
              <button className="btn-accent w-full justify-center text-sm">
                <Upload size={14} /> Submit {uploadedFiles.length} File(s)
              </button>
            )}

            {/* Allowed formats */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(59,110,232,0.1)' }}>
              <div className="text-xs font-medium mb-2" style={{ color: 'rgba(240,244,255,0.5)' }}>ALLOWED FORMATS</div>
              <div className="flex flex-wrap gap-2">
                {['PDF', 'JPG', 'PNG', 'Excel'].map(f => (
                  <span key={f} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(36,87,212,0.1)', color: '#6b93f0', border: '1px solid rgba(36,87,212,0.2)' }}>{f}</span>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>Maximum file size: 20 MB per document</p>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'all', label: 'All Documents', count: docs.length },
              { key: 'pending', label: 'Pending Upload', count: pendingCount },
              { key: 'uploaded', label: 'Uploaded', count: docs.filter(d => d.uploadedDate).length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}>
                {tab.label} <span className="ml-1 text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search documents..." />
            </div>
            <div className="relative">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field text-sm pr-8" style={{ minWidth: '130px' }}>
                {documentCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
            </div>
          </div>

          {/* Document Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={40} style={{ color: 'rgba(59,110,232,0.3)', margin: '0 auto 12px' }} />
              <div className="text-white font-medium">No documents found</div>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map(doc => (
                <DocumentCard key={doc.id} doc={doc} onView={setViewDoc} onDelete={handleDeleteDoc} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document View Modal */}
      {viewDoc && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,8,24,0.85)' }}>
            <div className="w-full max-w-md rounded-2xl p-6 animate-fade-in-up" style={{ background: '#060f2e', border: '1px solid rgba(59,110,232,0.3)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-base font-semibold text-white">{viewDoc.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.5)' }}>{viewDoc.category} • {viewDoc.fileType} • {viewDoc.fileSize}</div>
                </div>
                <button onClick={() => setViewDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,244,255,0.5)' }}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-8 rounded-xl text-center mb-4" style={{ background: 'rgba(10,24,64,0.6)', border: '1px solid rgba(59,110,232,0.15)' }}>
                <FileText size={48} style={{ color: '#6b93f0', margin: '0 auto 12px' }} />
                <div className="text-sm" style={{ color: 'rgba(240,244,255,0.6)' }}>Document preview available in full version</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>Uploaded: {viewDoc.uploadedDate}</div>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary flex-1 justify-center text-sm"><Download size={14} /> Download</button>
                <button className="btn-primary flex-1 justify-center text-sm"><Eye size={14} /> Full View</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
