import React, { useState } from 'react'
import {
  Bell, AlertTriangle, Clock, ShieldAlert, CheckCircle2,
  Calendar, Check, X, RefreshCw, Send, Mail, Search,
  Filter, Plus, MessageSquare, ArrowRight, Shield, Sparkles
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { SLA_REMINDER_LADDER } from '../../data/adminMockData'

export default function AlertManagement({ initialTab = 'notifications' }) {
  const [activeTab, setActiveTab] = useState(initialTab) // 'notifications' | 'ladder' | 'logs'
  const [ladder, setLadder] = useState(SLA_REMINDER_LADDER)
  const [testScanNotice, setTestScanNotice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  // Broadcast Modal State
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastCategory, setBroadcastCategory] = useState('SYSTEM')
  const [broadcastSeverity, setBroadcastSeverity] = useState('HIGH')
  const [broadcastAudience, setBroadcastAudience] = useState('ALL')
  const [broadcastMessage, setBroadcastMessage] = useState('')

  // System Notifications Feed matching dashboard + historical items
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-2026-001',
      title: 'New application submitted',
      sub: 'SVS College of Engineering (Southern Bureau)',
      message: 'Extension of Approval (EoA) application submitted for AY 2026-27 with 420 intake requested.',
      category: 'APPLICATION',
      severity: 'INFO',
      time: '10 min ago',
      read: false,
      audience: 'All Bureau Officers',
      actionRoute: 'applications'
    },
    {
      id: 'NOTIF-2026-002',
      title: 'EVC deadline approaching',
      sub: 'ABC Engineering College (Northern Bureau)',
      message: 'On-site EVC inspection report submission window closes in 48 hours. Standing committee alert dispatched.',
      category: 'EVC',
      severity: 'CRITICAL',
      time: '1 hour ago',
      read: false,
      audience: 'EVC Coordinators',
      actionRoute: 'obligations'
    },
    {
      id: 'NOTIF-2026-003',
      title: 'Document verification pending',
      sub: 'GreenTech Polytechnic (Western Bureau)',
      message: 'Candidate uploaded revised 30-year lease deed. Pending AI-OCR mismatch re-verification.',
      category: 'DOCUMENT',
      severity: 'HIGH',
      time: '3 hours ago',
      read: false,
      audience: 'Scrutiny Desk',
      actionRoute: 'applications'
    },
    {
      id: 'NOTIF-2026-004',
      title: 'Stage delay detected',
      sub: 'Skyline Institute of Management (Northern Bureau)',
      message: 'Application has spent 12 days in scrutiny stage (85% of SLA budget consumed). Advance T-2 escalation triggered.',
      category: 'SLA',
      severity: 'CRITICAL',
      time: '5 hours ago',
      read: false,
      audience: 'Regional Bureau Supervisor',
      actionRoute: 'obligations'
    },
    {
      id: 'NOTIF-2026-005',
      title: 'System update completed',
      sub: 'Workflow rules updated successfully',
      message: 'Regulatory APH 2026-27 policy parameters committed to production with dual-authorization approval.',
      category: 'SYSTEM',
      severity: 'INFO',
      time: '1 day ago',
      read: true,
      audience: 'System Administrators',
      actionRoute: 'workflows'
    },
    {
      id: 'NOTIF-2026-006',
      title: 'Structural stability grace period warning',
      sub: 'Vidya Institute of Technology (Western Bureau)',
      message: 'State PWD fitness certificate expired. Automatic deficiency ticket raised under APH Clause 2.14.',
      category: 'DOCUMENT',
      severity: 'HIGH',
      time: '2 days ago',
      read: true,
      audience: 'Applying Institution & Scrutiny',
      actionRoute: 'applications'
    }
  ])

  // Sync initial tab when props change
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const handleToggleRule = (index) => {
    setLadder(prev => prev.map((item, idx) => idx === index ? { ...item, active: !item.active } : item))
  }

  const handleRunSchedulerScan = () => {
    setTestScanNotice('Scheduler scan completed: Scanned 18 active obligations. 0 duplicate alerts created due to unique idempotency constraints (IDEMP-***).')
    setTimeout(() => setTestScanNotice(null), 5000)
  }

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleSendBroadcast = (e) => {
    e.preventDefault()
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return

    const newAlert = {
      id: `NOTIF-2026-${String(notifications.length + 1).padStart(3, '0')}`,
      title: broadcastTitle,
      sub: `Broadcast to ${broadcastAudience === 'ALL' ? 'All Roles' : broadcastAudience}`,
      message: broadcastMessage,
      category: broadcastCategory,
      severity: broadcastSeverity,
      time: 'Just now',
      read: false,
      audience: broadcastAudience,
      actionRoute: 'alerts'
    }

    setNotifications([newAlert, ...notifications])
    setShowBroadcastModal(false)
    setBroadcastTitle('')
    setBroadcastMessage('')
    setTestScanNotice(`Broadcast announcement "${newAlert.title}" dispatched across all user channels.`)
    setTimeout(() => setTestScanNotice(null), 4500)
  }

  const filteredNotifications = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = selectedFilter === 'ALL' ? true :
      selectedFilter === 'UNREAD' ? !n.read :
      selectedFilter === 'CRITICAL' ? n.severity === 'CRITICAL' :
      n.category === selectedFilter
    return matchSearch && matchFilter
  })

  const demoDeliveryLogs = [
    {
      jobId: 'JOB-9021',
      idempotencyKey: 'IDEMP-OBL-101-T07-20261029',
      recipient: 'Dr. Rajesh Kumar (Regional Scrutiny Officer)',
      channel: 'IN_APP',
      event: 'T-7 Scrutiny SLA Warning',
      scheduledFor: '2026-10-29 09:00 IST',
      dispatchedAt: '2026-10-29 09:00:12 IST',
      status: 'DELIVERED',
      acknowledged: 'YES (by Dr. Rajesh Kumar)'
    },
    {
      jobId: 'JOB-9022',
      idempotencyKey: 'IDEMP-OBL-103-OVERDUE-20261028',
      recipient: 'Prof. K. V. S. Murthy (Bureau Supervisor)',
      channel: 'ESCALATION_QUEUE',
      event: 'LEVEL_1_OVERDUE_ESCALATION',
      scheduledFor: '2026-10-28 17:01 IST',
      dispatchedAt: '2026-10-28 17:01:05 IST',
      status: 'DELIVERED',
      acknowledged: 'PENDING_REVIEW'
    },
    {
      jobId: 'JOB-9023',
      idempotencyKey: 'IDEMP-OBL-102-T15-20261028',
      recipient: 'Prof. S. K. Mahajan (EVC Coordinator)',
      channel: 'IN_APP',
      event: 'T-15 EVC Planning Window Notice',
      scheduledFor: '2026-10-28 09:00 IST',
      dispatchedAt: '2026-10-28 09:00:08 IST',
      status: 'DELIVERED',
      acknowledged: 'YES'
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Alert &amp; Notification Broadcast Center"
        subtitle="Business-calendar aware notification thresholds (T-30, T-7, T-1, T+0), live alert inbox &amp; system-wide broadcasts"
        badgeText={`${unreadCount} Unread Alerts Active`}
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Notifications & Alerts']}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast Announcement
            </button>
            <button
              onClick={handleRunSchedulerScan}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" /> Test Cron Scan
            </button>
          </div>
        }
      />

      {/* Scheduler Notice */}
      {testScanNotice && (
        <div className="p-3.5 rounded-xl bg-blue-100 border border-blue-300 text-[#102A56] text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1769E0]" />
            <span>{testScanNotice}</span>
          </div>
          <button onClick={() => setTestScanNotice(null)} className="text-slate-500 font-bold">&times;</button>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-[#1E6DEB] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Active Notifications &amp; Alerts ({notifications.length})</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ladder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'ladder'
              ? 'bg-[#1E6DEB] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Configurable SLA Escalation Ladder ({ladder.length} Offsets)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#1E6DEB] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Idempotent Delivery Audit Logs</span>
        </button>
      </div>

      {/* ── TAB 1: NOTIFICATIONS FEED ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts by title, institution, content..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'ALL', label: 'All Alerts' },
                { id: 'UNREAD', label: `Unread (${unreadCount})` },
                { id: 'CRITICAL', label: 'Critical / SLA' },
                { id: 'EVC', label: 'EVC Inspections' },
                { id: 'DOCUMENT', label: 'Documents' },
                { id: 'SYSTEM', label: 'System Directives' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedFilter === f.id
                      ? 'bg-[#1E6DEB] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl ml-2 whitespace-nowrap"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List of Notification Cards */}
          <div className="space-y-3">
            {filteredNotifications.map(notif => {
              const isCrit = notif.severity === 'CRITICAL'
              const isHigh = notif.severity === 'HIGH'
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !notif.read
                      ? 'bg-blue-50/50 border-blue-200 shadow-xs ring-1 ring-blue-200/50'
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.2 rounded-md font-bold uppercase font-mono ${
                          isCrit ? 'bg-rose-100 text-rose-800' :
                          isHigh ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#1E6DEB]'
                        }`}>
                          {notif.category} &bull; {notif.severity}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#1E6DEB]" />
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">&bull; {notif.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{notif.sub}</p>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">{notif.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Reviewing notification: ${notif.title}\nID: ${notif.id}\nTarget: ${notif.audience}`)}
                      className="px-3.5 py-1.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Action Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SLA ESCALATION LADDER ── */}
      {activeTab === 'ladder' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Configured SLA Reminder &amp; Escalation Ladder</h3>
              <p className="text-xs text-slate-500">
                Automated multi-channel notifications dispatched by statutory cron worker.
              </p>
            </div>
            <button
              onClick={handleRunSchedulerScan}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Re-scan Now
            </button>
          </div>

          <div className="space-y-3">
            {ladder.map((rule, idx) => {
              const triggerText = rule.trigger || rule.step || `Step-${idx + 1}`
              const isOverdue = triggerText.includes('OVERDUE') || triggerText.includes('Overdue') || triggerText.includes('T+0')
              const isUrgent = triggerText.includes('T-1') || triggerText.includes('T-7')

              return (
                <div
                  key={triggerText || idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    rule.active ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      isOverdue ? 'bg-rose-100 text-rose-700' :
                      isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-[#1769E0]'
                    }`}>
                      {triggerText.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rule.name || triggerText}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                          Offset: {rule.offsetDays ?? 0} days
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Recipients: <strong className="text-slate-700">{rule.targetRole || rule.recipients || 'All Stakeholders'}</strong> &bull; Channels: {Array.isArray(rule.channels) ? rule.channels.join(', ') : (rule.channel || 'IN_APP')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-[10px] font-bold uppercase ${rule.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {rule.active ? 'Active' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => handleToggleRule(idx)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        rule.active ? 'bg-[#159B68]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        rule.active ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: DISPATCH & IDEMPOTENCY LOGS ── */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Cryptographic Delivery &amp; Idempotency Audit Logs</h3>
            <p className="text-xs text-slate-500">
              Every dispatched alert is fingerprinted with an idempotency key to prevent spam and duplicate deliveries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Idempotency Key</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Dispatched Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demoDeliveryLogs.map((log) => (
                  <tr key={log.jobId} className="hover:bg-slate-50/70 font-mono text-[11px]">
                    <td className="py-2.5 px-3 font-bold text-[#1E6DEB]">{log.jobId}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]" title={log.idempotencyKey}>
                      {log.idempotencyKey}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{log.event}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700">{log.recipient}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{log.dispatchedAt}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BROADCAST ANNOUNCEMENT MODAL ── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-[#1E6DEB]" /> Broadcast National Regulatory Directive
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Broadcast Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Compliance Window Extension for Land Lease Filings"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={broadcastCategory}
                    onChange={e => setBroadcastCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none"
                  >
                    <option value="SYSTEM">System Directive</option>
                    <option value="SLA">SLA Alert</option>
                    <option value="EVC">EVC Inspection</option>
                    <option value="DOCUMENT">Document Norms</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={broadcastSeverity}
                    onChange={e => setBroadcastSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none"
                  >
                    <option value="CRITICAL">Critical (Immediate Banner)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="INFO">Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={broadcastAudience}
                  onChange={e => setBroadcastAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none"
                >
                  <option value="ALL">All Users (Institutions, Officers, Admins)</option>
                  <option value="Institutions">Applying Institutions Only</option>
                  <option value="Scrutiny Officers">Regional Scrutiny Officers</option>
                  <option value="EVC Committees">EVC Expert Committee Chairs</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Directive Details / Instructions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the mandatory compliance instructions, gazette references, or deadlines..."
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#102A56] hover:bg-[#1E6DEB] text-white font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
