import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Activity,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import ApplicationTimeline from '../../components/institution/ApplicationTimeline';
import { useInstitution } from './context/InstitutionContext';

export default function ApplicationTracking() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { applications } = useInstitution();

  const currentAppId = searchParams.get('id') || applications[0]?.id;
  const currentApp = applications.find(a => a.id === currentAppId) || applications[0];

  const handleSelectApp = (id) => {
    setSearchParams({ id });
  };

  if (!currentApp) {
    return (
      <div className="p-8 text-center text-slate-500">
        No applications available to track.
      </div>
    );
  }

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

  const stageNumber = getStageNumber(currentApp.currentStage);
  const totalStages = currentApp.totalStages || 6;
  const completionPercent = Math.min(100, Math.round((stageNumber / totalStages) * 100));

  const displayTitle = currentApp.title || (currentApp.applicationType ? `${currentApp.applicationType} - ${currentApp.courseType || currentApp.programName || 'Engineering & Technology'}` : 'Technical Approval Dossier');
  const displayAppId = currentApp.applicationNumber || currentApp.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Stage Tracking & SLA Monitor"
        subtitle="Track multi-stage regulatory scrutinies, EVC inspections, and committee approvals."
        breadcrumb={['Home', 'Applications', 'Stage Tracking']}
        actions={
          <div className="relative inline-flex items-center">
            <label className="text-xs font-bold text-slate-500 mr-2 hidden sm:inline">
              Switch Application:
            </label>
            <select
              value={currentApp.id}
              onChange={e => handleSelectApp(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-bold text-slate-800 shadow-sm focus:border-[#2563EB] focus:outline-none cursor-pointer"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.applicationNumber || app.id} – {app.programName || app.courseType || app.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        }
      />

      {/* Application Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {displayAppId}
              </span>
              <StatusBadge status={currentApp.status || 'Under Review'} size="md" />
              <span className="text-xs text-slate-500 font-mono">
                AY {currentApp.academicYear || '2026-27'}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                {currentApp.type || currentApp.applicationType || 'Regulatory Approval'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {displayTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Assigned Scrutiny Desk: <strong>{currentApp.assignedOfficer || 'Regional Allocation Cell'}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="text-center sm:text-right">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                Overall Progress
              </span>
              <span className="text-2xl font-extrabold text-[#123B70] font-mono">
                {completionPercent}%
              </span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="text-left text-xs">
              <span className="text-slate-500 block">Active Milestone:</span>
              <span className="font-bold text-blue-700">
                Stage 0{stageNumber} of 0{totalStages}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Info Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[11px]">Submission Date</span>
            <strong className="text-slate-800 font-mono text-sm">{currentApp.submissionDate || '2026-10-25'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[11px]">Last Updated</span>
            <strong className="text-slate-800 font-mono text-sm">{currentApp.lastUpdated || currentApp.submissionDate || '2026-10-28'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[11px]">Intake Capacity</span>
            <strong className="text-slate-800 text-sm">{currentApp.intake || currentApp.intakeRequested || 60} Students</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[11px]">Active Deficiencies</span>
            <strong className={`text-sm ${(currentApp.deficiencyCount || 0) > 0 ? 'text-amber-600 font-bold' : 'text-emerald-600'}`}>
              {(currentApp.deficiencyCount || 0) > 0 ? `${currentApp.deficiencyCount} Pending` : 'None (Clear)'}
            </strong>
          </div>
        </div>

        {/* Detailed Timeline Component */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#2563EB]" />
            Regulatory Progression & Bureau Verification Timeline
          </h3>
          <ApplicationTimeline
            stages={currentApp.stages || []}
            currentStage={currentApp.currentStage}
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Tracked via Sentinel Intelligent Regulatory Workflow Engine
          </span>
          <div className="flex gap-2">
            {(currentApp.deficiencyCount || 0) > 0 && (
              <button
                type="button"
                onClick={() => navigate('/institution/deficiencies')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-amber-700 transition-colors"
              >
                <span>View Deficiency Notices</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/institution/applications')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}