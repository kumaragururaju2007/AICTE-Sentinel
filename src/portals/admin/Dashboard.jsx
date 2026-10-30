import React, { useState, useEffect } from 'react'
import {
  FileText, Clock, CheckCircle2, XCircle, Calendar,
  ArrowRight, Users, Building2, Sliders, Settings,
  Bell, Landmark, UserPlus, Send, TrendingUp, AlertTriangle,
  ChevronDown, ExternalLink, MapPin, Eye, Check, X
} from 'lucide-react'
import { analyticsService } from '../../services/analyticsService'

export default function AdminDashboard({ onNavigateToPage }) {
  const [trendsFilter, setTrendsFilter] = useState('Last 6 Months')
  const [programFilter, setProgramFilter] = useState('This Year')
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [quickActionNotice, setQuickActionNotice] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    analyticsService.getAdminDashboardMetrics()
      .then(res => {
        if (res) setMetrics(res)
      })
      .catch(e => console.warn('[AdminDashboard] metrics fetch note:', e.message))
  }, [])

  // 5 Top KPI Cards matching reference image
  const kpiCards = [
    {
      id: 'total',
      title: 'Total Applications',
      value: metrics ? metrics.totalApplications.toLocaleString() : '1,248',
      trend: { dir: 'up', val: '12%', text: 'vs last month' },
      icon: FileText,
      iconBg: 'bg-[#1E6DEB]',
      page: 'applications'
    },
    {
      id: 'pending',
      title: 'Pending Applications',
      value: metrics ? metrics.pendingApplications.toLocaleString() : '342',
      trend: { dir: 'down', val: '5%', text: 'vs last month' },
      icon: Clock,
      iconBg: 'bg-[#7738E8]',
      page: 'applications'
    },
    {
      id: 'approved',
      title: 'Approved Applications',
      value: metrics ? metrics.approvedApplications.toLocaleString() : '812',
      trend: { dir: 'down', val: '18%', text: 'vs last month' },
      icon: Check,
      iconBg: 'bg-[#159B68]',
      page: 'applications'
    },
    {
      id: 'rejected',
      title: 'Rejected Applications',
      value: metrics ? metrics.rejectedApplications.toLocaleString() : '94',
      trend: { dir: 'down', val: '8%', text: 'vs last month' },
      icon: X,
      iconBg: 'bg-[#EF4444]',
      page: 'applications'
    },
    {
      id: 'deadlines',
      title: 'Upcoming Deadlines',
      value: metrics ? metrics.upcomingDeadlines.toLocaleString() : '156',
      trend: { dir: 'down', val: '20%', text: 'in next 30 days' },
      icon: Calendar,
      iconBg: 'bg-[#F59E0B]',
      page: 'obligations'
    }
  ]

  // Trend Chart Data (Apr - Sep)
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const trendData = {
    total: [170, 210, 250, 285, 320, 360],
    approved: [110, 135, 160, 185, 210, 240],
    pending: [45, 55, 70, 80, 95, 140],
    rejected: [25, 30, 35, 45, 60, 90]
  }

  // Program Type Distribution Donut Data
  const programTypes = [
    { name: 'Engineering', percentage: 62, count: 774, color: '#1E6DEB' },
    { name: 'Management', percentage: 15, count: 187, color: '#7738E8' },
    { name: 'Pharmacy', percentage: 10, count: 125, color: '#159B68' },
    { name: 'Architecture', percentage: 8, count: 100, color: '#F59E0B' },
    { name: 'Others', percentage: 5, count: 62, color: '#64748B' }
  ]

  // Recent Applications Data matching image
  const recentApplications = [
    {
      id: 1,
      name: 'SVS College of Engineering',
      type: 'EoA',
      status: 'Under Review',
      statusStyle: 'bg-blue-50 text-[#1E6DEB] border border-blue-200',
      date: '28 Oct 2026'
    },
    {
      id: 2,
      name: 'GreenTech Polytechnic',
      type: 'New',
      status: 'Documents Pending',
      statusStyle: 'bg-amber-50 text-[#D97706] border border-amber-200',
      date: '27 Oct 2026'
    },
    {
      id: 3,
      name: 'Skyline Institute of Mgmt',
      type: 'Extension',
      status: 'Approved',
      statusStyle: 'bg-emerald-50 text-[#159B68] border border-emerald-200',
      date: '26 Oct 2026'
    },
    {
      id: 4,
      name: 'RVS College of Pharmacy',
      type: 'EoA',
      status: 'Under Review',
      statusStyle: 'bg-blue-50 text-[#1E6DEB] border border-blue-200',
      date: '25 Oct 2026'
    },
    {
      id: 5,
      name: 'Sunrise Tech Institute',
      type: 'Change',
      status: 'Rejected',
      statusStyle: 'bg-rose-50 text-[#EF4444] border border-rose-200',
      date: '24 Oct 2026'
    }
  ]

  // Upcoming Obligations Data matching image
  const upcomingObligations = [
    {
      institution: 'ABC Engineering College',
      obligation: 'EVC Compliance',
      dueDate: '02 Nov 2026',
      daysLeft: 5,
      daysBadge: 'bg-rose-100 text-rose-700'
    },
    {
      institution: 'XYZ Polytechnic',
      obligation: 'Undertaking Renewal',
      dueDate: '10 Nov 2026',
      daysLeft: 13,
      daysBadge: 'bg-amber-100 text-amber-700'
    },
    {
      institution: 'RVS College',
      obligation: 'Land Document Validity',
      dueDate: '18 Nov 2026',
      daysLeft: 21,
      daysBadge: 'bg-emerald-100 text-emerald-700'
    },
    {
      institution: 'Modern Institute',
      obligation: 'SLA Response',
      dueDate: '25 Nov 2026',
      daysLeft: 28,
      daysBadge: 'bg-emerald-100 text-emerald-700'
    },
    {
      institution: 'NKM Engineering',
      obligation: 'Affidavit Submission',
      dueDate: '30 Nov 2026',
      daysLeft: 33,
      daysBadge: 'bg-emerald-100 text-emerald-700'
    }
  ]

  // System Notifications matching image
  const systemNotifications = [
    {
      id: 'sn1',
      title: 'New application submitted',
      sub: 'SVS College of Engineering',
      time: '10 min ago',
      icon: FileText,
      iconBg: 'bg-blue-100 text-[#1E6DEB]'
    },
    {
      id: 'sn2',
      title: 'EVC deadline approaching',
      sub: 'ABC Engineering College',
      time: '1 hour ago',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 text-[#EF4444]'
    },
    {
      id: 'sn3',
      title: 'Document verification pending',
      sub: 'GreenTech Polytechnic',
      time: '3 hours ago',
      icon: FileText,
      iconBg: 'bg-amber-100 text-[#F59E0B]'
    },
    {
      id: 'sn4',
      title: 'Stage delay detected',
      sub: 'Skyline Institute of Mgmt',
      time: '5 hours ago',
      icon: Clock,
      iconBg: 'bg-rose-100 text-[#EF4444]'
    },
    {
      id: 'sn5',
      title: 'System update completed',
      sub: 'Workflow rules updated successfully',
      time: '1 day ago',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-[#159B68]'
    }
  ]

  // Pipeline Stages matching image
  const pipelineStages = [
    { id: 'sub', name: 'Submission', count: '1,248', color: 'bg-[#1E6DEB]', icon: FileText },
    { id: 'scr', name: 'Scrutiny', count: '924', color: 'bg-[#7738E8]', icon: Clock },
    { id: 'evc', name: 'EVC / SAC / SHC', count: '612', color: 'bg-[#F59E0B]', icon: Building2 },
    { id: 'app', name: 'Final Approval', count: '812', color: 'bg-[#159B68]', icon: Check }
  ]

  // Quick Action Buttons
  const quickActions = [
    { id: 'add-inst', label: 'Add Institution', icon: Landmark, page: 'institutions' },
    { id: 'create-usr', label: 'Create User', icon: UserPlus, page: 'users' },
    { id: 'cfg-wf', label: 'Configure Workflow', icon: Sliders, page: 'workflows' },
    { id: 'gen-rep', label: 'Generate Report', icon: FileText, page: 'analytics' },
    { id: 'snd-notif', label: 'Send Notification', icon: Send, page: 'alerts' },
    { id: 'sys-set', label: 'System Settings', icon: Settings, page: 'settings' }
  ]

  const handleQuickAction = (action) => {
    setQuickActionNotice(`Quick Action "${action.label}" activated.`)
    setTimeout(() => setQuickActionNotice(null), 3000)
    if (onNavigateToPage) onNavigateToPage(action.page)
  }

  // Pure SVG Line Graph helpers
  const svgWidth = 480
  const svgHeight = 180
  const padLeft = 35
  const padRight = 20
  const padTop = 15
  const padBottom = 25
  const graphW = svgWidth - padLeft - padRight
  const graphH = svgHeight - padTop - padBottom

  const getX = (idx) => padLeft + (idx / 5) * graphW
  const getY = (val) => padTop + graphH - (val / 400) * graphH

  const makePath = (vals) => {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ')
  }

  // Donut SVG generator
  let accumulatedAngle = 0
  const donutR = 56
  const donutCx = 75
  const donutCy = 75
  const donutThickness = 22

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* ── Top Greeting Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the AICTE approval ecosystem, monitor compliance and ensure smooth operations.
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E6DEB] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Tuesday, 28 October 2026
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
              AICTE Sentinel | Team Valora
            </span>
          </div>
        </div>
      </div>

      {quickActionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{quickActionNotice}</span>
          </div>
          <button onClick={() => setQuickActionNotice(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* ── 5 Top KPI Statistic Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon
          const isUp = card.trend.dir === 'up'
          const isRed = card.id === 'pending' || card.id === 'rejected' || card.id === 'deadlines'
          return (
            <div
              key={card.id}
              onClick={() => onNavigateToPage && onNavigateToPage(card.page)}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none block">
                    {card.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">
                    {card.title}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px]">
                <span className={`font-bold flex items-center gap-0.5 ${
                  isRed ? 'text-[#EF4444]' : 'text-[#159B68]'
                }`}>
                  {isUp ? '↑' : '↓'} {card.trend.val}
                </span>
                <span className="text-slate-400 font-medium">{card.trend.text}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Section 1: Charts Row (2 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (~60%): Application Trends Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Application Trends</h3>
            </div>
            <div className="relative">
              <select
                value={trendsFilter}
                onChange={e => setTrendsFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none cursor-pointer"
              >
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Current Academic Year">Current Academic Year</option>
                <option value="Previous Year">Previous Year</option>
              </select>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-5 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E6DEB]" /> Total
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#159B68]" /> Approved
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Rejected
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Pending
            </span>
          </div>

          {/* Pure SVG Multi-line Graph */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
              {/* Horizontal grid lines & Y labels */}
              {[0, 100, 200, 300, 400].map((val) => {
                const y = getY(val)
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={val === 0 ? 'none' : '3,3'}
                    />
                    <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                )
              })}

              {/* X-axis labels */}
              {months.map((m, i) => (
                <text key={m} x={getX(i)} y={svgHeight - 8} textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="500">
                  {m}
                </text>
              ))}

              {/* Trend Lines */}
              <path d={makePath(trendData.total)} fill="none" stroke="#1E6DEB" strokeWidth="2.5" />
              <path d={makePath(trendData.approved)} fill="none" stroke="#159B68" strokeWidth="2.5" />
              <path d={makePath(trendData.pending)} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              <path d={makePath(trendData.rejected)} fill="none" stroke="#EF4444" strokeWidth="2.5" />

              {/* Data points */}
              {trendData.total.map((v, i) => (
                <circle key={`t-${i}`} cx={getX(i)} cy={getY(v)} r="3.5" fill="#1E6DEB" stroke="#fff" strokeWidth="1.5" />
              ))}
              {trendData.approved.map((v, i) => (
                <circle key={`a-${i}`} cx={getX(i)} cy={getY(v)} r="3.5" fill="#159B68" stroke="#fff" strokeWidth="1.5" />
              ))}
              {trendData.pending.map((v, i) => (
                <circle key={`p-${i}`} cx={getX(i)} cy={getY(v)} r="3.5" fill="#F59E0B" stroke="#fff" strokeWidth="1.5" />
              ))}
              {trendData.rejected.map((v, i) => (
                <circle key={`r-${i}`} cx={getX(i)} cy={getY(v)} r="3.5" fill="#EF4444" stroke="#fff" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>

        {/* Right (~40%): Applications by Program Type Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Applications by Program Type</h3>
            <select
              value={programFilter}
              onChange={e => setProgramFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none cursor-pointer"
            >
              <option value="This Year">This Year</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-2">
            {/* SVG Donut */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 150 150" className="w-full h-full transform -rotate-90">
                {programTypes.map((pt, i) => {
                  const strokeDasharray = `${(pt.percentage * (2 * Math.PI * donutR)) / 100} ${2 * Math.PI * donutR}`
                  const strokeDashoffset = -((accumulatedAngle * (2 * Math.PI * donutR)) / 100)
                  accumulatedAngle += pt.percentage
                  return (
                    <circle
                      key={pt.name}
                      cx={donutCx}
                      cy={donutCy}
                      r={donutR}
                      fill="transparent"
                      stroke={pt.color}
                      strokeWidth={donutThickness}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  )
                })}
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 leading-none">1,248</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total</span>
              </div>
            </div>

            {/* Breakdown Legend Table */}
            <div className="w-full space-y-2 text-xs">
              {programTypes.map((pt) => (
                <div key={pt.name} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pt.color }} />
                    <span className="text-slate-700 font-medium">{pt.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800 font-mono">{pt.percentage}%</span>
                    <span className="text-slate-400 font-mono text-[11px] w-8 text-right">{pt.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Middle Row (3 Columns) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Column 1: Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Recent Applications</h3>
              <button
                onClick={() => onNavigateToPage && onNavigateToPage('applications')}
                className="text-xs font-semibold text-[#1E6DEB] hover:underline flex items-center gap-0.5"
              >
                View All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Institution Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 text-slate-400 font-mono text-[11px]">{app.id}</td>
                      <td className="py-2.5 font-semibold text-slate-900 max-w-[130px] truncate" title={app.name}>
                        {app.name}
                      </td>
                      <td className="py-2.5 text-slate-500 text-[11px] font-mono">{app.type}</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${app.statusStyle}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400 text-[10px] whitespace-nowrap">
                        {app.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 2: Upcoming Obligations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Obligations</h3>
              <button
                onClick={() => onNavigateToPage && onNavigateToPage('obligations')}
                className="text-xs font-semibold text-[#1E6DEB] hover:underline flex items-center gap-0.5"
              >
                View All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                    <th className="pb-2">Institution</th>
                    <th className="pb-2">Obligation</th>
                    <th className="pb-2">Due Date</th>
                    <th className="pb-2 text-right">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {upcomingObligations.map((ob, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-900 max-w-[110px] truncate" title={ob.institution}>
                        {ob.institution}
                      </td>
                      <td className="py-2.5 text-slate-600 text-[11px] truncate max-w-[120px]" title={ob.obligation}>
                        {ob.obligation}
                      </td>
                      <td className="py-2.5 text-slate-400 text-[10px] whitespace-nowrap">
                        {ob.dueDate}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${ob.daysBadge}`}>
                          {ob.daysLeft}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 3: System Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">System Notifications</h3>
              <button
                onClick={() => onNavigateToPage && onNavigateToPage('alerts')}
                className="text-xs font-semibold text-[#1E6DEB] hover:underline flex items-center gap-0.5"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-2">
              {systemNotifications.map((notif) => {
                const Icon = notif.icon
                return (
                  <div
                    key={notif.id}
                    onClick={() => onNavigateToPage && onNavigateToPage('alerts')}
                    className="flex items-start justify-between gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-900 group-hover:text-[#1E6DEB] transition-colors leading-tight">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{notif.sub}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{notif.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Bottom Row (3 Columns) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Column 1: Application Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Application Pipeline
          </h3>

          <div className="flex items-center justify-between gap-1 py-4">
            {pipelineStages.map((st, i) => {
              const Icon = st.icon
              return (
                <React.Fragment key={st.id}>
                  <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
                    <div className={`w-11 h-11 rounded-full ${st.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold leading-tight line-clamp-1">{st.name}</span>
                    <span className="text-xs font-extrabold text-slate-900">{st.count}</span>
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <span className="text-slate-300 font-bold text-xs pb-5">&rarr;</span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Column 2: Institution Status (Pan India) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Institution Status (Pan India)
          </h3>

          <div className="flex items-center justify-between gap-4 py-1">
            {/* SVG India Map Vector Silhouette */}
            <div className="w-36 h-38 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 140 190" className="w-full h-full drop-shadow-sm select-none">
                <defs>
                  <linearGradient id="indiaVectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E6DEB" />
                  </linearGradient>
                </defs>
                {/* Accurate geographical silhouette of India */}
                <path
                  d="M 68,10
                     C 64,10 58,16 54,26
                     C 50,34 44,42 38,50
                     C 30,58 22,64 15,70
                     C 11,74 12,78 18,80
                     C 24,81 26,84 18,87
                     C 12,91 14,97 22,99
                     C 30,101 34,96 38,93
                     C 38,100 39,114 42,128
                     C 44,142 48,158 52,172
                     C 54,180 56,186 57,187
                     C 59,186 63,174 67,160
                     C 71,146 77,132 83,118
                     C 89,106 95,96 102,90
                     C 106,86 107,78 109,70
                     C 113,70 117,84 123,84
                     C 127,82 129,74 131,66
                     C 135,58 136,48 130,44
                     C 124,42 118,50 114,52
                     C 108,52 105,46 102,48
                     C 96,54 86,52 78,44
                     C 74,36 74,22 72,14
                     C 71,11 69,10 68,10 Z"
                  fill="url(#indiaVectorGrad)"
                  stroke="#93C5FD"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />

                {/* State/Regional Status Pins matching reference image */}
                <g className="cursor-pointer">
                  <circle cx="58" cy="30" r="3.5" fill="#159B68" stroke="#fff" strokeWidth="1.2">
                    <title>Northern Bureau: Approved</title>
                  </circle>
                  <circle cx="32" cy="78" r="3.5" fill="#F59E0B" stroke="#fff" strokeWidth="1.2">
                    <title>Western Bureau: Deficiencies</title>
                  </circle>
                  <circle cx="90" cy="72" r="3.5" fill="#7738E8" stroke="#fff" strokeWidth="1.2">
                    <title>Eastern Bureau: Under Review</title>
                  </circle>
                  <circle cx="62" cy="115" r="3.5" fill="#159B68" stroke="#fff" strokeWidth="1.2">
                    <title>Central Bureau: Approved</title>
                  </circle>
                  <circle cx="56" cy="162" r="3.5" fill="#EF4444" stroke="#fff" strokeWidth="1.2">
                    <title>Southern Bureau: Rejected</title>
                  </circle>
                </g>
              </svg>
            </div>

            {/* Counts Breakdown Legend matching reference image */}
            <div className="space-y-2 text-xs w-full">
              <div
                onClick={() => onNavigateToPage && onNavigateToPage('institutions')}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                title="View Approved Institutions"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-[#159B68]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#159B68]" /> Approved
                </span>
                <span className="font-bold text-slate-900 font-mono text-sm">3,842</span>
              </div>
              <div
                onClick={() => onNavigateToPage && onNavigateToPage('institutions')}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                title="View Under Review Institutions"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-[#1E6DEB]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E6DEB]" /> Under Review
                </span>
                <span className="font-bold text-slate-900 font-mono text-sm">1,205</span>
              </div>
              <div
                onClick={() => onNavigateToPage && onNavigateToPage('institutions')}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                title="View Institutions with Deficiencies"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-[#F59E0B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Deficiencies
                </span>
                <span className="font-bold text-slate-900 font-mono text-sm">482</span>
              </div>
              <div
                onClick={() => onNavigateToPage && onNavigateToPage('institutions')}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                title="View Rejected Applications"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-[#EF4444]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Rejected
                </span>
                <span className="font-bold text-slate-900 font-mono text-sm">216</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Quick Actions
          </h3>

          <div className="grid grid-cols-3 gap-2.5">
            {quickActions.map((qa) => {
              const Icon = qa.icon
              return (
                <button
                  key={qa.id}
                  onClick={() => handleQuickAction(qa)}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-[#1E6DEB] transition-all flex flex-col items-center text-center space-y-1.5 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#1E6DEB] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 group-hover:text-[#1E6DEB] leading-tight">
                    {qa.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
