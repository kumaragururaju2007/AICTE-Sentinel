import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, FileSearch, Calendar, CheckSquare,
  AlertTriangle, Sparkles, Bell, User, Settings, LogOut, Menu, X,
  Shield, CheckCircle2, ChevronRight, ChevronDown, Layers, Clock,
  Search, GitBranch, Building2, TrendingUp, Sliders, Check, UserCheck
} from 'lucide-react'

// Sub-components
import Dashboard from './Dashboard'
import AssignedApplications from './AssignedApplications'
import Scrutiny from './Scrutiny'
import DeficiencyClarification from './DeficiencyClarification'
import ApplicationTracking from './ApplicationTracking'
import EVCScheduling from './EVCScheduling'
import InspectionStatus from './InspectionStatus'
import UndertakingVerification from './UndertakingVerification'
import DocumentVerification from './DocumentVerification'
import LeaseValidityMonitoring from './LeaseValidityMonitoring'
import BottleneckEngine from './BottleneckEngine'
import WhatIfSimulation from './WhatIfSimulation'
import NotificationsAlerts from './NotificationsAlerts'
import OfficerProfile from './OfficerProfile'
import OfficerSettings from './OfficerSettings'

import NotificationPanel from '../../components/common/NotificationPanel'
import { NOTIFICATIONS_DATA } from '../../data/officerMockData'
import { useApplicationContext } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'

export default function OfficerPortal({ initialPage = 'dashboard', initialAppId = 'AICTE-2025-00123' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  const getPageFromPath = () => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/officer/assigned') || path.includes('/officer/applications')) return 'assigned'
    if (path.includes('/officer/scrutiny')) return 'scrutiny'
    if (path.includes('/officer/deficiencies') || path.includes('/officer/deficiency')) return 'deficiencies'
    if (path.includes('/officer/tracking')) return 'tracking'
    if (path.includes('/officer/evc-scheduling')) return 'evc-scheduling'
    if (path.includes('/officer/inspection')) return 'inspection-status'
    if (path.includes('/officer/evc')) return 'evc-scheduling'
    if (path.includes('/officer/undertakings') || path.includes('/officer/undertaking')) return 'undertakings'
    if (path.includes('/officer/documents') || path.includes('/officer/document')) return 'documents'
    if (path.includes('/officer/lease')) return 'lease-validity'
    if (path.includes('/officer/bottlenecks') || path.includes('/officer/intelligence')) return 'bottlenecks'
    if (path.includes('/officer/simulation')) return 'simulation'
    if (path.includes('/officer/notifications')) return 'notifications'
    if (path.includes('/officer/profile')) return 'profile'
    if (path.includes('/officer/settings')) return 'settings'
    if (path.includes('/officer/dashboard')) return 'dashboard'
    return initialPage
  }

  const [currentPage, setCurrentPage] = useState(getPageFromPath)
  const [selectedAppId, setSelectedAppId] = useState(initialAppId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setCurrentPage(getPageFromPath())
  }, [location.pathname])

  const handleMarkNotifRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllNotifRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Exact 7 groups and 16 items matching reference image
  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'APPLICATION MANAGEMENT',
      items: [
        { id: 'assigned', label: 'Assigned Applications', icon: FileText },
        { id: 'scrutiny', label: 'Application Scrutiny', icon: FileSearch },
        { id: 'deficiencies', label: 'Deficiency Management', icon: AlertTriangle },
        { id: 'tracking', label: 'Application Tracking', icon: GitBranch }
      ]
    },
    {
      title: 'EVC MANAGEMENT',
      items: [
        { id: 'evc-scheduling', label: 'EVC Scheduling', icon: Calendar },
        { id: 'inspection-status', label: 'Inspection Status', icon: CheckSquare }
      ]
    },
    {
      title: 'COMPLIANCE MONITORING',
      items: [
        { id: 'undertakings', label: 'Undertaking Verification', icon: CheckSquare },
        { id: 'documents', label: 'Document Verification', icon: Layers },
        { id: 'lease-validity', label: 'Lease Validity Monitoring', icon: Building2 }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'bottlenecks', label: 'Intelligence & Bottleneck Engine', icon: TrendingUp },
        { id: 'simulation', label: 'What-If Simulation', icon: Sliders }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'notifications', label: 'Notifications & Alerts', icon: Bell }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut }
      ]
    }
  ]

  const handleNavigate = (pageId, appId = null) => {
    if (pageId === 'logout') {
      logout()
      navigate('/login')
      return
    }
    setCurrentPage(pageId)
    if (appId) setSelectedAppId(appId)
    setMobileMenuOpen(false)
    navigate(`/officer/${pageId}`)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    handleNavigate('assigned')
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex antialiased">
      {/* ── Left Sidebar (Dark Navy matching image) ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-64 md:w-68 bg-[#0B1E38] text-white flex flex-col justify-between shrink-0 shadow-xl transition-transform duration-200 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Greek Pillar Shield Icon */}
              <div className="w-8 h-8 rounded-lg bg-[#1E6DEB] text-white flex items-center justify-center shrink-0 shadow-md">
                <Shield className="w-5 h-5 fill-white/20" />
              </div>
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm text-white tracking-wide block leading-none">
                  AICTE SENTINEL
                </span>
                <span className="text-[9px] text-white/50 block tracking-tight mt-1 truncate">
                  Intelligent Approval &amp; Compliance Automation
                </span>
              </div>
            </div>

            {/* Officer Portal Capsule Card */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#07152B] border border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/90">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-none">Officer Portal</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Regional Officer</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Navigation Groups List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  const isLogout = item.id === 'logout'
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-[#1E6DEB] text-white font-semibold shadow-sm'
                          : isLogout
                            ? 'text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ── Main Content Area with Top Navbar ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar matching image */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-xs">
          {/* Left: Hamburger + Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applications, institutions, or documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] hover:bg-[#EEF1F6] focus:bg-white border border-transparent focus:border-[#1E6DEB] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </form>
          </div>

          {/* Right: Notification Bell (5 badge) + User Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell Button */}
            <button
              onClick={() => handleNavigate('notifications')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="5 Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                5
              </span>
            </button>

            {/* User Profile Capsule */}
            <div
              onClick={() => handleNavigate('profile')}
              className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                  alt="R. Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#1E6DEB] block leading-tight transition-colors">
                  R. Sharma
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Regional Officer (West)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigateToPage={handleNavigate}
              onSelectApp={(appId) => setSelectedAppId(appId)}
            />
          )}

          {currentPage === 'assigned' && (
            <AssignedApplications
              onSelectApp={(appId) => setSelectedAppId(appId)}
              onNavigateToScrutiny={(appId) => handleNavigate('scrutiny', appId)}
            />
          )}

          {currentPage === 'scrutiny' && (
            <Scrutiny
              appId={selectedAppId}
              onBack={() => handleNavigate('assigned')}
              onNavigateToCompliance={() => handleNavigate('deficiencies')}
            />
          )}

          {currentPage === 'deficiencies' && (
            <DeficiencyClarification
              initialAppId={selectedAppId}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentPage === 'tracking' && (
            <ApplicationTracking
              onSelectApp={(appId) => setSelectedAppId(appId)}
              onNavigateToScrutiny={(appId) => handleNavigate('scrutiny', appId)}
            />
          )}

          {currentPage === 'evc-scheduling' && (
            <EVCScheduling
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentPage === 'inspection-status' && (
            <InspectionStatus />
          )}

          {currentPage === 'undertakings' && (
            <UndertakingVerification />
          )}

          {currentPage === 'documents' && (
            <DocumentVerification />
          )}

          {currentPage === 'lease-validity' && (
            <LeaseValidityMonitoring />
          )}

          {currentPage === 'bottlenecks' && (
            <BottleneckEngine
              onNavigateToSimulation={() => handleNavigate('simulation')}
            />
          )}

          {currentPage === 'simulation' && (
            <WhatIfSimulation />
          )}

          {currentPage === 'notifications' && (
            <NotificationsAlerts
              onNavigateToPage={handleNavigate}
            />
          )}

          {currentPage === 'profile' && (
            <OfficerProfile />
          )}

          {currentPage === 'settings' && (
            <OfficerSettings />
          )}
        </main>
      </div>

      {/* Global Notification Panel Drawer */}
      <NotificationPanel
        isOpen={notifPanelOpen}
        onClose={() => setNotifPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifRead}
        onNotificationClick={(notif) => {
          if (notif.actionRoute) {
            handleNavigate(notif.actionRoute)
            setNotifPanelOpen(false)
          }
        }}
      />
    </div>
  )
}
