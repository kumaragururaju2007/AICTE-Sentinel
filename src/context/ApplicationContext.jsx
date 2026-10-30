import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { applicationService } from '../services/applicationService'
import { obligationService } from '../services/obligationService'
import { notificationService } from '../services/notificationService'
import { adminService } from '../services/adminService'

import {
  initialInstitutionProfile,
  initialApplications as initialInstApps,
  initialDeficiencies as initialInstDefs,
  initialDocuments as initialInstDocs,
  initialUndertakings as initialInstUndertakings,
  initialLeaseDocuments as initialInstLeases,
  initialEvcInspectionData as initialInstEvc,
  initialNotifications as initialInstNotifs,
  initialAuditLogs as initialInstAudit,
  mockSupportTickets
} from '../data/institutionMockData'

import {
  OFFICER_PROFILE,
  ASSIGNED_APPLICATIONS_LIST,
  DEFICIENCY_TICKETS,
  SCRUTINY_DETAILS
} from '../data/officerMockData'

import {
  ADMIN_PROFILE,
  AUDIT_LOGS_DATA,
  WORKFLOW_CONFIGURATIONS,
  SLA_REMINDER_LADDER
} from '../data/adminMockData'

// Simple helper to create deterministic SHA-256 hashes for demonstration
function generateMockSha256(seed) {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0')
  return `${hex}a9b8c7d6e5f41234567890abcdef1234567890abcdef1234567890ab${hex.slice(0, 4)}`
}

function mapSupabaseAppToUI(dbApp) {
  const isScrutiny = (dbApp.current_stage || '').toLowerCase().includes('scrutiny')
  const isEvc = (dbApp.current_stage || '').toLowerCase().includes('evc')
  const isDef = (dbApp.current_stage || '').toLowerCase().includes('deficiency') || dbApp.status === 'DEFICIENT'

  return {
    id: dbApp.id,
    applicationNumber: dbApp.application_number,
    institutionName: dbApp.institutions?.institution_name || 'Apex Institute of Technology & Management',
    permanentId: dbApp.institutions?.aicte_permanent_id || '1-43219081',
    region: 'Western',
    state: dbApp.institutions?.state || 'Maharashtra',
    district: dbApp.institutions?.district || 'Pune',
    applicationType: dbApp.application_type,
    type: dbApp.application_type,
    title: `${dbApp.application_type} - Engineering & Technology`,
    academicYear: dbApp.academic_year || '2026-27',
    currentStage: dbApp.current_stage || 'Document Scrutiny Desk',
    stageKey: isScrutiny ? 'scrutiny' : isEvc ? 'evc' : isDef ? 'deficiency' : 'scrutiny',
    submissionDate: dbApp.submitted_at ? dbApp.submitted_at.split('T')[0] : '2026-10-25',
    dueDate: '2026-11-20',
    daysLeft: 10,
    priority: 'HIGH',
    riskScore: isDef ? 72 : 35,
    status: dbApp.status === 'APPROVED' ? 'Final Decision' : isDef ? 'Deficiency Review' : isEvc ? 'EVC / Inspection' : 'Initial Scrutiny',
    statusCode: dbApp.status === 'APPROVED' ? 'approved' : isDef ? 'deficiency' : isEvc ? 'evc' : 'scrutiny',
    totalStages: 6,
    intakeRequested: 180,
    intakeApproved: 180,
    courseType: 'Computer Science & AI',
    programName: 'Computer Science & Engineering',
    programLevel: 'UG / PG',
    discipline: 'Engineering & Technology',
    fees: '₹1,25,000 / year',
    assignedOfficer: dbApp.profiles?.full_name || 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
    documentsCount: 5,
    verifiedDocsCount: isDef ? 3 : 5,
    flaggedDocsCount: isDef ? 1 : 0,
    deficiencyCount: isDef ? 1 : 0,
    slaStatus: 'ACTIVE',
    stages: [
      { id: 1, name: 'Application Ingestion & Payment', status: 'completed', date: dbApp.submitted_at?.split('T')[0] || '2026-10-25', authority: 'Gateway', remarks: 'Dossier ingested.', slaDays: '3 Days' },
      { id: 2, name: 'Document Scrutiny Desk', status: isScrutiny ? 'in_progress' : 'completed', date: '2026-10-26', authority: 'Regional Scrutiny Cell', remarks: 'Verifications underway.', slaDays: '10 Days' },
      { id: 3, name: 'Deficiency Clarification Window', status: isDef ? 'in_progress' : 'pending', date: null, authority: 'Scrutiny Officer', remarks: null, slaDays: '8 Days' },
      { id: 4, name: 'Expert Visit Committee (EVC)', status: isEvc ? 'in_progress' : 'pending', date: null, authority: 'EVC Committee', remarks: null, slaDays: '15 Days' },
      { id: 5, name: 'Standing Hearing Committee (SAC/SHC)', status: 'pending', date: null, authority: 'SAC / SHC', remarks: null, slaDays: '8 Days' },
      { id: 6, name: 'Final Approval / EoA Issuance', status: dbApp.status === 'APPROVED' ? 'completed' : 'pending', date: null, authority: 'Executive Committee', remarks: null, slaDays: '4 Days' }
    ]
  }
}

// Unified Initial applications
function getUnifiedInitialApplications() {
  return ASSIGNED_APPLICATIONS_LIST.map(app => ({
    ...app,
    title: `${app.applicationType} - ${app.courseType}`,
    type: app.applicationType,
    statusCode: app.stageKey === 'scrutiny' ? 'scrutiny' : app.stageKey === 'evc' ? 'evc' : 'deficiency',
    currentStage: app.currentStage || 'Initial Scrutiny',
    totalStages: 6,
    programName: app.courseType,
    programLevel: 'UG / PG',
    discipline: 'Engineering & Technology',
    intake: app.intakeRequested || 120,
    fees: '₹1,25,000 / year',
    stages: [
      { id: 1, name: 'Application Submitted', status: 'completed', date: app.submissionDate, authority: 'Central Gateway', remarks: 'Queued.', slaDays: '3 Days' },
      { id: 2, name: 'Initial Scrutiny', status: app.stageKey === 'scrutiny' ? 'in_progress' : 'completed', date: '2026-10-20', authority: 'Regional Scrutiny', remarks: 'Under review.', slaDays: '7 Days' },
      { id: 3, name: 'Deficiency Review', status: app.stageKey === 'deficiency' ? 'in_progress' : 'pending', date: null, authority: 'Scrutiny Officer', remarks: null, slaDays: '15 Days' },
      { id: 4, name: 'EVC / Inspection', status: app.stageKey === 'evc' ? 'in_progress' : 'pending', date: null, authority: 'EVC Committee', remarks: null, slaDays: '21 Days' },
      { id: 5, name: 'Committee Review', status: 'pending', date: null, authority: 'SAC / SHC', remarks: null, slaDays: '10 Days' },
      { id: 6, name: 'Final Decision', status: 'pending', date: null, authority: 'AICTE Executive Committee', remarks: null, slaDays: '7 Days' }
    ]
  }))
}

const ApplicationContext = createContext(null)

export function ApplicationProvider({ children }) {
  const [authRole, setAuthRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('sentinel_auth_role') || localStorage.getItem('sentinel_auth_role')
      if (saved) return saved
      if (window.location.pathname.startsWith('/officer')) return 'officer'
      if (window.location.pathname.startsWith('/admin')) return 'admin'
    }
    return 'institution'
  })

  const [applications, setApplications] = useState(getUnifiedInitialApplications)
  const [deficiencies, setDeficiencies] = useState(DEFICIENCY_TICKETS)
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS_DATA)
  const [notifications, setNotifications] = useState(initialInstNotifs)
  const [workflowRules, setWorkflowRules] = useState(WORKFLOW_CONFIGURATIONS)
  const [alertTemplates, setAlertTemplates] = useState(SLA_REMINDER_LADDER)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real records from Supabase on mount
  useEffect(() => {
    let active = true

    async function loadSupabaseData() {
      setIsLoading(true)
      try {
        const [liveApps, liveObligations, liveNotifs, liveAudit, liveRules] = await Promise.allSettled([
          applicationService.getApplications(),
          obligationService.getObligations(),
          notificationService.getMyNotifications(),
          adminService.getAuditLogs({ limit: 40 }),
          obligationService.getWorkflowRules(),
        ])

        if (active) {
          if (liveApps.status === 'fulfilled' && liveApps.value?.length > 0) {
            const mapped = liveApps.value.map(mapSupabaseAppToUI)
            setApplications(mapped)
          }

          if (liveNotifs.status === 'fulfilled' && liveNotifs.value?.length > 0) {
            const mappedNotifs = liveNotifs.value.map(n => ({
              id: n.id,
              type: n.notification_type?.toLowerCase() || 'system',
              title: n.title,
              message: n.message,
              date: n.created_at,
              read: n.is_read,
              priority: n.priority?.toLowerCase() || 'medium'
            }))
            setNotifications(mappedNotifs)
          }

          if (liveAudit.status === 'fulfilled' && liveAudit.value?.length > 0) {
            const mappedAudit = liveAudit.value.map((l, idx) => ({
              blockId: `#${String(idx + 1).padStart(3, '0')}`,
              timestamp: new Date(l.created_at).toLocaleString('en-IN') + ' IST',
              action: l.action,
              performedBy: l.profiles?.full_name || 'AICTE Regulatory System',
              notes: typeof l.new_value === 'object' ? JSON.stringify(l.new_value) : String(l.action),
              prevHash: generateMockSha256(l.id),
              eventHash: generateMockSha256(l.id + l.action),
              chainStatus: 'VERIFIED'
            }))
            setAuditLogs(mappedAudit)
          }

          if (liveRules.status === 'fulfilled' && liveRules.value?.length > 0) {
            setWorkflowRules(liveRules.value)
          }
        }
      } catch (err) {
        console.warn('[ApplicationContext] Supabase sync note:', err.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadSupabaseData()

    // ── Setup Supabase Realtime Subscriptions ──
    const appChannel = applicationService.subscribeToApplications((payload) => {
      if (payload.eventType === 'INSERT') {
        const newApp = mapSupabaseAppToUI(payload.new)
        setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)])
      } else if (payload.eventType === 'UPDATE') {
        setApplications(prev => prev.map(a => a.id === payload.new.id ? { ...a, currentStage: payload.new.current_stage, status: payload.new.status } : a))
      }
    })

    const oblChannel = obligationService.subscribeToObligations((payload) => {
      // Automatic update when obligations change
    })

    return () => {
      active = false
      supabase.removeChannel(appChannel)
      supabase.removeChannel(oblChannel)
    }
  }, [authRole])

  const setDemoRole = (role) => {
    setAuthRole(role)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sentinel_auth_role', role)
      localStorage.setItem('sentinel_auth_role', role)
    }
  }

  const appendAuditLog = async (action, details, targetId = 'SYS-GENESIS') => {
    const prevBlock = auditLogs[0] || { eventHash: '0000000000000000' }
    const nowIso = new Date().toISOString()
    const blockNum = auditLogs.length + 1
    const blockId = `#${String(blockNum).padStart(3, '0')}`
    const seed = `${prevBlock.eventHash}:${action}:${targetId}:${nowIso}`
    const eventHash = generateMockSha256(seed)

    let performer = 'Authorized Institution Principal'
    if (authRole === 'officer') performer = 'Dr. Rajesh Kumar (Senior Scrutiny Officer)'
    if (authRole === 'admin') performer = 'Admin Governance Engine'

    const newBlock = {
      blockId,
      timestamp: `${nowIso.split('T')[0]} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} IST`,
      applicationId: targetId,
      action,
      performedBy: performer,
      notes: details,
      prevHash: prevBlock.eventHash,
      eventHash,
      chainStatus: 'VERIFIED'
    }

    setAuditLogs(prev => [newBlock, ...prev])

    // Write to Supabase audit_logs in background
    try {
      await adminService.logAuditEvent(action, 'APPLICATION', null, null, { notes: details, targetId })
    } catch (e) {
      // offline fallback
    }
  }

  // 1. Institution submits a new application
  const submitNewApplication = (formData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newId = `APP-2026-${randomSuffix}`
    const today = new Date().toISOString().split('T')[0]

    const newApp = {
      id: newId,
      applicationNumber: newId,
      institutionName: initialInstitutionProfile.institutionName,
      permanentId: '1-10928374',
      region: 'Southern',
      state: 'Tamil Nadu',
      district: 'Tiruchirappalli',
      applicationType: formData.applicationType || 'New Program Approval',
      type: formData.applicationType || 'New Program Approval',
      title: formData.programName ? `${formData.applicationType || 'New Program Approval'} - ${formData.programName}` : `New Application ${newId}`,
      academicYear: formData.academicYear || '2026-27',
      currentStage: 'Document Scrutiny Desk',
      stageKey: 'scrutiny',
      submissionDate: today,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysLeft: 14,
      priority: formData.priority || 'HIGH',
      riskScore: 45,
      status: 'Initial Scrutiny',
      statusCode: 'scrutiny',
      intakeRequested: formData.intake ? parseInt(formData.intake) : 60,
      intakeApproved: formData.intake ? parseInt(formData.intake) : 60,
      courseType: formData.programName || 'Advanced Computing & Data Science',
      programName: formData.programName || 'Advanced Computing & Data Science',
      programLevel: formData.level || 'UG',
      discipline: formData.discipline || 'Engineering & Technology',
      assignedOfficer: 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
      documentsCount: 4,
      verifiedDocsCount: 0,
      flaggedDocsCount: 0,
      deficiencyCount: 0,
      slaStatus: 'ACTIVE',
      stages: [
        { id: 1, name: 'Application Submitted', status: 'completed', date: today, authority: 'Gateway', remarks: 'Validated.', slaDays: '3 Days' },
        { id: 2, name: 'Document Scrutiny Desk', status: 'in_progress', date: today, authority: 'Regional Scrutiny', remarks: 'Under evaluation.', slaDays: '7 Days' },
        { id: 3, name: 'Deficiency Review', status: 'pending', date: null, authority: 'Scrutiny Officer', remarks: null, slaDays: '15 Days' },
        { id: 4, name: 'EVC / Inspection', status: 'pending', date: null, authority: 'Inspection Committee', remarks: null, slaDays: '21 Days' },
        { id: 5, name: 'Committee Review', status: 'pending', date: null, authority: 'SAC / SHC', remarks: null, slaDays: '10 Days' },
        { id: 6, name: 'Final Decision', status: 'pending', date: null, authority: 'AICTE Executive Committee', remarks: null, slaDays: '7 Days' },
      ],
      ...formData
    }

    setApplications(prev => [newApp, ...prev])

    // Push notification
    const notif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'application',
      title: `Application Submitted: ${newId}`,
      message: `Your application for ${newApp.courseType || newApp.programName} has been assigned to Dr. Rajesh Kumar for Scrutiny review.`,
      date: new Date().toISOString(),
      read: false,
      priority: 'high',
      applicationId: newId,
      relatedPath: '/institution/applications'
    }
    setNotifications(prev => [notif, ...prev])

    appendAuditLog(
      'APPLICATION_SUBMISSION',
      `Submitted fresh application for ${newApp.courseType || newApp.programName} (Intake: ${newApp.intakeRequested})`,
      newId
    )

    // Persist to Supabase in background
    const defaultInstId = '4a1a6b0c-9821-4f1b-a5d2-03912a781011'
    applicationService.submitApplication({
      institutionId: defaultInstId,
      applicationType: formData.applicationType || 'Extension of Approval',
      academicYear: formData.academicYear || '2026-27'
    }).catch(e => {
      console.warn('[ApplicationContext] Supabase submit note:', e.message)
    })

    return newApp
  }

  // 2. Officer raises a deficiency
  const raiseDeficiency = ({ applicationId, title, description, category = 'Infrastructure & Laboratory', clauseRef = 'Chapter II, Clause 2.14.3', deadline = '2026-11-12' }) => {
    const defId = `DEF-2026-${Math.floor(100 + Math.random() * 900)}`
    const targetApp = applications.find(a => a.id === applicationId)

    const newDeficiency = {
      id: defId,
      applicationId,
      institutionName: targetApp ? targetApp.institutionName : initialInstitutionProfile.institutionName,
      title,
      description,
      category,
      clauseRef,
      severity: 'HIGH',
      priority: 'Critical',
      daysRemaining: 7,
      deadline,
      officerName: 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
      officerRemarks: description,
      status: 'Pending Response',
      statusCode: 'pending',
      messages: [
        {
          sender: 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
          role: 'officer',
          timestamp: 'Just now',
          content: `Formal Deficiency Notice issued under ${clauseRef}: ${description}`
        }
      ]
    }

    setDeficiencies(prev => [newDeficiency, ...prev])

    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'Deficiency Review',
          statusCode: 'deficiency',
          stageKey: 'deficiency',
          currentStage: 'Deficiency Clarification Window',
          deficiencyCount: (app.deficiencyCount || 0) + 1,
          stages: app.stages.map(st => st.id === 3 ? { ...st, status: 'in_progress' } : st)
        }
      }
      return app
    }))

    appendAuditLog(
      'DEFICIENCY_ISSUED',
      `Deficiency issued for ${applicationId}: ${title} (${clauseRef})`,
      applicationId
    )
  }

  // 3. Institution submits response to deficiency
  const submitDeficiencyResponse = (deficiencyId, responseText, uploadedFiles = []) => {
    let affectedAppId = null

    setDeficiencies(prev => prev.map(def => {
      if (def.id === deficiencyId) {
        affectedAppId = def.applicationId
        const newMsg = {
          sender: 'Authorized Institution Principal',
          role: 'institution',
          timestamp: 'Just now',
          content: responseText,
          attachments: uploadedFiles.map(f => f.name || f)
        }
        return {
          ...def,
          status: 'Under Review',
          statusCode: 'under_review',
          messages: [...(def.messages || []), newMsg]
        }
      }
      return def
    }))

    appendAuditLog(
      'DEFICIENCY_RESPONSE_SUBMITTED',
      `Institution responded to deficiency ${deficiencyId} with ${uploadedFiles.length} supporting attachments.`,
      affectedAppId || deficiencyId
    )
  }

  // 4. Officer verifies and resolves deficiency
  const resolveDeficiency = (deficiencyId, officerRemarks) => {
    let affectedAppId = null

    setDeficiencies(prev => prev.map(def => {
      if (def.id === deficiencyId) {
        affectedAppId = def.applicationId
        return {
          ...def,
          status: 'Resolved',
          statusCode: 'resolved',
          resolvedDate: new Date().toISOString().split('T')[0],
          officerRemarks: officerRemarks || 'Clarification documents verified and accepted.'
        }
      }
      return def
    }))

    if (affectedAppId) {
      setApplications(prev => prev.map(app => {
        if (app.id === affectedAppId) {
          const remainingDefs = Math.max(0, (app.deficiencyCount || 1) - 1)
          return {
            ...app,
            deficiencyCount: remainingDefs,
            status: remainingDefs === 0 ? 'Document Scrutiny Desk' : 'Deficiency Review',
            statusCode: remainingDefs === 0 ? 'scrutiny' : 'deficiency',
            stageKey: remainingDefs === 0 ? 'scrutiny' : 'deficiency'
          }
        }
        return app
      }))
    }

    appendAuditLog(
      'DEFICIENCY_RESOLVED',
      `Officer Dr. Rajesh Kumar verified and resolved deficiency ${deficiencyId}`,
      affectedAppId || deficiencyId
    )
  }

  // 5. Update application stage directly
  const updateApplicationStage = async (appId, newStage, newStatus, remarks) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          currentStage: newStage,
          status: newStatus,
          stageKey: newStage.toLowerCase().includes('evc') ? 'evc' : newStage.toLowerCase().includes('scrutiny') ? 'scrutiny' : 'approved'
        }
      }
      return app
    }))

    appendAuditLog(
      'APPLICATION_STAGE_TRANSITION',
      `Stage transitioned to ${newStage} (${newStatus}) - ${remarks || 'Statutory review'}`,
      appId
    )

    // Persist to Supabase if it's a UUID
    if (appId.includes('-') && appId.length === 36) {
      try {
        await applicationService.updateStage({
          applicationId: appId,
          newStage,
          newStatus: newStatus.toUpperCase().replace(/\s+/g, '_'),
          remarks
        })
      } catch (e) {
        console.warn('[ApplicationContext] Stage update note:', e.message)
      }
    }
  }

  const currentUser = {
    role: authRole,
    name: authRole === 'officer' ? 'Dr. Rajesh Kumar' : authRole === 'admin' ? 'System Administrator' : 'National Institute of Technology, Trichy',
    designation: authRole === 'officer' ? 'Senior Regional Scrutiny Officer (Western Region)' : authRole === 'admin' ? 'National Regulatory & IT Administrator' : 'Principal & Head of Institution',
    email: authRole === 'officer' ? 'officer@aicte-india.org' : authRole === 'admin' ? 'admin@aicte.gov.in' : 'principal@institution.ac.in',
    region: 'Western Region / Southern Bureau',
    employeeId: 'AICTE-REG-2026-0814'
  }

  const value = {
    authRole,
    currentUser,
    setDemoRole,
    applications,
    deficiencies,
    auditLogs,
    notifications,
    workflowRules,
    alertTemplates,
    isLoading,
    submitNewApplication,
    raiseDeficiency,
    submitDeficiencyResponse,
    resolveDeficiency,
    updateApplicationStage,
    appendAuditLog
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplicationContext() {
  const ctx = useContext(ApplicationContext)
  if (!ctx) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider')
  }
  return ctx
}
