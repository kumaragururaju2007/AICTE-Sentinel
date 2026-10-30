import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, ChevronRight, ChevronDown, FileText,
  CheckCircle, Clock, XCircle, AlertCircle, Eye, Download,
  Calendar, User, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { mockApplications } from '../../data/mockData';

const STATUS_CONFIG = {
  approved: { label: 'Approved', cls: 'badge-green', icon: CheckCircle, color: '#10b981' },
  under_review: { label: 'Under Review', cls: 'badge-blue', icon: Clock, color: '#6b93f0' },
  pending_documents: { label: 'Docs Pending', cls: 'badge-gold', icon: AlertCircle, color: '#fbbf24' },
  rejected: { label: 'Rejected', cls: 'badge-red', icon: XCircle, color: '#f87171' },
  submitted: { label: 'Submitted', cls: 'badge-blue', icon: FileText, color: '#6b93f0' },
};

const STAGE_CONFIG = {
  completed: { bg: '#10b981', border: '#10b981', text: '#10b981', dot: '#10b981' },
  in_progress: { bg: '#2457d4', border: '#2457d4', text: '#6b93f0', dot: '#2457d4' },
  rejected: { bg: '#ef4444', border: '#ef4444', text: '#f87171', dot: '#ef4444' },
  pending: { bg: 'rgba(59,110,232,0.1)', border: 'rgba(59,110,232,0.2)', text: 'rgba(240,244,255,0.3)', dot: 'rgba(59,110,232,0.2)' },
};

function StageTimeline({ stages }) {
  return (
    <div className="space-y-0">
      {stages.map((stage, idx) => {
        const sc = STAGE_CONFIG[stage.status] || STAGE_CONFIG.pending;
        const isLast = idx === stages.length - 1;
        return (
          <div key={stage.id} className="flex gap-4">
            {/* Timeline Track */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ background: `${sc.dot}20`, border: `2px solid ${sc.dot}` }}>
                {stage.status === 'completed' ? <CheckCircle size={14} style={{ color: sc.dot }} /> :
                  stage.status === 'in_progress' ? <RefreshCw size={14} style={{ color: sc.dot }} className="animate-spin" /> :
                    stage.status === 'rejected' ? <XCircle size={14} style={{ color: sc.dot }} /> :
                      <span className="text-xs font-bold" style={{ color: sc.text }}>{stage.id}</span>}
              </div>
              {!isLast && <div className="w-px flex-1 my-1" style={{ background: `${sc.dot}40`, minHeight: '24px' }} />}
            </div>

            {/* Stage Content */}
            <div className="pb-6 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{stage.name}</div>
                  {stage.officer && <div className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.5)' }}>Officer: {stage.officer}</div>}
                </div>
                <div className="text-right flex-shrink-0">
                  {stage.date && <div className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>{stage.date}</div>}
                  <div className="text-xs font-medium mt-0.5" style={{ color: sc.text }}>
                    {stage.status === 'completed' ? 'Completed' : stage.status === 'in_progress' ? 'In Progress' :
                      stage.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </div>
                </div>
              </div>
              {stage.remarks && (
                <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(6,15,46,0.6)', border: '1px solid rgba(59,110,232,0.15)', color: 'rgba(240,244,255,0.65)' }}>
                  {stage.remarks}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationDetailPanel({ app, onClose }) {
  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col"
      style={{ background: '#060f2e', borderLeft: '1px solid rgba(59,110,232,0.25)', boxShadow: '-20px 0 60px rgba(2,8,24,0.8)' }}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'rgba(59,110,232,0.15)' }}>
        <div className="flex-1 min-w-0">
          <div className="text-xs mb-1" style={{ color: 'rgba(240,244,255,0.5)' }}>{app.id}</div>
          <h3 className="text-base font-semibold text-white leading-snug">{app.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={sc.cls}>{sc.label}</div>
            <div className="badge-blue">{app.type}</div>
          </div>
        </div>
        <button onClick={onClose} className="ml-4 p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer' }}>
          <XCircle size={16} />
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Program', value: app.programName },
            { label: 'Submitted', value: app.submittedDate },
            { label: 'Last Updated', value: app.lastUpdated },
            { label: 'Assigned To', value: app.assignedOfficer || 'Unassigned' },
            app.intake && { label: 'Intake', value: `${app.intake} students` },
            app.duration && { label: 'Duration', value: app.duration },
          ].filter(Boolean).map((item, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(10,24,64,0.5)', border: '1px solid rgba(59,110,232,0.12)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Application Progress</span>
            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>Stage {app.currentStage}/{app.totalStages}</span>
          </div>
          <div className="progress-bar mb-1">
            <div className="progress-fill" style={{ width: `${(app.currentStage / app.totalStages) * 100}%` }} />
          </div>
          <div className="text-right text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {Math.round((app.currentStage / app.totalStages) * 100)}% Complete
          </div>
        </div>

        {/* Stage Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Stage History</h4>
          <StageTimeline stages={app.stages} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t flex gap-3" style={{ borderColor: 'rgba(59,110,232,0.15)' }}>
        <button className="btn-secondary flex-1 justify-center text-sm py-2">
          <Download size={14} /> Download
        </button>
        <button className="btn-primary flex-1 justify-center text-sm py-2">
          <ArrowUpRight size={14} /> View Full Details
        </button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [sortBy, setSortBy] = useState('lastUpdated');

  const allStatuses = ['all', ...Object.keys(STATUS_CONFIG)];
  const allTypes = ['all', ...new Set(mockApplications.map(a => a.type))];

  const filtered = useMemo(() => {
    return mockApplications
      .filter(a => {
        const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchType = typeFilter === 'all' || a.type === typeFilter;
        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => {
        if (sortBy === 'lastUpdated') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        if (sortBy === 'submittedDate') return new Date(b.submittedDate) - new Date(a.submittedDate);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }, [search, statusFilter, typeFilter, sortBy]);

  const statusCounts = useMemo(() => {
    const counts = {};
    mockApplications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Applications</h2>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Manage and track all your AICTE applications</p>
        </div>
        <button className="btn-primary text-sm py-2 px-4" onClick={() => navigate('/institution/new-application')}>
          + New Application
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allStatuses.map(s => {
          const count = s === 'all' ? mockApplications.length : (statusCounts[s] || 0);
          const label = s === 'all' ? 'All' : (STATUS_CONFIG[s]?.label || s);
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`tab-btn ${statusFilter === s ? 'active' : ''}`}>
              {label}
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: statusFilter === s ? 'rgba(36,87,212,0.3)' : 'rgba(59,110,232,0.1)', color: statusFilter === s ? '#6b93f0' : 'rgba(240,244,255,0.5)' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm"
            placeholder="Search by title or application ID..." />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field text-sm pr-8" style={{ minWidth: '160px' }}>
            {allTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
        </div>

        {/* Sort */}
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field text-sm pr-8" style={{ minWidth: '140px' }}>
            <option value="lastUpdated">Sort: Last Updated</option>
            <option value="submittedDate">Sort: Submitted Date</option>
            <option value="status">Sort: Status</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs mb-4" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Showing {filtered.length} of {mockApplications.length} applications
      </div>

      {/* Application Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={48} style={{ color: 'rgba(59,110,232,0.3)', margin: '0 auto 16px' }} />
          <div className="text-white font-medium mb-2">No applications found</div>
          <div className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Try adjusting your search or filters</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
            const StatusIcon = sc.icon;
            return (
              <div key={app.id}
                className="rounded-xl p-5 cursor-pointer transition-all duration-200"
                style={{ border: '1px solid rgba(59,110,232,0.15)', background: 'rgba(6,15,46,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,24,64,0.8)'; e.currentTarget.style.borderColor = 'rgba(59,110,232,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,15,46,0.5)'; e.currentTarget.style.borderColor = 'rgba(59,110,232,0.15)'; }}
                onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}30` }}>
                    <StatusIcon size={18} style={{ color: sc.color }} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{app.title}</h3>
                      <div className={sc.cls}>{sc.label}</div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>
                      <span className="flex items-center gap-1"><FileText size={11} /> {app.id}</span>
                      <span className="flex items-center gap-1"><User size={11} /> {app.type}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> Submitted {app.submittedDate}</span>
                      {app.assignedOfficer && <span className="flex items-center gap-1">👤 {app.assignedOfficer}</span>}
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="progress-bar flex-1">
                        <div className="progress-fill" style={{ width: `${(app.currentStage / app.totalStages) * 100}%` }} />
                      </div>
                      <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(240,244,255,0.5)' }}>
                        Stage {app.currentStage}/{app.totalStages}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(36,87,212,0.1)', border: 'none', cursor: 'pointer', color: '#6b93f0' }}
                      onClick={e => { e.stopPropagation(); setSelectedApp(app); }}>
                      <Eye size={14} />
                    </button>
                    <ChevronRight size={14} style={{ color: 'rgba(240,244,255,0.3)' }} />
                  </div>
                </div>

                {/* Expanded Stage Preview */}
                {selectedApp?.id === app.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(59,110,232,0.15)' }}>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {app.stages.map(stage => {
                        const stCfg = STAGE_CONFIG[stage.status] || STAGE_CONFIG.pending;
                        return (
                          <div key={stage.id} className="flex flex-col items-center min-w-[80px]">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center mb-1" style={{ background: `${stCfg.dot}20`, border: `2px solid ${stCfg.dot}` }}>
                              {stage.status === 'completed' ? <CheckCircle size={10} style={{ color: stCfg.dot }} /> :
                                <span className="text-xs" style={{ color: stCfg.text }}>{stage.id}</span>}
                            </div>
                            <div className="text-xs text-center leading-tight" style={{ color: stCfg.text, maxWidth: '70px' }}>{stage.name}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <button className="btn-primary text-xs py-1.5 px-3"
                        onClick={e => { e.stopPropagation(); /* full detail view */ }}>
                        View Full Stage History <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel Overlay */}
      {selectedApp && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(2,8,24,0.6)' }} onClick={() => setSelectedApp(null)} />
          <ApplicationDetailPanel app={selectedApp} onClose={() => setSelectedApp(null)} />
        </>
      )}
    </div>
  );
}
