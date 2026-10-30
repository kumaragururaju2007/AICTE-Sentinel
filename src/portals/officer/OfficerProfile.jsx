import React, { useState } from 'react'
import {
  User, Shield, Mail, Phone, MapPin, Building2, Calendar,
  CheckCircle2, Award, Key, Lock, Check, Edit3, ArrowRight
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'

export default function OfficerProfile() {
  const [profile, setProfile] = useState({
    name: 'R. Sharma',
    designation: 'Regional Officer (West)',
    id: 'OFFICER-WR-042',
    email: 'r.sharma@aicte-india.org',
    phone: '+91 22 2285 5412',
    jurisdiction: 'Maharashtra & Goa (Western Bureau)',
    office: 'Industrial Assurance Building, 2nd Floor, V.N. Road, Churchgate, Mumbai 400020',
    joinedDate: '15 Aug 2018',
    dscStatus: 'ACTIVE (Class-3 Valid till Nov 2027)'
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regional Officer Profile &amp; Regulatory Credentials"
        subtitle="Statutory jurisdiction, officer identification, digital signature status and security credentials"
        badgeText="Western Bureau Verified"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Officer Profile']}
      />

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and contact details updated successfully.</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Grid: Officer Card & Detailed Credential Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Officer Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                alt="R. Sharma"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
              <p className="text-xs font-semibold text-[#1E6DEB]">{profile.designation}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{profile.id}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{profile.jurisdiction}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            </div>

            {/* DSC Badge */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> DSC Certificate
              </div>
              <span className="text-[10px] text-emerald-700 font-mono">Class-3 Valid</span>
            </div>
          </div>
        </div>

        {/* Right Column: Credentials & Official Jurisdiction */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1E6DEB]" /> Statutory Jurisdictional Mandate
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Designation &amp; Cadre</label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={e => setProfile({ ...profile, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Official Govt Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Direct Landline / Mobile</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Western Regional Office Address</label>
              <textarea
                rows={2}
                value={profile.office}
                onChange={e => setProfile({ ...profile, office: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#102A56] hover:bg-[#1E6DEB] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

