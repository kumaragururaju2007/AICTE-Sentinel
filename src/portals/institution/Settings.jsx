import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Mail,
  Lock,
  Globe,
  Shield,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useInstitution } from './context/InstitutionContext';

export default function Settings() {
  const { profile } = useInstitution();

  const [activeTab, setActiveTab] = useState('account');
  const [saveToast, setSaveToast] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    emailScrutiny: true,
    emailDeficiency: true,
    emailDeadlines: true,
    smsUrgent: true,
    pushEVC: true,
    weeklyDigest: false,
    frequency: 'immediate',
  });

  // Language & display
  const [lang, setLang] = useState('en');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Password state
  const [passForm, setPassForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassError('');
    if (!passForm.currentPass) {
      setPassError('Current password is required.');
      return;
    }
    if (passForm.newPass.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setPassSuccess(true);
    setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPassSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portal Settings & Governance Configurations"
        subtitle="Manage communication channels, security credentials, and compliance alert frequencies."
        breadcrumb={['Home', 'Account', 'Settings']}
      />

      {/* Demo disclaimer banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <Info className="h-5 w-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block text-[#123B70] font-bold mb-0.5">
            Frontend Prototype Simulation Notice:
          </strong>
          These preference controls simulate institutional profile settings for demonstration purposes. In this prototype, settings updates persist in the local session and do not overwrite production government servers without an authorized backend.
        </div>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Institutional communication preferences updated and saved for this session.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'account', label: 'Account & Regional Desk', icon: SettingsIcon },
          { id: 'notifications', label: 'Notification & Email Alerts', icon: Bell },
          { id: 'security', label: 'Password & Authentication', icon: Lock },
          { id: 'localization', label: 'Language & Accessibility', icon: Globe },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#123B70] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account Settings */}
      {activeTab === 'account' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Institutional Account & Council Mapping
            </h3>
            <p className="text-xs text-slate-500">
              Assigned Regional Bureau desk and statutory contact credentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block text-[11px]">Assigned Regional Office</span>
              <strong className="text-slate-800 text-sm block">Southern Regional Office (SRO), Chennai</strong>
              <p className="text-slate-500 text-[11px]">AICTE Shastri Bhawan, 26 Haddows Road, Nungambakkam</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block text-[11px]">Primary Authorized Login</span>
              <strong className="text-slate-800 text-sm block">{profile.officialEmail}</strong>
              <p className="text-slate-500 text-[11px]">Principal / Director executive portal access token</p>
            </div>
          </div>

          {/* Active Sessions list */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Active Sentinel Portal Sessions
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 divide-y divide-slate-100 text-xs">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-800 block">Current Web Browser Session (Active Now)</span>
                    <span className="text-[11px] text-slate-400 font-mono">14.139.183.12 • Chrome on Windows NT</span>
                  </div>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  This Device
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <div>
                    <span className="font-semibold text-slate-700 block">Secondary Administrative Terminal</span>
                    <span className="text-[11px] text-slate-400 font-mono">14.139.183.15 • Registrar Office Desktop</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Idle 4h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notification & Email Alerts */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSavePreferences} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Notification & Alert Dispatch Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Configure channels for scrutiny notices, deadline alerts, and EVC window telemetry
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'emailScrutiny',
                title: 'Scrutiny Officer Inquiries & Deficiencies',
                desc: 'Instant email alert when a regional officer raises a compliance defect on any application.',
              },
              {
                id: 'emailDeadlines',
                title: 'Obligation & Expiry Reminders',
                desc: 'Proactive email alerts 30 days and 7 days prior to land lease or affidavit expiration.',
              },
              {
                id: 'smsUrgent',
                title: 'Emergency SMS Broadcasts to Director Mobile',
                desc: 'Dispatch emergency SMS messages for surprise EVC inspection 48-hour notices.',
              },
              {
                id: 'pushEVC',
                title: 'Live Portal Telemetry & Status Badges',
                desc: 'Enable instant unread badge counter in top navigation bar for council updates.',
              },
              {
                id: 'weeklyDigest',
                title: 'Weekly Executive Compliance Digest',
                desc: 'Receive comprehensive summary of institutional health score and completed milestones each Monday.',
              },
            ].map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={notifPrefs[item.id]}
                  onChange={e => setNotifPrefs({ ...notifPrefs, [item.id]: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <span>Save Alert Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Password Change */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 max-w-xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Change Institutional Portal Password
            </h3>
            <p className="text-xs text-slate-500">
              Ensure passphrases satisfy Ministry of Education password security standards
            </p>
          </div>

          {passSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fade-in-up">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Password updated successfully for this session.</span>
            </div>
          )}

          {passError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>{passError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                value={passForm.currentPass}
                onChange={e => setPassForm({ ...passForm, currentPass: e.target.value })}
                placeholder="Enter existing password"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                value={passForm.newPass}
                onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passForm.confirmPass}
                onChange={e => setPassForm({ ...passForm, confirmPass: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <KeyRound className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Language & Accessibility */}
      {activeTab === 'localization' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 max-w-xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Language & Regional Localization
            </h3>
            <p className="text-xs text-slate-500">
              Select preferred working language for portal notifications and date conventions
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Interface Language
              </label>
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
              >
                <option value="en">English (Official Council Language)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date & Calendar Format
              </label>
              <select
                value={dateFormat}
                onChange={e => setDateFormat(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
