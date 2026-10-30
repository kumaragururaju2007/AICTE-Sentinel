/**
 * AICTE Sentinel - System Administrator Mock Dataset
 * Project: AICTE Sentinel (Intelligent Approval & Compliance Automation)
 * Team: TEAM VALORA | Smart India Hackathon 2026
 * 
 * DISCLAIMER: This is synthetic demonstration data calibrated for AICTE regulatory
 * governance & system administration.
 */

export const ADMIN_KPI_METRICS = {
  totalInstitutions: 1420,
  totalApplications: 1850,
  applicationsPending: 245,
  applicationsCompleted: 1605,
  overdueObligations: 14,
  activeOfficers: 48,
  systemUptime: '99.98%',
  auditChainBlocks: 5
};

export const ADMIN_PROFILE = {
  id: 'ADMIN-HQ-001',
  name: 'Shri Amitabh Sharma',
  designation: 'Chief Technology Administrator',
  department: 'IT & Regulatory Policy - AICTE HQ New Delhi',
  email: 'amitabh.sharma@aicte-india.org',
  role: 'SYSTEM_ADMINISTRATOR',
  jurisdiction: 'National Central Bureau (All Regions)',
  lastAuditVerification: '2026-10-30 08:00 IST (All 5 Blocks Valid)'
};

export const INSTITUTIONS_MASTER_LIST = [
  {
    permanentId: '1-43219081',
    name: 'Apex Institute of Technology & Management',
    region: 'Western (Mumbai/Pune)',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'Engineering & Technology (UG/PG)',
    headName: 'Dr. Ramesh S. Patil',
    email: 'principal@apextech.edu.in',
    establishedYear: 2008,
    status: 'ACTIVE_UNDER_SCRUTINY',
    activeApplications: 1,
    complianceScore: 78,
    complianceRating: 'GOOD_STANDING'
  },
  {
    permanentId: '1-89765412',
    name: 'Delhi Institute of Engineering & Advanced Sciences',
    region: 'Northern (Delhi NCR)',
    state: 'Delhi NCR',
    city: 'New Delhi',
    category: 'Engineering & Technology (UG)',
    headName: 'Prof. Anita Sharma',
    email: 'director@dieas.ac.in',
    establishedYear: 2004,
    status: 'ACTIVE_EVC_SCHEDULED',
    activeApplications: 1,
    complianceScore: 92,
    complianceRating: 'EXEMPLARY'
  },
  {
    permanentId: '1-99882314',
    name: 'Kalinga Institute of Polytechnic & Technology',
    region: 'Eastern (Kolkata/Bhubaneswar)',
    state: 'Odisha',
    city: 'Bhubaneswar',
    category: 'Diploma in Engineering',
    headName: 'Dr. P. K. Rout',
    email: 'principal@kalingapoly.edu.in',
    establishedYear: 2012,
    status: 'DEFICIENT_OVERDUE',
    activeApplications: 1,
    complianceScore: 48,
    complianceRating: 'ACTION_REQUIRED'
  },
  {
    permanentId: '1-33445511',
    name: 'St. Xavier Institute of Management Studies',
    region: 'Western (Goa)',
    state: 'Goa',
    city: 'Panaji',
    category: 'Management (MBA/PGDM)',
    headName: 'Fr. Anthony D’Souza',
    email: 'director@stxaviers-mgmt.ac.in',
    establishedYear: 2015,
    status: 'ACTIVE_CLEAN',
    activeApplications: 1,
    complianceScore: 88,
    complianceRating: 'GOOD_STANDING'
  },
  {
    permanentId: '1-66778899',
    name: 'Vellore Advanced Science & Engineering Academy',
    region: 'Southern (Chennai)',
    state: 'Tamil Nadu',
    city: 'Vellore',
    category: 'Engineering & Technology (UG/PG)',
    headName: 'Dr. K. Senthil Kumar',
    email: 'principal@vellore-science.edu.in',
    establishedYear: 1999,
    status: 'APPROVED_EOA_ISSUED',
    activeApplications: 0,
    complianceScore: 96,
    complianceRating: 'EXEMPLARY'
  }
];

export const OFFICERS_DIRECTORY = [
  {
    id: 'OFFICER-001',
    name: 'Dr. Rajesh Kumar',
    designation: 'Senior Scrutiny Officer',
    region: 'Western Region (Mumbai/Pune)',
    email: 'rajesh.kumar@aicte-india.org',
    activeCases: 8,
    completedCycle: 14,
    status: 'ACTIVE',
    role: 'REGIONAL_OFFICER'
  },
  {
    id: 'OFFICER-002',
    name: 'Prof. S. K. Mahajan',
    designation: 'EVC Regional Coordinator',
    region: 'Northern Region (Delhi NCR)',
    email: 'sk.mahajan@aicte-india.org',
    activeCases: 12,
    completedCycle: 22,
    status: 'ACTIVE',
    role: 'EVC_COORDINATOR'
  },
  {
    id: 'OFFICER-003',
    name: 'Mrs. Lakshmi Narayanan',
    designation: 'Senior Scrutiny Officer',
    region: 'Southern Region (Chennai)',
    email: 'lakshmi.n@aicte-india.org',
    activeCases: 6,
    completedCycle: 18,
    status: 'ACTIVE',
    role: 'REGIONAL_OFFICER'
  },
  {
    id: 'OFFICER-004',
    name: 'Prof. K. V. S. Murthy',
    designation: 'Bureau Officer / Approval Supervisor',
    region: 'Central Bureau (HQ New Delhi)',
    email: 'kvs.murthy@aicte-india.org',
    activeCases: 42,
    completedCycle: 85,
    status: 'ACTIVE',
    role: 'BUREAU_OFFICER'
  }
];

export const COMMITTEES_ROSTER = [
  {
    committeeId: 'COM-WEST-01',
    name: 'Western Bureau Technical Inspection Panel A',
    discipline: 'Computer Science & AI / Mechanical',
    chairperson: 'Prof. Anjali Deshpande (COEP Pune)',
    membersCount: 3,
    status: 'EMPANELLED',
    assignedVisits: 4,
    maxCapacity: 6,
    conflictClearanceStatus: 'VERIFIED'
  },
  {
    committeeId: 'COM-NORTH-02',
    name: 'Northern Bureau Infrastructure & Safety Panel B',
    discipline: 'Civil / Architecture / Safety NOC',
    chairperson: 'Prof. K. G. Radhakrishnan (IIT Delhi)',
    membersCount: 3,
    status: 'ACTIVE_FIELD_VISIT',
    assignedVisits: 5,
    maxCapacity: 5,
    conflictClearanceStatus: 'VERIFIED'
  },
  {
    committeeId: 'COM-SOUTH-01',
    name: 'Southern Bureau Electronics & Electrical Panel',
    discipline: 'ECE / VLSI / Power Systems',
    chairperson: 'Dr. P. Balachandran (NIT Trichy)',
    membersCount: 2,
    status: 'AVAILABLE_POOL',
    assignedVisits: 2,
    maxCapacity: 5,
    conflictClearanceStatus: 'VERIFIED'
  }
];

export const RBAC_PERMISSIONS_MATRIX = [
  {
    role: 'INSTITUTION_USER',
    roleLabel: 'Applying Institution (Principal/Director)',
    permissions: [
      { code: 'APP_CREATE', name: 'Create & Submit Application', allowed: true },
      { code: 'DOC_UPLOAD', name: 'Upload Documents & Undertakings', allowed: true },
      { code: 'DEF_RESPOND', name: 'Respond to Deficiencies', allowed: true },
      { code: 'SCRUTINY_DECISION', name: 'Conduct Document Scrutiny', allowed: false },
      { code: 'EVC_SCHEDULE', name: 'Schedule EVC Committee', allowed: false },
      { code: 'RULE_CONFIGURE', name: 'Configure Workflow Rules', allowed: false },
      { code: 'AUDIT_EXPORT', name: 'Export Tamper-Evident Evidence Pack', allowed: false }
    ]
  },
  {
    role: 'REGIONAL_OFFICER',
    roleLabel: 'Regional Scrutiny Officer',
    permissions: [
      { code: 'APP_CREATE', name: 'Create & Submit Application', allowed: false },
      { code: 'DOC_UPLOAD', name: 'Upload Documents & Undertakings', allowed: false },
      { code: 'DEF_RESPOND', name: 'Respond to Deficiencies', allowed: false },
      { code: 'SCRUTINY_DECISION', name: 'Conduct Document Scrutiny', allowed: true },
      { code: 'EVC_SCHEDULE', name: 'Schedule EVC Committee', allowed: false },
      { code: 'RULE_CONFIGURE', name: 'Configure Workflow Rules', allowed: false },
      { code: 'AUDIT_EXPORT', name: 'Export Tamper-Evident Evidence Pack', allowed: true }
    ]
  },
  {
    role: 'EVC_COORDINATOR',
    roleLabel: 'EVC Logistics Coordinator',
    permissions: [
      { code: 'APP_CREATE', name: 'Create & Submit Application', allowed: false },
      { code: 'DOC_UPLOAD', name: 'Upload Documents & Undertakings', allowed: false },
      { code: 'DEF_RESPOND', name: 'Respond to Deficiencies', allowed: false },
      { code: 'SCRUTINY_DECISION', name: 'Conduct Document Scrutiny', allowed: false },
      { code: 'EVC_SCHEDULE', name: 'Schedule EVC Committee', allowed: true },
      { code: 'RULE_CONFIGURE', name: 'Configure Workflow Rules', allowed: false },
      { code: 'AUDIT_EXPORT', name: 'Export Tamper-Evident Evidence Pack', allowed: true }
    ]
  },
  {
    role: 'BUREAU_OFFICER',
    roleLabel: 'Bureau Officer / Approval Supervisor',
    permissions: [
      { code: 'APP_CREATE', name: 'Create & Submit Application', allowed: false },
      { code: 'DOC_UPLOAD', name: 'Upload Documents & Undertakings', allowed: false },
      { code: 'DEF_RESPOND', name: 'Respond to Deficiencies', allowed: false },
      { code: 'SCRUTINY_DECISION', name: 'Conduct Document Scrutiny', allowed: true },
      { code: 'EVC_SCHEDULE', name: 'Schedule EVC Committee', allowed: true },
      { code: 'RULE_CONFIGURE', name: 'Configure Workflow Rules', allowed: false },
      { code: 'AUDIT_EXPORT', name: 'Export Tamper-Evident Evidence Pack', allowed: true }
    ]
  },
  {
    role: 'SYSTEM_ADMINISTRATOR',
    roleLabel: 'System Administrator (IT Governance)',
    permissions: [
      { code: 'APP_CREATE', name: 'Create & Submit Application', allowed: false },
      { code: 'DOC_UPLOAD', name: 'Upload Documents & Undertakings', allowed: false },
      { code: 'DEF_RESPOND', name: 'Respond to Deficiencies', allowed: false },
      { code: 'SCRUTINY_DECISION', name: 'Conduct Document Scrutiny', allowed: false },
      { code: 'EVC_SCHEDULE', name: 'Schedule EVC Committee', allowed: false },
      { code: 'RULE_CONFIGURE', name: 'Configure Workflow Rules', allowed: true },
      { code: 'AUDIT_EXPORT', name: 'Export Tamper-Evident Evidence Pack', allowed: true }
    ]
  }
];

export const WORKFLOW_CONFIGURATIONS = [
  {
    workflowId: 'WF-SCRUTINY-EVC-V1',
    name: 'Standard Technical Degree (UG/PG) Approval Flow',
    routeType: 'Scrutiny + EVC',
    applicationType: 'Engineering & Technology (UG/PG)',
    version: '1.2.0',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2025-12-31',
    publishedStatus: 'ACTIVE_PUBLISHED',
    twoPersonApproval: true,
    approvedBy: 'Member Secretary, AICTE',
    stages: [
      { order: 1, id: 'INGESTION', name: 'Application Ingestion', ownerRole: 'INSTITUTION', deadlineDays: 0 },
      { order: 2, id: 'SCRUTINY', name: 'Document Scrutiny Desk', ownerRole: 'REGIONAL_OFFICER', deadlineDays: 15 },
      { order: 3, id: 'DEFICIENCY', name: 'Deficiency Correction Window', ownerRole: 'INSTITUTION', deadlineDays: 10 },
      { order: 4, id: 'EVC', name: 'Expert Visit Committee (EVC)', ownerRole: 'EVC_COORDINATOR', deadlineDays: 20 },
      { order: 5, id: 'SAC_SHC', name: 'Standing Hearing Committee', ownerRole: 'BUREAU_OFFICER', deadlineDays: 10 },
      { order: 6, id: 'FINAL_DECISION', name: 'Issuance of EoA / Letter', ownerRole: 'COMPETENT_AUTHORITY', deadlineDays: 7 }
    ],
    yamlPolicy: `workflow:
  id: "WF-SCRUTINY-EVC-V1"
  version: "1.2.0"
  type: "SCRUTINY_PLUS_EVC"
  effective_dates:
    from: "2024-01-01"
    to: "2025-12-31"
  governance:
    requires_two_person_approval: true
    mandatory_deficiency_reason: true
  stages:
    - id: "SCRUTINY"
      sla_days: 15
      business_calendar_aware: true
    - id: "EVC"
      sla_days: 20
      conflict_of_interest_required: true`
  },
  {
    workflowId: 'WF-ONLY-SCRUTINY-V2',
    name: 'Fast-Track Extension of Approval (Clean Track Record)',
    routeType: 'Only Scrutiny',
    applicationType: 'NBA Accredited / Tier-1 Technical Institutes',
    version: '2.0.1',
    effectiveFrom: '2024-06-01',
    effectiveTo: '2026-05-31',
    publishedStatus: 'ACTIVE_PUBLISHED',
    twoPersonApproval: true,
    approvedBy: 'Vice Chairman, AICTE',
    stages: [
      { order: 1, id: 'INGESTION', name: 'Application Ingestion', ownerRole: 'INSTITUTION', deadlineDays: 0 },
      { order: 2, id: 'DIGITAL_SCRUTINY', name: 'Digital Desk Scrutiny', ownerRole: 'REGIONAL_OFFICER', deadlineDays: 10 },
      { order: 3, id: 'AUTO_APPROVAL', name: 'System Assisted EoA Dispatch', ownerRole: 'COMPETENT_AUTHORITY', deadlineDays: 5 }
    ],
    yamlPolicy: `workflow:
  id: "WF-ONLY-SCRUTINY-V2"
  version: "2.0.1"
  type: "ONLY_SCRUTINY_FAST_TRACK"
  stages:
    - id: "DIGITAL_SCRUTINY"
      sla_days: 10
      business_calendar_aware: true`
  },
  {
    workflowId: 'WF-EVC-SAC-SHC-V1',
    name: 'Complaint / Quality Audit Ad-Hoc Inspection Flow',
    routeType: 'EVC + SAC/SHC',
    applicationType: 'Institutions with Formal Complaints / Show Cause',
    version: '1.0.4',
    effectiveFrom: '2024-03-15',
    effectiveTo: '2025-12-31',
    publishedStatus: 'ACTIVE_PUBLISHED',
    twoPersonApproval: true,
    approvedBy: 'Chief Vigilance Officer, AICTE',
    stages: [
      { order: 1, id: 'SURPRISE_EVC', name: 'Unannounced EVC Inspection', ownerRole: 'EVC_COORDINATOR', deadlineDays: 7 },
      { order: 2, id: 'SAC_HEARING', name: 'Standing Appellate Committee Hearing', ownerRole: 'BUREAU_OFFICER', deadlineDays: 15 },
      { order: 3, id: 'COUNCIL_DECISION', name: 'Final Statutory Adjudication', ownerRole: 'COMPETENT_AUTHORITY', deadlineDays: 10 }
    ],
    yamlPolicy: `workflow:
  id: "WF-EVC-SAC-SHC-V1"
  version: "1.0.4"
  type: "EVC_SAC_SHC_SPECIAL"
  stages:
    - id: "SURPRISE_EVC"
      sla_days: 7`
  }
];

export const SLA_REMINDER_LADDER = [
  { trigger: 'T-30 Days', offsetDays: 30, channel: 'IN_APP & EMAIL', targetRole: 'INSTITUTION', active: true, description: 'Advance notice for document expiration or upcoming compliance deadline.' },
  { trigger: 'T-15 Days', offsetDays: 15, channel: 'IN_APP & EMAIL', targetRole: 'INSTITUTION', active: true, description: 'Mid-term reminder for pending submission or EVC planning window.' },
  { trigger: 'T-7 Days', offsetDays: 7, channel: 'IN_APP & SMS_SIMULATED', targetRole: 'REGIONAL_OFFICER & INSTITUTION', active: true, description: 'Urgent notice: SLA deadline approaching within 1 week.' },
  { trigger: 'T-1 Day', offsetDays: 1, channel: 'IN_APP_POPUP', targetRole: 'ASSIGNED_OFFICER', active: true, description: 'Critical 24-hour reminder before escalation to next authority.' },
  { trigger: 'Due Date (T+0)', offsetDays: 0, channel: 'SYSTEM_FLAG', targetRole: 'SYSTEM_ENGINE', active: true, description: 'Obligation enters Overdue state; triggers Level 1 escalation event.' },
  { trigger: 'Overdue Escalation (T+3)', offsetDays: 3, channel: 'ESCALATION_QUEUE', targetRole: 'BUREAU_SUPERVISOR', active: true, description: 'Administrative escalation to Bureau Supervisor with reason requirement.' }
];

export const AUDIT_LOGS_DATA = [
  {
    blockIndex: 1,
    eventId: 'EVT-001',
    user: 'Dr. Ramesh Patil (Principal)',
    role: 'INSTITUTION_USER',
    action: 'APPLICATION_SUBMITTED',
    relatedApplication: 'APP-2024-00145',
    timestamp: '2026-10-14 14:22:10 IST',
    eventType: 'LIFECYCLE_MUTATION',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    eventHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    chainStatus: 'VALID_CONTINUITY',
    notes: 'Electronic submission of EoA 2024-25 with 4 mandatory attachments.'
  },
  {
    blockIndex: 2,
    eventId: 'EVT-002',
    user: 'AICTE Sentinel Engine',
    role: 'SYSTEM_SCHEDULER',
    action: 'OBLIGATION_CREATED',
    relatedApplication: 'APP-2024-00145',
    timestamp: '2026-10-15 09:30:00 IST',
    eventType: 'OBLIGATION_CLOCK_START',
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    eventHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    chainStatus: 'VALID_CONTINUITY',
    notes: 'Initialized 15-day Scrutiny SLA Clock assigned to Dr. Rajesh Kumar (Western).'
  },
  {
    blockIndex: 3,
    eventId: 'EVT-003',
    user: 'Dr. Rajesh Kumar',
    role: 'REGIONAL_OFFICER',
    action: 'DEFICIENCY_RAISED',
    relatedApplication: 'APP-2024-00145',
    timestamp: '2026-10-25 14:30:00 IST',
    eventType: 'DEFICIENCY_NOTICE',
    previousHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    eventHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    chainStatus: 'VALID_CONTINUITY',
    notes: 'Deficiency DEF-2026-081 raised: Expired Fire Safety Certificate (Clause 2.14.3).'
  },
  {
    blockIndex: 4,
    eventId: 'EVT-004',
    user: 'Dr. Ramesh Patil (Principal)',
    role: 'INSTITUTION_USER',
    action: 'EVIDENCE_RESUBMITTED',
    relatedApplication: 'APP-2024-00145',
    timestamp: '2026-10-27 10:15:30 IST',
    eventType: 'EVIDENCE_ATTACHMENT',
    previousHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    eventHash: '2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9bbd011cf2b4b1727a',
    chainStatus: 'VALID_CONTINUITY',
    notes: 'Uploaded PCMC Fire Inspection Fee receipt and provisional clearance.'
  },
  {
    blockIndex: 5,
    eventId: 'EVT-005',
    user: 'AICTE Sentinel Scheduler',
    role: 'SYSTEM_WORKER',
    action: 'ALERT_DISPATCHED',
    relatedApplication: 'APP-2024-00145',
    timestamp: '2026-10-29 09:00:12 IST',
    eventType: 'IDEMPOTENT_NOTIFICATION',
    previousHash: '2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9bbd011cf2b4b1727a',
    eventHash: '9f83c60bee855b4e722b406e4099eed71f543666b6c00d41e7372cfbe8ee6d39',
    chainStatus: 'VALID_CONTINUITY',
    notes: 'Idempotency key IDEMP-OBL-101-T07 delivered to Regional Officer inbox.'
  }
];

