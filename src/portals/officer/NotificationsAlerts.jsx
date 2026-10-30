import React, { useState } from 'react'
import {
  Bell, AlertTriangle, CheckCircle2, Clock, Calendar,
  MessageSquare, FileText, Check, Filter, Search, ArrowRight
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { NOTIFICATIONS_DATA } from '../../data/officerMockData'

export default function NotificationsAlerts({ onNavigateToPage }) {
  const [notifications, setNotifications] = useState([
    {
      id: 'N-1',
      title: 'SLA Escalation: Sunrise Engineering College',
      message: 'Scrutiny deadline expires in 24 hours. Immediate officer action required under APH SLA rule 4.2.',
      category: 'SLA',
      severity: 'CRITICAL',
      timestamp: '2 hours ago',
      read: false,
      actionRoute: 'scrutiny',
      appId: 'AICTE-2025-00123'
    },
    {
      id: 'N-2',
      title: 'Deficiency Clarification Resubmitted: Vidya Institute',
      message: 'Vidya Institute of Technology has uploaded registered lease renewal endorsement. Pending officer review.',
      category: 'DEFICIENCY',
      severity: 'HIGH',
      timestamp: '4 hours ago',
      read: false,
      actionRoute: 'deficiencies',
      appId: 'AICTE-2025-00145'
    },
    {
      id: 'N-3',
      title: 'EVC Field Report Submitted: Global Polytechnic',
      message: 'Inspection Committee #4 (Prof. Arvind Deshpande) has uploaded geotagged report and digital checklist.',
      category: 'EVC',
      severity: 'INFO',
      timestamp: 'Yesterday at 04:30 PM',
      read: false,
      actionRoute: 'inspection-status',
      appId: 'AICTE-2025-00167'
    },
    {
      id: 'N-4',
      title: 'New EoA Ingestion: National College of Engineering',
      message: 'New Extension of Approval application assigned to your Western Bureau caseload portfolio.',
      category: 'SYSTEM',
      severity: 'INFO',
      timestamp: '2 days ago',
      read: true,
      actionRoute: 'assigned',
      appId: 'AICTE-2025-00189'
    },
    {
      id: 'N-5',
      title: '30-Year Lease Expiry Notice Dispatched',
      message: 'Automated 12-month advance advisory sent to Modern Institute of Management trust committee.',
      category: 'SYSTEM',
      severity: 'INFO',
      timestamp: '3 days ago',
      read: true,
      actionRoute: 'lease-validity',
      appId: 'AICTE-2025-00190'
    }
  ])

  const [activeTab, setActiveTab] = useState('ALL')
  const [search, setSearch] = useState('')

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = notifications.filter(n => {
    const matchTab = activeTab === 'ALL' ? true :
      activeTab === 'UNREAD' ? !n.read : n.category === activeTab
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Notifications &amp; SLA Alert Center"
        subtitle="Real-time alert dispatch, statutory deadline warnings and cross-functional workflow triggers"
        badgeText={`${notifications.filter(n => !n.read).length} Unread Alerts`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Notifications']}
        actions={
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Mark All as Read
          </button>
        }
      />

      {/* Tabs and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${notifications.filter(n => !n.read).length})` },
            { id: 'SLA', label: 'SLA Escalations' },
            { id: 'DEFICIENCY', label: 'Deficiencies' },
            { id: 'EVC', label: 'EVC Reports' },
            { id: 'SYSTEM', label: 'System Directives' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1E6DEB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filtered.map(notif => {
          const isCrit = notif.severity === 'CRITICAL'
          const isHigh = notif.severity === 'HIGH'
          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !notif.read
                  ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isCrit ? 'bg-rose-100 text-rose-600' :
                  isHigh ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-[#1E6DEB]'
                }`}>
                  {isCrit ? <AlertTriangle className="w-5 h-5" /> :
                   isHigh ? <Clock className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1E6DEB]" />
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">&bull; {notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {onNavigateToPage && (
                  <button
                    onClick={() => {
                      handleMarkRead(notif.id)
                      onNavigateToPage(notif.actionRoute)
                    }}
                    className="px-3.5 py-1.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

