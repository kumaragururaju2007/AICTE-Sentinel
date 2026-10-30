import React, { useState, useMemo } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, FileText, Info,
  XCircle, Search, Filter, Check, Trash2, Mail,
  ChevronRight, ChevronDown, Clock, ExternalLink
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const TYPE_CFG = {
  application_update: { icon: FileText, color: '#6b93f0', bg: 'rgba(36,87,212,0.12)', label: 'Application' },
  deadline_alert: { icon: AlertTriangle, color: '#f87171', bg: 'rgba(239,68,68,0.1)', label: 'Deadline' },
  document_request: { icon: FileText, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', label: 'Document' },
  approval: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Approval' },
  rejection: { icon: XCircle, color: '#f87171', bg: 'rgba(239,68,68,0.1)', label: 'Rejection' },
  system: { icon: Info, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'System' },
};

const PRIORITY_COLOR = {
  critical: '#f87171',
  high: '#fbbf24',
  medium: '#6b93f0',
  low: 'rgba(240,244,255,0.4)',
};

function NotificationItem({ notif, onMarkRead, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_CFG[notif.type] || TYPE_CFG.system;
  const Icon = tc.icon;
  const navigate = useNavigate();

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      className="rounded-xl transition-all duration-200 overflow-hidden"
      style={{
        border: notif.read ? '1px solid rgba(59,110,232,0.12)' : '1px solid rgba(59,110,232,0.3)',
        background: notif.read ? 'rgba(6,15,46,0.4)' : 'rgba(10,24,64,0.6)',
        borderLeft: notif.read ? undefined : `3px solid ${PRIORITY_COLOR[notif.priority] || '#2457d4'}`,
      }}
    >
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(p => !p)}>
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tc.bg }}>
          <Icon size={16} style={{ color: tc.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!notif.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_COLOR[notif.priority] || '#2457d4' }} />}
                <span className="text-sm font-semibold text-white">{notif.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${tc.color}15`, color: tc.color }}>{tc.label}</span>
                <span className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>{timeAgo(notif.date)}</span>
                {notif.priority !== 'low' && (
                  <span className="text-xs font-medium" style={{ color: PRIORITY_COLOR[notif.priority] }}>
                    {notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1)} Priority
                  </span>
                )}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'rgba(240,244,255,0.4)', flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {/* Preview (collapsed) */}
          {!expanded && (
            <p className="text-xs mt-1.5 truncate" style={{ color: 'rgba(240,244,255,0.55)' }}>{notif.message}</p>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in-up">
          <div className="pt-2 pb-3 border-t" style={{ borderColor: 'rgba(59,110,232,0.1)' }}>
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.7)', lineHeight: '1.7' }}>{notif.message}</p>
            <div className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
              <Clock size={11} className="inline mr-1" />
              {new Date(notif.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!notif.read && (
              <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); onMarkRead(notif.id); }}>
                <Check size={12} /> Mark as Read
              </button>
            )}
            {notif.applicationId && (
              <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors"
                style={{ background: 'rgba(36,87,212,0.1)', color: '#6b93f0', border: '1px solid rgba(36,87,212,0.2)', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); navigate('/institution/applications'); }}>
                <ExternalLink size={12} /> View Application
              </button>
            )}
            <button className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg ml-auto transition-colors"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'none', cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onDelete(notif.id); }}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchFilter = filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'read' && n.read);
      const matchType = typeFilter === 'all' || n.type === typeFilter;
      const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchType && matchSearch;
    });
  }, [notifications, filter, typeFilter, search]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const typeGroups = Object.keys(TYPE_CFG);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Notifications</h2>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All notifications read'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2 px-3" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check size={14} /> Mark All Read
          </button>
          <button className="text-xs py-2 px-3 rounded-lg transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}
            onClick={handleClearAll}>
            <Trash2 size={13} className="inline mr-1" /> Clear Read
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Total', value: notifications.length, color: '#6b93f0' },
          { label: 'Unread', value: unreadCount, color: '#fbbf24' },
          { label: 'Critical', value: notifications.filter(n => n.priority === 'critical').length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
            <span className="text-lg font-bold" style={{ color: s.color, fontFamily: 'Outfit,sans-serif' }}>{s.value}</span>
            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.6)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-btn ${filter === f ? 'active' : ''}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: '#ef4444', color: '#fff' }}>{unreadCount}</span>
            )}
          </button>
        ))}
        <div className="border-l mx-1" style={{ borderColor: 'rgba(59,110,232,0.2)' }} />
        {['all', ...typeGroups].map(t => {
          const tc = t === 'all' ? null : TYPE_CFG[t];
          return (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`tab-btn ${typeFilter === t ? 'active' : ''}`}>
              {t === 'all' ? 'All Types' : tc.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(107,147,240,0.6)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search notifications..." />
      </div>

      {/* Results */}
      <div className="text-xs mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Showing {filtered.length} of {notifications.length} notifications
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} style={{ color: 'rgba(59,110,232,0.3)', margin: '0 auto 16px' }} />
          <div className="text-white font-medium mb-2">No notifications found</div>
          <div className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {filter === 'unread' ? "You're all caught up!" : "Try adjusting your filters"}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Group by unread/read */}
          {filter === 'all' && filtered.some(n => !n.read) && (
            <div className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
              <div className="h-px flex-1" style={{ background: 'rgba(59,110,232,0.15)' }} />
              UNREAD
              <div className="h-px flex-1" style={{ background: 'rgba(59,110,232,0.15)' }} />
            </div>
          )}
          {filtered.filter(n => !n.read).map(n => (
            <NotificationItem key={n.id} notif={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}

          {filter === 'all' && filtered.some(n => n.read) && (
            <div className="text-xs font-semibold mt-4 mb-2 flex items-center gap-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
              <div className="h-px flex-1" style={{ background: 'rgba(59,110,232,0.15)' }} />
              READ
              <div className="h-px flex-1" style={{ background: 'rgba(59,110,232,0.15)' }} />
            </div>
          )}
          {filtered.filter(n => filter === 'all' ? n.read : true).map(n => (
            filter !== 'all' ? (
              <NotificationItem key={n.id} notif={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
            ) : n.read ? (
              <NotificationItem key={n.id} notif={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
