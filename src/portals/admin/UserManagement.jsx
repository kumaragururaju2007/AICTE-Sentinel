import React, { useState } from 'react'
import {
  Users, Building2, UserCheck, Shield, Key, Plus, Search, Filter,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Check, X
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import {
  INSTITUTIONS_MASTER_LIST,
  OFFICERS_DIRECTORY,
  COMMITTEES_ROSTER,
  RBAC_PERMISSIONS_MATRIX
} from '../../data/adminMockData'

export default function UserManagement({ initialTab = 'institutions' }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'users' ? 'permissions' : initialTab)
  const [institutions, setInstitutions] = useState(INSTITUTIONS_MASTER_LIST)
  const [officers, setOfficers] = useState(OFFICERS_DIRECTORY)
  const [committees, setCommittees] = useState(COMMITTEES_ROSTER)

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'users' ? 'permissions' : initialTab)
    }
  }, [initialTab])

  // Add officer modal
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false)
  const [newOfficerName, setNewOfficerName] = useState('')
  const [newOfficerEmail, setNewOfficerEmail] = useState('')
  const [newOfficerRole, setNewOfficerRole] = useState('REGIONAL_OFFICER')
  const [newOfficerRegion, setNewOfficerRegion] = useState('Western Region (Mumbai/Pune)')

  const handleAddOfficer = (e) => {
    e.preventDefault()
    if (!newOfficerName.trim() || !newOfficerEmail.trim()) return

    const newOfficer = {
      id: `OFFICER-00${officers.length + 1}`,
      name: newOfficerName,
      designation: newOfficerRole === 'REGIONAL_OFFICER' ? 'Scrutiny Officer' : 'EVC Coordinator',
      region: newOfficerRegion,
      email: newOfficerEmail,
      activeCases: 0,
      completedCycle: 0,
      status: 'ACTIVE',
      role: newOfficerRole
    }

    setOfficers([...officers, newOfficer])
    setShowAddOfficerModal(false)
    setNewOfficerName('')
    setNewOfficerEmail('')
  }

  const handleToggleOfficerStatus = (id) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : o))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Identity &amp; Access Governance (RBAC)"
        subtitle="Manage institutions, regulatory officers, empanelled visit committees, and statutory permission matrices"
        badgeText="Least-Privilege Security Core"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'User Management']}
        actions={
          activeTab === 'officers' ? (
            <button
              onClick={() => setShowAddOfficerModal(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20"
            >
              <Plus className="w-4 h-4" /> Add Regulatory Official
            </button>
          ) : null
        }
      />

      {/* Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5">
        {[
          { id: 'institutions', label: `Institutions (${institutions.length})` },
          { id: 'officers', label: `Regulatory Officers (${officers.length})` },
          { id: 'committees', label: `EVC Committees (${committees.length})` },
          { id: 'permissions', label: 'RBAC Permission Matrix' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#102A56] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INSTITUTIONS */}
      {activeTab === 'institutions' && (
        <DataTable
          columns={[
            {
              header: 'Permanent ID',
              field: 'permanentId',
              sortable: true,
              render: val => <span className="font-mono font-bold text-[#1769E0]">{val}</span>
            },
            {
              header: 'Institution Name',
              field: 'name',
              sortable: true,
              render: (val, row) => (
                <div>
                  <p className="font-bold text-slate-900 text-xs">{val}</p>
                  <p className="text-[11px] text-slate-500">{row.category} &bull; Estd: {row.establishedYear}</p>
                </div>
              )
            },
            {
              header: 'Region & Location',
              field: 'region',
              render: (val, row) => (
                <div>
                  <span className="font-semibold text-slate-800 text-xs">{val}</span>
                  <span className="text-[10px] text-slate-400 block">{row.city}, {row.state}</span>
                </div>
              )
            },
            {
              header: 'Head of Institute',
              field: 'headName',
              render: (val, row) => (
                <div>
                  <p className="font-medium text-slate-800 text-xs">{val}</p>
                  <p className="text-[10px] font-mono text-slate-400">{row.email}</p>
                </div>
              )
            },
            {
              header: 'Compliance Score',
              field: 'complianceScore',
              sortable: true,
              render: val => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  val >= 80 ? 'bg-emerald-100 text-[#159B68]' :
                  val >= 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {val}/100
                </span>
              )
            },
            {
              header: 'Status',
              field: 'status',
              render: val => <StatusBadge status={val} size="xs" />
            }
          ]}
          data={institutions}
          searchPlaceholder="Search institutions by name, PID, or city..."
          pageSize={5}
          keyField="permanentId"
        />
      )}

      {/* TAB 2: OFFICERS DIRECTORY */}
      {activeTab === 'officers' && (
        <DataTable
          columns={[
            {
              header: 'Officer ID',
              field: 'id',
              sortable: true,
              render: val => <span className="font-mono font-bold text-[#102A56]">{val}</span>
            },
            {
              header: 'Official Name & Role',
              field: 'name',
              sortable: true,
              render: (val, row) => (
                <div>
                  <p className="font-bold text-slate-900 text-xs">{val}</p>
                  <p className="text-[11px] text-slate-500">{row.designation}</p>
                </div>
              )
            },
            {
              header: 'Regional Jurisdiction',
              field: 'region',
              render: val => <span className="text-xs font-semibold text-slate-700">{val}</span>
            },
            {
              header: 'Contact Email',
              field: 'email',
              render: val => <span className="font-mono text-xs text-slate-500">{val}</span>
            },
            {
              header: 'Active Caseload',
              field: 'activeCases',
              sortable: true,
              render: (val, row) => (
                <span className="font-mono font-bold text-[#1769E0]">
                  {val} Cases ({row.completedCycle} Completed)
                </span>
              )
            },
            {
              header: 'Access Status',
              field: 'status',
              render: (val, row) => (
                <button
                  onClick={() => handleToggleOfficerStatus(row.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                    val === 'ACTIVE'
                      ? 'bg-emerald-50 text-[#159B68] border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {val === 'ACTIVE' ? 'Active' : 'Suspended'}
                </button>
              )
            }
          ]}
          data={officers}
          searchPlaceholder="Search officers by name, region, or role..."
          pageSize={5}
          keyField="id"
        />
      )}

      {/* TAB 3: COMMITTEES ROSTER */}
      {activeTab === 'committees' && (
        <DataTable
          columns={[
            {
              header: 'Committee ID',
              field: 'committeeId',
              sortable: true,
              render: val => <span className="font-mono font-bold text-[#7738E8]">{val}</span>
            },
            {
              header: 'Committee Name',
              field: 'name',
              sortable: true,
              render: (val, row) => (
                <div>
                  <p className="font-bold text-slate-900 text-xs">{val}</p>
                  <p className="text-[11px] text-slate-500">{row.discipline}</p>
                </div>
              )
            },
            {
              header: 'Chairperson',
              field: 'chairperson',
              render: val => <span className="text-xs font-semibold text-slate-800">{val}</span>
            },
            {
              header: 'Members',
              field: 'membersCount',
              render: val => <span className="font-mono text-xs">{val} Empanelled</span>
            },
            {
              header: 'Capacity Slots',
              field: 'assignedVisits',
              render: (val, row) => (
                <span className="font-mono text-xs font-bold text-[#1769E0]">
                  {val} / {row.maxCapacity} Booked
                </span>
              )
            },
            {
              header: 'COI Status',
              field: 'conflictClearanceStatus',
              render: val => (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-[#159B68] flex items-center gap-1 w-max">
                  <CheckCircle2 className="w-3 h-3" /> {val}
                </span>
              )
            }
          ]}
          data={committees}
          searchPlaceholder="Search committees by name or discipline..."
          pageSize={5}
          keyField="committeeId"
        />
      )}

      {/* TAB 4: RBAC PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            AICTE Sentinel Role-Based Access Control (RBAC) Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Strict least-privilege scoping enforced across all statutory actions
          </p>

          <div className="space-y-4 pt-2">
            {RBAC_PERMISSIONS_MATRIX.map(roleItem => (
              <div key={roleItem.role} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{roleItem.roleLabel}</h4>
                    <span className="font-mono text-[10px] text-slate-400">{roleItem.role}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1769E0] font-bold text-[10px]">
                    Role Scoped
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {roleItem.permissions.map(perm => (
                    <div
                      key={perm.code}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        perm.allowed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="font-medium text-[11px]">{perm.name}</span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        perm.allowed ? 'bg-[#159B68] text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {perm.allowed ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Officer Modal */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Provision Regulatory Official</h3>
              <button onClick={() => setShowAddOfficerModal(false)} className="text-slate-400 font-bold">&times;</button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Meenakshi Sundaram"
                  value={newOfficerName}
                  onChange={e => setNewOfficerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Govt Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@aicte-india.org"
                  value={newOfficerEmail}
                  onChange={e => setNewOfficerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={newOfficerRole}
                  onChange={e => setNewOfficerRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="REGIONAL_OFFICER">Regional Scrutiny Officer</option>
                  <option value="EVC_COORDINATOR">EVC Logistics Coordinator</option>
                  <option value="BUREAU_OFFICER">Bureau Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bureau Jurisdiction</label>
                <select
                  value={newOfficerRegion}
                  onChange={e => setNewOfficerRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="Western Region (Mumbai/Pune)">Western Region (Mumbai/Pune)</option>
                  <option value="Northern Region (New Delhi)">Northern Region (New Delhi)</option>
                  <option value="Southern Region (Chennai)">Southern Region (Chennai)</option>
                  <option value="Eastern Region (Kolkata)">Eastern Region (Kolkata)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#102A56] hover:bg-[#1769E0] text-white font-bold"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
