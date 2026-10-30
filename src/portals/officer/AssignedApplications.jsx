import React, { useState } from 'react'
import { Search, Filter, Eye, ArrowRight, Clock, Building2, ChevronRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { ASSIGNED_APPLICATIONS_LIST } from '../../data/officerMockData'
import { useApplicationContext } from '../../context/ApplicationContext'

export default function AssignedApplications({ onSelectApp, onNavigateToScrutiny }) {
  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  const applications = appContext ? appContext.applications : ASSIGNED_APPLICATIONS_LIST
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [selectedStage, setSelectedStage] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')

  // Selected app modal details
  const [selectedModalApp, setSelectedModalApp] = useState(null)

  // Filter logic
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      app.district.toLowerCase().includes(search.toLowerCase()) ||
      app.permanentId.toLowerCase().includes(search.toLowerCase())

    const matchesRegion = selectedRegion === 'ALL' || app.region === selectedRegion
    const matchesStage = selectedStage === 'ALL' || app.stageKey === selectedStage
    const matchesPriority = selectedPriority === 'ALL' || app.priority === selectedPriority

    return matchesSearch && matchesRegion && matchesStage && matchesPriority
  })

  const columns = [
    {
      header: 'Application ID',
      field: 'id',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#1769E0] text-xs">{val}</span>
          <span className="text-[10px] text-slate-400 block font-mono">PID: {row.permanentId}</span>
        </div>
      )
    },
    {
      header: 'Institution Name',
      field: 'institutionName',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-xs">
          <p className="font-bold text-slate-900 text-xs line-clamp-1">{val}</p>
          <p className="text-[11px] text-slate-500">{row.courseType}</p>
        </div>
      )
    },
    {
      header: 'Region / Location',
      field: 'region',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{val} Bureau</span>
          <span className="text-[10px] text-slate-500 block">{row.district}, {row.state}</span>
        </div>
      )
    },
    {
      header: 'Application Type',
      field: 'applicationType',
      render: val => <span className="text-xs font-medium text-slate-700">{val}</span>
    },
    {
      header: 'Current Stage',
      field: 'currentStage',
      render: (val, row) => <StatusBadge status={row.status} label={val} size="xs" />
    },
    {
      header: 'Submission Date',
      field: 'submissionDate',
      sortable: true,
      render: val => <span className="font-mono text-xs text-slate-500">{val}</span>
    },
    {
      header: 'SLA Due Date',
      field: 'dueDate',
      sortable: true,
      render: (val, row) => {
        const isOverdue = row.daysLeft < 0
        return (
          <div>
            <span className={`font-mono text-xs font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
              {val}
            </span>
            <span className={`text-[10px] block font-mono ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
              {isOverdue ? `Overdue by ${Math.abs(row.daysLeft)}d` : `${row.daysLeft}d left`}
            </span>
          </div>
        )
      }
    },
    {
      header: 'Priority',
      field: 'priority',
      sortable: true,
      render: val => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
          val === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
          val === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
          val === 'MEDIUM' ? 'bg-blue-100 text-[#1769E0]' :
          'bg-emerald-100 text-[#159B68]'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: 'Action',
      field: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedModalApp(row)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            Quick View
          </button>
          <button
            onClick={() => {
              onSelectApp && onSelectApp(row.id)
              onNavigateToScrutiny && onNavigateToScrutiny(row.id)
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#102A56] hover:bg-[#1769E0] text-white font-bold transition-colors flex items-center gap-1 shadow-xs"
          >
            Scrutiny Desk
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Regulatory Applications"
        subtitle="Searchable scrutiny queue for Western Bureau official caseload"
        badgeText={`${filteredApps.length} Applications Active in Scrutiny`}
        breadcrumbs={['AICTE Sentinel', 'Officer Portal', 'Assigned Applications']}
      />

      {/* Control Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Application ID, Institution Name, Permanent ID, or District..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1769E0] text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Region filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Region:</span>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">All Regions</option>
              <option value="Western">Western</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="Southern">Southern</option>
            </select>
          </div>

          {/* Stage filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Stage:</span>
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">All Stages</option>
              <option value="scrutiny">In Scrutiny</option>
              <option value="evc">EVC Scheduled</option>
              <option value="deficiency">Deficiency Window</option>
              <option value="approved">Final Approved</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Priority:</span>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Data Table */}
      <DataTable
        columns={columns}
        data={filteredApps}
        searchable={false}
        pageSize={6}
        keyField="id"
      />

      {/* Quick View Modal */}
      {selectedModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#1769E0]">{selectedModalApp.id}</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedModalApp.institutionName}</h3>
              </div>
              <button
                onClick={() => setSelectedModalApp(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-slate-800">{selectedModalApp.applicationType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Permanent ID</span>
                <span className="font-mono font-semibold text-slate-800">{selectedModalApp.permanentId}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Approved Intake</span>
                <span className="font-semibold text-slate-800">{selectedModalApp.intakeApproved} Seats</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Requested Intake</span>
                <span className="font-semibold text-slate-800">{selectedModalApp.intakeRequested} Seats</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <p className="font-bold text-[#102A56]">SLA Obligation Status:</p>
              <p className="text-slate-600 mt-0.5">
                Statutory due date is <strong>{selectedModalApp.dueDate}</strong>. 
                Risk score currently evaluated at <strong>{selectedModalApp.riskScore}/100</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedModalApp(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const appId = selectedModalApp.id
                  setSelectedModalApp(null)
                  onSelectApp && onSelectApp(appId)
                  onNavigateToScrutiny && onNavigateToScrutiny(appId)
                }}
                className="px-4 py-1.5 rounded-xl bg-[#102A56] hover:bg-[#1769E0] text-white text-xs font-bold shadow-xs"
              >
                Proceed to Scrutiny Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
