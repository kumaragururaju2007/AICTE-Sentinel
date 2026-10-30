import React, { useState } from 'react'
import {
  Calendar, Users, MapPin, CheckCircle2, Clock, AlertTriangle,
  Video, FileCheck, Shield, ExternalLink, ChevronRight, Filter,
  Search, Eye, Check, Download, Camera
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { EVC_MANAGEMENT_DATA } from '../../data/officerMockData'

export default function InspectionStatus() {
  const [inspections, setInspections] = useState([
    {
      evcId: 'EVC-2026-901',
      appId: 'AICTE-2025-00145',
      institutionName: 'Vidya Institute of Technology',
      committeeLead: 'Prof. S. R. Kulkarni (IIT Bombay)',
      membersCount: 3,
      inspectionDate: '30 Nov 2025',
      timeSlot: '10:00 AM - 02:00 PM',
      status: 'SCHEDULED',
      gpsCoords: '19.0760° N, 72.8777° E (Within 15m radius)',
      geoTagVerified: true,
      videoStreamStatus: 'READY',
      deficiencyObserved: 'Minor civil work in 2nd floor computer lab',
      checklist: {
        landBoundaries: true,
        barrierFreeAccess: true,
        fireNOC: true,
        computerLabCadence: false,
        libraryVolumes: true
      }
    },
    {
      evcId: 'EVC-2026-894',
      appId: 'AICTE-2025-00123',
      institutionName: 'Sunrise Engineering College',
      committeeLead: 'Dr. Meenakshi Sundaram (NIT Trichy)',
      membersCount: 3,
      inspectionDate: '24 Nov 2025',
      timeSlot: '11:00 AM - 04:00 PM',
      status: 'REPORT_SUBMITTED',
      gpsCoords: '18.5204° N, 73.8567° E (Verified on-site)',
      geoTagVerified: true,
      videoStreamStatus: 'ARCHIVED',
      deficiencyObserved: 'Zero deficiencies noted by inspection panel',
      checklist: {
        landBoundaries: true,
        barrierFreeAccess: true,
        fireNOC: true,
        computerLabCadence: true,
        libraryVolumes: true
      }
    },
    {
      evcId: 'EVC-2026-880',
      appId: 'AICTE-2025-00167',
      institutionName: 'Global Polytechnic',
      committeeLead: 'Prof. Arvind Deshpande (COEP Pune)',
      membersCount: 2,
      inspectionDate: '19 Nov 2025',
      timeSlot: '09:30 AM - 01:30 PM',
      status: 'VERIFIED',
      gpsCoords: '19.9975° N, 73.7898° E (Nashik campus verified)',
      geoTagVerified: true,
      videoStreamStatus: 'ARCHIVED',
      deficiencyObserved: 'Cadence of machine tools in workshop requires additional safety enclosure',
      checklist: {
        landBoundaries: true,
        barrierFreeAccess: false,
        fireNOC: true,
        computerLabCadence: true,
        libraryVolumes: true
      }
    }
  ])

  const [selectedEvc, setSelectedEvc] = useState(inspections[0])
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState(null)

  const handleApproveReport = (evcId) => {
    setInspections(prev => prev.map(item => {
      if (item.evcId === evcId) {
        return { ...item, status: 'VERIFIED' }
      }
      return item
    }))
    setInspectionSuccessMsg(`EVC Inspection Report for ${selectedEvc.institutionName} signed and officially verified by Regional Officer R. Sharma.`)
    setTimeout(() => setInspectionSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="EVC Inspection Field Status & Committee Audits"
        subtitle="Real-time oversight of Expert Visit Committees, GPS geo-stamped premises verification & physical audit reports"
        badgeText="3 Western Bureau Panels Active"
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Inspection Status']}
      />

      {inspectionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{inspectionSuccessMsg}</span>
          </div>
          <button onClick={() => setInspectionSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">&times;</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Scheduled Inspections</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">12</p>
          <span className="text-[11px] text-[#1E6DEB] font-semibold mt-1 block">Western Bureau Q4</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Reports Submitted</span>
          <p className="text-2xl font-extrabold text-[#159B68] mt-1">7</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Pending Officer Sign-off</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Geo-fence Verification</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">100%</p>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Zero GPS spoofing</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Deficiencies Flagged</span>
          <p className="text-2xl font-extrabold text-[#EF4444] mt-1">2</p>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Escalated to SHC</span>
        </div>
      </div>

      {/* Main Grid: Inspection List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active EVC Panels</span>
            <div className="flex gap-1">
              {['ALL', 'SCHEDULED', 'REPORT_SUBMITTED', 'VERIFIED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                    filterStatus === st ? 'bg-[#1E6DEB] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'REPORT_SUBMITTED' ? 'Reports' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {inspections.filter(i => filterStatus === 'ALL' || i.status === filterStatus).map(item => {
              const isSelected = selectedEvc.evcId === item.evcId
              return (
                <div
                  key={item.evcId}
                  onClick={() => setSelectedEvc(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E6DEB]">{item.evcId}</span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{item.institutionName}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.inspectionDate} &bull; {item.timeSlot}
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>Lead: {item.committeeLead.split('(')[0]}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> GPS Tagged
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Inspection Details Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E6DEB]">{selectedEvc.evcId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-xs text-slate-500">{selectedEvc.appId}</span>
                  <StatusBadge status={selectedEvc.status} size="xs" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedEvc.institutionName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Committee Chair: <strong>{selectedEvc.committeeLead}</strong> ({selectedEvc.membersCount} Panel Experts)</p>
              </div>

              {selectedEvc.status === 'REPORT_SUBMITTED' && (
                <button
                  onClick={() => handleApproveReport(selectedEvc.evcId)}
                  className="px-4 py-2 bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Verify Report
                </button>
              )}
            </div>

            {/* Geo and Camera Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> AICTE Geotag Coordinates
                </span>
                <p className="font-mono font-bold text-slate-900 mt-1">{selectedEvc.gpsCoords}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">✓ Match verified with Master Land Survey</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[11px] flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-purple-600" /> Tamper-Evident Video Stream
                </span>
                <p className="font-mono font-bold text-slate-900 mt-1">{selectedEvc.videoStreamStatus}</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Continuous 1080p recording securely hashed</span>
              </div>
            </div>

            {/* Statutory Physical Inspection Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Statutory Physical Verification Checklist
              </h4>
              <div className="space-y-2">
                {[
                  { key: 'landBoundaries', label: 'Continuous Contiguous Land Boundaries & Compound Wall' },
                  { key: 'barrierFreeAccess', label: 'Barrier-Free Built Environment & Lift Facilities (Divyangjan Norms)' },
                  { key: 'fireNOC', label: 'Government Fire & Rescue Safety NOC Certificate' },
                  { key: 'computerLabCadence', label: 'Computer Lab Terminal Density & 1 Gbps Leased Line Speed' },
                  { key: 'libraryVolumes', label: 'Minimum 5,000 Technical Books & Subscription to IEEE/ScienceDirect' }
                ].map(item => {
                  const isChecked = selectedEvc.checklist[item.key]
                  return (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800">{item.label}</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1 ${
                        isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isChecked ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {isChecked ? 'COMPLIANT' : 'DEFICIENT'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Field Observation Summary */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
              <span className="font-bold text-blue-950">Committee Field Observation Remarks:</span>
              <p className="text-blue-900 leading-relaxed">{selectedEvc.deficiencyObserved}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

