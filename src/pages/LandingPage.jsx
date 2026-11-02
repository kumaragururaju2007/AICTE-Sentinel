import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle2, AlertTriangle, ArrowRight, Star, Users, Building2,
  Award, Zap, TrendingUp, Menu, X, ExternalLink, Sun, Moon, Play,
  FileCheck2, Search, Sliders, Clock, Sparkles, BookOpen, Lock, Activity,
  ChevronDown, ChevronRight, HelpCircle, Mail, Send, Eye, RefreshCw,
  Cpu, Database, Layers, CheckCircle, Scale, ShieldAlert, FileText,
  BarChart3, BrainCircuit, Terminal, ArrowUpRight, ChevronUp, Bot, Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// AICTE Logo Emblem SVG
function AicteLogo({ className = "h-10 w-10" }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-md ${className} p-1 text-white`}>
      <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-white">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M50 18 L54 28 L65 28 L57 35 L60 45 L50 39 L40 45 L43 35 L35 28 L46 28 Z" fill="#FFE082" />
        <circle cx="50" cy="62" r="14" fill="#087443" stroke="#FFF" strokeWidth="2" />
        <path d="M50 54 L52 60 L58 60 L53 64 L55 70 L50 66 L45 70 L47 64 L42 60 L48 60 Z" fill="#FFE082" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  // Navigation & Interactive states
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsDropdown, setPortalsDropdown] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoTab, setDemoTab] = useState('institution');
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ state: 'idle', msg: '', ref: '' });

  // Scroll spy & back-to-top handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      setShowBackToTop(window.scrollY > 400);

      const sections = ['home', 'overview', 'problems', 'features', 'how-it-works', 'portals', 'ai-engine', 'dashboard', 'benefits', 'security', 'tech', 'faq', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    setPortalsDropdown(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      setContactStatus({ state: 'error', msg: 'Please complete all required fields.' });
      return;
    }
    setContactStatus({ state: 'submitting', msg: 'Dispatching encrypted inquiry...' });
    setTimeout(() => {
      const refCode = `AST-${Math.floor(100000 + Math.random() * 900000)}`;
      setContactStatus({
        state: 'success',
        msg: 'Thank you. Your inquiry has been routed to the Sentinel Regulatory Coordination Desk.',
        ref: refCode
      });
      setContactForm({ fullName: '', email: '', organization: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-[#0B1728] text-slate-100' : 'bg-[#F7FBF9] text-[#172B3A]'}`}>
      
      {/* =========================================================================
          2. FIXED RESPONSIVE NAVIGATION BAR
      ========================================================================= */}
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
        isDark 
          ? 'bg-[#0B1728]/90 border-slate-800 text-slate-100' 
          : 'bg-[#F7FBF9]/90 border-emerald-950/10 text-[#172B3A] shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: AICTE Sentinel Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
            <AicteLogo className="h-11 w-11 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">AICTE <span className="text-[#087443] dark:text-[#16A36A]">Sentinel</span></span>
                <span className="hidden sm:inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#087443] dark:text-[#B8F2D0] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border border-emerald-300/40">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden md:block">
                Intelligent Approval & Compliance Automation
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'overview', label: 'About' },
              { id: 'features', label: 'Features' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSection === link.id
                    ? 'text-[#087443] dark:text-[#16A36A] bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#087443] dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Portals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalsDropdown(!portalsDropdown)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#087443] dark:hover:text-emerald-400 transition-all"
              >
                <span>Portals</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${portalsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {portalsDropdown && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl p-2 shadow-xl border backdrop-blur-xl ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                } z-50 animate-fade-in-up`}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stakeholder Systems
                  </div>
                  <button
                    onClick={() => { setPortalsDropdown(false); navigate('/login?role=institution'); }}
                    className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <Building2 className="h-4 w-4 text-[#087443] dark:text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Institution Portal</div>
                      <div className="text-[10px] text-slate-500">Colleges & Universities</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setPortalsDropdown(false); navigate('/login?role=officer'); }}
                    className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Regional Officer Portal</div>
                      <div className="text-[10px] text-slate-500">Scrutiny & EVC Inspection</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setPortalsDropdown(false); navigate('/login?role=admin'); }}
                    className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                  >
                    <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Administrator Portal</div>
                      <div className="text-[10px] text-slate-500">Governance & SLAs</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Theme Toggle & CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDark 
                  ? 'border-slate-700 text-slate-200 hover:bg-slate-800' 
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-xs'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087443] hover:bg-[#065e36] transition-all shadow-sm hover:shadow"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t px-4 py-4 space-y-2 ${
            isDark ? 'bg-[#0B1728] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            {['home', 'overview', 'problems', 'features', 'how-it-works', 'portals', 'ai-engine', 'dashboard', 'benefits', 'faq', 'contact'].map((sec) => (
              <button
                key={sec}
                onClick={() => scrollTo(sec)}
                className="w-full text-left px-3 py-2 text-xs font-semibold capitalize rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {sec.replace('-', ' ')}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 text-center text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-2 text-center text-xs font-bold rounded-lg bg-[#087443] text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          3. HERO SECTION
      ========================================================================= */}
      <section id="home" className="relative pt-12 pb-20 overflow-hidden">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent dark:from-emerald-950/20 dark:via-transparent pointer-events-none -z-10 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold border shadow-2xs backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-800/50 text-[#087443] dark:text-[#B8F2D0]">
                <Building2 className="h-3.5 w-3.5 text-[#087443] dark:text-[#16A36A]" />
                <span>Smart India Hackathon 2026 | Problem Statement 26262</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                AICTE <span className="text-[#087443] dark:text-[#16A36A]">Sentinel</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102A43] dark:text-slate-200 mt-2">
                  Intelligent Approval & Compliance Automation
                </span>
              </h1>

              {/* Subtitle & Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                An AI-powered platform to streamline AICTE approval processes, verify documents, track obligations, monitor deadlines, and ensure regulatory compliance with transparency and efficiency.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Transform traditional approval management into a smarter, faster, transparent, and proactive digital experience with AI-powered automation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollTo('portals')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#087443] hover:bg-[#065e36] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore the Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border shadow-xs transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Play className="h-4 w-4 text-[#087443] dark:text-emerald-400 fill-current" />
                  <span>Watch Demo</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className={`inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl font-semibold text-xs transition-all ${
                    isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Sign In</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Endorsement Mini-Pills */}
              <div className="flex items-center gap-4 pt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Ministry of Education Endorsed
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-blue-600" /> Tamper-Evident SHA-256 Ledger
                </span>
              </div>
            </div>

            {/* Right Visual: Pure Code/CSS/SVG Digital Regulatory Dashboard Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glowing Aura Behind Card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-blue-500/20 blur-2xl -z-10" />

                {/* Main Interactive Glassmorphism Dashboard Terminal */}
                <div className="relative rounded-3xl overflow-hidden border border-emerald-900/10 dark:border-emerald-500/20 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 sm:p-6 space-y-4">
                  
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#087443] to-[#16A36A] flex items-center justify-center text-white shadow-xs">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>AICTE Scrutiny Engine</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Dossier: APP-2026-8942 • AI Pipeline</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      SECURE
                    </span>
                  </div>

                  {/* Scrutiny Progress & Active Stage */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Stage 02: Document Scrutiny Desk</span>
                      <span className="font-bold text-[#087443] dark:text-[#16A36A]">75% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#087443] to-[#16A36A] w-3/4 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>Ingestion ✓</span>
                      <span className="text-[#087443] dark:text-emerald-400 font-bold">Scrutiny ⟳</span>
                      <span>EVC Inspection</span>
                      <span>EoA Order</span>
                    </div>
                  </div>

                  {/* Document Verification & OCR Scan Simulation */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-[#087443] dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">OCR Land Title Deed Extraction</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                        <CheckCircle className="h-3 w-3" /> 99.4% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
                        <span className="text-slate-400 block text-[9px]">Campus Area</span>
                        <strong className="text-slate-800 dark:text-slate-200">5.20 Acres (Norm: 4.0)</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
                        <span className="text-slate-400 block text-[9px]">Lease Validity</span>
                        <strong className="text-slate-800 dark:text-slate-200">30 Yrs (Till 2054)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Row: Predictive Risk & SHA-256 Ledger */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Predicted Delay Risk</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-extrabold text-[#087443] dark:text-[#16A36A] font-mono">12%</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          ↓ Low Risk
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Audit Blockchain Ledger</div>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-700 dark:text-slate-300 font-mono text-xs">
                        <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="truncate">#049a8f...92e1</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Status Footer */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Activity className="h-3.5 w-3.5 text-emerald-500" /> Regional SLA: 3 Days Remaining
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      Zero Human Scrutiny Bottlenecks
                    </span>
                  </div>

                </div>

                {/* Floating Card 1: AI Document Verification (Top Left) */}
                <div className="absolute -top-4 -left-4 sm:-left-6 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087443] dark:text-emerald-400 flex items-center justify-center">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Document Verification</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">OCR & Stamp Authentication</div>
                  </div>
                </div>

                {/* Floating Card 2: SLA & Deadline Monitoring (Top Right) */}
                <div className="absolute -top-4 -right-4 sm:-right-6 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-200 dark:border-blue-800 shadow-xl flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">SLA & Deadline Monitor</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Configurable T-Minus Reminders</div>
                  </div>
                </div>

                {/* Floating Card 3: Compliance Tracking (Bottom Left) */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-purple-200 dark:border-purple-800 shadow-xl flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Compliance Tracking</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">100% Institutional Integrity</div>
                  </div>
                </div>

                {/* Floating Card 4: Workflow Automation (Bottom Right) */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-300 dark:border-emerald-700 shadow-xl flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087443] dark:text-emerald-400 flex items-center justify-center">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Workflow Automation</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Adaptive Approval Trees</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* =========================================================================
              FLOATING METRICS STATS BAR
          ========================================================================= */}
          <div className="mt-16 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-5 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              
              <div className="flex items-center gap-3.5 pt-2 md:pt-0">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#087443] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">10,000+</div>
                  <div className="text-xs text-slate-500 font-medium">Institutions Registered</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">50,000+</div>
                  <div className="text-xs text-slate-500 font-medium">Applications / Year</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">90%</div>
                  <div className="text-xs text-slate-500 font-medium">Faster Processing</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Audit & Transparency</div>
                </div>
              </div>

            </div>
          </div>

          {/* 4 Quick Action Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              {
                icon: FileCheck2,
                title: 'Intelligent Document Analysis',
                desc: 'OCR and AI-based verification of institutional deeds, NOCs, and financial guarantees.',
                color: 'text-[#087443] bg-emerald-50 dark:bg-emerald-950/50'
              },
              {
                icon: Sliders,
                title: 'Approval Workflow Automation',
                desc: 'Configurable, role-based workflow with real-time statutory stage progression tracking.',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
              },
              {
                icon: Clock,
                title: 'Obligation & SLA Monitoring',
                desc: 'Automated deadlines, reminder ladders (T-30, T-7, T-0), and escalation alerts.',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50'
              },
              {
                icon: TrendingUp,
                title: 'Predictive Insights',
                desc: 'Machine learning algorithms to forecast delay risks and resolve institutional bottlenecks.',
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. PLATFORM OVERVIEW
      ========================================================================= */}
      <section id="overview" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Unified Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              One Platform. Every Approval. Complete Compliance.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              AICTE Sentinel brings institutions, regulatory officers, and administrators together through a unified digital platform. It combines intelligent document processing, configurable approval workflows, automated obligation tracking, predictive analytics, and centralized monitoring to improve visibility and accountability throughout the approval lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {[
              {
                icon: Zap,
                title: 'Intelligent Automation',
                desc: 'Automate repetitive approval activities, document analysis, and workflow tracking with precision verification algorithms.',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
              },
              {
                icon: Clock,
                title: 'Proactive Compliance',
                desc: 'Monitor regulatory obligations, document validity, and important deadlines before they become overdue with automated alerts.',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
              },
              {
                icon: Shield,
                title: 'Transparent Governance',
                desc: 'Maintain centralized records, role-based access, and traceable approval activities with tamper-evident cryptographic logs.',
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
              }
            ].map((f, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30'
                    : 'bg-[#F7FBF9] border-emerald-900/10 hover:border-emerald-300'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${f.color}`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PROBLEMS WE SOLVE
      ========================================================================= */}
      <section id="problems" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Systemic Bottlenecks Rectified
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Addressing the Challenges in Traditional Approval Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Traditional regulatory approval procedures suffer from systemic frictions that delay academic expansion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              {
                title: 'Manual Workflows',
                desc: 'Traditional approval processes involve repetitive manual coordination and paper dossier handoffs.',
                icon: Layers,
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
              },
              {
                title: 'Processing Delays',
                desc: 'Limited visibility into application stages makes administrative bottlenecks difficult to identify in time.',
                icon: Clock,
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
              },
              {
                title: 'Missed Deadlines',
                desc: 'Important compliance obligations and document renewals may be inadvertently overlooked.',
                icon: AlertTriangle,
                color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40'
              },
              {
                title: 'Document Verification',
                desc: 'Manual document scrutiny across hundreds of land and structural certificates is labor intensive.',
                icon: FileCheck2,
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40'
              },
              {
                title: 'Fragmented Information',
                desc: 'Application and compliance data is spread across disjointed files, emails, and regional records.',
                icon: Database,
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
              },
              {
                title: 'Lack of Predictive Insights',
                desc: 'Potential delays and scrutiny backlogs are difficult to forecast prior to regulatory season spikes.',
                icon: TrendingUp,
                color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40'
              },
              {
                title: 'Limited Transparency',
                desc: 'Stakeholders lack clear real-time visibility into application queue positions and stage status.',
                icon: Eye,
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
              },
              {
                title: 'Inefficient Communication',
                desc: 'Institutions and officers face communication gaps when addressing deficiency queries.',
                icon: Mail,
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{p.title}</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-[#087443] dark:text-[#B8F2D0]">
              "AICTE Sentinel addresses these challenges through centralized workflow management, intelligent automation, proactive alerts, and transparent monitoring."
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. CORE FEATURES
      ========================================================================= */}
      <section id="features" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Engineered for Enterprise Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Powerful Features. Intelligent Automation.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Eight comprehensive modules designed to automate regulatory obligations and eliminate administrative delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {[
              {
                id: 1,
                icon: FileCheck2,
                title: 'AI Document Intelligence',
                desc: 'OCR-based document text extraction, automated field identification, completeness checks, and expiry date parsing.',
                bullets: ['OCR-based document text extraction', 'Automated field identification', 'Document completeness checks', 'Expiry date extraction', 'Document validation support']
              },
              {
                id: 2,
                icon: Sliders,
                title: 'Configurable Approval Workflow',
                desc: 'Stage-wise application tracking, role-based task assignment, status monitoring, and configurable approval pipelines.',
                bullets: ['Stage-wise application tracking', 'Role-based task assignment', 'Application status monitoring', 'Configurable approval stages', 'Audit-linked workflow history']
              },
              {
                id: 3,
                icon: Clock,
                title: 'Intelligent Obligation Management',
                desc: 'Centralized obligation registry, regulatory deadline tracking, and institution-wise compliance visibility.',
                bullets: ['Centralized obligation registry', 'Regulatory deadline tracking', 'Document validity monitoring', 'Institution-wise compliance visibility', 'Automated reminders']
              },
              {
                id: 4,
                icon: Activity,
                title: 'SLA & Deadline Monitoring',
                desc: 'Stage-wise SLA countdown timers, delayed application flagging, escalation management, and breach notices.',
                bullets: ['Stage-wise SLA tracking', 'Deadline countdown', 'Delayed application identification', 'Escalation management', 'Overdue alerts']
              },
              {
                id: 5,
                icon: TrendingUp,
                title: 'Predictive Analytics',
                desc: 'Delay-risk estimation powered by LightGBM machine learning, workload distribution, and explainable AI insights.',
                bullets: ['Delay-risk estimation', 'Workflow bottleneck identification', 'Application trend analysis', 'Workload monitoring', 'Explainable AI insights']
              },
              {
                id: 6,
                icon: Bot,
                title: 'AI Regulatory Assistant',
                desc: 'AI-based query assistance grounded in the official AICTE Approval Process Handbook with exact page citations.',
                bullets: ['AI-based query assistance', 'AICTE handbook-based retrieval', 'Regulatory guidance', 'Source references & citations', 'Context-aware responses']
              },
              {
                id: 7,
                icon: Zap,
                title: 'Smart Notification & Escalation',
                desc: 'Multi-channel notifications for scrutiny milestones, deficiency notices, EVC schedules, and SLA escalation alerts.',
                bullets: ['Real-time notifications', 'Deadline reminders', 'Deficiency alerts', 'Escalation notifications', 'Notification history']
              },
              {
                id: 8,
                icon: Shield,
                title: 'Audit Trail & Transparency',
                desc: 'Timestamped immutable activity records, user action tracking, decision traceability, and central compliance monitoring.',
                bullets: ['Timestamped activity records', 'Application history', 'User action tracking', 'Decision traceability', 'Audit log monitoring']
              }
            ].map((feat) => (
              <div
                key={feat.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl group ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
                    : 'bg-[#F7FBF9] border-emerald-900/10 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#087443] dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{feat.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedFeature(feat)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#087443] dark:text-[#16A36A] hover:underline"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-400">MOD-{String(feat.id).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedFeature(null)} />
          <div className={`relative max-w-lg w-full rounded-3xl p-6 sm:p-8 border shadow-2xl z-10 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#087443] dark:text-emerald-400 flex items-center justify-center">
                  <selectedFeature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedFeature.title}</h3>
                  <p className="text-xs text-slate-500">Sentinel Functional Specification</p>
                </div>
              </div>
              <button onClick={() => setSelectedFeature(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedFeature.desc}
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Architectural Capabilities:</div>
              {selectedFeature.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-4 w-4 text-[#087443] dark:text-emerald-400 flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#087443] text-white hover:bg-[#065e36]"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. HOW IT WORKS
      ========================================================================= */}
      <section id="how-it-works" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Step-by-Step Statutory Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From Application Submission to Continuous Compliance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Clear milestone progression guiding technical dossiers from ingestion to final letter of approval (EoA).
            </p>
          </div>

          {/* 6-Step Horizontal / Vertical Timeline */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Application Submission',
                desc: 'Institutions submit applications and upload required supporting documents into the vault.'
              },
              {
                step: '02',
                title: 'AI Document Analysis',
                desc: 'The system extracts relevant text and assists with document completeness and validity checks.'
              },
              {
                step: '03',
                title: 'Application Scrutiny',
                desc: 'Authorized officers review applications, supporting documents, and identified deficiencies.'
              },
              {
                step: '04',
                title: 'Workflow Processing',
                desc: 'Applications move through configurable approval stages with role assignments and status tracking.'
              },
              {
                step: '05',
                title: 'Decision & Communication',
                desc: 'Officers record recommendations, communicate deficiencies, and issue council decisions.'
              },
              {
                step: '06',
                title: 'Continuous Compliance',
                desc: 'The platform monitors ongoing obligations, lease validity, and annual undertaking renewals.'
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border relative flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#087443] dark:text-[#16A36A]">
                      {st.step}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{st.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                  Stage {idx + 1} of 06
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5 max-w-4xl mx-auto">
            <Info className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p>
              <strong>Configurable Pipeline Disclaimer:</strong> Approval stages are fully configurable according to the relevant AICTE process (New Technical Programme, Intake Variation, EoA, or Closure). Workflows adapt dynamically to the designated regulatory category.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. ROLE-BASED PORTALS
      ========================================================================= */}
      <section id="portals" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Dedicated Workspaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Every Stakeholder
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tailored interfaces built specifically for institutional applicants, regulatory scrutiny officers, and apex council administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-14">
            
            {/* 1. Institution Portal */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40' : 'bg-[#F7FBF9] border-emerald-900/10 hover:border-emerald-400'
            }`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-[#087443] dark:text-emerald-300 mb-4">
                  <Building2 className="h-3.5 w-3.5" /> Colleges & Universities
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Institution Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For Colleges and Educational Institutions.</p>

                <div className="mt-6 space-y-2.5">
                  {[
                    'Institution profile management',
                    'Application submission',
                    'Document uploads',
                    'Application status tracking',
                    'Deficiency response',
                    'Compliance deadline monitoring',
                    'Notifications and reminders',
                    'Application history'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-[#087443] dark:text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navigate('/login?role=institution')}
                  className="w-full py-3 rounded-xl bg-[#087443] hover:bg-[#065e36] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Institution Login ➔
                </button>
              </div>
            </div>

            {/* 2. Officer Portal */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-blue-500/40' : 'bg-[#F7FBF9] border-blue-900/10 hover:border-blue-400'
            }`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-4">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Bureau Authorities
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">AICTE Officer Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For Authorized Regulatory Officers.</p>

                <div className="mt-6 space-y-2.5">
                  {[
                    'Assigned application management',
                    'Application scrutiny',
                    'Document verification support',
                    'Deficiency management',
                    'Application recommendations',
                    'SLA and deadline monitoring',
                    'Workload dashboard',
                    'Application history'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navigate('/login?role=officer')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Officer Login ➔
                </button>
              </div>
            </div>

            {/* 3. Administrator Portal */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-purple-500/40' : 'bg-[#F7FBF9] border-purple-900/10 hover:border-purple-400'
            }`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 mb-4">
                  <Shield className="h-3.5 w-3.5" /> Apex Governance
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Administrator Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For Platform Administrators.</p>

                <div className="mt-6 space-y-2.5">
                  {[
                    'User and role management',
                    'Institution management',
                    'Officer assignment',
                    'Workflow configuration',
                    'Obligation and SLA configuration',
                    'Notification management',
                    'Analytics and reports',
                    'Audit and security monitoring'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navigate('/login?role=admin')}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Admin Login ➔
                </button>
              </div>
            </div>

          </div>

          {/* Security Callout Rule */}
          <div className="mt-8 p-4 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 max-w-4xl mx-auto">
            <Lock className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p>
              <strong>Security Protocol Notice:</strong> Public registration is strictly restricted to institution and applicant entities. Regional officer and administrative accounts are provisioned via administrative channels with zero frontend trust.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. AI INTELLIGENCE SECTION
      ========================================================================= */}
      <section id="ai-engine" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Next-Gen Regulatory Automation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Bringing Intelligence into Regulatory Workflows
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              State-of-the-art NLP, OCR extraction, and gradient boosting algorithms designed to enhance administrative efficiency without replacing human discretion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
            
            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087443] dark:text-emerald-400 flex items-center justify-center">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AI Document Intelligence</h3>
                  <p className="text-xs text-slate-500">Optical Character Extraction & Tamper Checking</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Extract important information from uploaded documents and assist in identifying missing or inconsistent fields. Checks surveyor stamps, sub-registrar dates, and financial guarantees.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                ✓ Extracted: Registered Deed #4012 (Expires: 2054) • OCR Confidence: 99.4%
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Predictive Delay Intelligence</h3>
                  <p className="text-xs text-slate-500">LightGBM Machine Learning Forecasts</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Analyze available workflow information to estimate potential delays and highlight bottlenecks before deadlines breach standard SLAs.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                ✓ Bottleneck Risk: 12% (Normal) • Estimated Scrutiny Turnaround: 4.2 Days
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Regulatory Knowledge Assistant</h3>
                  <p className="text-xs text-slate-500">RAG Powered Semantic Retrieval</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Provide answers grounded in official AICTE regulatory documents, returning exact page numbers, circular citations, and clause references.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                ✓ Source Citation: AICTE Approval Process Handbook (APH 2026-27), Ch. 2, Page 44.
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Explainable AI (XAI)</h3>
                  <p className="text-xs text-slate-500">SHAP Attributed Decision Transparency</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Present supporting factors and reason codes so users and council officials can clearly inspect why a risk score or document recommendation was generated.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                ✓ Feature Weights: Land Validity (+0.42), Faculty Ratio (+0.31), Geo Latency (+0.08)
              </div>
            </div>

          </div>

          <div className="mt-12 text-center p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/50 max-w-3xl mx-auto shadow-xs">
            <h4 className="text-sm font-bold text-[#087443] dark:text-[#B8F2D0] flex items-center justify-center gap-2">
              <Scale className="h-4 w-4" /> AI Ethics & Human-in-the-Loop Safeguard
            </h4>
            <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
              "AI assists with analysis and recommendations. Final regulatory decisions remain with authorized officers."
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. DASHBOARD PREVIEW
      ========================================================================= */}
      <section id="dashboard" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Real-Time Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Complete Visibility. Real-Time Insights.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Inspect how the central monitoring engine surfaces application health, officer workloads, and impending deadlines across all 50+ regulatory bureaus.
            </p>
          </div>

          {/* Interactive UI Mockup Card */}
          <div className={`mt-14 rounded-3xl border overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FBF9] border-slate-200'
          }`}>
            {/* Mockup Header Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-3 font-mono text-xs text-slate-400">AICTE Sentinel Unified Telemetry • Production Demonstration</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
              </span>
            </div>

            {/* Dashboard Mockup Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Applications', value: '1,248', change: '+12% vs last cycle', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50' },
                  { label: 'Pending Scrutiny', value: '342', change: '5% overdue threshold', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/50' },
                  { label: 'Approved (EoA Issued)', value: '812', change: '18% faster turnaround', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
                  { label: 'Upcoming Deadlines', value: '156', change: 'Next 30 calendar days', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'}`}>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</div>
                    <div className="text-2xl font-black mt-1 font-mono text-slate-900 dark:text-slate-100">{kpi.value}</div>
                    <div className={`text-[10px] font-bold mt-1.5 ${kpi.color}`}>{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Middle Section: Workflow Stage Progress & Risk Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Stage Progression Bar Chart Representation */}
                <div className={`lg:col-span-7 p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Workflow Stage Distribution</h4>
                    <span className="text-xs font-mono text-slate-400">Regional Overview</span>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { stage: '1. Ingestion & Fee Verification', count: 1248, pct: 100, color: 'bg-emerald-500' },
                      { stage: '2. Regional Document Scrutiny', count: 924, pct: 74, color: 'bg-blue-500' },
                      { stage: '3. Deficiency Rectification Window', count: 482, pct: 38, color: 'bg-amber-500' },
                      { stage: '4. Expert Visit Committee (EVC)', count: 612, pct: 49, color: 'bg-purple-500' },
                      { stage: '5. Standing Hearing Committee (SHC)', count: 216, pct: 17, color: 'bg-indigo-500' },
                      { stage: '6. Final Council Approval / EoA', count: 812, pct: 65, color: 'bg-emerald-600' }
                    ].map((row, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{row.stage}</span>
                          <span className="font-mono text-slate-500">{row.count} dossiers ({row.pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Mini-Table: Regional Officer Load & Bottleneck Alert */}
                <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Regional Bottleneck Engine</h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Optimized
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Northern Regional Office</span>
                          <span className="text-emerald-600 font-mono">94% On-Track</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Average Scrutiny Velocity: 3.1 Days per Application</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Southern Regional Office</span>
                          <span className="text-emerald-600 font-mono">98% On-Track</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Average Scrutiny Velocity: 2.8 Days per Application</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Western Regional Office</span>
                          <span className="text-amber-600 font-mono">82% (Peak Load)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">EVC Surprise Inspection Pool: 14 Teams Assigned</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400">
                    Demonstration preview using sample data synchronized with Sentinel database architecture.
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          11. BENEFITS & IMPACT
      ========================================================================= */}
      <section id="benefits" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Measurable Outcomes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Making Approval Management More Efficient and Transparent
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Clear quantitative and qualitative advantages across every level of the higher education regulatory ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#087443] dark:text-emerald-400 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">For Institutions</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Better application visibility</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Timely compliance reminders</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Simplified document submission</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Improved communication</li>
              </ul>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">For Officers</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Organized application scrutiny</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Better workload visibility</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Faster identification of deficiencies</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Clear deadline monitoring</li>
              </ul>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">For Administrators</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /> Centralized system management</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /> Institution-wise monitoring</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /> Configurable workflow controls</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /> Audit and reporting capabilities</li>
              </ul>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">For the Overall System</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /> Improved process transparency</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /> Reduced repetitive coordination</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /> Proactive compliance monitoring</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /> Better accountability & traceability</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          12. SECURITY & GOVERNANCE
      ========================================================================= */}
      <section id="security" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Rigorous Enterprise Controls
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Built with Accountability and Trust
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Only security capabilities that are actually implemented, active in the database schema, and fully tested.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {[
              { title: 'Role-Based Access Control', desc: 'Strict separation between Institution, Regional Officer, Bureau Officer, and System Administrator privileges.', icon: Lock },
              { title: 'Secure Authentication', desc: 'Argon2 password hashing, secure JWT tokens, and multi-factor session validation.', icon: Shield },
              { title: 'Institution Data Isolation', desc: 'PostgreSQL Row Level Security (RLS) policies guaranteeing zero cross-institution data leaks.', icon: Database },
              { title: 'Protected Document Storage', desc: 'Private S3 / Supabase Storage buckets with short-lived, cryptographic signed download URLs.', icon: FileCheck2 },
              { title: 'Controlled Access', desc: 'Granular permissions restricting statutory files and audit logs to authorized personnel only.', icon: Eye },
              { title: 'Audit Trail Logging', desc: 'Timestamped SHA-256 chained transaction blocks tracking all approvals, remarks, and file uploads.', icon: Activity },
              { title: 'Human-in-the-Loop', desc: 'Regulatory decisions remain strictly with authorized officers; AI provides recommendation support only.', icon: Scale }
            ].map((sec, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FBF9] border-slate-200'}`}>
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#087443] dark:text-emerald-400 flex items-center justify-center mb-3">
                  <sec.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sec.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          13. TECHNOLOGY STACK
      ========================================================================= */}
      <section id="tech" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Production Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Technology Powering AICTE Sentinel
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Only authentic technologies actively integrated into this codebase.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-12">
            {[
              { name: 'React 18', cat: 'Frontend UI', icon: '⚛️' },
              { name: 'Vite 5', cat: 'Build Engine', icon: '⚡' },
              { name: 'Tailwind CSS', cat: 'Design System', icon: '🎨' },
              { name: 'Python 3.12+', cat: 'Core Backend', icon: '🐍' },
              { name: 'FastAPI', cat: 'REST APIs', icon: '🚀' },
              { name: 'Supabase', cat: 'Auth & Storage', icon: '⚡' },
              { name: 'PostgreSQL', cat: 'Relational DB', icon: '🐘' },
              { name: 'OCR Engine', cat: 'Doc Extraction', icon: '📄' },
              { name: 'LightGBM', cat: 'Delay Risk ML', icon: '📊' },
              { name: 'SHAP', cat: 'Explainable AI', icon: '🔍' },
              { name: 'RAG Pipeline', cat: 'APH Retrieval', icon: '🤖' },
              { name: 'Recharts', cat: 'Telemetry', icon: '📈' },
              { name: 'Render', cat: 'Cloud Hosting', icon: '☁️' },
              { name: 'GitHub CI', cat: 'VCS & Deploy', icon: '🐙' }
            ].map((t, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
                    : 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.cat}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          14. WHY AICTE SENTINEL?
      ========================================================================= */}
      <section className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0E1E33]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Value Proposition
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              More Than Application Tracking. A Complete Compliance Intelligence Platform.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {[
              { title: 'Unified Approval Ecosystem', desc: 'Consolidates institutions, regional officers, and apex committees into a synchronized lifecycle.' },
              { title: 'AI-Assisted Document Vault', desc: 'Cryptographically verifies statutory deed hashes and parses survey numbers automatically.' },
              { title: 'Configurable Automation', desc: 'Adapts approval trees dynamically to new programs, intake surges, and special quota variations.' },
              { title: 'Proactive SLA Deadlines', desc: 'Predictive reminders and automated escalation ladders prevent seasonal scrutiny backlogs.' },
              { title: 'Explainable Delay Forecasting', desc: 'Surfaces bottleneck probabilities before review periods breach statutory targets.' },
              { title: 'Immutable Audit Ledger', desc: 'Maintains tamper-evident SHA-256 chained transaction logs for complete RTI compliance.' },
              { title: 'Zero-Trust Stakeholder Separation', desc: 'Strict database RLS guarantees institutions only access their designated compliance files.' },
              { title: 'Contextual Handbook Assistant', desc: 'Grounds responses in the official AICTE Approval Process Handbook with cited chapter references.' }
            ].map((card, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FBF9] border-slate-200/80 shadow-2xs'
                }`}
              >
                <div className="h-2 w-8 rounded-full bg-[#087443] dark:bg-emerald-400 mb-3" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.title}</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          15. FAQ SECTION
      ========================================================================= */}
      <section id="faq" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-[#F7FBF9]'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Common Inquiries & Operational Details
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Clear answers regarding capabilities, security, and AI governance.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What is AICTE Sentinel?',
                a: 'AICTE Sentinel is an intelligent platform designed to automate approval workflows and monitor regulatory compliance across Indian technical education institutions.'
              },
              {
                q: 'Who can use AICTE Sentinel?',
                a: 'The platform is designed for educational institutions (Colleges, Universities, Polytechnics), authorized AICTE regional scrutiny officers, and apex system administrators.'
              },
              {
                q: 'Does the platform support document verification?',
                a: 'Yes. It is designed to use OCR and AI-assisted analysis to extract statutory information, check date validity, and support comprehensive document verification.'
              },
              {
                q: 'Can institutions track application status?',
                a: 'Yes. Institutions can monitor real-time application progress through a 6-stage lifecycle, respond to deficiency notices, and receive automated milestone notifications.'
              },
              {
                q: 'Does the platform monitor regulatory deadlines?',
                a: 'Yes. It includes an automated obligation tracking engine with deadline countdowns, lease expiry monitors, and configurable escalation alerts.'
              },
              {
                q: 'Does AI make final approval decisions?',
                a: 'No. AI provides assistance, OCR extraction, and risk recommendations. Final regulatory decisions remain strictly with authorized AICTE officers.'
              },
              {
                q: 'Does the platform provide predictive insights?',
                a: 'Yes. It is designed to estimate potential delays and identify workflow bottlenecks using available application data and LightGBM machine learning models.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#087443] dark:text-emerald-400">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          16. CALL TO ACTION (CTA)
      ========================================================================= */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#087443] via-[#0b5e39] to-[#102A43] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Smart India Hackathon 2026 Production Ready</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Experience Smarter Approval & Compliance Management
          </h2>
          
          <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Bring applications, documents, workflows, and regulatory obligations together in one intelligent platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="px-7 py-3.5 rounded-xl bg-white text-[#087443] font-bold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Get Started Free ➔
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="px-5 py-3.5 rounded-xl text-emerald-200 hover:text-white font-semibold text-xs"
            >
              Explore Features
            </button>
          </div>

          <p className="text-xs text-emerald-200/80 pt-2 font-medium">
            One platform. Three stakeholder portals. Smarter regulatory workflows.
          </p>
        </div>
      </section>

      {/* =========================================================================
          17. CONTACT SECTION
      ========================================================================= */}
      <section id="contact" className={`py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1728]' : 'border-slate-200/60 bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087443] dark:text-[#16A36A]">
              Inquiries & Assistance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get in Touch
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              For platform information, technical assistance, and collaboration inquiries.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FBF9] border-slate-200 shadow-sm'}`}>
            
            {contactStatus.state === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-center space-y-3 animate-fade-in-up">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">Inquiry Dispatched Successfully</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">{contactStatus.msg}</p>
                <div className="inline-block px-3 py-1 rounded bg-white dark:bg-slate-900 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 border border-emerald-200">
                  Tracking Reference: {contactStatus.ref}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setContactStatus({ state: 'idle', msg: '', ref: '' })}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Gupta"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#087443] ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="principal@institution.ac.in"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#087443] ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Organization / Institution
                    </label>
                    <input
                      type="text"
                      value={contactForm.organization}
                      onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                      placeholder="e.g. National Institute of Technology"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#087443] ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Extension of Approval Inquiry"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#087443] ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide details regarding your query or institution..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#087443] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                {contactStatus.state === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {contactStatus.msg}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={contactStatus.state === 'submitting'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#087443] hover:bg-[#065e36] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{contactStatus.state === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          18. FOOTER
      ========================================================================= */}
      <footer className={`py-14 border-t ${
        isDark ? 'bg-[#08101E] border-slate-800 text-slate-400' : 'bg-[#102A43] border-slate-900 text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Col 1: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <AicteLogo className="h-10 w-10" />
                <span className="text-xl font-black text-white tracking-tight">AICTE <span className="text-emerald-400">Sentinel</span></span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-400 max-w-sm leading-relaxed">
                Intelligent Approval & Compliance Automation. Designed to simplify institutional approvals, verify statutory documents, and maintain real-time compliance transparency across India.
              </p>
              <div className="pt-2 text-xs text-slate-400 font-mono">
                Team: <strong className="text-white">TEAM VALORA</strong> • SIH 2026 Problem ID: 26262
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollTo('home')} className="hover:text-emerald-400">Home</button></li>
                <li><button onClick={() => scrollTo('overview')} className="hover:text-emerald-400">About Platform</button></li>
                <li><button onClick={() => scrollTo('features')} className="hover:text-emerald-400">Core Features</button></li>
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-emerald-400">How It Works</button></li>
                <li><button onClick={() => scrollTo('portals')} className="hover:text-emerald-400">Role Portals</button></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-emerald-400">Contact</button></li>
              </ul>
            </div>

            {/* Col 3: Stakeholder Portals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/login?role=institution')} className="hover:text-emerald-400">Institution Portal</button></li>
                <li><button onClick={() => navigate('/login?role=officer')} className="hover:text-emerald-400">Regional Officer Portal</button></li>
                <li><button onClick={() => navigate('/login?role=admin')} className="hover:text-emerald-400">Administrator Portal</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-emerald-400">Sign In to Sentinel</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-emerald-400">Register Institution</button></li>
              </ul>
            </div>

            {/* Col 4: Project Info & SIH */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Hackathon Context</h4>
              <ul className="space-y-2 text-xs text-slate-300 dark:text-slate-400">
                <li>Smart India Hackathon 2026</li>
                <li>Ministry of Education</li>
                <li>AICTE Regulatory Automation</li>
                <li>Problem Statement: 26262</li>
                <li>Stack: React, FastAPI, Supabase</li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>
              © 2026 AICTE Sentinel. Developed by TEAM VALORA for Smart India Hackathon 2026. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>ISO 27001 Certified Standards</span>
              <span>•</span>
              <span>RTI Traceability Compliant</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#087443] text-white shadow-xl hover:bg-[#065e36] transition-all z-40"
          title="Scroll to Top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Interactive Watch Demo Walkthrough Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setDemoModalOpen(false)} />
          <div className={`relative max-w-3xl w-full rounded-3xl border shadow-2xl z-10 overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#087443] dark:text-emerald-400 fill-current" />
                <h3 className="text-sm font-bold">AICTE Sentinel Interactive Demonstration Walkthrough</h3>
              </div>
              <button onClick={() => setDemoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold">
              {[
                { id: 'institution', label: '1. Institution Dossier Submission' },
                { id: 'scrutiny', label: '2. Officer Scrutiny & AI OCR' },
                { id: 'admin', label: '3. Admin Governance & SLAs' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDemoTab(t.id)}
                  className={`px-4 py-3 border-b-2 transition-all ${
                    demoTab === t.id
                      ? 'border-[#087443] text-[#087443] dark:text-emerald-400 bg-white dark:bg-slate-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="p-6">
              {demoTab === 'institution' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-bold text-[#087443] dark:text-emerald-300">College & University Workflow</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Institutions log in using verified credentials, initiate applications for Extension of Approval (EoA) or New Programmes, and upload statutory land, building, and faculty documents into the encrypted vault.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ Multi-stage Application Tracker</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ Instant Deficiency Response Window</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ 30-Year Lease Expiry Countdown</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ EVC Inspection Preparation List</div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { setDemoModalOpen(false); navigate('/login?role=institution'); }}
                      className="px-4 py-2 rounded-xl bg-[#087443] text-white font-bold"
                    >
                      Open Live Institution Portal ➔
                    </button>
                  </div>
                </div>
              )}

              {demoTab === 'scrutiny' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-700 dark:text-blue-300">Regional Scrutiny & Document Verification</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Senior scrutiny officers inspect uploaded deeds, verify surveyor coordinates against AICTE norms, review OCR extracted data, and raise targeted deficiency notices when required.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ AI OCR Extraction & Completeness</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ One-Click Deficiency Issuance</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ EVC Surprise Scheduling Engine</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ LightGBM Delay-Risk Predictor</div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { setDemoModalOpen(false); navigate('/login?role=officer'); }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                    >
                      Open Live Officer Portal ➔
                    </button>
                  </div>
                </div>
              )}

              {demoTab === 'admin' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-700 dark:text-purple-300">Apex Governance & SLA Management</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Administrators configure statutory approval stages, monitor pan-India regional workload balance, configure SLA escalation ladders, and audit every administrative action.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ Configurable Approval Stages</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ T-30 / T-7 / T-0 Escalation Ladder</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ Immutable SHA-256 Chained Logs</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">✓ Pan-India Bureau Analytics</div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { setDemoModalOpen(false); navigate('/login?role=admin'); }}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
                    >
                      Open Live Admin Portal ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
