import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';

export default function FileUpload({
  label = 'Upload Supporting Document',
  hint = 'PDF, JPG, PNG, or Excel format up to 20MB. Ensure document is signed and stamped.',
  onFileSelect,
  selectedFiles = [],
  onRemoveFile,
  maxSizeMB = 20,
  accept = '.pdf,.jpg,.jpeg,.png,.xlsx,.xls',
  multiple = false,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = (fileList) => {
    setError(null);
    const validFiles = [];

    Array.from(fileList).forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`"${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push({
        file,
        name: file.name,
        size: `${sizeMB.toFixed(2)} MB`,
        type: file.type || 'Document',
        uploadedAt: new Date().toLocaleTimeString(),
      });
    });

    if (validFiles.length > 0 && onFileSelect) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}

      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragOver
            ? 'border-[#2563EB] bg-blue-50/50 scale-[1.01]'
            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Click to upload or drag & drop documents
        </p>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">{hint}</p>

        <label className="mt-4 cursor-pointer rounded-lg bg-white border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-colors">
          <span>Browse Device</span>
          <input
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-slate-600">Attached Document(s):</p>
          {selectedFiles.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 text-[#2563EB] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {f.name || f}
                  </p>
                  {f.size && (
                    <p className="text-[10px] text-slate-400">{f.size}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                </span>
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
