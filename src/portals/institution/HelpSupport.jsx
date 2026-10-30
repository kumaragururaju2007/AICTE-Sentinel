import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  FileText,
  UploadCloud,
  CheckCircle2,
  LifeBuoy,
  Send,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { faqsList } from '../../data/institutionMockData';
import { useInstitution } from './context/InstitutionContext';

export default function HelpSupport() {
  const { supportTickets, addSupportTicket, applications } = useInstitution();

  const [expandedFaq, setExpandedFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'guides' | 'ticket'
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Application Query',
    applicationRef: '',
    priority: 'Medium',
    description: '',
  });
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) return;

    addSupportTicket(ticketForm);
    setTicketSuccess(true);
    setTicketForm({
      subject: '',
      category: 'Application Query',
      applicationRef: '',
      priority: 'Medium',
      description: '',
    });
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help Centre & Compliance Knowledgebase"
        subtitle="Step-by-step regulatory guidance, Approval Process Handbook (APH) FAQs, and institutional helpdesk."
        breadcrumb={['Home', 'Communication', 'Help & Support']}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
          { id: 'guides', label: 'Procedural Guides & Norms', icon: BookOpen },
          { id: 'ticket', label: 'Helpdesk Support Tickets', icon: LifeBuoy },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
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

      {/* Tab 1: FAQs */}
      {activeTab === 'faq' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 mb-2">
            <h3 className="text-base font-bold text-slate-900">
              Regulatory Approval FAQs (APH AY 2025-26)
            </h3>
            <p className="text-xs text-slate-500">
              Clear answers regarding scrutiny procedures, lease tenures, and EVC window timelines
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {faqsList.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 font-mono">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#2563EB]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed border border-slate-200/60 animate-fade-in-up">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Procedural Guides */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Application Submission Guide</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-by-step instructions on filling course intake details, computing faculty cadre ratios, and paying application processing fees.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li>✓ Multi-step workflow navigation</li>
              <li>✓ Faculty Cadre ratio validation (1:2:6)</li>
              <li>✓ Fee Regulatory norms breakdown</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Document Upload Specifications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format rules and digital scanning standards. Ensuring Sub-Registrar seals and CA verification UDIN numbers are machine-readable.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li>✓ PDF, JPG, PNG formats up to 20MB</li>
              <li>✓ Minimum 300 DPI color scan resolution</li>
              <li>✓ Self-attestation and digital e-Signs</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Compliance & EVC Guidelines</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard operating procedures for managing the confidential EVC surprise window, physical laboratory setup, and student records.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li>✓ 48-hour surprise window alert rules</li>
              <li>✓ NABL calibration certificate checks</li>
              <li>✓ Anti-ragging & PwD barrier-free norms</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Helpdesk Support Ticket */}
      {activeTab === 'ticket' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Form (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Raise Regulatory Helpdesk Support Ticket
              </h3>
              <p className="text-xs text-slate-500">
                Direct query ticket routed to AICTE Sentinel Regional Bureau Desk Officer
              </p>
            </div>

            {ticketSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-fade-in-up">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  Support ticket lodged successfully! Your reference ticket number has been assigned.
                </span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Scrutiny portal document upload timeout for APP-2026-0041"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Query Classification
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="Technical Gateway">Technical Gateway / Upload Error</option>
                    <option value="Policy Clarification">Policy Clarification (APH Rules)</option>
                    <option value="Scrutiny Question">Scrutiny / Deficiency Query</option>
                    <option value="Fee & Billing">Application Fee Reconciliation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Related Application (Optional)
                  </label>
                  <select
                    value={ticketForm.applicationRef}
                    onChange={e => setTicketForm({ ...ticketForm, applicationRef: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="">General (No Application)</option>
                    {applications.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.id} – {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Query Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketForm.description}
                  onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Describe your issue in detail, error codes observed, or required council clarification..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Ticket to Helpdesk</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Tickets Tracker (1 col) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              My Support Ticket Status
            </h3>

            <div className="space-y-3">
              {supportTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{ticket.id}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">{ticket.subject}</h4>
                  <p className="text-[11px] text-slate-500 italic">
                    Reply: "{ticket.lastReply}"
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                    Lodged: {ticket.date} • {ticket.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
