import React, { useState } from 'react';
import {
  Building2,
  User,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Landmark,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { indianStates } from '../../data/mockData';
import { useInstitution } from './context/InstitutionContext';

export default function InstitutionProfile() {
  const { profile, updateInstitutionProfile } = useInstitution();
  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    name: profile.name,
    shortName: profile.shortName,
    type: profile.type,
    address: profile.address,
    city: profile.city,
    district: profile.district,
    state: profile.state,
    pincode: profile.pincode,
    officialEmail: profile.officialEmail,
    contactPhone: profile.contactPhone,
    websiteUrl: profile.websiteUrl,
    naacAccreditation: profile.naacAccreditation,
    principalName: profile.principal.name,
    principalDesignation: profile.principal.designation,
    principalQual: profile.principal.qualification,
    principalExp: profile.principal.experienceYears,
    principalMobile: profile.principal.mobile,
    principalEmail: profile.principal.email,
    repName: profile.authorizedRepresentative.name,
    repDesignation: profile.authorizedRepresentative.designation,
    repPhone: profile.authorizedRepresentative.phone,
    repEmail: profile.authorizedRepresentative.email,
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateInstitutionProfile({
      name: formData.name,
      shortName: formData.shortName,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      officialEmail: formData.officialEmail,
      contactPhone: formData.contactPhone,
      websiteUrl: formData.websiteUrl,
      naacAccreditation: formData.naacAccreditation,
      principal: {
        name: formData.principalName,
        designation: formData.principalDesignation,
        qualification: formData.principalQual,
        experienceYears: formData.principalExp,
        mobile: formData.principalMobile,
        email: formData.principalEmail,
      },
      authorizedRepresentative: {
        name: formData.repName,
        designation: formData.repDesignation,
        phone: formData.repPhone,
        email: formData.repEmail,
      },
    });

    setIsEditing(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Master Profile & Council Gazette Data"
        subtitle="Permanent AICTE registration parameters, campus demographics, and statutory signatories."
        breadcrumb={['Home', 'Account', 'Profile']}
        actions={
          !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Institutional Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel Edit</span>
            </button>
          )
        }
      />

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>
            Institutional profile updated successfully! The change has been committed to the live demo session.
          </span>
        </div>
      )}

      {/* Main Profile View / Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Banner Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#123B70] to-[#2563EB] text-white shadow-md font-extrabold text-2xl">
                NIT
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#123B70] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    AICTE Permanent ID: {profile.aictePermanentId}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    Approved Institution
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {profile.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profile.type} • Est. {profile.establishedYear} • Campus: {profile.totalCampusAreaAcres}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <span className="block text-slate-400">NIRF Recognition</span>
              <strong className="text-slate-800">{profile.nirfRanking}</strong>
              <span className="block text-emerald-700 font-semibold mt-0.5">
                {profile.naacAccreditation}
              </span>
            </div>
          </div>

          {/* Section 1: Institutional Core Info */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Institutional Core Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Legal Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 block text-sm">{profile.name}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Name / Moniker</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 block">{profile.shortName}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Institution Classification</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 block">{profile.type}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">State / UT</label>
                {isEditing ? (
                  <select
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-semibold text-slate-800 block">{profile.state}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 block">{profile.district}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 font-mono block">{profile.pincode}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Registered Campus Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <span className="font-medium text-slate-700 block">{profile.address}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Official Web Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.websiteUrl}
                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                  />
                ) : (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563EB] font-semibold hover:underline block"
                  >
                    {profile.websiteUrl}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Director / Principal Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#123B70]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Head of the Institution / Director Details
              </h3>
              <p className="text-xs text-slate-500">
                Primary authorized signatory for AICTE compliance and EVC attendance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Director / Principal Name *</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.principalName}
                  onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <strong className="text-slate-800 block text-sm">{profile.principal.name}</strong>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.principalDesignation}
                  onChange={e => setFormData({ ...formData, principalDesignation: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="text-slate-700 block">{profile.principal.designation}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Academic Qualification</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.principalQual}
                  onChange={e => setFormData({ ...formData, principalQual: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="text-slate-700 block">{profile.principal.qualification}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Mobile Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.principalMobile}
                  onChange={e => setFormData({ ...formData, principalMobile: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="font-mono text-slate-800 block">{profile.principal.mobile}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Official Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.principalEmail}
                  onChange={e => setFormData({ ...formData, principalEmail: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="text-blue-700 font-mono block">{profile.principal.email}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Total Academic Experience</label>
              <span className="text-slate-700 block font-semibold">{profile.principal.experienceYears} Years</span>
            </div>
          </div>
        </div>

        {/* Section 3: Authorized Representative / Registrar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registrar / Authorized Representative
              </h3>
              <p className="text-xs text-slate-500">
                Secondary representative for legal affidavits and Aadhaar-authenticated e-Signs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Representative Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.repName}
                  onChange={e => setFormData({ ...formData, repName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <strong className="text-slate-800 block text-sm">{profile.authorizedRepresentative.name}</strong>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.repDesignation}
                  onChange={e => setFormData({ ...formData, repDesignation: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="text-slate-700 block">{profile.authorizedRepresentative.designation}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.repPhone}
                  onChange={e => setFormData({ ...formData, repPhone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 focus:border-[#2563EB]"
                />
              ) : (
                <span className="font-mono text-slate-800 block">{profile.authorizedRepresentative.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Save button bar when editing */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm sticky bottom-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save & Commit Profile Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
