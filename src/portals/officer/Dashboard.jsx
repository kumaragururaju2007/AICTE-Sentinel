import React, { useState, useEffect } from 'react'
import {
  FileText, Clock, AlertTriangle, CheckCircle2, Calendar,
  TrendingUp, Users, ArrowRight, ShieldAlert, Sparkles, Building2,
  Layers, MapPin, Eye, FileSearch, Filter, ExternalLink, ChevronDown,
  Check, ArrowUp, ArrowDown, UserCheck, Shield
} from 'lucide-react'
import { analyticsService } from '../../services/analyticsService'

export default function OfficerDashboard({ onNavigateToPage, onSelectApp }) {
  const [stageFilter, setStageFilter] = useState('This Month')
  const [pendencyFilter, setPendencyFilter] = useState('Applications')
  const [complianceFilter, setComplianceFilter] = useState('This Month')
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    analyticsService.getOfficerDashboardMetrics()
      .then(res => {
        if (res) setMetrics(res)
      })
      .catch(e => console.warn('[OfficerDashboard] metrics note:', e.message))
  }, [])

  // Top KPI metrics matching image: 48, 16, 12, 6, 9, 25
  const kpiCards = [
    {
      id: 'assigned',
      title: 'Assigned Applications',
      value: metrics ? metrics.assignedApplications : 48,
      trend: { dir: 'up', val: '12%', text: '+5 from last week' },
      icon: FileText,
      iconColor: 'text-[#1E6DEB]',
      iconBg: 'bg-[#EBF2FF]',
      page: 'assigned'
    },
    {
      id: 'scrutiny',
      title: 'Pending Scrutiny',
      value: metrics ? metrics.pendingScrutiny : 16,
      trend: { dir: 'up', val: '8%', text: '+3 from last week' },
      icon: Clock,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#FFF4E5]',
      page: 'scrutiny'
    },
    {
      id: 'evc',
      title: 'EVC Pending',
      value: metrics ? metrics.pendingEVC : 12,
      trend: { dir: 'down', val: '20%', text: '-3 from last week' },
      icon: Users,
      iconColor: 'text-[#7738E8]',
      iconBg: 'bg-[#F3EBFF]',
      page: 'evc-scheduling'
    },
    {
      id: 'overdue',
      title: 'Overdue Applications',
      value: metrics ? metrics.overdueApplications : 6,
      trend: { dir: 'up', val: '50%', text: '+2 from last week' },
      icon: AlertTriangle,
      iconColor: 'text-[#EF4444]',
      iconBg: 'bg-[#FEEAEA]',
      page: 'assigned'
    },
    {
      id: 'deadlines',
      title: 'Upcoming Deadlines',
      value: metrics ? metrics.upcomingDeadlines : 9,
      trend: { dir: 'down', val: '10%', text: '-1 from last week' },
      icon: Calendar,
      iconColor: 'text-[#159B68]',
      iconBg: 'bg-[#E6F7F0]',
      page: 'deficiencies'
    },
    {
      id: 'completed',
      title: 'Applications Completed',
      value: metrics ? metrics.completedApplications : 25,
      trend: { dir: 'up', val: '25%', text: '+5 from last week' },
      icon: CheckCircle2,
      iconColor: 'text-[#0D9488]',
      iconBg: 'bg-[#E6FAFA]',
      page: 'tracking'
    }
  ]

  // Stage distribution items matching image
  const stageDistribution = [
    { name: 'Scrutiny', count: 16, percentage: 33, color: '#1E6DEB' },
    { name: 'Deficiency', count: 8, percentage: 17, color: '#F59E0B' },
    { name: 'EVC', count: 12, percentage: 25, color: '#0D9488' },
    { name: 'Committee Review', count: 7, percentage: 15, color: '#7738E8' },
    { name: 'Final Decision', count: 5, percentage: 10, color: '#EF4444' }
  ]

  // Region-wise pendency bars matching image: North (24), South (18), East (32), West (28), Central (16)
  const regionData = [
    { name: 'North', count: 24, height: 60, color: '#0D9488' },
    { name: 'South', count: 18, height: 45, color: '#38BDF8' },
    { name: 'East', count: 32, height: 80, color: '#2563EB' },
    { name: 'West', count: 28, height: 70, color: '#D946EF' },
    { name: 'Central', count: 16, height: 40, color: '#6366F1' }
  ]

  // Officer workload matching image
  const officerWorkload = [
    { name: 'R. Sharma (You)', count: '48 / 60', percent: 80, color: 'bg-[#2563EB]' },
    { name: 'A. Kumar', count: '32 / 60', percent: 53, color: 'bg-[#38BDF8]' },
    { name: 'P. Singh', count: '28 / 60', percent: 47, color: 'bg-[#0D9488]' },
    { name: 'M. Verma', count: '20 / 60', percent: 33, color: 'bg-[#34D399]' }
  ]

  // Upcoming deadlines matching image
  const upcomingDeadlines = [
    {
      id: 'd1',
      day: '28',
      month: 'Nov',
      dateBg: 'bg-[#EF4444]',
      title: 'Scrutiny Deadline',
      subtitle: 'AICTE-2025-00123 | Sunrise Engineering College',
      badge: '1 day left'
    },
    {
      id: 'd2',
      day: '30',
      month: 'Nov',
      dateBg: 'bg-[#1E6DEB]',
      title: 'EVC Report Submission',
      subtitle: 'AICTE-2025-00145 | Vidya Institute of Technology',
      badge: '3 days left'
    },
    {
      id: 'd3',
      day: '02',
      month: 'Dec',
      dateBg: 'bg-[#0B1E3B]',
      title: 'Deficiency Response Review',
      subtitle: 'AICTE-2025-00167 | Global Polytechnic',
      badge: '5 days left'
    },
    {
      id: 'd4',
      day: '05',
      month: 'Dec',
      dateBg: 'bg-[#475569]',
      title: 'Lease Document Verification',
      subtitle: 'AICTE-2025-00189 | National College of Engineering',
      badge: '8 days left'
    }
  ]

  // High-priority cases matching image
  const highPriorityCases = [
    {
      id: 'AICTE-2025-00123',
      priority: 'High',
      priorityColor: 'bg-[#FEEAEA] text-[#EF4444] border-[#FCA5A5]',
      college: 'Sunrise Engineering College',
      stage: 'Scrutiny (Overdue)',
      days: '5 days'
    },
    {
      id: 'AICTE-2025-00145',
      priority: 'High',
      priorityColor: 'bg-[#FEEAEA] text-[#EF4444] border-[#FCA5A5]',
      college: 'Vidya Institute of Technology',
      stage: 'EVC Pending',
      days: '3 days'
    },
    {
      id: 'AICTE-2025-00167',
      priority: 'Medium',
      priorityColor: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
      college: 'Global Polytechnic',
      stage: 'Deficiency Review',
      days: '4 days'
    },
    {
      id: 'AICTE-2025-00189',
      priority: 'Medium',
      priorityColor: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
      college: 'National College of Engineering',
      stage: 'Committee Review',
      days: '6 days'
    }
  ]

  // Bottleneck alerts matching image
  const bottleneckAlerts = [
    {
      id: 'b1',
      title: 'EVC Queue Delay',
      desc: '12 applications waiting for EVC in West region.',
      time: '2 hours ago',
      icon: AlertTriangle,
      iconColor: 'text-[#EF4444]',
      iconBg: 'bg-[#FEEAEA]'
    },
    {
      id: 'b2',
      title: 'High Deficiency Rate',
      desc: '38% applications have document related deficiencies.',
      time: '5 hours ago',
      icon: AlertTriangle,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#FFF4E5]'
    },
    {
      id: 'b3',
      title: 'SLA Breach Risk',
      desc: '6 applications may breach SLA in next 7 days.',
      time: '1 day ago',
      icon: Clock,
      iconColor: 'text-[#D97706]',
      iconBg: 'bg-[#FEF3C7]'
    }
  ]

  // Recent activity table matching image
  const recentActivities = [
    {
      appId: 'AICTE-2025-00123',
      name: 'Sunrise Engineering College',
      stage: 'Scrutiny',
      stageColor: 'bg-blue-100 text-[#1E6DEB]',
      action: 'Documents verified',
      time: '27 Nov 2025, 11:20 AM'
    },
    {
      appId: 'AICTE-2025-00145',
      name: 'Vidya Institute of Technology',
      stage: 'EVC',
      stageColor: 'bg-purple-100 text-[#7738E8]',
      action: 'EVC scheduled',
      time: '27 Nov 2025, 10:45 AM'
    },
    {
      appId: 'AICTE-2025-00167',
      name: 'Global Polytechnic',
      stage: 'Deficiency',
      stageColor: 'bg-amber-100 text-[#D97706]',
      action: 'Clarification raised',
      time: '27 Nov 2025, 09:30 AM'
    },
    {
      appId: 'AICTE-2025-00189',
      name: 'National College of Engineering',
      stage: 'Committee',
      stageColor: 'bg-indigo-100 text-[#4F46E5]',
      action: 'Forwarded to SAC',
      time: '26 Nov 2025, 04:15 PM'
    },
    {
      appId: 'AICTE-2025-00190',
      name: 'Modern Institute of Management',
      stage: 'Scrutiny',
      stageColor: 'bg-blue-100 text-[#1E6DEB]',
      action: 'Under review',
      time: '26 Nov 2025, 02:10 PM'
    }
  ]

  // Compliance metrics matching image
  const complianceMetrics = [
    { name: 'Document Compliance', val: '85%', color: 'bg-[#10B981]' },
    { name: 'Undertaking Compliance', val: '72%', color: 'bg-[#38BDF8]' },
    { name: 'Lease Validity', val: '80%', color: 'bg-[#A855F7]' },
    { name: 'Response Timeliness', val: '76%', color: 'bg-[#6366F1]' },
    { name: 'Overall Score', val: '78%', color: 'bg-[#1E3A8A]' }
  ]

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* ── Top Welcome Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, R. Sharma
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's the latest update on your assigned applications and tasks.
          </p>
        </div>

        {/* Date / Last Login Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E6DEB] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium leading-none">Today</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">27 Nov 2025</span>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium leading-none">Last Login</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">27 Nov 2025, 10:15 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Statistic Cards Row (6 Cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon
          const isUp = card.trend.dir === 'up'
          const isRedOverdue = card.id === 'overdue' || (card.id === 'scrutiny' && isUp)
          return (
            <div
              key={card.id}
              onClick={() => onNavigateToPage && onNavigateToPage(card.page)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">
                    {card.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 block mt-1 leading-tight">
                    {card.title}
                  </span>
                </div>
              </div>

              {/* Trend Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px]">
                <span className={`font-semibold flex items-center ${isRedOverdue ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isUp ? '↑' : '↓'} {card.trend.val}
                </span>
                <span className="text-slate-400 text-[10px] truncate">{card.trend.text}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Section 1: Charts Row (3 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Application Stage Distribution (Donut Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Application Stage Distribution</h3>
            <button className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1">
              <span>{stageFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            {/* Donut Chart SVG */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* 5 Slices: Scrutiny 33%, Deficiency 17%, EVC 25%, Committee 15%, Decision 10% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="16" />
                {/* Scrutiny: 33% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1E6DEB" strokeWidth="16" strokeDasharray="78.8 238.8" strokeDashoffset="0" />
                {/* Deficiency: 17% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="40.6 238.8" strokeDashoffset="-78.8" />
                {/* EVC: 25% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0D9488" strokeWidth="16" strokeDasharray="59.7 238.8" strokeDashoffset="-119.4" />
                {/* Committee: 15% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#7738E8" strokeWidth="16" strokeDasharray="35.8 238.8" strokeDashoffset="-179.1" />
                {/* Decision: 10% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="16" strokeDasharray="23.9 238.8" strokeDashoffset="-214.9" />
              </svg>
              {/* Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 leading-none">48</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Total</span>
              </div>
            </div>

            {/* Legend with percentages matching image */}
            <div className="space-y-2 flex-1 text-xs">
              {stageDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Region-wise Pendency (Bar Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Region-wise Pendency</h3>
            <button className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1">
              <span>{pendencyFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Bar Chart Grid matching image: 40, 30, 20, 10, 0 */}
          <div className="h-40 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-6 border-t border-slate-100 -z-0" />
            <div className="absolute inset-x-0 top-16 border-t border-slate-100 -z-0" />
            <div className="absolute inset-x-0 top-26 border-t border-slate-100 -z-0" />

            {regionData.map(col => (
              <div key={col.name} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-10">
                <span className="text-[11px] font-bold text-slate-700">{col.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-500 hover:opacity-90"
                  style={{ height: `${col.height}%`, backgroundColor: col.color }}
                />
              </div>
            ))}
          </div>

          {/* X-Axis Labels */}
          <div className="flex items-center justify-between px-2 pt-2 text-[11px] font-medium text-slate-500">
            {regionData.map(col => (
              <span key={col.name} className="flex-1 text-center truncate">{col.name}</span>
            ))}
          </div>
        </div>

        {/* Card 3: Officer Workload */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Officer Workload</h3>
          </div>

          <div className="space-y-4 py-1">
            {officerWorkload.map((officer) => (
              <div key={officer.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{officer.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">{officer.count}</span>
                    <span className="font-bold text-slate-900 text-[11px]">{officer.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${officer.color} transition-all duration-500`}
                    style={{ width: `${officer.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Cards Row 2 (3 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Upcoming Deadlines */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Upcoming Deadlines</h3>
            <button
              onClick={() => onNavigateToPage && onNavigateToPage('assigned')}
              className="text-xs text-[#1E6DEB] font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl ${item.dateBg} text-white flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold leading-none">{item.day}</span>
                    <span className="text-[9px] uppercase font-semibold leading-none mt-0.5">{item.month}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: High-Priority Cases */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">High-Priority Cases</h3>
            <button
              onClick={() => onNavigateToPage && onNavigateToPage('assigned')}
              className="text-xs text-[#1E6DEB] font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {highPriorityCases.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-900">{c.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${c.priorityColor}`}>
                    {c.priority}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{c.college}</p>
                    <p className="text-[10px] text-slate-500 truncate">{c.stage}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600 shrink-0">{c.days}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Bottleneck Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Bottleneck Alerts</h3>
            <button
              onClick={() => onNavigateToPage && onNavigateToPage('bottlenecks')}
              className="text-xs text-[#1E6DEB] font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {bottleneckAlerts.map(b => {
              const Icon = b.icon
              return (
                <div key={b.id} className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${b.iconBg} ${b.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{b.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Section 3: Bottom Row (2 Columns: Table + Gauge) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table: Recent Application Activity (Col-span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Application Activity</h3>
            <button
              onClick={() => onNavigateToPage && onNavigateToPage('assigned')}
              className="text-xs text-[#1E6DEB] font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Application ID</th>
                  <th className="pb-3 font-semibold">Institution Name</th>
                  <th className="pb-3 font-semibold">Stage</th>
                  <th className="pb-3 font-semibold">Action Taken</th>
                  <th className="pb-3 font-semibold text-right">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentActivities.map((row) => (
                  <tr key={row.appId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#1E6DEB]">
                      <button
                        onClick={() => {
                          onSelectApp && onSelectApp(row.appId)
                          onNavigateToPage && onNavigateToPage('scrutiny')
                        }}
                        className="hover:underline"
                      >
                        {row.appId}
                      </button>
                    </td>
                    <td className="py-3 text-slate-800 font-medium max-w-[200px] truncate">
                      {row.name}
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.stageColor}`}>
                        {row.stage}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {row.action}
                    </td>
                    <td className="py-3 text-slate-400 text-right font-mono text-[11px]">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card: Compliance Health Overview (Radial Gauge + Metrics) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Compliance Health Overview</h3>
            <button className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1">
              <span>{complianceFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            {/* Radial Gauge SVG */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="55.2" // 78% of 251.2 is ~196 fill, offset ~55
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 leading-none">78</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">Out of 100</span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 flex-1 text-xs">
              {complianceMetrics.map(m => (
                <div key={m.name} className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full ${m.color} shrink-0`} />
                    <span className="text-slate-600 truncate">{m.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>6% improvement from last month (Demo data)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
