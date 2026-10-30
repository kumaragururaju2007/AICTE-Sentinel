import React from 'react'
import { Bell, Check, X, Clock, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react'

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#102A56] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm">Regulatory Alerts &amp; Notifications</h3>
                <p className="text-[10px] text-white/70">Obligation Clock &amp; Escalation Service</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    item.read
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-[#1769E0]/30 shadow-xs ring-1 ring-[#1769E0]/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.priority === 'CRITICAL' || item.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.type} &bull; {item.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{item.message}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    {!item.read ? (
                      <button
                        onClick={() => onMarkRead && onMarkRead(item.id)}
                        className="text-[11px] text-[#1769E0] hover:underline font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Read</span>
                    )}
                    <button
                      onClick={() => {
                        onNavigate && onNavigate(item.actionRoute || item.link || 'alerts')
                        onClose()
                      }}
                      className="text-[11px] text-[#102A56] hover:text-[#1769E0] font-bold ml-auto flex items-center gap-1 cursor-pointer"
                    >
                      Open Record <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p>No new notifications</p>
              </div>
            )}
          </div>

          {/* Footer with direct link to Alert Center */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => {
                onNavigate && onNavigate('alerts')
                onClose()
              }}
              className="w-full py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Open Regulatory Notification &amp; Alert Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

