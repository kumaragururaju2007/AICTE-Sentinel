import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import {
  initialInstitutionProfile,
  initialApplications,
  initialDeficiencies,
  initialDocuments,
  initialUndertakings,
  initialLeaseDocuments,
  initialEvcInspectionData,
  initialNotifications,
  initialAuditLogs,
  mockSupportTickets
} from '../../../data/institutionMockData';
import { useApplicationContext } from '../../../context/ApplicationContext';

const InstitutionContext = createContext(null);

export function InstitutionProvider({ children }) {
  // Try to read from shared central ApplicationContext if wrapped
  let appContext = null;
  try {
    appContext = useApplicationContext();
  } catch (e) {
    appContext = null;
  }

  const [profile, setProfile] = useState(initialInstitutionProfile);
  const [localApplications, setLocalApplications] = useState(initialApplications);
  const [localDeficiencies, setLocalDeficiencies] = useState(initialDeficiencies);
  const [documents, setDocuments] = useState(initialDocuments);
  const [undertakings, setUndertakings] = useState(initialUndertakings);
  const [leaseDocuments, setLeaseDocuments] = useState(initialLeaseDocuments);
  const [evcData, setEvcData] = useState(initialEvcInspectionData);
  const [localNotifications, setLocalNotifications] = useState(initialNotifications);
  const [localAuditLogs, setLocalAuditLogs] = useState(initialAuditLogs);
  const [supportTickets, setSupportTickets] = useState(mockSupportTickets);

  // Sync with Supabase documents vault on mount
  useEffect(() => {
    let active = true;
    async function loadVaultDocuments() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (!error && data && data.length > 0 && active) {
          const mappedDocs = data.map(d => ({
            id: d.id,
            name: d.document_name,
            document_name: d.document_name,
            category: d.document_type || 'Other Supporting Documents',
            document_type: d.document_type || 'Other Supporting Documents',
            subCategory: 'Statutory Verification Vault',
            uploadedDate: d.uploaded_at ? d.uploaded_at.split('T')[0] : '2026-10-25',
            expiryDate: d.expiry_date || '2028-12-31',
            fileSize: '3.4 MB',
            fileType: 'PDF',
            version: 'v1.0',
            verificationStatus: d.verification_status === 'APPROVED' ? 'Verified' : d.verification_status === 'REJECTED' ? 'Expired' : 'Under Scrutiny',
            statusCode: d.verification_status === 'APPROVED' ? 'verified' : 'in_review',
            storage_path: d.storage_path,
            relatedApplicationId: d.application_id,
            mandatory: true,
            remarks: 'Stored in AICTE Sentinel secure cryptographic vault.',
          }));

          setDocuments(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newOnes = mappedDocs.filter(m => !existingIds.has(m.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (e) {
        // Fallback to local documents if offline
      }
    }
    loadVaultDocuments();
    return () => { active = false; };
  }, []);

  // Use shared context state if available, else local
  const applications = appContext ? appContext.applications : localApplications;
  const deficiencies = appContext ? appContext.deficiencies : localDeficiencies;
  const notifications = appContext ? appContext.notifications : localNotifications;
  const auditLogs = appContext ? appContext.auditLogs : localAuditLogs;

  // Helper to add audit entry
  const logAuditAction = (action, details) => {
    if (appContext && appContext.appendAuditLog) {
      appContext.appendAuditLog(action, details, profile.applicationId || 'INST-01');
      return;
    }
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action,
      details,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true,
      }) + ' IST',
      user: `${profile.principal.name} (Director)`,
      ip: '14.139.183.12 (Campus Gateway)',
    };
    setLocalAuditLogs(prev => [newEntry, ...prev]);
  };

  // Add new application
  const addApplication = (appData) => {
    if (appContext && appContext.submitNewApplication) {
      const createdApp = appContext.submitNewApplication(appData);
      return createdApp?.id || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: newId,
      applicationNumber: newId,
      title: appData.programName ? `${appData.applicationType} - ${appData.programName}` : appData.applicationType,
      type: appData.applicationType || 'New Program Approval',
      applicationType: appData.applicationType || 'New Program Approval',
      academicYear: appData.academicYear || '2025-26',
      submissionDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Application Submitted',
      statusCode: 'submitted',
      currentStage: 1,
      totalStages: 6,
      assignedOfficer: 'Pending Regional Allocation',
      priority: appData.priority || 'Normal',
      programName: appData.programName || 'New Technical Programme',
      programLevel: appData.level || 'UG',
      discipline: appData.discipline || 'Engineering & Technology',
      intake: appData.intake ? parseInt(appData.intake) : 60,
      duration: appData.duration ? `${appData.duration} Years` : '4 Years',
      fees: appData.tuitionFee ? `₹${parseInt(appData.tuitionFee).toLocaleString()} / year` : 'Government Approved Scales',
      category: appData.level ? `${appData.level} Programme` : 'Technical',
      deficiencyCount: 0,
      stages: [
        { id: 1, name: 'Application Submitted', status: 'in_progress', date: new Date().toISOString().split('T')[0], authority: 'Central Portal Automated Gateway', remarks: 'Application successfully queued for scrutiny.', slaDays: '3 Days SLA' },
        { id: 2, name: 'Initial Scrutiny', status: 'pending', date: null, authority: 'Regional Scrutiny Cell', remarks: null, slaDays: '7 Days' },
        { id: 3, name: 'Deficiency Review', status: 'pending', date: null, authority: null, remarks: null, slaDays: '15 Days' },
        { id: 4, name: 'EVC / Inspection', status: 'pending', date: null, authority: null, remarks: null, slaDays: '21 Days' },
        { id: 5, name: 'Committee Review', status: 'pending', date: null, authority: null, remarks: null, slaDays: '10 Days' },
        { id: 6, name: 'Final Decision', status: 'pending', date: null, authority: null, remarks: null, slaDays: '7 Days' },
      ],
      ...appData,
    };

    setLocalApplications(prev => [newApp, ...prev]);

    const newNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'application',
      title: `Application Registered: ${newApp.id}`,
      message: `Your application for ${newApp.programName} has been submitted and queued for scrutiny review.`,
      date: new Date().toISOString(),
      read: false,
      priority: 'medium',
      relatedPath: '/institution/applications',
      applicationId: newId,
    };
    setLocalNotifications(prev => [newNotification, ...prev]);

    logAuditAction('New Application Submitted', `Submitted application ${newId} (${newApp.title})`);
    return newId;
  };

  // Submit response for a deficiency
  const submitDeficiencyResponse = (deficiencyId, responseText, uploadedFiles = []) => {
    if (appContext && appContext.submitDeficiencyResponse) {
      appContext.submitDeficiencyResponse(deficiencyId, responseText, uploadedFiles);
      return;
    }

    setLocalDeficiencies(prev => prev.map(def => {
      if (def.id === deficiencyId) {
        return {
          ...def,
          status: 'Submitted / Under Review',
          statusCode: 'in_review',
          response: responseText,
          submittedFiles: uploadedFiles.map(f => f.name || f),
          respondedDate: new Date().toISOString().split('T')[0],
        };
      }
      return def;
    }));

    const targetDef = deficiencies.find(d => d.id === deficiencyId);
    if (targetDef) {
      logAuditAction('Deficiency Response Submitted', `Submitted clarification for ${deficiencyId} on application ${targetDef.applicationId}`);

      const notif = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'deficiency',
        title: `Response Received for ${deficiencyId}`,
        message: `Your response with ${uploadedFiles.length} supporting attachment(s) has been forwarded to ${targetDef.officerName}.`,
        date: new Date().toISOString(),
        read: false,
        priority: 'high',
        relatedPath: '/institution/deficiencies',
        applicationId: targetDef.applicationId,
      };
      setLocalNotifications(prev => [notif, ...prev]);
    }
  };

  // Upload/add document
  const addDocument = (docData) => {
    const newDoc = {
      id: `DOC-2026-${Math.floor(200 + Math.random() * 800)}`,
      name: docData.name || 'Uploaded Institutional Document',
      document_name: docData.name || 'Uploaded Institutional Document',
      category: docData.category || 'Other Supporting Documents',
      document_type: docData.category || 'Other Supporting Documents',
      subCategory: docData.subCategory || 'General',
      uploadedDate: new Date().toISOString().split('T')[0],
      expiryDate: docData.expiryDate || '2028-12-31',
      fileSize: docData.fileSize || '2.5 MB',
      fileType: docData.fileType || 'PDF',
      version: 'v1.0',
      verificationStatus: 'Under Scrutiny',
      statusCode: 'in_review',
      relatedApplicationId: docData.relatedApplicationId || null,
      mandatory: Boolean(docData.mandatory),
      remarks: docData.remarks || 'Freshly uploaded document pending verification.',
    };

    setDocuments(prev => [newDoc, ...prev]);
    logAuditAction('Document Uploaded', `Uploaded ${newDoc.name} under ${newDoc.category}`);
    return newDoc;
  };

  // Delete document
  const deleteDocument = (docId) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (doc) {
      logAuditAction('Document Removed', `Removed document ${doc.name || doc.document_name} (${docId})`);
      if (typeof docId === 'string' && docId.includes('-') && docId.length > 20) {
        supabase.from('documents').delete().eq('id', docId).then(() => {}).catch(() => {});
      }
    }
  };

  // Submit undertaking evidence
  const submitUndertakingEvidence = (undertakingId, fileInfo) => {
    setUndertakings(prev => prev.map(u => {
      if (u.id === undertakingId) {
        return {
          ...u,
          complianceStatus: 'Submitted',
          evidenceStatus: `Submitted: ${fileInfo.name || 'Evidence Document'}`,
          submissionDate: new Date().toISOString().split('T')[0],
          officerRemark: 'Evidence received. Awaiting officer verification.',
        };
      }
      return u;
    }));

    const targetUnd = undertakings.find(u => u.id === undertakingId);
    if (targetUnd) {
      logAuditAction('Undertaking Evidence Submitted', `Submitted compliance evidence for ${targetUnd.title}`);
    }
  };

  // Renew lease document
  const renewLeaseDocument = (leaseId, renewalYears = 30) => {
    setLeaseDocuments(prev => prev.map(l => {
      if (l.id === leaseId) {
        const newExpiry = new Date();
        newExpiry.setFullYear(newExpiry.getFullYear() + renewalYears);
        return {
          ...l,
          expiryDate: newExpiry.toISOString().split('T')[0],
          remainingDays: renewalYears * 365,
          validityStatus: 'Valid',
          statusCode: 'valid',
          actionRequired: 'Renewal Supplemental Deed Registered with Sub-Registrar.',
        };
      }
      return l;
    }));

    logAuditAction('Lease Renewal Action', `Initiated & registered renewal for lease record ${leaseId}`);
  };

  // Toggle EVC checklist item
  const toggleEvcChecklistItem = (itemId) => {
    setEvcData(prev => ({
      ...prev,
      preparationChecklist: prev.preparationChecklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Notifications management
  const markNotificationAsRead = (notifId) => {
    setLocalNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notifId) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // Profile update
  const updateInstitutionProfile = (updatedFields) => {
    setProfile(prev => ({
      ...prev,
      ...updatedFields,
      principal: {
        ...prev.principal,
        ...(updatedFields.principal || {}),
      },
      authorizedRepresentative: {
        ...prev.authorizedRepresentative,
        ...(updatedFields.authorizedRepresentative || {}),
      },
    }));
    logAuditAction('Profile Updated', 'Institution profile details updated by authorized executive');
  };

  // Add support ticket
  const addSupportTicket = (ticketData) => {
    const newTicket = {
      id: `TKT-${Date.now().toString().slice(-4)}`,
      subject: ticketData.subject,
      category: ticketData.category || 'Technical Grievance',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open',
      statusCode: 'open',
      priority: ticketData.priority || 'Medium',
      lastReply: 'Ticket received and queued for Sentinel Helpdesk Support Officer.',
      description: ticketData.description,
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    logAuditAction('Support Ticket Raised', `Raised ticket ${newTicket.id}: ${newTicket.subject}`);
    return newTicket.id;
  };

  // Calculated statistics
  const stats = useMemo(() => {
    const list = Array.isArray(applications) ? applications : [];
    const pendingApps = list.filter(a => {
      const s = String(a.status || '').toLowerCase();
      return !s.includes('approv') && !s.includes('reject');
    }).length;
    const approvedApps = list.filter(a => String(a.status || '').toLowerCase().includes('approv')).length;
    const activeDeficiencies = (deficiencies || []).filter(d => String(d.status || '').toLowerCase().includes('pending')).length;
    const unreadNotifs = (notifications || []).filter(n => !n.read).length;

    // Upcoming obligations: active deficiencies + expiring leases (< 180 days) + pending undertakings
    const expiringLeases = (leaseDocuments || []).filter(l => (l.remainingDays || 365) <= 180).length;
    const pendingUndertakings = (undertakings || []).filter(u => {
      const st = String(u.complianceStatus || '').toLowerCase();
      return st.includes('pend') || st.includes('overdue');
    }).length;
    const totalObligations = activeDeficiencies + expiringLeases + pendingUndertakings;

    return {
      totalApplications: list.length,
      pendingReview: pendingApps,
      approvedApplications: approvedApps,
      upcomingObligations: totalObligations,
      complianceScore: 89,
      activeDeficiencies,
      expiringDocuments: expiringLeases,
      unreadNotifications: unreadNotifs,
    };
  }, [applications, deficiencies, leaseDocuments, undertakings, notifications]);

  const value = {
    profile,
    applications,
    deficiencies,
    documents,
    undertakings,
    leaseDocuments,
    evcData,
    notifications,
    auditLogs,
    supportTickets,
    stats,
    addApplication,
    submitDeficiencyResponse,
    addDocument,
    deleteDocument,
    submitUndertakingEvidence,
    renewLeaseDocument,
    toggleEvcChecklistItem,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    updateInstitutionProfile,
    addSupportTicket,
    logAuditAction,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
}
