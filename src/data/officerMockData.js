/**
 * AICTE Sentinel - Officer Portal Mock Dataset
 * Project: AICTE Sentinel (Intelligent Approval & Compliance Automation)
 * Team: TEAM VALORA | Smart India Hackathon 2026
 * 
 * DISCLAIMER: This is synthetic demonstration data calibrated for AICTE approval
 * workflows (APH 2024-25). Not an official regulatory finding.
 */

export const OFFICER_PROFILE = {
  id: 'OFFICER-WR-042',
  name: 'Dr. Rajesh Kumar',
  designation: 'Senior Scrutiny Officer',
  department: 'Bureau of Approval - Western Regional Office',
  email: 'rajesh.kumar@aicte-india.org',
  phone: '+91 22 2285 5412',
  jurisdiction: 'Maharashtra & Goa (Western Bureau)',
  officeAddress: 'Industrial Assurance Building, 2nd Floor, V.N. Road, Churchgate, Mumbai 400020',
  activeCaseload: 8,
  pendingScrutiny: 4,
  evcScheduled: 2,
  deficienciesActive: 2,
  lastLogin: '2026-10-30 10:15 IST'
};

export const OFFICER_KPI_METRICS = {
  totalAssigned: 8,
  pendingScrutiny: 4,
  evcPending: 2,
  overdueApplications: 1,
  upcomingDeadlines: 3,
  completedApplications: 14
};

export const STAGE_DISTRIBUTION = [
  { stage: 'Application Ingestion', count: 1, percentage: 12.5, color: '#1769E0' },
  { stage: 'Document Scrutiny', count: 4, percentage: 50.0, color: '#102A56' },
  { stage: 'Deficiency Clarification', count: 2, percentage: 25.0, color: '#7738E8' },
  { stage: 'EVC Inspection', count: 2, percentage: 25.0, color: '#159B68' },
  { stage: 'SAC/SHC Review', count: 1, percentage: 12.5, color: '#DC2626' },
  { stage: 'Final EoA Decision', count: 3, percentage: 37.5, color: '#059669' }
];

export const REGIONAL_PENDENCY = [
  { region: 'Western (Mumbai/Pune)', assigned: 8, pending: 4, overdue: 1, capacity: '82%' },
  { region: 'Northern (Delhi NCR)', assigned: 12, pending: 6, overdue: 2, capacity: '90%' },
  { region: 'Southern (Chennai)', assigned: 10, pending: 3, overdue: 0, capacity: '65%' },
  { region: 'Eastern (Kolkata)', assigned: 6, pending: 2, overdue: 1, capacity: '58%' },
  { region: 'South-Western (Bengaluru)', assigned: 9, pending: 4, overdue: 1, capacity: '75%' }
];

export const BOTTLENECK_ALERTS = [
  {
    id: 'BTN-01',
    severity: 'HIGH',
    title: 'EVC Committee Capacity Saturation',
    description: 'Western Bureau EVC queue delay detected: 8 applications awaiting committee scheduling with only 3 active panels empanelled for next 14-day window.',
    reason: 'Pending cases exceed available committee capacity in this demo dataset.',
    recommendedAction: 'Trigger What-If Simulator to reallocate 2 cross-regional committee slots from Southern Bureau.'
  },
  {
    id: 'BTN-02',
    severity: 'MEDIUM',
    title: 'Recurring Deficiency on Land Lease Deeds',
    description: '3 out of 8 applications flagged for registered title deed duration < 30 years or missing Sub-Registrar stamp.',
    reason: 'Non-metro land lease regulations under APH Clause 1.8.2 require 30-year unexpired term.',
    recommendedAction: 'Issue standard template clarification checklist to applying institutions.'
  }
];

export const ASSIGNED_APPLICATIONS_LIST = [
  {
    id: 'APP-2024-00145',
    institutionName: 'Apex Institute of Technology & Management',
    permanentId: '1-43219081',
    region: 'Western',
    state: 'Maharashtra',
    district: 'Pune',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    currentStage: 'Scrutiny Review',
    stageKey: 'scrutiny',
    submissionDate: '2026-10-14',
    dueDate: '2026-11-05',
    daysLeft: 6,
    priority: 'HIGH',
    riskScore: 74,
    status: 'in_scrutiny',
    intakeRequested: 360,
    intakeApproved: 300,
    courseType: 'B.Tech Computer Science & AI',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsCount: 4,
    verifiedDocsCount: 2,
    flaggedDocsCount: 1,
    deficiencyCount: 1,
    slaStatus: 'UPCOMING_DUE'
  },
  {
    id: 'APP-2024-00146',
    institutionName: 'Delhi Institute of Engineering & Advanced Sciences',
    permanentId: '1-89765412',
    region: 'Northern',
    state: 'Delhi NCR',
    district: 'New Delhi',
    applicationType: 'Increase in Intake / New Program',
    academicYear: '2024-25',
    currentStage: 'EVC Inspection',
    stageKey: 'evc',
    submissionDate: '2026-10-18',
    dueDate: '2026-11-12',
    daysLeft: 13,
    priority: 'MEDIUM',
    riskScore: 52,
    status: 'evc_scheduled',
    intakeRequested: 180,
    intakeApproved: 120,
    courseType: 'B.Tech Artificial Intelligence & Robotics',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsCount: 6,
    verifiedDocsCount: 5,
    flaggedDocsCount: 0,
    deficiencyCount: 0,
    slaStatus: 'ON_TRACK'
  },
  {
    id: 'APP-2024-00147',
    institutionName: 'Kalinga Institute of Polytechnic & Technology',
    permanentId: '1-99882314',
    region: 'Eastern',
    state: 'Odisha',
    district: 'Bhubaneswar',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    currentStage: 'Deficiency Clarification',
    stageKey: 'deficiency',
    submissionDate: '2026-10-01',
    dueDate: '2026-10-28',
    daysLeft: -2,
    priority: 'CRITICAL',
    riskScore: 89,
    status: 'deficient',
    intakeRequested: 240,
    intakeApproved: 240,
    courseType: 'Diploma in Civil & Mechanical Engg',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsCount: 5,
    verifiedDocsCount: 3,
    flaggedDocsCount: 2,
    deficiencyCount: 2,
    slaStatus: 'OVERDUE'
  },
  {
    id: 'APP-2024-00148',
    institutionName: 'St. Xavier Institute of Management Studies',
    permanentId: '1-33445511',
    region: 'Western',
    state: 'Goa',
    district: 'Panaji',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    currentStage: 'Scrutiny Review',
    stageKey: 'scrutiny',
    submissionDate: '2026-10-20',
    dueDate: '2026-11-20',
    daysLeft: 21,
    priority: 'LOW',
    riskScore: 28,
    status: 'in_scrutiny',
    intakeRequested: 120,
    intakeApproved: 120,
    courseType: 'MBA / PGDM in Finance & Analytics',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsCount: 4,
    verifiedDocsCount: 4,
    flaggedDocsCount: 0,
    deficiencyCount: 0,
    slaStatus: 'ON_TRACK'
  },
  {
    id: 'APP-2024-00149',
    institutionName: 'Vellore Advanced Science & Engineering Academy',
    permanentId: '1-66778899',
    region: 'Southern',
    state: 'Tamil Nadu',
    district: 'Vellore',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    currentStage: 'Final Decision',
    stageKey: 'approved',
    submissionDate: '2026-10-05',
    dueDate: '2026-10-29',
    daysLeft: 0,
    priority: 'LOW',
    riskScore: 15,
    status: 'approved',
    intakeRequested: 300,
    intakeApproved: 300,
    courseType: 'B.Tech Electrical & Electronics',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsCount: 6,
    verifiedDocsCount: 6,
    flaggedDocsCount: 0,
    deficiencyCount: 0,
    slaStatus: 'COMPLETED'
  }
];

export const SCRUTINY_DETAILS = {
  'APP-2024-00145': {
    institution: {
      name: 'Apex Institute of Technology & Management',
      permanentId: '1-43219081',
      address: 'Survey No. 42, Hinjewadi Phase 1, Pune 411057, Maharashtra',
      headOfInstitute: 'Dr. Ramesh S. Patil (Principal)',
      contactEmail: 'principal@apextech.edu.in',
      contactPhone: '+91 20 67123400',
      universityAffiliation: 'Savitribai Phule Pune University (SPPU)',
      category: 'Technical Degree (UG/PG)'
    },
    application: {
      id: 'APP-2024-00145',
      type: 'Extension of Approval (EoA)',
      academicYear: '2024-25',
      submittedAt: '2026-10-14 14:20 IST',
      governingWorkflow: 'WF-SCRUTINY-EVC-V1',
      currentStage: 'Document Scrutiny Desk',
      slaDue: '2026-11-05',
      riskScore: 74,
      riskBand: 'HIGH'
    },
    documents: [
      {
        id: 'DOC-101',
        title: 'Land Ownership / Registered Lease Deed',
        category: 'Legal & Infrastructure',
        fileName: 'registered_land_lease_apex_pune.pdf',
        fileSize: '3.4 MB',
        uploadedAt: '2026-10-14 14:22',
        mandatory: true,
        verificationStatus: 'FLAGGED_MISMATCH',
        extractedOcr: {
          titleHolder: 'Apex Educational Society Trust',
          surveyNumber: 'Survey No. 42/B, Hinjewadi',
          landArea: '7.25 Acres (Rural/Urban Mixed)',
          leaseValidTill: '2044-03-31',
          registrationNo: 'MH-PN-2014-9982',
          confidenceScore: 94.2
        },
        masterRecord: {
          titleHolder: 'Apex Institute of Technology & Management',
          surveyNumber: 'Survey No. 42 (Consolidated)',
          landArea: '7.50 Acres (Min Required for Urban: 7.50 Acres)',
          leaseValidTill: '30 Years Minimum',
          registrationNo: 'MH-PN-2014-9982'
        },
        flagReasons: [
          'Land Area Shortfall: OCR reads 7.25 Acres vs AICTE minimum 7.50 Acres requirement under APH 2024 Clause 1.8.2.',
          'Title Name Discrepancy: Deed is registered to "Apex Educational Society Trust" while application is in institute name.'
        ],
        officerRemarks: 'Deficiency ticket DEF-2026-081 issued. Clarification deed required from Sub-Registrar.'
      },
      {
        id: 'DOC-102',
        title: 'State Government No-Objection Certificate (NOC)',
        category: 'Statutory Approvals',
        fileName: 'maharashtra_dte_noc_2024_25.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-10-14 14:25',
        mandatory: true,
        verificationStatus: 'VERIFIED',
        extractedOcr: {
          issuingAuthority: 'Directorate of Technical Education, Maharashtra',
          referenceNo: 'DTE/NOC/2024/7821',
          issueDate: '2024-05-18',
          validity: 'Academic Session 2024-25',
          qrVerified: true,
          confidenceScore: 98.7
        },
        masterRecord: {
          issuingAuthority: 'Directorate of Technical Education, Maharashtra',
          referenceNo: 'DTE/NOC/2024/7821',
          validity: 'Valid for current academic session'
        },
        flagReasons: [],
        officerRemarks: 'Verified against State DTE portal API. Compliant with APH guidelines.'
      },
      {
        id: 'DOC-103',
        title: 'Fire Safety Certificate & CFO Clearance',
        category: 'Safety & Environmental',
        fileName: 'pcmc_fire_safety_noc_pune.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-10-14 14:30',
        mandatory: true,
        verificationStatus: 'FLAGGED_MISMATCH',
        extractedOcr: {
          issuingAuthority: 'Chief Fire Officer, PCMC Pune',
          certificateNo: 'PCMC/FIRE/2023/1142',
          issueDate: '2023-08-10',
          validUpto: '2024-08-09',
          confidenceScore: 91.5
        },
        masterRecord: {
          issuingAuthority: 'Chief Fire Officer / Local Authority',
          validUpto: 'Must be active on inspection date (2026-10-30)',
          maxValidity: '1 Year from issue date'
        },
        flagReasons: [
          'Certificate Expired: Expired on 2024-08-09. Overdue by >2 years.',
          'APH Clause 6.3 strictly mandates active annual fire clearance certificate.'
        ],
        officerRemarks: 'Expired certificate submitted. Institution uploaded provisional renewal receipt on 27 Oct.'
      },
      {
        id: 'DOC-104',
        title: 'Building Occupancy & PWD Stability Certificate',
        category: 'Infrastructure',
        fileName: 'pwd_structural_stability_certified.pdf',
        fileSize: '4.7 MB',
        uploadedAt: '2026-10-14 14:35',
        mandatory: true,
        verificationStatus: 'VERIFIED',
        extractedOcr: {
          engineerName: 'Er. V. M. Deshmukh, Licensed Structural Engineer',
          licenseNo: 'COA-SE-2018-0941',
          totalBuiltUpArea: '18,450 sq.m',
          buildingUsage: 'Educational / Technical Campus',
          confidenceScore: 96.0
        },
        masterRecord: {
          engineerName: 'Licensed Structural Engineer',
          totalBuiltUpArea: 'Min 14,000 sq.m for 300 intake',
          buildingUsage: 'Technical Institute'
        },
        flagReasons: [],
        officerRemarks: 'Total carpet area exceeds required norms. Architectural drawings match approval schedule.'
      }
    ]
  }
};

export const DEFICIENCY_TICKETS = [
  {
    id: 'DEF-2026-081',
    applicationId: 'APP-2024-00145',
    institutionName: 'Apex Institute of Technology & Management',
    deficiencyCode: 'DEF-SAFE-01',
    category: 'Fire Safety Clearance',
    aphClause: 'Chapter II, Clause 2.14.3',
    severity: 'CRITICAL',
    title: 'Expired Fire Safety NOC (Outdated by > 2 Years)',
    description: 'Submitted fire safety certificate issued by PCMC expired on 2024-08-09. AICTE statutory guidelines require an active, unexpired certificate for academic session 2024-25.',
    dateRaised: '2026-10-25 14:30 IST',
    responseDeadline: '2026-11-04 17:00 IST',
    daysRemaining: 5,
    status: 'RESUBMITTED_UNDER_REVIEW',
    raisedBy: 'Dr. Rajesh Kumar (Senior Scrutiny Officer)',
    messages: [
      {
        sender: 'Dr. Rajesh Kumar (AICTE Officer)',
        role: 'officer',
        timestamp: '2026-10-25 14:30',
        content: 'Deficiency raised under APH Clause 2.14.3: Fire safety clearance is expired. Upload active certificate or acknowledged CFO inspection receipt.'
      },
      {
        sender: 'Dr. Ramesh S. Patil (Principal)',
        role: 'institution',
        timestamp: '2026-10-27 10:15',
        content: 'Respected Officer, PCMC fire inspection was completed on 12th Oct 2026. Attached is the official inspection report and fee payment receipt.',
        attachment: 'pcmc_fire_inspection_receipt_2026.pdf'
      }
    ],
    resubmittedEvidence: {
      fileName: 'pcmc_fire_inspection_receipt_2026.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2026-10-27 10:15',
      verificationState: 'PENDING_OFFICER_REVIEW'
    }
  },
  {
    id: 'DEF-2026-082',
    applicationId: 'APP-2024-00145',
    institutionName: 'Apex Institute of Technology & Management',
    deficiencyCode: 'DEF-LAND-02',
    category: 'Land Title & Acreage',
    aphClause: 'Chapter I, Clause 1.8.2',
    severity: 'HIGH',
    title: 'Discrepancy in Land Area Acreage and Trust Registration',
    description: 'Deed registers 7.25 Acres in name of "Apex Educational Society Trust" whereas master profile declares 7.50 Acres. Contiguous title documents required.',
    dateRaised: '2026-10-25 15:10 IST',
    responseDeadline: '2026-11-05 17:00 IST',
    daysRemaining: 6,
    status: 'AWAITING_INSTITUTION_RESPONSE',
    raisedBy: 'Dr. Rajesh Kumar',
    messages: [
      {
        sender: 'Dr. Rajesh Kumar (AICTE Officer)',
        role: 'officer',
        timestamp: '2026-10-25 15:10',
        content: 'Clarification required regarding shortfall of 0.25 Acres and Trust ownership linkage. Submit Sub-Registrar amalgamation order.'
      }
    ],
    resubmittedEvidence: null
  },
  {
    id: 'DEF-2026-079',
    applicationId: 'APP-2024-00147',
    institutionName: 'Kalinga Institute of Polytechnic & Technology',
    deficiencyCode: 'DEF-FAC-04',
    category: 'Faculty Cadre & Ratio',
    aphClause: 'Appendix 7, Clause 7.1',
    severity: 'CRITICAL',
    title: 'Shortfall in Senior Lecturer / HOD Cadre Credentials',
    description: 'Civil and Electrical engineering diploma sections do not satisfy the 1:2:6 cadre ratio. State Board verified appointments required.',
    dateRaised: '2026-10-15 11:00 IST',
    responseDeadline: '2026-10-28 17:00 IST',
    daysRemaining: -2,
    status: 'OVERDUE_ESCALATED',
    raisedBy: 'Dr. Rajesh Kumar',
    messages: [
      {
        sender: 'Dr. Rajesh Kumar (AICTE Officer)',
        role: 'officer',
        timestamp: '2026-10-15 11:00',
        content: 'Cadre ratio deficient in Civil Diploma. Response required by 28th October.'
      }
    ],
    resubmittedEvidence: null
  }
];

export const EVC_MANAGEMENT_DATA = {
  queue: [
    {
      evcId: 'EVC-2026-901',
      applicationId: 'APP-2024-00146',
      institutionName: 'Delhi Institute of Engineering & Advanced Sciences',
      address: 'Sector 62, Institutional Area, Noida / Delhi NCR',
      region: 'Northern',
      proposedDate: '2026-11-12',
      confirmedDate: '2026-11-12',
      status: 'CONFIRMED',
      committeeType: '3-Member Expert Visit Panel',
      conflictStatus: 'CLEARED',
      conflictDetails: 'Zero alma mater, prior faculty employment, or trust affiliation in past 7 years.',
      assignedCommittee: [
        { name: 'Prof. K. G. Radhakrishnan', role: 'Chairman', inst: 'IIT Delhi', discipline: 'Computer Science & AI' },
        { name: 'Dr. Meenakshi Sundaram', role: 'Subject Expert', inst: 'NIT Kurukshetra', discipline: 'ECE & Robotics' },
        { name: 'Er. Alok Srivastava', role: 'Infrastructure Expert', inst: 'CPWD / AICTE Empanelled', discipline: 'Civil Architecture' }
      ],
      checklist: {
        labsVerified: false,
        biometricAttendanceAudited: false,
        libraryVolumesChecked: false,
        hostelSafetyCleared: false,
        videoRecordingUploaded: false
      }
    },
    {
      evcId: 'EVC-2026-902',
      applicationId: 'APP-2024-00145',
      institutionName: 'Apex Institute of Technology & Management',
      address: 'Survey No. 42, Hinjewadi Phase 1, Pune, Maharashtra',
      region: 'Western',
      proposedDate: '2026-11-16',
      confirmedDate: null,
      status: 'PROPOSED_AWAITING_CONFIRMATION',
      committeeType: '2-Member Technical Panel',
      conflictStatus: 'CLEARED',
      conflictDetails: 'Automated conflict filter passed against Western Bureau roster.',
      assignedCommittee: [
        { name: 'Prof. Anjali Deshpande', role: 'Chairman', inst: 'COEP Tech University, Pune', discipline: 'Mechanical Engg' },
        { name: 'Dr. T. R. Venkatesh', role: 'Subject Expert', inst: 'VJTI Mumbai', discipline: 'Computer Engineering' }
      ],
      checklist: {
        labsVerified: false,
        biometricAttendanceAudited: false,
        libraryVolumesChecked: false,
        hostelSafetyCleared: false,
        videoRecordingUploaded: false
      }
    }
  ],
  availableExpertsPool: [
    { id: 'EXP-101', name: 'Prof. Arvind Kulkarni', specialization: 'Computer Engineering', affiliation: 'IIT Bombay', region: 'Western', visitsThisCycle: 2, maxCapacity: 5 },
    { id: 'EXP-102', name: 'Dr. Sunita Rao', specialization: 'Information Technology', affiliation: 'VNIT Nagpur', region: 'Western', visitsThisCycle: 1, maxCapacity: 4 },
    { id: 'EXP-103', name: 'Prof. H. S. Rawat', specialization: 'Mechanical Engineering', affiliation: 'DTU Delhi', region: 'Northern', visitsThisCycle: 3, maxCapacity: 5 },
    { id: 'EXP-104', name: 'Dr. P. Balachandran', specialization: 'Civil & Safety', affiliation: 'NIT Trichy', region: 'Southern', visitsThisCycle: 2, maxCapacity: 4 }
  ]
};

export const LEASE_VALIDITY_DATA = [
  {
    id: 'LSE-001',
    institutionName: 'Apex Institute of Technology & Management',
    permanentId: '1-43219081',
    leaseDocument: 'Land Title Deed - Survey 42 Hinjewadi',
    startDate: '2014-04-01',
    expiryDate: '2044-03-31',
    remainingDays: 6360,
    status: 'VALID',
    badgeColor: 'green'
  },
  {
    id: 'LSE-002',
    institutionName: 'St. Xavier Institute of Management Studies',
    permanentId: '1-33445511',
    leaseDocument: 'Campus Building & Hostels Lease',
    startDate: '2017-12-01',
    expiryDate: '2026-11-28',
    remainingDays: 29,
    status: 'EXPIRING_SOON',
    badgeColor: 'orange'
  },
  {
    id: 'LSE-003',
    institutionName: 'Modern Polytechnic Institute of Pune',
    permanentId: '1-22446688',
    leaseDocument: 'Workshop & Laboratory Annex Lease',
    startDate: '2016-08-15',
    expiryDate: '2026-09-30',
    remainingDays: -30,
    status: 'EXPIRED',
    badgeColor: 'red'
  }
];

export const UNDERTAKINGS_DATA = [
  {
    id: 'UND-001',
    institutionName: 'Apex Institute of Technology & Management',
    undertakingTitle: 'Faculty Cadre Ratio & Sixth Pay Scale Undertaking',
    clauseRef: 'APH 2024 Appendix 7',
    dueDate: '2026-11-10',
    daysRemaining: 11,
    status: 'EVIDENCE_SUBMITTED',
    evidenceFile: 'faculty_cadre_notarized_affidavit.pdf',
    verificationState: 'PENDING_OFFICER_REVIEW'
  },
  {
    id: 'UND-002',
    institutionName: 'Kalinga Institute of Polytechnic & Technology',
    undertakingTitle: 'Anti-Ragging Committee & CCTV Installation Undertaking',
    clauseRef: 'AICTE Anti-Ragging Notification 2009',
    dueDate: '2026-10-25',
    daysRemaining: -5,
    status: 'DEFICIENT_OVERDUE',
    evidenceFile: 'anti_ragging_undertaking_unsigned.pdf',
    verificationState: 'REJECTED_DEFICIENT'
  }
];

export const NOTIFICATIONS_DATA = [
  {
    id: 'NOTIF-01',
    type: 'DEADLINE',
    priority: 'HIGH',
    title: 'SLA Warning: Apex Institute Scrutiny Due in 6 Days',
    message: 'Application APP-2024-00145 is approaching the 15-day scrutiny SLA window on 5th Nov 2026.',
    timestamp: '2026-10-30 09:30 IST',
    read: false,
    link: '/officer/scrutiny'
  },
  {
    id: 'NOTIF-02',
    type: 'DEFICIENCY',
    priority: 'HIGH',
    title: 'Resubmitted Evidence: Fire Safety Receipt Uploaded',
    message: 'Apex Institute uploaded PCMC fire inspection fee payment receipt for ticket DEF-2026-081.',
    timestamp: '2026-10-27 10:15 IST',
    read: false,
    link: '/officer/compliance'
  },
  {
    id: 'NOTIF-03',
    type: 'EVC',
    priority: 'MEDIUM',
    title: 'EVC Visit Confirmed for Delhi Institute',
    message: 'Committee confirmed inspection for 12th November 2026. Logistics intimation dispatched.',
    timestamp: '2026-10-28 14:00 IST',
    read: true,
    link: '/officer/evc'
  },
  {
    id: 'NOTIF-04',
    type: 'ESCALATION',
    priority: 'CRITICAL',
    title: 'Overdue Undertaking Escalated to Bureau Officer',
    message: 'Kalinga Polytechnic undertaking breached deadline by 48 hours. Escalation Level 2 active.',
    timestamp: '2026-10-29 09:00 IST',
    read: true,
    link: '/officer/compliance'
  }
];

