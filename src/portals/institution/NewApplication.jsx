import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Building2,
  BookOpen,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/institution/FileUpload';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { applicationTypes, programLevels, disciplines, indianStates } from '../../data/mockData';
import { useInstitution } from './context/InstitutionContext';

const STEPS = [
  { id: 1, title: 'Application Type', subtitle: 'Category & AY', icon: FileText },
  { id: 2, title: 'Institution Info', subtitle: 'Affiliation & State', icon: Building2 },
  { id: 3, title: 'Programme Details', subtitle: 'Intake & Curricula', icon: BookOpen },
  { id: 4, title: 'Document Checklist', subtitle: 'Statutory Uploads', icon: Upload },
  { id: 5, title: 'Review & Submit', subtitle: 'Declaration', icon: CheckCircle2 },
];

export default function NewApplication() {
  const navigate = useNavigate();
  const { profile, addApplication } = useInstitution();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [newApplicationId, setNewApplicationId] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    applicationType: 'New Program Approval',
    academicYear: '2025-26',
    priority: 'Normal',
    category: 'Engineering & Technology',
    institutionName: profile.name,
    approvalNo: profile.affiliationNo,
    state: profile.state,
    district: profile.district,
    address: profile.address,
    website: profile.websiteUrl,
    programName: '',
    level: 'UG',
    discipline: 'Engineering & Technology',
    duration: '4',
    intake: '60',
    tuitionFee: '120000',
    programObjectives: '',
    uploadedDocuments: [],
    declared: false,
  });

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!form.applicationType) errs.applicationType = 'Please select application type';
      if (!form.academicYear) errs.academicYear = 'Academic year is required';
    } else if (step === 2) {
      if (!form.institutionName) errs.institutionName = 'Institution name is required';
      if (!form.state) errs.state = 'State is required';
      if (!form.district) errs.district = 'District is required';
    } else if (step === 3) {
      if (!form.programName.trim()) errs.programName = 'Program / Course name is required';
      if (!form.level) errs.level = 'Level is required';
      if (!form.discipline) errs.discipline = 'Discipline is required';
      if (!form.intake || parseInt(form.intake) <= 0) errs.intake = 'Valid intake capacity is required';
    } else if (step === 4) {
      if (form.uploadedDocuments.length === 0) {
        errs.uploadedDocuments = 'Please upload at least one required supporting document';
      }
    } else if (step === 5) {
      if (!form.declared) {
        errs.declared = 'You must confirm the statutory declaration before submitting';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const generatedId = addApplication(form);
    setNewApplicationId(generatedId);
    setSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit New Regulatory Application"
        subtitle="Step-by-step submission portal for Course Approvals, EoA, Intake Variations and NOCs."
        breadcrumb={['Home', 'Applications', 'New Application']}
      />

      {/* Progress Steps Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isDone = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <React.Fragment key={s.id}>
                <div
                  onClick={() => s.id < currentStep && setCurrentStep(s.id)}
                  className={`flex items-center gap-3 min-w-fit px-2 py-1 rounded-xl transition-all ${
                    s.id < currentStep ? 'cursor-pointer hover:bg-slate-50' : ''
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 shadow-md'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                  </div>
                  <div className="hidden md:block text-left">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#2563EB]'
                          : isDone
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{s.subtitle}</p>
                  </div>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block h-0.5 flex-1 min-w-[20px] transition-colors ${
                      s.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Draft Notification Toast */}
      {draftSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Draft application saved locally in Sentinel temporary cache. You can resume anytime.</span>
        </div>
      )}

      {/* Step Content Container */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Step 1: Application Type */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Select Application Category & Academic Year
              </h3>
              <p className="text-xs text-slate-500">
                Choose the approval classification as per AICTE Approval Process Handbook (APH)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Application Classification *
                </label>
                <select
                  value={form.applicationType}
                  onChange={e => update('applicationType', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {applicationTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.applicationType && (
                  <p className="mt-1 text-xs text-rose-600">{errors.applicationType}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Academic Cycle / Year *
                </label>
                <select
                  value={form.academicYear}
                  onChange={e => update('academicYear', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value="2025-26">Academic Year 2025-26 (Active Regular Cycle)</option>
                  <option value="2026-27">Academic Year 2026-27 (Advance Planning)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Submission Processing Priority
                </label>
                <div className="flex gap-3">
                  {['Normal', 'Urgent / Priority Scrutiny'].map(p => (
                    <label
                      key={p}
                      className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                        form.priority === p
                          ? 'border-[#2563EB] bg-blue-50 text-[#123B70]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={() => update('priority', p)}
                        className="hidden"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Council Discipline Division
                </label>
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {disciplines.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Institution Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Institution Identity & Jurisdiction
              </h3>
              <p className="text-xs text-slate-500">
                Pre-populated from verified Sentinel institutional master profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Institutional Name *
                </label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={e => update('institutionName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  AICTE Permanent ID / Affiliation
                </label>
                <input
                  type="text"
                  value={form.approvalNo}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  State / UT *
                </label>
                <select
                  value={form.state}
                  onChange={e => update('state', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {indianStates.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={e => update('district', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Website
                </label>
                <input
                  type="text"
                  value={form.website}
                  onChange={e => update('website', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Campus Address
                </label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Programme Details */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. Proposed Course / Programme Specifications
              </h3>
              <p className="text-xs text-slate-500">
                Provide academic curriculum details, proposed intake capacity, and tuition structure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Proposed Course / Degree Title *
                </label>
                <input
                  type="text"
                  value={form.programName}
                  onChange={e => update('programName', e.target.value)}
                  placeholder="e.g. B.Tech Artificial Intelligence and Data Science"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
                {errors.programName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.programName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Academic Level *
                </label>
                <select
                  value={form.level}
                  onChange={e => update('level', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {programLevels.map(lvl => (
                    <option key={lvl} value={lvl}>
                      {lvl} (Degree)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Discipline Specialization *
                </label>
                <select
                  value={form.discipline}
                  onChange={e => update('discipline', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  {disciplines.map(disc => (
                    <option key={disc} value={disc}>
                      {disc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Approved Annual Student Intake *
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={form.intake}
                  onChange={e => update('intake', e.target.value)}
                  placeholder="60"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
                {errors.intake && (
                  <p className="mt-1 text-xs text-rose-600">{errors.intake}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Duration (Years) *
                </label>
                <select
                  value={form.duration}
                  onChange={e => update('duration', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value="1">1 Year</option>
                  <option value="2">2 Years (PG / Lateral)</option>
                  <option value="3">3 Years (B.Sc / MCA / Diploma)</option>
                  <option value="4">4 Years (B.Tech / B.E)</option>
                  <option value="5">5 Years (Integrated / B.Arch)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Annual Tuition Fee Scale (₹)
                </label>
                <input
                  type="number"
                  value={form.tuitionFee}
                  onChange={e => update('tuitionFee', e.target.value)}
                  placeholder="120000"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Programme Objectives & Industry Alignment
                </label>
                <textarea
                  rows={3}
                  value={form.programObjectives}
                  onChange={e => update('programObjectives', e.target.value)}
                  placeholder="Summarize learning outcomes, laboratory readiness, and industry advisory board approvals..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Required Document Checklist & Upload */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Mandatory Document Checklist & Vault Upload
              </h3>
              <p className="text-xs text-slate-500">
                Attach digital certified copies. All uploads are processed through automated OCR integrity verification.
              </p>
            </div>

            {/* Checklist guidance */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <h4 className="text-xs font-bold text-[#123B70] uppercase tracking-wider mb-2">
                Statutory Documents Required for this Application Category:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Land & Lease Registered Deed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Approved Municipal Building Plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Departmental Faculty Cadre Roster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Lab Equipment Invoices & Calibration Certs</span>
                </li>
              </ul>
            </div>

            <FileUpload
              label="Upload Application Dossier / Supporting Files"
              hint="Attach signed PDFs or archive bundles (up to 20MB). Demo will attach filename to application."
              multiple={true}
              selectedFiles={form.uploadedDocuments}
              onFileSelect={(files) => {
                const arr = Array.isArray(files) ? files : [files];
                update('uploadedDocuments', [...form.uploadedDocuments, ...arr]);
              }}
              onRemoveFile={(idx) => {
                update(
                  'uploadedDocuments',
                  form.uploadedDocuments.filter((_, i) => i !== idx)
                );
              }}
            />
            {errors.uploadedDocuments && (
              <p className="text-xs text-rose-600">{errors.uploadedDocuments}</p>
            )}
          </div>
        )}

        {/* Step 5: Review & Declaration */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                5. Comprehensive Application Review & Submission
              </h3>
              <p className="text-xs text-slate-500">
                Verify details carefully. Submitted applications are locked and forwarded to the Regional Scrutiny Officer.
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 divide-y divide-slate-200/70 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3">
                <div>
                  <span className="text-slate-400 block">Category:</span>
                  <strong className="text-slate-800 text-sm">{form.applicationType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Academic Year:</span>
                  <strong className="text-slate-800 text-sm">{form.academicYear}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Proposed Intake:</span>
                  <strong className="text-slate-800 text-sm">{form.intake} Students</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration:</span>
                  <strong className="text-slate-800 text-sm">{form.duration} Years</strong>
                </div>
              </div>

              <div className="pt-3 pb-3">
                <span className="text-slate-400 block mb-0.5">Proposed Program Title:</span>
                <span className="text-sm font-bold text-[#123B70]">{form.programName}</span>
                <p className="text-slate-500 mt-0.5">
                  Level: {form.level} • Discipline: {form.discipline} • Annual Tuition: ₹{parseInt(form.tuitionFee || 0).toLocaleString()}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-slate-400 block mb-1">Attached Documents:</span>
                <div className="flex flex-wrap gap-2">
                  {form.uploadedDocuments.map((doc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded bg-white border border-slate-200 px-2 py-1 text-slate-700 font-mono text-[11px]"
                    >
                      📄 {doc.name || doc}
                    </span>
                  ))}
                  {form.uploadedDocuments.length === 0 && (
                    <span className="text-rose-600 font-semibold">No documents attached yet!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Statutory Declaration */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.declared}
                  onChange={e => update('declared', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I, <strong>{profile.principal?.name}</strong>, Director/Principal of <strong>{profile.name}</strong>, hereby solemnly declare that all statements made and documents attached with this application are genuine and authentic. I confirm that our institution satisfies the AICTE norms regarding land, built-up space, faculty cadres, and laboratory readiness. Any misrepresentation shall forfeit institutional approval.
                </span>
              </label>
              {errors.declared && (
                <p className="mt-2 text-xs text-rose-600 font-semibold">{errors.declared}</p>
              )}
            </div>
          </div>
        )}

        {/* Form Actions Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Save className="h-4 w-4 text-slate-400" />
              <span>Save as Draft</span>
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit Application to AICTE</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <ConfirmationModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/institution/applications');
        }}
        onConfirm={() => {
          setSuccessModalOpen(false);
          navigate('/institution/applications');
        }}
        title="Application Submitted Successfully!"
        message={`Your application has been registered with Application ID ${newApplicationId}. It has been entered into the live state and is now visible under My Applications and Application Tracking.`}
        confirmText="Go to My Applications"
        cancelText="Close"
        type="success"
      />
    </div>
  );
}
