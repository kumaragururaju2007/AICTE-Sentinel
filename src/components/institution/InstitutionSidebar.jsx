import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Activity,
  AlertCircle,
  FolderCheck,
  CheckSquare,
  CalendarClock,
  Eye,
  Bell,
  HelpCircle,
  Building2,
  Settings,
  LogOut,
  Shield,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';

export default function InstitutionSidebar({ isOpen, onClose, onLogoutClick }) {
  const location = useLocation();
  const { profile, stats, notifications, deficiencies, leaseDocuments } = useInstitution();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const activeDeficiencies = deficiencies.filter(d => d.status === 'Pending Response').length;
  const expiringLeases = leaseDocuments.filter(l => l.remainingDays <= 180).length;

  const NAV_GROUPS = [
    {
      group: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          path: '/institution/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'APPLICATION MANAGEMENT',
      items: [
        {
          label: 'New Application',
          path: '/institution/new-application',
          icon: PlusCircle,
          badge: 'New',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
        {
          label: 'My Applications',
          path: '/institution/applications',
          icon: FileText,
          badge: stats.totalApplications.toString(),
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        },
        {
          label: 'Application Tracking',
          path: '/institution/application-tracking',
          icon: Activity,
        },
        {
          label: 'Deficiency & Clarifications',
          path: '/institution/deficiencies',
          icon: AlertCircle,
          badge: activeDeficiencies > 0 ? activeDeficiencies.toString() : null,
          badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-500/40 animate-pulse',
        },
      ],
    },
    {
      group: 'DOCUMENTS & COMPLIANCE',
      items: [
        {
          label: 'Document Repository',
          path: '/institution/documents',
          icon: FolderCheck,
        },
        {
          label: 'Undertaking Compliance',
          path: '/institution/undertakings',
          icon: CheckSquare,
        },
        {
          label: 'Lease & Document Validity',
          path: '/institution/lease-validity',
          icon: CalendarClock,
          badge: expiringLeases > 0 ? `${expiringLeases} Expiring` : null,
          badgeColor: 'bg-rose-500/25 text-rose-300 border-rose-500/30',
        },
        {
          label: 'EVC & Inspection Status',
          path: '/institution/evc-inspection',
          icon: Eye,
          badge: 'Window Active',
          badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
        },
      ],
    },
    {
      group: 'COMMUNICATION',
      items: [
        {
          label: 'Notifications & Alerts',
          path: '/institution/notifications',
          icon: Bell,
          badge: unreadNotifs > 0 ? unreadNotifs.toString() : null,
          badgeColor: 'bg-rose-600 text-white font-bold',
        },
        {
          label: 'Help & Support',
          path: '/institution/help-support',
          icon: HelpCircle,
        },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        {
          label: 'Institution Profile',
          path: '/institution/profile',
          icon: Building2,
        },
        {
          label: 'Settings',
          path: '/institution/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#123B70] text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-emerald-500 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-white text-base leading-tight">
                AICTE Sentinel
              </div>
              <div className="text-[11px] font-medium text-blue-200/70">
                TEAM VALORA • SIH 2026
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Institution Info Badge */}
        <div className="mx-3 mt-3.5 rounded-xl bg-white/5 p-3 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {profile.shortName || profile.name}
              </p>
              <p className="text-[11px] text-blue-200/70 truncate">
                ID: {profile.aictePermanentId}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Institute
            </span>
            <span className="text-slate-300 text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">
              AY 2025-26
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-sidebar-scroll">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/50">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/institution/dashboard' && location.pathname.startsWith(item.path));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-blue-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap ${
                            item.badgeColor || 'bg-white/20 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-white/10 p-3 bg-black/10 text-center">
          <p className="text-[10px] text-blue-200/60">
            AICTE Sentinel v2.4 • Smart India Hackathon
          </p>
          <p className="text-[9px] text-blue-200/40 mt-0.5">
            Ministry of Education • Govt. of India
          </p>
        </div>
      </aside>
    </>
  );
}
