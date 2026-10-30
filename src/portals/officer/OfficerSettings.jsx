import React, { useState } from 'react'
import {
  Settings, Bell, Shield, Lock, Sliders, CheckCircle2,
  Check, Save, Clock, Key
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function OfficerSettings() {
  const [settings, setSettings] = useState({
    slaWarningHours: '72',
    highRiskAlert: true,
    emailDeficiencySummary: true,
    autoOcrValidation: true,
    strict30YearLease: true,
    sessionTimeoutMins: '30',
    dscUsbPrompt: true,
    twoFactorAuth: true
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
        title="Officer Preferences &amp; Scrutiny Workflow Settings"
        subtitle="Configure regulatory alert thresholds, automated OCR validation gates &amp; session security"
        badgeText="Settings Active"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Settings']}
      />

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preferences saved successfully to your officer profile.</span>
          </div>
          <button onClick={() => setSaved(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Section 1: SLA & Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#1E6DEB]" /> Statutory SLA &amp; Alert Thresholds
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">SLA Breach Advance Warning</p>
                <p className="text-slate-500 text-[11px]">Dispatch notification prior to statutory 14-day limit breach</p>
              </div>
              <select
                value={settings.slaWarningHours}
                onChange={e => setSettings({ ...settings, slaWarningHours: e.target.value })}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              >
                <option value="24">24 Hours Before</option>
                <option value="48">48 Hours Before</option>
                <option value="72">72 Hours Before (Recommended)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">High-Risk Institution Alert (&gt;70% Score)</p>
                <p className="text-slate-500 text-[11px]">Pin applications with high deficiency risk to top of queue</p>
              </div>
              <input
                type="checkbox"
                checked={settings.highRiskAlert}
                onChange={e => setSettings({ ...settings, highRiskAlert: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Daily Deficiency Digest Email</p>
                <p className="text-slate-500 text-[11px]">Send morning summary of resubmitted institution documents</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailDeficiencySummary}
                onChange={e => setSettings({ ...settings, emailDeficiencySummary: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scrutiny Gates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#7738E8]" /> AI OCR Scrutiny Automated Gates
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Auto-Flag Land Deeds with Unexpired Tenure &lt; 30 Years</p>
                <p className="text-slate-500 text-[11px]">Enforce strict APH Clause 1.8.2 non-metro land norms</p>
              </div>
              <input
                type="checkbox"
                checked={settings.strict30YearLease}
                onChange={e => setSettings({ ...settings, strict30YearLease: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">AI-OCR Confidence Threshold</p>
                <p className="text-slate-500 text-[11px]">Require human officer sign-off if OCR match score &lt; 90%</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoOcrValidation}
                onChange={e => setSettings({ ...settings, autoOcrValidation: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Digital Signature & Session */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-4 h-4 text-[#159B68]" /> Digital Signature &amp; Desk Security
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Idle Session Inactivity Timeout</p>
                <p className="text-slate-500 text-[11px]">Lock officer desk if left unattended</p>
              </div>
              <select
                value={settings.sessionTimeoutMins}
                onChange={e => setSettings({ ...settings, sessionTimeoutMins: e.target.value })}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900">USB Token Class-3 DSC Auto-Detect</p>
                <p className="text-slate-500 text-[11px]">Prompt hardware token for scrutiny approval sign-offs</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dscUsbPrompt}
                onChange={e => setSettings({ ...settings, dscUsbPrompt: e.target.checked })}
                className="w-4 h-4 accent-[#1E6DEB] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}

