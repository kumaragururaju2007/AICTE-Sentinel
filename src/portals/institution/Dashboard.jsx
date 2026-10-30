import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  ArrowRight,
  Sparkles,
  Calendar,
  Building,
  UploadCloud,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import SmartAlertsBanner from '../../components/institution/SmartAlertsBanner';
import ObligationClock from '../../components/institution/ObligationClock';
import ComplianceHealthCard from '../../components/institution/ComplianceHealthCard';
import { useInstitution } from './context/InstitutionContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, stats, applications, deficiencies, leaseDocuments, undertakings, documents } = useInstitution();

  const recentApps = applications.slice(0, 4);

  // Status breakdown for chart
  const statusCounts = {
    Approved: applications.filter(a => a.status === 'Approved').length,
    'Under Scrutiny': applications.filter(a => a.status === 'Initial Scrutiny' || a.status === 'Application Submitted').length,
    Deficiency: applications.filter(a => a.status === 'Deficiency Review').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const pendingActions = [
    {
      id: 'act-1',
      title: 'Respond to Scrutiny Deficiency for B.Tech AI & ML',
      description: 'Upload current OEM calibration report for GPU Cluster before Nov 5, 2025 deadline.',
      path: '/institution/deficiencies',
      priority: 'critical',
      badge: 'Deficiency Notice',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'act-2',
      title: 'Execute & Upload Renewed Sports Arena Land Lease',
      description: 'Sub-registrar 30-year renewal required for continuing approval compliance.',
      path: '/institution/lease-validity',
      priority: 'high',
      badge: 'Lease Expiry',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'act-3',
      title: 'Submit Barrier-Free PwD Environment Compliance Evidence',
      description: 'Upload photographic proof of tactile pavers & Braille elevators in Block 3.',
      path: '/institution/undertakings',
      priority: 'high',
      badge: 'Undertaking Evidence',
      icon: FileCheck2,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'act-4',
      title: 'Review EVC Inspection Preparation Checklist',
      description: 'EVC inspection surprise window begins Nov 10. Verify all 7 preparation items.',
      path: '/institution/evc-inspection',
      priority: 'medium',
      badge: 'EVC Inspection',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Institution Overview Dashboard"
        subtitle={`Welcome back, ${profile.principal?.name || 'Dr. Principal'}. Overview of approvals, deficiencies, and obligations.`}
        badgeText="Demo Environment"
        breadcrumb={['Home', 'Institution Portal', 'Dashboard']}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/institution/new-application')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow"
            >
              <span>+ New Application</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/institution/documents')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <UploadCloud className="h-4 w-4 text-slate-500" />
              <span>Document Vault</span>
            </button>
          </>
        }
      />

      {/* Smart Alerts Banner */}
      <SmartAlertsBanner />

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Applications"
          value={stats.totalApplications}
          subtext="Submitted across all academic cycles"
          trend="+2 This Cycle"
          color="navy"
          onClick={() => navigate('/institution/applications')}
        />
        <StatCard
          icon={Clock}
          label="Pending Applications"
          value={stats.pendingReview}
          subtext="Under scrutiny & committee review"
          color="amber"
          onClick={() => navigate('/institution/applications?status=in_review')}
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved Applications"
          value={stats.approvedApplications}
          subtext="Letter of Approvals (LOA) issued"
          trend="50% Approval Rate"
          color="green"
          onClick={() => navigate('/institution/applications?status=approved')}
        />
        <StatCard
          icon={AlertTriangle}
          label="Upcoming Obligations"
          value={stats.upcomingObligations}
          subtext="Deficiencies, leases & undertakings"
          color="rose"
          onClick={() => navigate('/institution/deficiencies')}
        />
      </div>

      {/* Section: My Pending Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2563EB] text-white text-xs">
                ⚡
              </span>
              My Pending Actions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Urgent tasks requiring prompt institutional response to avoid approval delays
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {pendingActions.length} Actions Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {pendingActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => navigate(action.path)}
                className="group flex items-start gap-3.5 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-slate-50/70 hover:shadow-sm cursor-pointer"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {action.badge}
                    </span>
                    <StatusBadge status={action.priority} size="sm" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors line-clamp-1">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Column (Obligations + Recent Apps) & Right Column (Compliance + Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Obligation Clock */}
          <ObligationClock />

          {/* Recently Submitted Applications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recently Submitted Applications
                </h3>
                <p className="text-xs text-slate-500">
                  Active programs queued through AICTE Sentinel
                </p>
              </div>
              <Link
                to="/institution/applications"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
              >
                <span>View All ({applications.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/institution/application-tracking?id=${app.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/90 p-4 transition-all hover:border-blue-300 hover:bg-slate-50/50 cursor-pointer shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-600">
                        {app.id}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                      <span className="text-xs text-slate-400 font-mono">
                        AY {app.academicYear}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors truncate">
                      {app.title}
                    </h4>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Type: <strong>{app.type}</strong></span>
                      <span>•</span>
                      <span>Intake: <strong>{app.intake} seats</strong></span>
                      <span>•</span>
                      <span>Officer: <strong>{app.assignedOfficer}</strong></span>
                    </div>

                    {/* Stage Progress */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-emerald-500 transition-all duration-700"
                          style={{
                            width: `${(app.currentStage / app.totalStages) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                        Stage {app.currentStage} of {app.totalStages}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                    <span className="text-[11px] text-slate-400">
                      Submitted {app.submissionDate}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:underline mt-1"
                    >
                      Track Stage <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Document Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Missing & Expired Document Alerts
                </h3>
              </div>
              <Link
                to="/institution/documents"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Manage Repository →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents
                .filter(d => d.verificationStatus === 'Expired' || d.verificationStatus === 'Expiring Soon')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                          {doc.category}
                        </span>
                        <StatusBadge status={doc.verificationStatus} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {doc.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                        {doc.remarks}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-2 text-xs">
                      <span className="text-slate-400 text-[10px]">
                        Expiry: {doc.expiryDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/institution/documents')}
                        className="font-bold text-[#2563EB] hover:underline"
                      >
                        Upload Renewed Copy
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Compliance Health Score */}
          <ComplianceHealthCard />

          {/* Simple Application Status Distribution Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Application Pipeline Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time portfolio status breakdown
            </p>

            <div className="space-y-3">
              {Object.entries(statusCounts).map(([label, count]) => {
                const percentage = applications.length ? Math.round((count / applications.length) * 100) : 0;
                const colors = {
                  Approved: 'bg-emerald-500',
                  'Under Scrutiny': 'bg-blue-500',
                  Deficiency: 'bg-amber-500',
                  Rejected: 'bg-rose-500',
                };
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{label}</span>
                      <span className="font-bold text-slate-900">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${colors[label] || 'bg-slate-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Officer Remarks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Officer Remarks
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
            </div>

            <div className="space-y-3.5">
              {deficiencies.slice(0, 3).map((def) => (
                <div
                  key={def.id}
                  onClick={() => navigate('/institution/deficiencies')}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      {def.officerName}
                    </span>
                    <span className="text-[10px] text-slate-400">{def.dateRaised}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-1 font-mono">
                    {def.applicationId} • {def.officerDesignation}
                  </p>
                  <p className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                    "{def.officerRemarks}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

