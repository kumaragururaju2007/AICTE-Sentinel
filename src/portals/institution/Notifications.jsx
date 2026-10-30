import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  Eye,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import NotificationPanel from '../../components/institution/NotificationPanel';
import { useInstitution } from './context/InstitutionContext';

export default function Notifications() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useInstitution();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read'
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');

  const types = [
    { id: 'all', label: 'All Categories' },
    { id: 'deficiency', label: 'Deficiencies' },
    { id: 'deadline', label: 'Deadlines' },
    { id: 'evc', label: 'EVC Inspections' },
    { id: 'approval', label: 'Approvals' },
    { id: 'undertaking', label: 'Undertakings' },
    { id: 'application', label: 'Applications' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && !n.read) ||
        (activeTab === 'read' && n.read);

      const matchType = selectedType === 'all' || n.type === selectedType;

      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase());

      return matchTab && matchType && matchSearch;
    });
  }, [notifications, activeTab, selectedType, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Centre & Official Council Alerts"
        subtitle="Real-time statutory updates, scrutiny notices, EVC windows, and deadline alerts."
        breadcrumb={['Home', 'Communication', 'Notifications']}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          </div>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Alerts', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'read', label: 'Archived', count: notifications.length - unreadCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#123B70] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Filter notifications..."
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`rounded-lg px-2.5 py-1 font-semibold whitespace-nowrap transition-colors ${
                selectedType === t.id
                  ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <NotificationPanel
          notifications={filteredNotifications}
          onMarkRead={markNotificationAsRead}
          onDelete={deleteNotification}
          showActions={true}
        />
      </div>
    </div>
  );
}
