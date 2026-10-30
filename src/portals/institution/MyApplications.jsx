import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Eye,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Calendar,
  User,
  X
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import { useInstitution } from './context/InstitutionContext';

export default function MyApplications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { applications = [] } = useInstitution();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'approved', label: 'Approved (LOA Issued)' },
    { value: 'in_review', label: 'In Scrutiny / Review' },
    { value: 'deficiency', label: 'Deficiencies Active' },
    { value: 'submitted', label: 'Newly Submitted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Application Types' },
    { value: 'New Course Approval', label: 'New Course Approval' },
    { value: 'Intake Increase', label: 'Intake Increase' },
    { value: 'Extension of Approval', label: 'Extension of Approval' },
    { value: 'Supernumerary Quota', label: 'Supernumerary Quota' },
    { value: 'Course Closure', label: 'Course Closure' },
  ];

  const getStageNumber = (stage) => {
    if (typeof stage === 'number') return stage;
    const str = String(stage || '').toLowerCase();
    if (str.includes('ingestion') || str.includes('submit')) return 1;
    if (str.includes('scrutiny')) return 2;
    if (str.includes('deficien')) return 3;
    if (str.includes('evc') || str.includes('inspect')) return 4;
    if (str.includes('hearing') || str.includes('sac') || str.includes('shc')) return 5;
    if (str.includes('final') || str.includes('approv')) return 6;
    return 2;
  };

  const filteredApplications = useMemo(() => {
    const list = Array.isArray(applications) ? applications : [];
    return list.filter((app) => {
      const appId = String(app.id || app.applicationNumber || '');
      const appTitle = String(app.title || app.courseType || app.applicationType || 'AICTE Regulatory Application');
      const appProg = String(app.programName || app.courseType || '');
      const query = (search || '').toLowerCase().trim();

      const matchSearch =
        !query ||
        appId.toLowerCase().includes(query) ||
        appTitle.toLowerCase().includes(query) ||
        appProg.toLowerCase().includes(query);

      let matchStatus = true;
      if (statusFilter !== 'all') {
        const s = String(app.status || '').toLowerCase();
        if (statusFilter === 'approved') matchStatus = s.includes('approv') || s.includes('final');
        else if (statusFilter === 'in_review')
          matchStatus = s.includes('scrutiny') || s.includes('submitted') || s.includes('review') || s.includes('evc');
        else if (statusFilter === 'deficiency') matchStatus = s.includes('deficien');
        else if (statusFilter === 'submitted') matchStatus = s.includes('submit') || s.includes('ingestion');
        else if (statusFilter === 'rejected') matchStatus = s.includes('reject');
      }

      const matchType =
        typeFilter === 'all' ||
        app.type === typeFilter ||
        app.applicationType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [applications, search, statusFilter, typeFilter]);

  const columns = [
    {
      header: 'Application ID',
      accessor: 'id',
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-[#123B70] block">
            {item.applicationNumber || item.id}
          </span>
          <span className="text-[11px] text-slate-400">
            {item.category || item.programLevel || item.level || 'UG / PG'}
          </span>
        </div>
      ),
    },
    {
      header: 'Program / Application Title',
      accessor: 'title',
      render: (item) => (
        <div className="max-w-xs sm:max-w-sm">
          <p className="font-semibold text-slate-900 truncate" title={item.title || item.courseType || item.applicationType}>
            {item.title || (item.applicationType ? `${item.applicationType} - ${item.courseType || 'Technical Programme'}` : 'Technical Approval Dossier')}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{item.type || item.applicationType || 'Extension of Approval'}</span>
            <span>•</span>
            <span>Intake: {item.intake || item.intakeRequested || 60}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYear',
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {item.academicYear || '2026-27'}
        </span>
      ),
    },
    {
      header: 'Submission Date',
      accessor: 'submissionDate',
      render: (item) => (
        <span className="text-xs text-slate-600 font-mono">
          {item.submissionDate || '2026-10-25'}
        </span>
      ),
    },
    {
      header: 'Current Stage',
      accessor: 'currentStage',
      render: (item) => {
        const stageNum = getStageNumber(item.currentStage);
        const total = item.totalStages || 6;
        const pct = Math.min(100, Math.round((stageNum / total) * 100));
        const stageLabel = typeof item.currentStage === 'string' && isNaN(Number(item.currentStage))
          ? item.currentStage
          : `Stage ${stageNum} of ${total}`;

        return (
          <div className="flex flex-col gap-1 min-w-[130px]">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="truncate max-w-[130px]" title={stageLabel}>{stageLabel}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => <StatusBadge status={item.status || 'Under Review'} size="sm" />,
    },
    {
      header: 'Assigned Officer',
      accessor: 'assignedOfficer',
      render: (item) => (
        <div className="text-xs text-slate-700 max-w-[140px] truncate" title={item.assignedOfficer}>
          {item.assignedOfficer || 'Regional Scrutiny Desk'}
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedApp(item);
            }}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-xs"
            title="View Details Modal"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/institution/application-tracking?id=${item.id}`);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            Track <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications Registry"
        subtitle="Comprehensive register of institutional applications, approval status, and stage progress."
        breadcrumb={['Home', 'Applications', 'My Applications']}
        actions={
          <button
            type="button"
            onClick={() => navigate('/institution/new-application')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Application</span>
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by ID, program title, discipline, or keyword..."
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          className="w-full md:w-56"
        />
        <FilterDropdown
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
          className="w-full md:w-56"
        />
      </div>

      {/* Applications Data Table */}
      <DataTable
        columns={columns}
        data={filteredApplications}
        onRowClick={(item) => setSelectedApp(item)}
        emptyTitle="No applications matching your criteria"
        emptyDescription="Try clearing your search filters or submit a new regulatory application."
      />

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedApp(null)}
          />

          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedApp.applicationNumber || selectedApp.id}
                  </span>
                  <StatusBadge status={selectedApp.status || 'Under Review'} size="sm" />
                  <span className="text-xs text-slate-400 font-mono">
                    AY {selectedApp.academicYear || '2026-27'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedApp.title || (selectedApp.applicationType ? `${selectedApp.applicationType} - ${selectedApp.courseType || 'Technical Programme'}` : 'Application Dossier')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Grid Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200/70 text-xs mb-5">
              <div>
                <span className="text-slate-400 block">Category:</span>
                <strong className="text-slate-800">{selectedApp.type || selectedApp.applicationType || 'Extension of Approval'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Officer:</span>
                <strong className="text-slate-800">{selectedApp.assignedOfficer || 'Regional Allocation Queue'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Submission Date:</span>
                <strong className="text-slate-800 font-mono">{selectedApp.submissionDate || '2026-10-25'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Proposed Intake:</span>
                <strong className="text-slate-800">{selectedApp.intake || selectedApp.intakeRequested || 60} Seats</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Duration:</span>
                <strong className="text-slate-800">{selectedApp.duration || '4 Years'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Current Stage:</span>
                <strong className="text-[#2563EB]">
                  {typeof selectedApp.currentStage === 'string' && isNaN(Number(selectedApp.currentStage))
                    ? selectedApp.currentStage
                    : `Stage ${getStageNumber(selectedApp.currentStage)} of 6`}
                </strong>
              </div>
            </div>

            {/* Stage Timeline Snippet */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Current Approval Progression:
              </h4>
              <div className="space-y-2">
                {selectedApp.stages &&
                  selectedApp.stages.map((stg) => (
                    <div
                      key={stg.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                        stg.status === 'completed'
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : stg.status === 'in_progress'
                          ? 'border-blue-200 bg-blue-50/50 font-bold'
                          : 'border-slate-200 bg-white opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {stg.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : stg.status === 'in_progress' ? (
                          <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                            {stg.id}
                          </span>
                        )}
                        <span>{stg.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {stg.date || (stg.slaDays ? `Target: ${stg.slaDays}` : 'Pending')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">
                Official AICTE Permanent ID: <strong className="font-mono text-slate-700">{selectedApp.permanentId || '1-43219081'}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetId = selectedApp.id;
                    setSelectedApp(null);
                    navigate(`/institution/application-tracking?id=${targetId}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <span>Detailed Stage Tracking</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
