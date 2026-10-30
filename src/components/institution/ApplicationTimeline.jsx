import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building2,
  UserCheck,
  ArrowRight,
  Info
} from 'lucide-react';

export default function ApplicationTimeline({ stages = [], currentStage = 1, showDetails = true }) {
  const getStageStatus = (stage) => {
    if (stage.status === 'completed') return 'completed';
    if (stage.status === 'in_progress') return 'in_progress';
    if (stage.status === 'rejected') return 'rejected';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* SLA Disclaimer banner */}
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900">
        <Info className="h-4 w-4 flex-shrink-0 text-[#2563EB] mt-0.5" />
        <p className="leading-relaxed">
          <strong>SLA Target Notice:</strong> Configured SLA targets (e.g. 7-15 days) indicate standard administrative benchmarks set within the Sentinel simulation model. Official dates are recorded when verified by designated AICTE bureau authorities.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 before:absolute before:bottom-0 before:top-2 before:left-[17px] sm:before:left-[21px] before:w-[2px] before:bg-slate-200">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage);
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in_progress';
          const isRejected = status === 'rejected';

          return (
            <div key={stage.id || index} className="relative mb-8 last:mb-0">
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-[25px] sm:-left-[29px] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                    : isInProgress
                    ? 'border-[#2563EB] bg-[#2563EB] text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                    : isRejected
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isInProgress ? (
                  <Clock className="h-4 w-4" />
                ) : isRejected ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{stage.id || index + 1}</span>
                )}
              </div>

              {/* Stage Content Card */}
              <div
                className={`rounded-xl border p-4 shadow-sm transition-all ${
                  isInProgress
                    ? 'border-blue-300 bg-blue-50/30'
                    : isCompleted
                    ? 'border-slate-200 bg-white'
                    : isRejected
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      STAGE 0{stage.id || index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {stage.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {stage.slaDays && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                        Target: {stage.slaDays}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted
                        ? 'Completed'
                        : isInProgress
                        ? 'Current Active Stage'
                        : isRejected
                        ? 'Rejected'
                        : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Authority & Date Details */}
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <div>
                    <span className="text-slate-400">Responsible Authority: </span>
                    <span className="font-semibold text-slate-700">
                      {stage.authority || 'AICTE Delegated Officer / Bureau'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Execution / Action Date: </span>
                    <span className="font-semibold text-slate-700 font-mono">
                      {stage.date || 'Pending Execution'}
                    </span>
                  </div>
                </div>

                {/* Officer remarks if available */}
                {stage.remarks && (
                  <div className="mt-2.5 rounded-lg bg-slate-100/90 border border-slate-200/80 p-2.5 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Officer Note: </span>
                    {stage.remarks}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
