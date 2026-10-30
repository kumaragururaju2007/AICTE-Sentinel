import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight,
  Filter, Bell, Award, FileText, ArrowUpRight, TrendingUp,
  Shield, Info
} from 'lucide-react';
import { mockDeadlines, mockStats } from '../../data/mockData';

const PRIORITY_CFG = {
  critical: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: 'Critical' },
  high: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', label: 'High' },
  medium: { color: '#6b93f0', bg: 'rgba(36,87,212,0.1)', border: 'rgba(36,87,212,0.25)', label: 'Medium' },
  low: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', label: 'Low' },
};

const COMPLIANCE_AREAS = [
  { name: 'Faculty Qualifications', score: 94, status: 'compliant', lastChecked: '2024-10-15', requirement: 'Min. 60% PhDs in senior faculty' },
  { name: 'Student-Faculty Ratio', score: 88, status: 'compliant', lastChecked: '2024-10-10', requirement: '1:15 ratio or better' },
  { name: 'Lab Infrastructure', score: 91, status: 'compliant', lastChecked: '2024-09-30', requirement: 'Standard AICTE norms met' },
  { name: 'Library Resources', score: 76, status: 'attention', lastChecked: '2024-10-05', requirement: 'Min. 5000 volumes + e-journals' },
  { name: 'Financial Audit', score: 83, status: 'compliant', lastChecked: '2024-10-01', requirement: 'Annual CA certified audit' },
  { name: 'Fee Compliance (FRC)', score: 45, status: 'non_compliant', lastChecked: '2024-09-01', requirement: 'FRC report submission overdue' },
  { name: 'NBA/NAAC Accreditation', score: 100, status: 'compliant', lastChecked: '2024-08-15', requirement: 'Valid accreditation certificate' },
  { name: 'Grievance Redressal', score: 60, status: 'attention', lastChecked: '2024-09-15', requirement: 'Q3 report not submitted' },
];

const STATUS_CFG_COMP = {
  compliant: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Compliant' },
  attention: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', label: 'Needs Attention' },
  non_compliant: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', label: 'Non-Compliant' },
};

function ComplianceCard({ area }) {
  const sc = STATUS_CFG_COMP[area.status] || STATUS_CFG_COMP.compliant;
  return (
    <div className="p-4 rounded-xl transition-all duration-200"
      style={{ border: `1px solid ${sc.color}25`, background: `${sc.bg}` }}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold text-white">{area.name}</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.5)' }}>Req: {area.requirement}</div>
        </div>
        <div className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: `${sc.color}20`, color: sc.color }}>
          {sc.label}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="progress-bar flex-1">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${area.score}%`, background: area.score >= 80 ? '#10b981' : area.score >= 60 ? '#fbbf24' : '#ef4444' }} />
        </div>
        <span className="text-sm font-bold" style={{ color: sc.color, minWidth: '36px', textAlign: 'right' }}>{area.score}%</span>
      </div>
      <div className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>Last checked: {area.lastChecked}</div>
    </div>
  );
}

function DeadlineCard({ dl, onAction }) {
  const pc = PRIORITY_CFG[dl.priority] || PRIORITY_CFG.medium;
  const isOverdue = dl.daysLeft < 0;
  const isDueSoon = dl.daysLeft >= 0 && dl.daysLeft <= 14;

  return (
    <div className="rounded-xl p-5 transition-all duration-200"
      style={{ border: `1px solid ${pc.border}`, background: pc.bg }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${pc.color}20`, color: pc.color }}>{pc.label}</span>
            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>{dl.category}</span>
          </div>
          <div className="text-sm font-semibold text-white">{dl.title}</div>
          <div className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.55)' }}>{dl.description}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs mb-1" style={{ color: 'rgba(240,244,255,0.5)' }}>Due Date</div>
          <div className="text-sm font-semibold" style={{ color: pc.color }}>{dl.dueDate}</div>
          <div className="text-xs font-bold mt-0.5" style={{ color: isOverdue ? '#f87171' : isDueSoon ? '#fbbf24' : '#34d399' }}>
            {isOverdue ? `${Math.abs(dl.daysLeft)} days overdue` : `${dl.daysLeft} days left`}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full" style={{
          width: isOverdue ? '100%' : `${Math.max(5, 100 - (dl.daysLeft / 90 * 100))}%`,
          background: isOverdue ? '#ef4444' : isDueSoon ? '#fbbf24' : '#10b981',
        }} />
      </div>

      <div className="flex items-center gap-2">
        {dl.applicationId && (
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(36,87,212,0.15)', color: '#6b93f0' }}>
            {dl.applicationId}
          </span>
        )}
        <button className="ml-auto text-xs btn-primary py-1.5 px-3" onClick={() => onAction(dl)}>
          Take Action <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const navigate = useNavigate();
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [complianceView, setComplianceView] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const overallScore = Math.round(COMPLIANCE_AREAS.reduce((s, a) => s + a.score, 0) / COMPLIANCE_AREAS.length);

  const filteredDeadlines = useMemo(() => {
    return mockDeadlines.filter(d => {
      if (deadlineFilter === 'overdue') return d.daysLeft < 0;
      if (deadlineFilter === 'upcoming') return d.daysLeft >= 0 && d.daysLeft <= 30;
      if (deadlineFilter === 'critical') return d.priority === 'critical';
      return true;
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [deadlineFilter]);

  const filteredAreas = useMemo(() => {
    if (complianceView === 'non_compliant') return COMPLIANCE_AREAS.filter(a => a.status === 'non_compliant');
    if (complianceView === 'attention') return COMPLIANCE_AREAS.filter(a => a.status === 'attention');
    return COMPLIANCE_AREAS;
  }, [complianceView]);

  const handleAction = (dl) => {
    if (dl.applicationId) navigate('/institution/applications');
    else navigate('/institution/documents');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Compliance & Deadlines</h2>
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Monitor regulatory compliance and upcoming deadlines</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'compliance', label: 'Compliance Areas' },
          { key: 'deadlines', label: 'Deadlines' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Banner */}
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0e2154,#122a68)', border: '1px solid rgba(59,110,232,0.3)' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.4) 0%, transparent 60%)' }} />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Score Circle */}
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(59,110,232,0.15)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 100) * 251} 251`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>{overallScore}%</span>
                  <span className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>Score</span>
                </div>
              </div>
              <div>
                <div className="badge-green inline-flex mb-2">AY 2024-25</div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>Overall Compliance Score</h3>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.6)' }}>
                  {overallScore >= 80 ? '✅ Your institution is in good standing with AICTE norms.' :
                    overallScore >= 60 ? '⚠️ Some areas require attention to improve compliance.' :
                      '🚨 Critical compliance issues need immediate attention.'}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span style={{ color: '#34d399' }}>✓ {COMPLIANCE_AREAS.filter(a => a.status === 'compliant').length} Compliant</span>
                  <span style={{ color: '#fbbf24' }}>⚠ {COMPLIANCE_AREAS.filter(a => a.status === 'attention').length} Attention</span>
                  <span style={{ color: '#f87171' }}>✗ {COMPLIANCE_AREAS.filter(a => a.status === 'non_compliant').length} Issues</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle, label: 'Compliant Areas', value: COMPLIANCE_AREAS.filter(a => a.status === 'compliant').length, color: '#10b981' },
              { icon: AlertTriangle, label: 'Needs Attention', value: COMPLIANCE_AREAS.filter(a => a.status === 'attention').length, color: '#fbbf24' },
              { icon: Clock, label: 'Overdue Deadlines', value: mockDeadlines.filter(d => d.daysLeft < 0).length, color: '#f87171' },
              { icon: Calendar, label: 'Due in 30 Days', value: mockDeadlines.filter(d => d.daysLeft >= 0 && d.daysLeft <= 30).length, color: '#6b93f0' },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Outfit,sans-serif' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Critical Deadlines */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Critical & Overdue Items</h3>
              <button className="text-xs" style={{ color: '#6b93f0', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setActiveTab('deadlines')}>View All →</button>
            </div>
            <div className="space-y-3">
              {mockDeadlines.filter(d => d.priority === 'critical' || d.daysLeft < 0).slice(0, 3).map(dl => (
                <DeadlineCard key={dl.id} dl={dl} onAction={handleAction} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COMPLIANCE AREAS TAB ── */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="flex gap-2 mb-4">
            {[
              { key: 'all', label: 'All Areas' },
              { key: 'attention', label: 'Needs Attention' },
              { key: 'non_compliant', label: 'Non-Compliant' },
            ].map(f => (
              <button key={f.key} onClick={() => setComplianceView(f.key)} className={`tab-btn ${complianceView === f.key ? 'active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAreas.map((area, i) => <ComplianceCard key={i} area={area} />)}
          </div>
        </div>
      )}

      {/* ── DEADLINES TAB ── */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'All Deadlines' },
              { key: 'overdue', label: '🔴 Overdue' },
              { key: 'upcoming', label: '⚠️ Due in 30 Days' },
              { key: 'critical', label: '🔴 Critical' },
            ].map(f => (
              <button key={f.key} onClick={() => setDeadlineFilter(f.key)} className={`tab-btn ${deadlineFilter === f.key ? 'active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDeadlines.map(dl => <DeadlineCard key={dl.id} dl={dl} onAction={handleAction} />)}
          </div>

          {filteredDeadlines.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle size={40} style={{ color: '#10b981', margin: '0 auto 12px' }} />
              <div className="text-white font-medium">No deadlines in this category</div>
              <div className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>Great job staying on top of compliance!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
