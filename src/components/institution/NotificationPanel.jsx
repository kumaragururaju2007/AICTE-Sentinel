import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  XCircle,
  Eye,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function NotificationPanel({
  notifications = [],
  onMarkRead,
  onDelete,
  onClose,
  showActions = true,
}) {
  const navigate = useNavigate();

  const typeIcons = {
    deficiency: { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-700' },
    deadline: { icon: Clock, bg: 'bg-rose-100', color: 'text-rose-700' },
    evc: { icon: Eye, bg: 'bg-indigo-100', color: 'text-indigo-700' },
    approval: { icon: CheckCircle2, bg: 'bg-emerald-100', color: 'text-emerald-700' },
    undertaking: { icon: FileText, bg: 'bg-purple-100', color: 'text-purple-700' },
    application: { icon: FileText, bg: 'bg-blue-100', color: 'text-blue-700' },
    system: { icon: Bell, bg: 'bg-slate-100', color: 'text-slate-700' },
  };

  if (!notifications.length) {
    return (
      <div className="py-12 text-center text-slate-500">
        <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium">No notifications in this view</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {notifications.map((n) => {
        const typeInfo = typeIcons[n.type] || typeIcons.system;
        const Icon = typeInfo.icon;

        return (
          <div
            key={n.id}
            className={`p-4 transition-colors ${
              n.read ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/40 hover:bg-blue-50/70'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${typeInfo.bg} ${typeInfo.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={n.priority} size="sm" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(n.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.message}
                </p>

                {showActions && (
                  <div className="mt-2.5 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      {!n.read && onMarkRead && (
                        <button
                          type="button"
                          onClick={() => onMarkRead(n.id)}
                          className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
                        >
                          <Check className="h-3 w-3" /> Mark as Read
                        </button>
                      )}
                      {n.relatedPath && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onClose) onClose();
                            navigate(n.relatedPath);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline"
                        >
                          Take Action <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(n.id)}
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
