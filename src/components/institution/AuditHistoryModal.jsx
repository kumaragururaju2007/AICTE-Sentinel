import React, { useState } from 'react';
import { History, X, Shield, Search, User, Clock, Terminal } from 'lucide-react';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';

export default function AuditHistoryModal({ isOpen, onClose }) {
  const { auditLogs } = useInstitution();
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = auditLogs.filter(log =>
    !filter ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase()) ||
    log.user.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#123B70]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Institutional Regulatory Audit History
              </h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all portal interactions, submissions, and responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search audit trail by action, user, or reference..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
        </div>

        {/* Audit Log Entries */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching audit entries found.
            </div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                      {log.action}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {log.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  {log.details}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" />
                    User: <strong className="text-slate-700">{log.user}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="h-3 w-3 text-slate-400" />
                    IP: {log.ip}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>AICTE Sentinel Cryptographic Audit Trail (SIH 2026 Prototype)</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
