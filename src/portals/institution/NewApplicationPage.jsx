import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
  FileText, Building2, User, Book, DollarSign, Upload,
  Info, Save
} from 'lucide-react';
import { applicationTypes, indianStates, programLevels, disciplines } from '../../data/mockData';

const FORM_STEPS = [
  { label: 'Application Type', icon: FileText },
  { label: 'Institution Info', icon: Building2 },
  { label: 'Program Details', icon: Book },
  { label: 'Infrastructure', icon: Building2 },
  { label: 'Faculty & Staff', icon: User },
  { label: 'Financial Details', icon: DollarSign },
  { label: 'Documents', icon: Upload },
  { label: 'Review & Submit', icon: CheckCircle },
];

function FormField({ label, required, error, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(240,244,255,0.85)' }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{hint}</p>}
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <AlertCircle size={11} style={{ color: '#f87171' }} />
          <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center min-w-fit">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: done ? '#10b981' : active ? '#2457d4' : 'rgba(59,110,232,0.1)',
                  color: done || active ? '#fff' : 'rgba(240,244,255,0.3)',
                  border: active ? '2px solid #3b6ee8' : '2px solid transparent',
                  boxShadow: active ? '0 0 16px rgba(36,87,212,0.4)' : 'none',
                }}>
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="text-xs mt-1 hidden md:block whitespace-nowrap" style={{ color: active ? '#6b93f0' : done ? '#34d399' : 'rgba(240,244,255,0.3)', maxWidth: '70px', textAlign: 'center' }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px min-w-4" style={{ background: done ? '#10b981' : 'rgba(59,110,232,0.15)', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Individual step components
function Step0({ form, update, errors }) {
  return (
    <div className="space-y-0 animate-fade-in-up">
      <div className="mb-6 p-4 rounded-xl flex gap-3" style={{ background: 'rgba(36,87,212,0.08)', border: '1px solid rgba(36,87,212,0.2)' }}>
        <Info size={16} style={{ color: '#6b93f0', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.7)' }}>
          Select the type of application you wish to submit. Each application type has specific requirements and documentation needs.
        </p>
      </div>
      <FormField label="Application Type" required error={errors.applicationType}>
        <div className="grid sm:grid-cols-2 gap-3">
          {applicationTypes.map(type => (
            <button key={type} type="button"
              onClick={() => update('applicationType', type)}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                border: form.applicationType === type ? '2px solid #2457d4' : '1px solid rgba(59,110,232,0.2)',
                background: form.applicationType === type ? 'rgba(36,87,212,0.15)' : 'rgba(6,15,46,0.5)',
                cursor: 'pointer',
              }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
                  border: form.applicationType === type ? '5px solid #2457d4' : '2px solid rgba(59,110,232,0.4)',
                }} />
                <span className="text-sm font-medium" style={{ color: form.applicationType === type ? '#6b93f0' : 'rgba(240,244,255,0.7)' }}>{type}</span>
              </div>
            </button>
          ))}
        </div>
      </FormField>

      {form.applicationType && (
        <FormField label="Academic Year" required error={errors.academicYear}>
          <select value={form.academicYear} onChange={e => update('academicYear', e.target.value)} className="input-field">
            <option value="">Select academic year...</option>
            {['2025-26', '2026-27', '2027-28'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </FormField>
      )}

      {form.applicationType && (
        <FormField label="Application Priority" error={errors.priority}>
          <div className="flex gap-3">
            {['Normal', 'Urgent'].map(p => (
              <button key={p} type="button" onClick={() => update('priority', p)}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
                style={{
                  border: form.priority === p ? '2px solid #2457d4' : '1px solid rgba(59,110,232,0.2)',
                  background: form.priority === p ? 'rgba(36,87,212,0.15)' : 'transparent',
                  color: form.priority === p ? '#6b93f0' : 'rgba(240,244,255,0.6)',
                  cursor: 'pointer',
                }}>
                {p}
              </button>
            ))}
          </div>
        </FormField>
      )}
    </div>
  );
}

function Step1({ form, update, errors }) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Institution Name" required error={errors.institutionName}>
          <input value={form.institutionName} onChange={e => update('institutionName', e.target.value)} className="input-field" placeholder="Full legal name" />
        </FormField>
        <FormField label="AICTE Approval No." required error={errors.approvalNo}>
          <input value={form.approvalNo} onChange={e => update('approvalNo', e.target.value)} className="input-field" placeholder="e.g. AICTE/2024/..." />
        </FormField>
        <FormField label="State" required error={errors.state}>
          <select value={form.state} onChange={e => update('state', e.target.value)} className="input-field">
            <option value="">Select state...</option>
            {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="District" required error={errors.district}>
          <input value={form.district} onChange={e => update('district', e.target.value)} className="input-field" placeholder="District name" />
        </FormField>
      </div>
      <FormField label="Full Address" required error={errors.address}>
        <textarea value={form.address} onChange={e => update('address', e.target.value)} className="input-field" rows={3} placeholder="Complete institutional address with pin code" style={{ resize: 'none' }} />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Website URL" error={errors.website}>
          <input value={form.website} onChange={e => update('website', e.target.value)} className="input-field" placeholder="https://www.institution.ac.in" />
        </FormField>
        <FormField label="NAAC Grade" error={errors.naacGrade}>
          <select value={form.naacGrade} onChange={e => update('naacGrade', e.target.value)} className="input-field">
            <option value="">Select grade...</option>
            {['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>
      </div>
    </div>
  );
}

function Step2({ form, update, errors }) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Program / Course Name" required error={errors.programName}>
          <input value={form.programName} onChange={e => update('programName', e.target.value)} className="input-field" placeholder="e.g. B.Tech Artificial Intelligence" />
        </FormField>
        <FormField label="Level" required error={errors.level}>
          <select value={form.level} onChange={e => update('level', e.target.value)} className="input-field">
            <option value="">Select level...</option>
            {programLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </FormField>
        <FormField label="Discipline" required error={errors.discipline}>
          <select value={form.discipline} onChange={e => update('discipline', e.target.value)} className="input-field">
            <option value="">Select discipline...</option>
            {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </FormField>
        <FormField label="Duration (Years)" required error={errors.duration}>
          <select value={form.duration} onChange={e => update('duration', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {['1', '2', '3', '4', '5'].map(d => <option key={d} value={d}>{d} Year{d !== '1' ? 's' : ''}</option>)}
          </select>
        </FormField>
        <FormField label="Proposed Intake" required error={errors.intake} hint="Number of students per year">
          <input type="number" min="0" value={form.intake} onChange={e => update('intake', e.target.value)} className="input-field" placeholder="e.g. 60" />
        </FormField>
        <FormField label="Shift" error={errors.shift}>
          <select value={form.shift} onChange={e => update('shift', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {['First Shift', 'Second Shift', 'Full Day'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Program Objectives" error={errors.objectives}>
        <textarea value={form.objectives} onChange={e => update('objectives', e.target.value)} className="input-field" rows={4} placeholder="Describe the program objectives and expected outcomes..." style={{ resize: 'none' }} />
      </FormField>
    </div>
  );
}

function Step3({ form, update, errors }) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Total Land Area (sq. meters)" required error={errors.landArea}>
          <input type="number" value={form.landArea} onChange={e => update('landArea', e.target.value)} className="input-field" placeholder="e.g. 10000" />
        </FormField>
        <FormField label="Built-up Area (sq. meters)" required error={errors.builtUpArea}>
          <input type="number" value={form.builtUpArea} onChange={e => update('builtUpArea', e.target.value)} className="input-field" placeholder="e.g. 5000" />
        </FormField>
        <FormField label="Number of Classrooms" required error={errors.classrooms}>
          <input type="number" value={form.classrooms} onChange={e => update('classrooms', e.target.value)} className="input-field" placeholder="e.g. 8" />
        </FormField>
        <FormField label="Number of Labs" required error={errors.labs}>
          <input type="number" value={form.labs} onChange={e => update('labs', e.target.value)} className="input-field" placeholder="e.g. 4" />
        </FormField>
        <FormField label="Library Books (volumes)" error={errors.libraryBooks}>
          <input type="number" value={form.libraryBooks} onChange={e => update('libraryBooks', e.target.value)} className="input-field" placeholder="e.g. 5000" />
        </FormField>
        <FormField label="Internet Speed (Mbps)" error={errors.internetSpeed}>
          <input type="number" value={form.internetSpeed} onChange={e => update('internetSpeed', e.target.value)} className="input-field" placeholder="e.g. 100" />
        </FormField>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { key: 'hasHostel', label: 'Hostel Facilities' },
          { key: 'hasCanteen', label: 'Canteen / Cafeteria' },
          { key: 'hasTransport', label: 'Transportation' },
          { key: 'hasMedical', label: 'Medical Facility' },
          { key: 'hasSports', label: 'Sports Complex' },
          { key: 'hasAuditorium', label: 'Auditorium' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
            style={{ border: form[key] ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(59,110,232,0.15)', background: form[key] ? 'rgba(16,185,129,0.08)' : 'rgba(6,15,46,0.4)' }}>
            <input type="checkbox" checked={form[key] || false} onChange={e => update(key, e.target.checked)}
              className="w-4 h-4" style={{ accentColor: '#10b981' }} />
            <span className="text-sm" style={{ color: form[key] ? '#34d399' : 'rgba(240,244,255,0.7)' }}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step4({ form, update, errors }) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Total Faculty Count" required error={errors.totalFaculty}>
          <input type="number" value={form.totalFaculty} onChange={e => update('totalFaculty', e.target.value)} className="input-field" placeholder="e.g. 25" />
        </FormField>
        <FormField label="PhD Holders" required error={errors.phdFaculty}>
          <input type="number" value={form.phdFaculty} onChange={e => update('phdFaculty', e.target.value)} className="input-field" placeholder="e.g. 8" />
        </FormField>
        <FormField label="Professors" error={errors.professors}>
          <input type="number" value={form.professors} onChange={e => update('professors', e.target.value)} className="input-field" placeholder="e.g. 4" />
        </FormField>
        <FormField label="Associate Professors" error={errors.assocProfessors}>
          <input type="number" value={form.assocProfessors} onChange={e => update('assocProfessors', e.target.value)} className="input-field" placeholder="e.g. 8" />
        </FormField>
        <FormField label="Assistant Professors" error={errors.asstProfessors}>
          <input type="number" value={form.asstProfessors} onChange={e => update('asstProfessors', e.target.value)} className="input-field" placeholder="e.g. 13" />
        </FormField>
        <FormField label="Non-Teaching Staff" error={errors.nonTeaching}>
          <input type="number" value={form.nonTeaching} onChange={e => update('nonTeaching', e.target.value)} className="input-field" placeholder="e.g. 15" />
        </FormField>
      </div>
      <FormField label="Faculty Recruitment Policy" error={errors.recruitmentPolicy}>
        <textarea value={form.recruitmentPolicy} onChange={e => update('recruitmentPolicy', e.target.value)} className="input-field" rows={3} placeholder="Describe your faculty recruitment and retention policy..." style={{ resize: 'none' }} />
      </FormField>
    </div>
  );
}

function Step5({ form, update, errors }) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Annual Tuition Fee (₹)" required error={errors.tuitionFee}>
          <input type="number" value={form.tuitionFee} onChange={e => update('tuitionFee', e.target.value)} className="input-field" placeholder="e.g. 100000" />
        </FormField>
        <FormField label="Other Fees (₹)" error={errors.otherFees}>
          <input type="number" value={form.otherFees} onChange={e => update('otherFees', e.target.value)} className="input-field" placeholder="e.g. 20000" />
        </FormField>
        <FormField label="Endowment Fund (₹)" error={errors.endowmentFund}>
          <input type="number" value={form.endowmentFund} onChange={e => update('endowmentFund', e.target.value)} className="input-field" placeholder="Minimum required by AICTE" />
        </FormField>
        <FormField label="Annual Budget (₹)" error={errors.annualBudget}>
          <input type="number" value={form.annualBudget} onChange={e => update('annualBudget', e.target.value)} className="input-field" placeholder="Total annual operational budget" />
        </FormField>
      </div>
      <FormField label="Fee Regulatory Compliance" error={errors.frcCompliance}>
        <select value={form.frcCompliance} onChange={e => update('frcCompliance', e.target.value)} className="input-field">
          <option value="">Select FRC compliance status...</option>
          <option value="compliant">Compliant with State FRC</option>
          <option value="exempted">Exempted (Central/Deemed University)</option>
          <option value="pending">FRC Approval Pending</option>
        </select>
      </FormField>
      <FormField label="Source of Funding" error={errors.fundingSource}>
        <div className="flex flex-wrap gap-2">
          {['Government Grant', 'UGC Grant', 'Industry Funding', 'Alumni Donations', 'Self-Financed', 'Foreign Collaboration'].map(s => (
            <button key={s} type="button" onClick={() => update('fundingSource', s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                border: form.fundingSource === s ? '1px solid #2457d4' : '1px solid rgba(59,110,232,0.2)',
                background: form.fundingSource === s ? 'rgba(36,87,212,0.15)' : 'transparent',
                color: form.fundingSource === s ? '#6b93f0' : 'rgba(240,244,255,0.6)',
                cursor: 'pointer',
              }}>{s}</button>
          ))}
        </div>
      </FormField>
    </div>
  );
}

function Step6({ form, update }) {
  const required_docs = [
    { key: 'landDoc', label: 'Land/Property Documents', hint: 'Title deed, lease agreement, etc. (PDF, max 10MB)' },
    { key: 'buildingPlan', label: 'Approved Building Plan', hint: 'Municipality/Panchayat approved plan (PDF, max 20MB)' },
    { key: 'trustDoc', label: 'Trust/Society Registration', hint: 'Registration certificate (PDF, max 5MB)' },
    { key: 'facultyList', label: 'Faculty List with Qualifications', hint: 'Excel/PDF with all faculty details' },
    { key: 'auditReport', label: 'Financial Audit Report', hint: 'Last 3 years CA certified report (PDF)' },
    { key: 'noObjection', label: 'State Government NOC', hint: 'No objection certificate from state (PDF)' },
  ];

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const valid = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type);
      const sizeOk = file.size <= 20 * 1024 * 1024;
      if (valid && sizeOk) {
        update(key, { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB', type: file.type });
      }
    }
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="p-4 rounded-xl flex gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <Info size={16} style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.7)' }}>
          Accepted formats: PDF, JPG, PNG, Excel. Maximum file size: 20MB per document. All documents must be self-attested.
        </p>
      </div>
      {required_docs.map(({ key, label, hint }) => (
        <div key={key} className="p-4 rounded-xl" style={{ border: form[key] ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(59,110,232,0.2)', background: 'rgba(6,15,46,0.4)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-white mb-0.5">{label} <span style={{ color: '#f87171' }}>*</span></div>
              <div className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>{hint}</div>
              {form[key] && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={12} style={{ color: '#10b981' }} />
                  <span className="text-xs" style={{ color: '#34d399' }}>{form[key].name} ({form[key].size})</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer flex-shrink-0">
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" onChange={e => handleFileChange(key, e)} />
              <div className="btn-secondary text-xs py-2 px-3">
                {form[key] ? 'Replace' : '+ Upload'}
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

function Step7({ form }) {
  const summaryItems = [
    { label: 'Application Type', value: form.applicationType },
    { label: 'Academic Year', value: form.academicYear },
    { label: 'Institution', value: form.institutionName },
    { label: 'Program', value: form.programName },
    { label: 'Level & Discipline', value: `${form.level} - ${form.discipline}` },
    { label: 'Proposed Intake', value: form.intake ? `${form.intake} students` : '-' },
    { label: 'Duration', value: form.duration ? `${form.duration} Year(s)` : '-' },
    { label: 'Annual Fee', value: form.tuitionFee ? `₹${parseInt(form.tuitionFee).toLocaleString()}` : '-' },
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="p-4 rounded-xl flex gap-3" style={{ background: 'rgba(36,87,212,0.08)', border: '1px solid rgba(36,87,212,0.2)' }}>
        <Info size={16} style={{ color: '#6b93f0', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.7)' }}>
          Please review all the information before submitting. Once submitted, you cannot edit the application without contacting AICTE.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Application Summary</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {summaryItems.map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg" style={{ background: 'rgba(10,24,64,0.5)', border: '1px solid rgba(59,110,232,0.12)' }}>
              <div className="text-xs mb-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>{label}</div>
              <div className="text-sm font-medium text-white">{value || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Declaration</h4>
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(10,24,64,0.5)', border: '1px solid rgba(59,110,232,0.2)', color: 'rgba(240,244,255,0.7)', lineHeight: '1.8' }}>
          I hereby declare that all the information furnished in this application is true and correct to the best of my knowledge and belief.
          I understand that any false or misleading information may result in rejection of the application or withdrawal of approval.
          The institution undertakes to fulfill all AICTE norms and regulations as applicable.
        </div>
        <label className="flex items-center gap-3 mt-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" style={{ accentColor: '#2457d4' }} />
          <span className="text-sm" style={{ color: 'rgba(240,244,255,0.8)' }}>
            I agree to the above declaration and confirm all submitted information is accurate.
          </span>
        </label>
      </div>
    </div>
  );
}

const STEPS_COMPONENTS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6, Step7];

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    applicationType: '', academicYear: '', priority: 'Normal',
    institutionName: 'National Institute of Technology Trichy', approvalNo: 'AICTE/2024/DU/001',
    state: 'Tamil Nadu', district: 'Tiruchirappalli', address: '', website: '', naacGrade: 'A+',
    programName: '', level: '', discipline: '', duration: '', intake: '', shift: '', objectives: '',
    landArea: '', builtUpArea: '', classrooms: '', labs: '', libraryBooks: '', internetSpeed: '',
    hasHostel: false, hasCanteen: false, hasTransport: false, hasMedical: false, hasSports: false, hasAuditorium: false,
    totalFaculty: '', phdFaculty: '', professors: '', assocProfessors: '', asstProfessors: '', nonTeaching: '',
    recruitmentPolicy: '',
    tuitionFee: '', otherFees: '', endowmentFund: '', annualBudget: '', frcCompliance: '', fundingSource: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const validateStep = (s) => {
    const e = {};
    if (s === 0 && !form.applicationType) e.applicationType = 'Please select an application type';
    if (s === 1 && !form.institutionName) e.institutionName = 'Required';
    if (s === 2 && !form.programName) e.programName = 'Required';
    if (s === 2 && !form.level) e.level = 'Required';
    if (s === 2 && !form.discipline) e.discipline = 'Required';
    if (s === 2 && !form.intake) e.intake = 'Required';
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(p => Math.min(p + 1, FORM_STEPS.length - 1));
    window.scrollTo(0, 0);
  };

  const prev = () => { setStep(p => Math.max(p - 1, 0)); setErrors({}); };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  const StepComponent = STEPS_COMPONENTS[step];

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-96">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle size={48} style={{ color: '#10b981' }} />
          </div>
          <div className="badge-green inline-flex mb-4">Application Submitted</div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>Application Submitted Successfully!</h2>
          <p className="text-sm mb-2" style={{ color: 'rgba(240,244,255,0.6)' }}>
            Your application for <strong style={{ color: '#6b93f0' }}>{form.programName || form.applicationType}</strong> has been submitted.
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>Application ID: <strong style={{ color: '#6b93f0' }}>APP-2024-{Math.floor(Math.random() * 900 + 100)}</strong></p>
          <div className="flex gap-3 justify-center">
            <button className="btn-secondary" onClick={() => navigate('/institution/applications')}>View Applications</button>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(0); setForm(f => ({ ...f, programName: '', applicationType: '' })); }}>
              New Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/institution/applications')} className="flex items-center gap-2 text-sm mb-4 transition-colors"
            style={{ color: 'rgba(240,244,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b93f0'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,244,255,0.5)'}>
            <ChevronLeft size={14} /> Back to Applications
          </button>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>New Application</h2>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Complete all sections and submit for AICTE review</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={FORM_STEPS} current={step} />

        {/* Form Card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'rgba(59,110,232,0.15)' }}>
            {React.createElement(FORM_STEPS[step].icon, { size: 18, style: { color: '#6b93f0' } })}
            <h3 className="text-base font-semibold text-white">{FORM_STEPS[step].label}</h3>
            <span className="ml-auto text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>Step {step + 1} of {FORM_STEPS.length}</span>
          </div>

          <StepComponent form={form} update={update} errors={errors} />

          {/* Navigation */}
          <div className={`flex gap-3 mt-8 pt-6 border-t ${step > 0 ? 'justify-between' : 'justify-end'}`} style={{ borderColor: 'rgba(59,110,232,0.1)' }}>
            {step > 0 && (
              <button type="button" className="btn-secondary" onClick={prev}>
                <ChevronLeft size={16} /> Previous
              </button>
            )}
            <div className="flex gap-2">
              <button type="button" className="btn-secondary text-sm py-2 px-4">
                <Save size={14} /> Save Draft
              </button>
              {step < FORM_STEPS.length - 1 ? (
                <button type="button" className="btn-primary" onClick={next}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button type="button" className="btn-accent" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (<><CheckCircle size={16} /> Submit Application</>)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
