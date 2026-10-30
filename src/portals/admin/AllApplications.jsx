import React, { useState } from 'react'
import {
  Layers, Search, Filter, Download, Eye, CheckCircle2,
  Clock, AlertTriangle, XCircle, Building2, Calendar, FileText
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'

export default function AllApplications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  const masterApplications = [
    {
      id: 'AICTE-2026-01248',
      name: 'SVS College of Engineering',
      region: 'Southern',
      type: 'EoA',
      program: 'Engineering',
      intake: 420,
      status: 'Under Review',
      submittedDate: '28 Oct 2026',
      slaDays: 14
    },
    {
      id: 'AICTE-2026-01247',
      name: 'GreenTech Polytechnic',
      region: 'Western',
      type: 'New Institution',
      program: 'Engineering',
      intake: 240,
      status: 'Documents Pending',
      submittedDate: '27 Oct 2026',
      slaDays: 12
    },
    {
      id: 'AICTE-2026-01246',
      name: 'Skyline Institute of Management',
      region: 'Northern',
      type: 'Extension of Approval',
      program: 'Management',
      intake: 180,
      status: 'Approved',
      submittedDate: '26 Oct 2026',
      slaDays: 0
    },
    {
      id: 'AICTE-2026-01245',
      name: 'RVS College of Pharmacy',
      region: 'Southern',
      type: 'EoA',
      program: 'Pharmacy',
      intake: 100,
      status: 'Under Review',
      submittedDate: '25 Oct 2026',
      slaDays: 9
    },
    {
      id: 'AICTE-2026-01244',
      name: 'Sunrise Tech Institute',
      region: 'Eastern',
      type: 'Change of Site',
      program: 'Engineering',
      intake: 300,
      status: 'Rejected',
      submittedDate: '24 Oct 2026',
      slaDays: 0
    },
    {
      id: 'AICTE-2026-01243',
      name: 'Apex Institute of Technology & Management',
      region: 'Western',
      type: 'Extension of Approval',
      program: 'Engineering',
      intake: 360,
      status: 'Under Review',
      submittedDate: '22 Oct 2026',
      slaDays: 6
    },
    {
      id: 'AICTE-2026-01242',
      name: 'Delhi Institute of Advanced Sciences',
      region: 'Northern',
      type: 'New Program',
      program: 'Management',
      intake: 120,
      status: 'Approved',
      submittedDate: '20 Oct 2026',
      slaDays: 0
    }
  ]

  const filtered = masterApplications.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = selectedType === 'ALL' || app.type.toLowerCase().includes(selectedType.toLowerCase())
    const matchStatus = selectedStatus === 'ALL' || app.status.toLowerCase().includes(selectedStatus.toLowerCase())
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Application Repository"
        subtitle="National pan-India registry of 1,248 academic institutions and technical programs for academic year 2026-27"
        badgeText="1,248 Live Applications"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'All Applications']}
        actions={
          <button
            onClick={() => alert('Exporting 1,248 records to CSV format with cryptographic SHA-256 seal...')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Data (CSV)
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, institution name, region..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6DEB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Application Types</option>
            <option value="EoA">Extension of Approval (EoA)</option>
            <option value="New">New Institution</option>
            <option value="Change">Change of Site / Intake</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Approved">Approved (812)</option>
            <option value="Under Review">Under Review (342)</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Rejected">Rejected (94)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Intake</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submission</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1E6DEB]">{app.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{app.name}</td>
                  <td className="py-3 px-4 text-slate-600">{app.region}</td>
                  <td className="py-3 px-4 text-slate-600">{app.program}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{app.intake}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      app.status === 'Approved' ? 'bg-emerald-50 text-[#159B68] border border-emerald-200' :
                      app.status === 'Rejected' ? 'bg-rose-50 text-[#EF4444] border border-rose-200' :
                      app.status === 'Documents Pending' ? 'bg-amber-50 text-[#D97706] border border-amber-200' :
                      'bg-blue-50 text-[#1E6DEB] border border-blue-200'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{app.submittedDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Reviewing application dossier: ${app.id} (${app.name})`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

