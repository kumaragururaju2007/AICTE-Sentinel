import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Landmark, UserCheck, Layers,
  SlidersHorizontal, Sliders, FileText, Calendar, Clock,
  Bell, BarChart3, History, Settings, HelpCircle, Shield,
  Search, Sun, Moon, Menu, X, ChevronRight, LogOut, CheckCircle2,
  FileCheck
} from 'lucide-react'

// Sub-components
import Dashboard from './Dashboard'
import UserManagement from './UserManagement'
import AllApplications from './AllApplications'
import WorkflowConfiguration from './WorkflowConfiguration'
import StageConfiguration from './StageConfiguration'
import DocumentTemplates from './DocumentTemplates'
import ObligationsDeadlines from './ObligationsDeadlines'
import SLAConfiguration from './SLAConfiguration'
import AlertManagement from './AlertManagement'
import AnalyticsReports from './AnalyticsReports'
import AuditLogs from './AuditLogs'
import SystemSettings from './SystemSettings'
import AdminHelpSupport from './AdminHelpSupport'
import NotificationPanel from '../../components/common/NotificationPanel'

import { useApplicationContext } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function AdminPortal({ initialPage = 'dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  const getPageFromPath = () => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/admin/users') || path.includes('/admin/roles')) return 'users'
    if (path.includes('/admin/institutions')) return 'institutions'
    if (path.includes('/admin/officials') || path.includes('/admin/officers')) return 'officials'
    if (path.includes('/admin/applications') || path.includes('/admin/all-applications')) return 'applications'
    if (path.includes('/admin/workflows') || path.includes('/admin/workflow')) return 'workflows'
    if (path.includes('/admin/stage') || path.includes('/admin/stages')) return 'stage-config'
    if (path.includes('/admin/document') || path.includes('/admin/templates')) return 'document-templates'
    if (path.includes('/admin/obligations') || path.includes('/admin/deadlines')) return 'obligations'
    if (path.includes('/admin/sla')) return 'sla-config'
    if (path.includes('/admin/alerts') || path.includes('/admin/notifications')) return 'alerts'
    if (path.includes('/admin/analytics') || path.includes('/admin/reports')) return 'analytics'
    if (path.includes('/admin/audit')) return 'audit-logs'
    if (path.includes('/admin/settings')) return 'settings'
    if (path.includes('/admin/help') || path.includes('/admin/support')) return 'help'
    if (path.includes('/admin/dashboard')) return 'dashboard'
    return initialPage
  }

  const [currentPage, setCurrentPage] = useState(getPageFromPath)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Stateful Admin Notifications
  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: 'n1',
      title: 'New application submitted',
      message: 'SVS College of Engineering submitted EoA application for AY 2026-27 with 420 intake.',
      timestamp: '10 min ago',
      type: 'APPLICATION',
      priority: 'INFO',
      read: false,
      actionRoute: 'applications'
    },
    {
      id: 'n2',
      title: 'EVC deadline approaching',
      message: 'ABC Engineering College EVC inspection window closing in 48 hours.',
      timestamp: '1 hour ago',
      type: 'EVC',
      priority: 'CRITICAL',
      read: false,
      actionRoute: 'obligations'
    },
    {
      id: 'n3',
      title: 'Document verification pending',
      message: 'GreenTech Polytechnic uploaded revised 30-year lease deed.',
      timestamp: '3 hours ago',
      type: 'DOCUMENT',
      priority: 'HIGH',
      read: false,
      actionRoute: 'applications'
    },
    {
      id: 'n4',
      title: 'Stage delay detected',
      message: 'Skyline Institute of Mgmt reached 85% of scrutiny SLA budget.',
      timestamp: '5 hours ago',
      type: 'SLA',
      priority: 'CRITICAL',
      read: false,
      actionRoute: 'obligations'
    },
    {
      id: 'n5',
      title: 'System update completed',
      message: 'Workflow rules updated successfully to APH 2026-27.',
      timestamp: '1 day ago',
      type: 'SYSTEM',
      priority: 'INFO',
      read: true,
      actionRoute: 'workflows'
    }
  ])

  const handleMarkNotifRead = (id) => {
    setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllNotifsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadNotifCount = adminNotifications.filter(n => !n.read).length

  useEffect(() => {
    setCurrentPage(getPageFromPath())
  }, [location.pathname])

  // Exact 4 groups and 14 items matching reference image media_1793350561025_4232a14b.jpg
  const navGroups = [
    {
      title: 'USER MANAGEMENT',
      items: [
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'institutions', label: 'Institutions', icon: Landmark },
        { id: 'officials', label: 'AICTE Officials', icon: UserCheck }
      ]
    },
    {
      title: 'APPLICATION MANAGEMENT',
      items: [
        { id: 'applications', label: 'All Applications', icon: Layers },
        { id: 'workflows', label: 'Workflow Management', icon: SlidersHorizontal },
        { id: 'stage-config', label: 'Stage Configuration', icon: Sliders },
        { id: 'document-templates', label: 'Document Templates', icon: FileText }
      ]
    },
    {
      title: 'OBLIGATION MANAGEMENT',
      items: [
        { id: 'obligations', label: 'Obligations & Deadlines', icon: Calendar },
        { id: 'sla-config', label: 'SLA Configuration', icon: Clock },
        { id: 'alerts', label: 'Notifications & Alerts', icon: Bell }
      ]
    },
    {
      title: 'SYSTEM & ANALYTICS',
      items: [
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'audit-logs', label: 'Audit Logs', icon: FileCheck },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ]

  const handleNavigate = (pageId) => {
    if (pageId === 'logout') {
      logout()
      navigate('/login')
      return
    }
    setCurrentPage(pageId)
    setMobileMenuOpen(false)
    navigate(`/admin/${pageId}`)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    handleNavigate('applications')
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex antialiased">
      {/* ── Left Sidebar (Deep Navy matching reference image) ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-64 md:w-68 bg-[#0B192C] text-white flex flex-col justify-between shrink-0 shadow-xl transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
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
                  AICTE Sentinel
                </span>
                <span className="text-[9px] text-white/50 block tracking-tight mt-1 truncate">
                  Intelligent Approval &amp; Compliance Automation
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Groups List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {/* Standalone Dashboard Item */}
            <div>
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-[#1E6DEB] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentPage === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Menu Groups */}
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1E6DEB] text-white font-semibold shadow-sm'
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

          {/* Bottom Pinned Help & Support Item */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <button
              onClick={() => handleNavigate('help')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'help'
                  ? 'bg-[#1E6DEB] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className={`w-4 h-4 shrink-0 ${currentPage === 'help' ? 'text-white' : 'text-slate-400'}`} />
              <span>Help &amp; Support</span>
            </button>
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
        {/* Top Navbar matching reference image */}
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
                placeholder="Search applications, institutions, users..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] hover:bg-[#EEF1F6] focus:bg-white border border-transparent focus:border-[#1E6DEB] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </form>
          </div>

          {/* Right: Notification Bell (5 badge) + Theme Sun Icon + User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell Button */}
            <button
              onClick={() => setNotifPanelOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title={`${unreadNotifCount} Notifications`}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Daylight Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile Capsule matching reference image */}
            <div
              onClick={() => handleNavigate('users')}
              className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B192C] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                AU
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#1E6DEB] block leading-tight transition-colors">
                  Admin User
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  System Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <Dashboard onNavigateToPage={handleNavigate} />
          )}

          {currentPage === 'users' && (
            <UserManagement initialTab="users" />
          )}

          {currentPage === 'institutions' && (
            <UserManagement initialTab="institutions" />
          )}

          {currentPage === 'officials' && (
            <UserManagement initialTab="officers" />
          )}

          {currentPage === 'applications' && (
            <AllApplications />
          )}

          {currentPage === 'workflows' && (
            <WorkflowConfiguration />
          )}

          {currentPage === 'stage-config' && (
            <StageConfiguration />
          )}

          {currentPage === 'document-templates' && (
            <DocumentTemplates />
          )}

          {currentPage === 'obligations' && (
            <ObligationsDeadlines />
          )}

          {currentPage === 'sla-config' && (
            <SLAConfiguration />
          )}

          {currentPage === 'alerts' && (
            <AlertManagement initialTab="notifications" />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsReports />
          )}

          {currentPage === 'audit-logs' && (
            <AuditLogs />
          )}

          {currentPage === 'settings' && (
            <SystemSettings />
          )}

          {currentPage === 'help' && (
            <AdminHelpSupport />
          )}
        </main>
      </div>

      {/* Global Notification Panel Drawer */}
      <NotificationPanel
        isOpen={notifPanelOpen}
        onClose={() => setNotifPanelOpen(false)}
        notifications={adminNotifications}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifsRead}
        onNavigate={(routeOrNotif) => {
          setNotifPanelOpen(false)
          if (typeof routeOrNotif === 'string') {
            handleNavigate(routeOrNotif)
          } else if (routeOrNotif?.actionRoute) {
            handleNavigate(routeOrNotif.actionRoute)
          } else {
            handleNavigate('alerts')
          }
        }}
      />
    </div>
  )
}
