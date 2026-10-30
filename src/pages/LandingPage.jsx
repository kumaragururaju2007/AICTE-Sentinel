import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, ChevronRight, CheckCircle, BarChart3, FileText,
  Bell, Lock, Globe, ArrowRight, Star, Users, Building2,
  Award, Zap, TrendingUp, Menu, X, ExternalLink, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Statistics', href: '#stats' },
  { label: 'Contact', href: '#contact' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Smart Application Management',
    desc: 'Submit, track and manage all AICTE applications from a single unified dashboard with real-time status updates.',
    color: '#1E6DEB',
  },
  {
    icon: Bell,
    title: 'Deadline & Compliance Alerts',
    desc: 'Never miss a statutory submission deadline. Get proactive alerts for compliance requirements, renewals and obligations.',
    color: '#159B68',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    desc: 'Visual dashboards with compliance scores, application progress, and historical performance metrics.',
    color: '#F59E0B',
  },
  {
    icon: Lock,
    title: 'Secure Document Vault',
    desc: 'Upload and manage all institutional documents in an encrypted, AICTE-compliant secure repository.',
    color: '#7738E8',
  },
  {
    icon: TrendingUp,
    title: 'Stage-wise Tracking',
    desc: 'Monitor every stage of your application with transparent progress timelines and officer assignments.',
    color: '#EC4899',
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    desc: 'Get real-time multi-channel notifications for approvals, deficiencies, EVC visits, and council orders.',
    color: '#06B6D4',
  },
];

const STATS = [
  { label: 'Institutions Registered', value: '11,400+', icon: Building2 },
  { label: 'Applications Processed', value: '2.8L+', icon: FileText },
  { label: 'Compliance Rate', value: '96.2%', icon: Award },
  { label: 'Active Users', value: '45,000+', icon: Users },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Rajesh Sharma',
    role: 'Principal, NIT Trichy',
    text: 'AICTE Sentinel has completely transformed how we manage our approvals. The transparency and tracking system is exceptional.',
    rating: 5,
  },
  {
    name: 'Dr. Priya Menon',
    role: 'Director, Chennai Engineering College',
    text: 'The compliance tracking feature alone saves us countless hours every semester. Highly recommend to all institutions.',
    rating: 5,
  },
  {
    name: 'Prof. Amit Gupta',
    role: 'Registrar, Delhi Technical University',
    text: 'The document management and deadline alerts have ensured we never miss a critical AICTE submission.',
    rating: 5,
  },
];

function ParticleBackground({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full transition-opacity"
          style={{
            width: `${(i % 5) + 3}px`,
            height: `${(i % 5) + 3}px`,
            background: isDark
              ? i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#10B981' : '#60A5FA'
              : i % 3 === 0 ? '#1E6DEB' : i % 3 === 1 ? '#159B68' : '#93C5FD',
            opacity: isDark ? 0.25 : 0.18,
            left: `${(i * 19) % 95}%`,
            top: `${(i * 23) % 90}%`,
            animation: `float ${4 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDark ? 'bg-[#0B1329] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>

      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-[#0B1329]/95 backdrop-blur-md border-b border-slate-800 shadow-md'
              : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#1E6DEB] to-[#159B68] shadow-sm text-white">
              <Shield size={20} />
            </div>
            <div>
              <div className={`font-extrabold text-base leading-tight tracking-tight ${isDark ? 'text-white' : 'text-[#102A56]'}`}>
                AICTE Sentinel
              </div>
              <div className={`text-[10px] font-medium leading-none mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Regulatory Intelligence Platform
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1E6DEB]'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Controls: Theme Toggle & CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'border-blue-500/40 text-blue-300 hover:bg-blue-900/30'
                  : 'border-[#1E6DEB]/30 text-[#1E6DEB] hover:bg-blue-50 bg-white shadow-xs'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1E6DEB] hover:bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Register Institution</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Mobile Right Controls: Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className={`p-2 rounded-lg ${isDark ? 'text-white' : 'text-slate-800'}`}
              onClick={() => setMobileOpen(p => !p)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className={`md:hidden px-4 py-4 space-y-3 border-b shadow-lg ${
            isDark ? 'bg-[#0B1329] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className={`block text-xs font-semibold py-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/50">
              <button
                className={`w-full py-2.5 text-xs font-bold rounded-xl border ${
                  isDark ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-800'
                }`}
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#1E6DEB] text-white shadow-sm"
                onClick={() => navigate('/register')}
              >
                Register Institution
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden" id="about">
        <ParticleBackground isDark={isDark} />

        {/* Background Ambient Glows */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-400/15'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/10'
        }`} />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Government Endorsement Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            isDark
              ? 'bg-blue-950/60 border-blue-800/80 text-blue-300'
              : 'bg-blue-50 border-blue-200 text-[#1E6DEB]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official AICTE Regulatory Automation Platform</span>
          </div>

          {/* Main Hero Title */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-[#102A56]'
          }`}>
            <span>Empowering Institutions.</span>
            <br />
            <span className="bg-gradient-to-r from-[#1E6DEB] via-blue-600 to-[#159B68] bg-clip-text text-transparent">
              Elevating Standards.
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            AICTE Sentinel is India's premier regulatory intelligence platform for technical institutions — 
            streamlining approvals, compliance tracking, and document management with AI-assisted scrutiny.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-[#1E6DEB] hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Register Your Institution</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-8 py-3.5 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 border-slate-700 text-slate-100 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <span>Sign In to Portal</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Trust Endorsements Bar */}
          <div className={`pt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-semibold ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {['Ministry of Education Endorsed', 'ISO 27001 Certified Architecture', 'Statutory SLA Compliant'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#159B68]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics Section ── */}
      <section id="stats" className={`py-16 px-4 border-y ${
        isDark ? 'bg-[#0E172E]/70 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  isDark
                    ? 'bg-[#13203C] border-slate-700/60 shadow-sm'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3.5 flex items-center justify-center bg-blue-100/70 text-[#1E6DEB]">
                  <s.icon size={22} />
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold font-mono mb-1 ${
                  isDark ? 'text-white' : 'text-[#102A56]'
                }`}>
                  {s.value}
                </div>
                <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#1E6DEB] uppercase font-mono">
              Platform Capabilities
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-[#102A56]'}`}>
              Comprehensive Automation for AICTE Approvals
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              End-to-end digital lifecycle management for institutions, regional scrutiny officers, and national administrators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all group hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#13203C] border-slate-700/60 hover:border-blue-500/50 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-[#1E6DEB]/50 hover:shadow-md shadow-xs'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${f.color}15`, color: f.color }}
                >
                  <f.icon size={22} />
                </div>
                <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {f.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className={`py-20 px-4 border-y ${
        isDark ? 'bg-[#0E172E]/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#159B68] uppercase font-mono">
              Institutional Feedback
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mt-3 ${isDark ? 'text-white' : 'text-[#102A56]'}`}>
              Trusted by Accredited Institutes Across India
            </h2>
          </div>

          <div className="relative min-h-[160px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`p-7 rounded-2xl border transition-all duration-500 ${
                  activeTestimonial === i
                    ? 'opacity-100 scale-100 pointer-events-auto shadow-md'
                    : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                } ${
                  isDark
                    ? 'bg-[#13203C] border-slate-700/60'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#F59E0B" className="text-amber-500" />
                  ))}
                </div>
                <p className={`text-sm md:text-base italic mb-4 leading-relaxed ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  "{t.text}"
                </p>
                <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-[#102A56]'}`}>{t.name}</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 pt-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeTestimonial
                    ? 'w-6 bg-[#1E6DEB]'
                    : isDark ? 'w-2 bg-slate-700' : 'w-2 bg-slate-300'
                }`}
                title={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Ready to Start Callout Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-br from-[#102A56] via-[#174894] to-[#1E6DEB] text-white shadow-xl relative overflow-hidden">
            <div className="relative space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Experience AICTE Sentinel?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
                Connect with India's central technical education regulatory ecosystem and access instant statutory assistance.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3.5 bg-white text-[#102A56] hover:bg-slate-100 text-xs font-extrabold rounded-xl shadow-md inline-flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
                >
                  <span>Register Institution Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className={`py-12 px-4 border-t ${
        isDark ? 'bg-[#080E1F] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E6DEB] text-white flex items-center justify-center">
                  <Shield size={17} />
                </div>
                <span className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-[#102A56]'}`}>
                  AICTE Sentinel
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Intelligent Approval &amp; Compliance Automation. Built for Smart India Hackathon 2026 by Team Valora.
              </p>
            </div>

            {[
              { title: 'Platform Portals', links: ['Institution Portal', 'Officer Portal', 'Administrator Portal', 'Workflow Engine'] },
              { title: 'Regulatory Compliance', links: ['APH 2026 Guidelines', 'SLA Framework', 'EVC Inspection SOP', 'Deficiency Redressal'] },
              { title: 'Contact & Support', links: ['AICTE Helpdesk', 'Regional Bureaus', 'Technical Queries', 'Grievance Portal'] }
            ].map(col => (
              <div key={col.title} className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <a
                        href="#about"
                        className={`text-xs transition-colors ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#1E6DEB]'
                        }`}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            <p>© 2026 AICTE Sentinel &bull; All Rights Reserved &bull; All India Council for Technical Education</p>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:underline cursor-pointer">Cybersecurity Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
