import React, { useState } from 'react'
import {
  Settings, Save, CheckCircle2, Shield, Database,
  Bell, Key, Lock, RefreshCw, Check
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: 'AICTE Sentinel Regulatory Intelligence Platform',
    currentCycle: 'Academic Year 2026-27',
    cronSchedule: '*/5 * * * * (Every 5 minutes)',
    digiLockerSync: true,
    autoEscalations: true,
    sha256Logging: true,
    maintenanceMode: false,
    sessionTimeout: '30'
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="National System &amp; Infrastructure Settings"
        subtitle="Configure API gateway endpoints, statutory cron schedulers, DigiLocker integration &amp; security policies"
        badgeText="Core Infrastructure Active"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'System Settings']}
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Infrastructure settings successfully saved and applied to running services.</span>
          </div>
          <button onClick={() => setSaved(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 max-w-4xl">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1E6DEB]" /> Gateway &amp; Integration Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">System Title</label>
              <input
                type="text"
                value={settings.systemName}
                onChange={e => setSettings({ ...settings, systemName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Regulatory Approval Cycle</label>
              <input
                type="text"
                value={settings.currentCycle}
                onChange={e => setSettings({ ...settings, currentCycle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">National DigiLocker API Sync</p>
                <p className="text-slate-500 text-[11px]">Auto-verify trust deed and university affiliation certificates via DigiLocker</p>
              </div>
              <input
                type="checkbox"
                checked={settings.digiLockerSync}
                onChange={e => setSettings({ ...settings, digiLockerSync: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Automated T-30, T-7, T-0 SLA Escalations</p>
                <p className="text-slate-500 text-[11px]">Dispatch automated reminder jobs to institutions and regional bureau heads</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoEscalations}
                onChange={e => setSettings({ ...settings, autoEscalations: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Cryptographic SHA-256 Block Logging</p>
                <p className="text-slate-500 text-[11px]">Append-only tamper-evident blockchain-style hash chain for all regulatory actions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sha256Logging}
                onChange={e => setSettings({ ...settings, sha256Logging: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <Check className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  )
}

