import React from 'react';
import { Calendar, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function DeadlineCard({
  title,
  dueDate,
  category,
  daysLeft,
  applicationId,
  owner = 'Principal / Institution Head',
  priority = 'medium',
  onAction,
  actionText = 'Resolve Now',
}) {
  const isOverdue = daysLeft < 0;
  const isDueSoon = daysLeft >= 0 && daysLeft <= 14;

  const cardBorder = isOverdue
    ? 'border-rose-300 bg-rose-50/40 hover:border-rose-400'
    : isDueSoon
    ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
    : 'border-slate-200 bg-white hover:border-blue-300';

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition-all duration-200 ${cardBorder}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <StatusBadge status={priority} size="sm" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {category}
            </span>
            {applicationId && (
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-mono font-medium text-blue-700 border border-blue-200">
                {applicationId}
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {title}
          </h4>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Due: <strong className="text-slate-700">{dueDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Owner: {owner}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isOverdue
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : isDueSoon
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isOverdue && <AlertTriangle className="h-3.5 w-3.5" />}
            <span>
              {isOverdue
                ? `${Math.abs(daysLeft)} Days Overdue`
                : daysLeft === 0
                ? 'Due Today!'
                : `${daysLeft} Days Left`}
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">
          AICTE Obligation SLA Tracking
        </span>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
          >
            {actionText} <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
