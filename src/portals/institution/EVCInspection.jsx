import React from 'react';
import {
  Eye,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building,
  UserCheck,
  CheckSquare,
  Square,
  FileText
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { useInstitution } from './context/InstitutionContext';

export default function EVCInspection() {
  const { evcData, toggleEvcChecklistItem } = useInstitution();

  const completedChecklistCount = evcData.preparationChecklist.filter(c => c.completed).length;
  const totalChecklist = evcData.preparationChecklist.length;
  const readyPercent = Math.round((completedChecklistCount / totalChecklist) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expert Visit Committee (EVC) & Inspection Status"
        subtitle="Live inspection window details, institutional preparedness checklist, and post-visit reports."
        breadcrumb={['Home', 'Compliance', 'EVC Inspection']}
      />

      {/* Official AICTE Authority Disclaimer Alert */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong className="block text-[#123B70] font-bold mb-0.5">
            Automated Confidential Panel Constitution Notice:
          </strong>
          {evcData.authorityDisclaimer}
        </div>
      </div>

      {/* Main Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Notice Ref: {evcData.noticeRef}
              </span>
              <StatusBadge status="Under Scrutiny" customLabel={evcData.status} size="md" />
              <span className="text-xs text-slate-500 font-mono">
                App: {evcData.applicationId}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              Specialized EVC Inspection for {evcData.courseName}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Inspection Mode: <strong>Hybrid Video Stream / Spot Verification</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <Calendar className="h-8 w-8 text-[#2563EB]" />
            <div className="text-left text-xs">
              <span className="text-slate-400 block text-[11px]">Proposed Window</span>
              <span className="font-bold text-slate-900 font-mono text-sm block">
                {evcData.windowDates}
              </span>
              <span className="text-emerald-700 font-semibold text-[11px]">
                48-hr advance date alert active
              </span>
            </div>
          </div>
        </div>

        {/* Panel Details & Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px] mb-1">Assigned Panel Bureau</span>
            <strong className="text-slate-800 text-sm block">{evcData.panelDetails.panelCode}</strong>
            <span className="text-slate-500 text-[11px] mt-1 block">
              Chair Specialization: {evcData.panelDetails.headSpecialization}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px] mb-1">Inspection Stage</span>
            <strong className="text-blue-700 text-sm block">{evcData.evcStage}</strong>
            <span className="text-slate-500 text-[11px] mt-1 block">
              Pre-visit telemetry and Geo-tagged laboratory verification
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px] mb-1">Institutional Readiness</span>
            <div className="flex items-center justify-between mb-1">
              <strong className="text-emerald-700 text-sm font-mono">{readyPercent}% Ready</strong>
              <span className="text-[11px] text-slate-500">{completedChecklistCount}/{totalChecklist} Tasks</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${readyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Preparation Checklist */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs mb-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-[#2563EB]" />
                Institution EVC Preparation Checklist (Click to Toggle)
              </h3>
              <p className="text-xs text-slate-500">
                Ensure all verification stations have designated nodal officers present
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#123B70] bg-blue-50 px-2 py-1 rounded">
              {completedChecklistCount} of {totalChecklist} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {evcData.preparationChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleEvcChecklistItem(item.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-900'
                    : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-white hover:border-blue-300'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-600 flex-shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 fill-emerald-100 text-emerald-600" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous EVC Remarks & Follow-Up Actions */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#2563EB]" />
            Historical EVC Inspection Remarks & Follow-Up Audit Log
          </h3>

          <div className="space-y-3">
            {evcData.previousRemarks.map((rem, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800">{rem.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{rem.date}</span>
                    <StatusBadge status="Compliant" size="sm" customLabel={rem.status} />
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed">
                  "{rem.remark}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
