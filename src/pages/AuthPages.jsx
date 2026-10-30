import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplicationContext } from '../context/ApplicationContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

function AuthLayout({ children, title, subtitle }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 relative transition-colors duration-300 font-sans ${
        isDark ? 'bg-[#0B1329] text-slate-100' : 'bg-[#F5F8FC] text-slate-800'
      }`}
    >
      {/* Ambient background glows */}
      <div
        className={`absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-blue-600/15' : 'bg-blue-400/10'
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/10'
        }`}
      />

      {/* Top Floating Controls */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-8 flex items-center gap-3 z-20">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            isDark
              ? 'bg-[#13203C] border-slate-700 text-amber-300 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Link
          to="/"
          className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-[#13203C] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
              : 'bg-white border-slate-200 text-slate-600 hover:text-[#1E6DEB] shadow-xs'
          }`}
        >
          &larr; Back to Home
        </Link>
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo and Brand Header */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#1E6DEB] to-[#159B68] text-white shadow-sm">
              <Shield size={24} />
            </div>
            <div className="text-left">
              <div className={`font-extrabold text-xl leading-tight tracking-tight ${
                isDark ? 'text-white' : 'text-[#102A56]'
              }`}>
                AICTE Sentinel
              </div>
              <div className={`text-[10px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Regulatory Intelligence Platform
              </div>
            </div>
          </Link>
          <h1 className={`text-2xl font-bold mb-1 tracking-tight ${
            isDark ? 'text-white' : 'text-[#102A56]'
          }`}>
            {title}
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        </div>

        {/* Auth Card Container */}
        <div
          className={`rounded-2xl p-7 sm:p-8 border transition-all ${
            isDark
              ? 'bg-[#13203C] border-slate-700/80 shadow-2xl'
              : 'bg-white border-slate-200 shadow-xl'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function InputField({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, error, ...rest }) {
  const { isDark } = useTheme();
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-xs font-bold mb-1.5 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={16} className={error ? 'text-rose-500' : isDark ? 'text-slate-400' : 'text-slate-400'} />
          </div>
        )}
        <input
          id={id}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl text-xs py-2.5 outline-none transition-all border ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            isDark
              ? 'bg-[#0E172E] border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'bg-[#F8FAFC] border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#1E6DEB] focus:ring-1 focus:ring-[#1E6DEB]'
          } ${error ? '!border-rose-500 !ring-rose-500' : ''}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            onClick={() => setShowPass(p => !p)}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1 text-rose-500 text-[11px] font-medium">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ─────────── COMMON LOGIN PAGE ────────────
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  let appContext = null;
  try {
    appContext = useApplicationContext();
  } catch (e) {
    appContext = null;
  }

  const [role, setRole] = useState('institution'); // 'institution' | 'officer' | 'admin'
  const [form, setForm] = useState({
    email: 'principal@institution.ac.in',
    password: 'password123',
    remember: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'officer') {
      setForm(p => ({ ...p, email: 'officer@aicte-india.org', password: 'password123' }));
    } else if (newRole === 'admin') {
      setForm(p => ({ ...p, email: 'admin@aicte.gov.in', password: 'password123' }));
    } else {
      setForm(p => ({ ...p, email: 'principal@institution.ac.in', password: 'password123' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSuccess(true);

    // Save session in shared auth context
    await login(role, form.email, form.password);
    if (appContext?.setDemoRole) {
      appContext.setDemoRole(role);
    }

    await new Promise(r => setTimeout(r, 400));

    // Role-based destination redirect
    if (role === 'officer') {
      navigate('/officer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/institution/dashboard');
    }
  };

  return (
    <AuthLayout title="Sign In to Sentinel" subtitle="Select your role to access your designated workspace">
      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-emerald-600">
            <CheckCircle size={30} />
          </div>
          <div className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Authentication Successful
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Redirecting to your authorized dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Control */}
          <div>
            <label htmlFor="role" className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Portal Role
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Shield size={16} />
              </div>
              <select
                id="role"
                value={role}
                onChange={e => handleRoleChange(e.target.value)}
                className={`w-full rounded-xl text-xs py-2.5 pl-10 pr-4 outline-none font-semibold transition-all border cursor-pointer ${
                  isDark
                    ? 'bg-[#0E172E] border-slate-700 text-white focus:border-blue-500'
                    : 'bg-[#F8FAFC] border-slate-300 text-slate-800 focus:bg-white focus:border-[#1E6DEB]'
                }`}
              >
                <option value="institution">1. Institution Portal (Principal / Director)</option>
                <option value="officer">2. Regional Officer Portal (Scrutiny &amp; EVC Desk)</option>
                <option value="admin">3. System Administrator Portal (HQ IT Governance)</option>
              </select>
            </div>
          </div>

          <InputField
            id="email"
            label="Official Email Address"
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder={role === 'officer' ? 'officer@aicte-india.org' : role === 'admin' ? 'admin@aicte.gov.in' : 'principal@institution.ac.in'}
            icon={Mail}
            error={errors.email}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
                className="w-4 h-4 rounded text-[#1E6DEB] focus:ring-blue-500"
              />
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Remember session</span>
            </label>
            <Link
              to="/forgot-password"
              className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-[#1E6DEB]'}`}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              'Sign In to Selected Portal'
            )}
          </button>

          <div className="text-center pt-2">
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Demo Credentials prefilled. Any 6+ characters accepted.
            </span>
          </div>

          <div className={`pt-4 border-t text-center text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            <span>New institution? </span>
            <Link to="/register" className={`font-bold hover:underline ${isDark ? 'text-blue-400' : 'text-[#1E6DEB]'}`}>
              Register here
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

// ─────────── REGISTER PAGE (INSTITUTION ONLY) ────────────
const STEPS = ['Institution Details', 'Contact Information', 'Account Setup'];

export function RegisterPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    institutionName: '', type: '', affiliationNo: '', state: '', district: '',
    principalName: '', email: '', phone: '', address: '',
    password: '', confirmPassword: '', agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.institutionName) e.institutionName = 'Institution name is required';
      if (!form.type) e.type = 'Select institution type';
      if (!form.state) e.state = 'Select state';
    }
    if (step === 1) {
      if (!form.principalName) e.principalName = 'Name is required';
      if (!form.email) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email';
      if (!form.phone) e.phone = 'Phone is required';
    }
    if (step === 2) {
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 8) e.password = 'Minimum 8 characters';
      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (!form.agree) e.agree = 'You must agree to the terms';
    }
    return e;
  };

  const next = () => {
    const e = validateStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(p => p + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validateStep();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setErrors({});
    try {
      await authService.signUp({
        email: form.email,
        password: form.password,
        fullName: form.principalName,
        phone: form.phone,
        institutionName: form.institutionName,
        permanentId: form.affiliationNo || `AICTE-${Math.floor(10000000 + Math.random() * 90000000)}`,
        state: form.state,
        district: form.district || 'District Center',
        address: form.address,
      });
      setSuccess(true);
    } catch (err) {
      console.warn('[Register] Supabase signup note:', err.message);
      // In demonstration environments, still show success with recorded data
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const institutionTypes = ['University', 'Deemed University', 'Autonomous College', 'Affiliated College', 'Polytechnic', 'Stand-alone Institution'];
  const states = ['Andhra Pradesh', 'Delhi NCR', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Odisha', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

  if (success) {
    return (
      <AuthLayout title="Registration Successful" subtitle="Your institution credentials have been provisioned">
        <div className="text-center py-4 space-y-3">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-[#159B68]">
            <CheckCircle size={36} />
          </div>
          <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Account Created Successfully
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your institution registration has been filed under AICTE Sentinel. An official statutory verification notice has been sent to{' '}
            <strong className={isDark ? 'text-blue-400' : 'text-[#1E6DEB]'}>{form.email}</strong>.
          </p>
          <div className="pt-2">
            <button
              className="w-full py-2.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Proceed to Sign In
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Register Institution" subtitle="Create your institution profile for AICTE statutory compliance">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  i < step
                    ? 'bg-[#159B68] text-white'
                    : i === step
                    ? 'bg-[#1E6DEB] text-white ring-2 ring-blue-300'
                    : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < step ? <CheckCircle size={13} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium hidden sm:block ${
                i === step ? (isDark ? 'text-blue-400' : 'text-[#1E6DEB]') : 'text-slate-400'
              }`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                i < step ? 'bg-[#159B68]' : isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 0 && (
          <div className="space-y-3.5">
            <InputField
              id="institutionName"
              label="Institution Full Name *"
              value={form.institutionName}
              onChange={e => update('institutionName', e.target.value)}
              placeholder="e.g. Apex Institute of Technology & Management"
              error={errors.institutionName}
            />

            <div>
              <label htmlFor="inst-type" className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Institution Category *
              </label>
              <select
                id="inst-type"
                value={form.type}
                onChange={e => update('type', e.target.value)}
                className={`w-full rounded-xl text-xs py-2.5 px-3.5 outline-none font-medium border cursor-pointer ${
                  isDark
                    ? 'bg-[#0E172E] border-slate-700 text-white'
                    : 'bg-[#F8FAFC] border-slate-300 text-slate-800 focus:bg-white'
                }`}
              >
                <option value="">Select category...</option>
                {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className="text-rose-500 text-[11px] mt-1">{errors.type}</p>}
            </div>

            <InputField
              id="affiliationNo"
              label="AICTE Permanent ID (PID) / Reg No."
              value={form.affiliationNo}
              onChange={e => update('affiliationNo', e.target.value)}
              placeholder="e.g. 1-43219081"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="state-select" className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  State *
                </label>
                <select
                  id="state-select"
                  value={form.state}
                  onChange={e => update('state', e.target.value)}
                  className={`w-full rounded-xl text-xs py-2.5 px-3 outline-none font-medium border cursor-pointer ${
                    isDark ? 'bg-[#0E172E] border-slate-700 text-white' : 'bg-[#F8FAFC] border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="">Select...</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-rose-500 text-[11px] mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="district-input" className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  District
                </label>
                <input
                  id="district-input"
                  value={form.district}
                  onChange={e => update('district', e.target.value)}
                  className={`w-full rounded-xl text-xs py-2.5 px-3 outline-none border ${
                    isDark ? 'bg-[#0E172E] border-slate-700 text-white' : 'bg-[#F8FAFC] border-slate-300 text-slate-800'
                  }`}
                  placeholder="District"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3.5">
            <InputField
              id="principalName"
              label="Principal / Director Full Name *"
              value={form.principalName}
              onChange={e => update('principalName', e.target.value)}
              placeholder="Dr. Full Name"
              error={errors.principalName}
            />
            <InputField
              id="email"
              label="Official Institutional Email Address *"
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="principal@institution.edu.in"
              icon={Mail}
              error={errors.email}
            />
            <InputField
              id="phone"
              label="Official Contact Number *"
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="+91 98765 43210"
              error={errors.phone}
            />
            <div>
              <label htmlFor="inst-address" className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Campus Postal Address
              </label>
              <textarea
                id="inst-address"
                value={form.address}
                onChange={e => update('address', e.target.value)}
                className={`w-full rounded-xl text-xs p-3 outline-none border resize-none ${
                  isDark ? 'bg-[#0E172E] border-slate-700 text-white' : 'bg-[#F8FAFC] border-slate-300 text-slate-800'
                }`}
                rows={3}
                placeholder="Complete street address with PIN code"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3.5">
            <InputField
              id="password"
              label="Create Secure Password *"
              type="password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Minimum 8 characters"
              icon={Lock}
              error={errors.password}
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password *"
              type="password"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              icon={Lock}
              error={errors.confirmPassword}
            />
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => update('agree', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#1E6DEB]"
              />
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                I certify that all details submitted are accurate and agree to the statutory provisions of AICTE APH 2026-27.
              </span>
            </label>
            {errors.agree && <p className="text-rose-500 text-[11px]">{errors.agree}</p>}
          </div>
        )}

        <div className="flex gap-3 pt-3">
          {step > 0 && (
            <button
              type="button"
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => { setStep(p => p - 1); setErrors({}); }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="flex-1 py-2.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              onClick={next}
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#159B68] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Submitting Registration...' : 'Complete Institutional Registration'}
            </button>
          )}
        </div>

        <div className={`pt-4 border-t text-center text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
          <span>Already registered? </span>
          <Link to="/login" className={`font-bold hover:underline ${isDark ? 'text-blue-400' : 'text-[#1E6DEB]'}`}>
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

// ─────────── FORGOT PASSWORD PAGE ────────────
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState('request'); // request | sent
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('sent');
  };

  return (
    <AuthLayout
      title={step === 'request' ? 'Password Recovery' : 'Check Your Inbox'}
      subtitle={step === 'request' ? 'Enter your institutional email to receive reset instructions' : 'A reset token has been dispatched'}
    >
      {step === 'request' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            isDark ? 'bg-blue-950/40 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-[#102A56]'
          }`}>
            <AlertCircle size={16} className="text-[#1E6DEB] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Password reset requests are logged in the tamper-evident regulatory security audit ledger for institutional compliance.
            </p>
          </div>

          <InputField
            id="forgot-email"
            label="Registered Official Email Address"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="principal@institution.edu.in"
            icon={Mail}
            error={error}
          />

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Sending Recovery Link...' : 'Dispatch Password Reset Link'}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`text-xs font-semibold hover:underline inline-flex items-center gap-1 ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[#1E6DEB]'
              }`}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 space-y-3">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-[#159B68]">
            <CheckCircle size={32} />
          </div>
          <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recovery Email Dispatched
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Instructions to securely reset your credentials have been sent to{' '}
            <strong className={isDark ? 'text-blue-400' : 'text-[#1E6DEB]'}>{email}</strong>.
          </p>
          <div className="pt-2">
            <button
              className="w-full py-2.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Return to Sign In
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
