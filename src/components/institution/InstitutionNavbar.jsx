import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';

export default function InstitutionNavbar({ onMenuToggle, onLogoutClick }) {
  const navigate = useNavigate();
  const { profile, notifications, stats, markNotificationAsRead } = useInstitution();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/institution/applications?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md lg:px-8 shadow-sm">
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#123B70]">
            <Building className="h-4 w-4" />
          </span>
          <div>
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {profile.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              AICTE ID: {profile.aictePermanentId} • {profile.state}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applications, deficiencies, document records..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
          />
        </form>
      </div>

      {/* Right side: Quick stats + Notifications + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compliance Score Pill */}
        <div
          onClick={() => navigate('/institution/dashboard')}
          className="hidden xl:flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs cursor-pointer hover:bg-emerald-100/70 transition-colors"
          title="Institutional Compliance Health Index"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
            {stats.complianceScore}%
          </div>
          <div className="leading-tight">
            <span className="font-semibold text-emerald-900">Compliance Health</span>
            <span className="block text-[10px] text-emerald-700">Good Standing</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(prev => !prev)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      {unreadNotifs.length} Unread
                    </span>
                  )}
                </div>
                <Link
                  to="/institution/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.relatedPath) navigate(n.relatedPath);
                      setNotifOpen(false);
                    }}
                    className={`p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      n.read ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="mt-1 text-slate-500 line-clamp-2 text-[11px]">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                <Link
                  to="/institution/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                  Go to Notification Centre →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-2.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#123B70] to-[#2563EB] text-white font-bold text-xs shadow-sm">
              DR
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-bold text-slate-800 truncate max-w-[120px]">
                {profile.principal?.name || 'Dr. Principal'}
              </div>
              <div className="text-[10px] text-slate-500">Institution Head</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <div className="font-bold text-slate-800 text-sm">
                  {profile.principal?.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {profile.officialEmail}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  <Sparkles className="h-3 w-3" />
                  Authorized AICTE Signatory
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  to="/institution/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Institution Profile</span>
                </Link>
                <Link
                  to="/institution/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Portal Settings</span>
                </Link>
                <Link
                  to="/institution/help-support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  <span>Help & Compliance Guide</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogoutClick();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
