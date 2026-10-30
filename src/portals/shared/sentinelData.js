// AICTE Sentinel Shared Data Structures & Store
// Coordinated with Developer 1's mockData.js while providing
// full fidelity for AICTE Sentinel Officer and Admin portals.

// 1. OBLIGATION MODELS
export const INITIAL_OBLIGATIONS = [
  {
    obligation_id: 'OBL-2026-00101',
    application_id: 'AICTE-2024-00145',
    institution_name: 'Apex Institute of Technology & Management',
    type: 'SCRUTINY_STAGE',
    stage: 'Scrutiny Initial Review',
    owner_role: 'REGIONAL_OFFICER',
    assigned_to: 'Dr. Rajesh Kumar (Western Region)',
    region: 'Western',
    state: 'Under Verification',
    due_at: '2026-11-05T17:00:00Z',
    days_left: 6,
    policy_version: 'v2.4.1',
    risk_score: 74,
    risk_band: 'HIGH',
    risk_factors: [
      { name: 'Deadline Proximity', weight: '35%', detail: '6 days remaining on scrutiny SLA' },
      { name: 'Document Mismatch', weight: '25%', detail: 'Land ownership deed mismatch flagged by OCR' },
      { name: 'Workload Pressure', weight: '20%', detail: 'Western Bureau queue at 88% capacity' },
      { name: 'Historical Resubmission', weight: '20%', detail: 'Previous deficiency returned twice' }
    ],
    next_best_action: 'Verify OCR-flagged land survey numbers against State Revenue Portal',
    evidence_count: 4,
    verified_evidence_count: 2,
    reminders_sent: 2,
    escalation_level: 'LEVEL_1_PENDING',
    created_at: '2026-10-15T09:30:00Z',
  },
  {
    obligation_id: 'OBL-2026-00102',
    application_id: 'AICTE-2024-00146',
    institution_name: 'Delhi Institute of Engineering & Advanced Sciences',
    type: 'EVC_EVENT',
    stage: 'Expert Visit Committee Inspection',
    owner_role: 'EVC_COORDINATOR',
    assigned_to: 'Prof. S. K. Mahajan (Northern Region)',
    region: 'Northern',
    state: 'Open',
    due_at: '2026-11-12T17:00:00Z',
    days_left: 13,
    policy_version: 'v2.4.1',
    risk_score: 52,
    risk_band: 'MEDIUM',
    risk_factors: [
      { name: 'Committee Availability', weight: '35%', detail: 'Only 1 mechanical expert slot available in region' },
      { name: 'SLA Window', weight: '25%', detail: '13 days remaining to complete onsite visit' }
    ],
    next_best_action: 'Confirm proposed 3-member committee and lock inspection date',
    evidence_count: 6,
    verified_evidence_count: 5,
    reminders_sent: 1,
    escalation_level: 'NONE',
    created_at: '2026-10-18T11:00:00Z',
  },
  {
    obligation_id: 'OBL-2026-00103',
    application_id: 'AICTE-2024-00147',
    institution_name: 'Kalinga Institute of Polytechnic & Technology',
    type: 'UNDERTAKING',
    stage: 'Faculty Cadre Ratio Compliance Undertaking',
    owner_role: 'INSTITUTION',
    assigned_to: 'Principal, Kalinga Polytechnic',
    region: 'Eastern',
    state: 'Overdue',
    due_at: '2026-10-28T17:00:00Z',
    days_left: -2,
    policy_version: 'v2.4.0',
    risk_score: 89,
    risk_band: 'HIGH',
    risk_factors: [
      { name: 'Deadline Breached', weight: '40%', detail: 'Overdue by 2 calendar days (Grace period active)' },
      { name: 'Missing Notarization', weight: '30%', detail: 'Submitted affidavit lacked valid stamp duty seal' },
      { name: 'Regional Escalation', weight: '30%', detail: 'Escalated to Bureau Supervisor' }
    ],
    next_best_action: 'Issue statutory final notice or recommend SAC/SHC inquiry',
    evidence_count: 1,
    verified_evidence_count: 0,
    reminders_sent: 4,
    escalation_level: 'LEVEL_2_ESCALATED',
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    obligation_id: 'OBL-2026-00104',
    application_id: 'AICTE-2024-00148',
    institution_name: 'St. Xavier Institute of Management Studies',
    type: 'LEASE_RENEWAL',
    stage: 'Campus Land Lease Deed Verification',
    owner_role: 'REGIONAL_OFFICER',
    assigned_to: 'Dr. Rajesh Kumar (Western Region)',
    region: 'Western',
    state: 'Awaiting Evidence',
    due_at: '2026-11-20T17:00:00Z',
    days_left: 21,
    policy_version: 'v2.4.1',
    risk_score: 28,
    risk_band: 'LOW',
    risk_factors: [
      { name: 'Time Remaining', weight: '50%', detail: '21 business days before renewal cut-off' }
    ],
    next_best_action: 'Monitor registered deed upload from Sub-Registrar Office',
    evidence_count: 2,
    verified_evidence_count: 1,
    reminders_sent: 1,
    escalation_level: 'NONE',
    created_at: '2026-10-20T14:20:00Z',
  },
  {
    obligation_id: 'OBL-2026-00105',
    application_id: 'AICTE-2024-00149',
    institution_name: 'Vellore Advanced Science & Engineering Academy',
    type: 'COMPLIANCE_SUBMISSION',
    stage: 'Fire Safety & Building Plan Approval Verification',
    owner_role: 'REGIONAL_OFFICER',
    assigned_to: 'Mrs. Lakshmi Narayanan (Southern Region)',
    region: 'Southern',
    state: 'Completed',
    due_at: '2026-10-29T17:00:00Z',
    days_left: 0,
    policy_version: 'v2.4.1',
    risk_score: 15,
    risk_band: 'LOW',
    risk_factors: [],
    next_best_action: 'Completed - Forwarded to Bureau for final approval',
    evidence_count: 4,
    verified_evidence_count: 4,
    reminders_sent: 0,
    escalation_level: 'NONE',
    created_at: '2026-10-10T08:00:00Z',
  }
]

// 2. ASSIGNED APPLICATIONS FOR OFFICER WORKSPACE
export const ASSIGNED_APPLICATIONS = [
  {
    id: 'AICTE-2024-00145',
    institutionName: 'Apex Institute of Technology & Management',
    aictePermanentId: '1-43219081',
    category: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    program: 'Engineering & Technology (UG/PG)',
    region: 'Western',
    state: 'Maharashtra',
    district: 'Pune',
    submittedDate: '2026-10-14',
    currentStage: 'Scrutiny Review',
    status: 'in_scrutiny', // in_scrutiny | evc_scheduled | deficient | approved | under_appeal
    riskScore: 74,
    riskLevel: 'HIGH',
    pendingAction: 'Verify Land & Building Occupancy Certificate',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsTotal: 8,
    documentsVerified: 5,
    documentsFlagged: 2,
    intakeRequested: 360,
    intakeApproved: 300,
    obligationsCount: 3,
    slaDueDate: '2026-11-05',
    lastUpdated: '2026-10-29 16:45',
  },
  {
    id: 'AICTE-2024-00146',
    institutionName: 'Delhi Institute of Engineering & Advanced Sciences',
    aictePermanentId: '1-89765412',
    category: 'Increase in Intake / New Program',
    academicYear: '2024-25',
    program: 'Computer Science & AI (UG)',
    region: 'Northern',
    state: 'Delhi NCR',
    district: 'New Delhi',
    submittedDate: '2026-10-18',
    currentStage: 'EVC Inspection',
    status: 'evc_scheduled',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    pendingAction: 'Confirm Committee Members & Logistics',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsTotal: 10,
    documentsVerified: 9,
    documentsFlagged: 0,
    intakeRequested: 180,
    intakeApproved: 120,
    obligationsCount: 2,
    slaDueDate: '2026-11-12',
    lastUpdated: '2026-10-29 11:20',
  },
  {
    id: 'AICTE-2024-00147',
    institutionName: 'Kalinga Institute of Polytechnic & Technology',
    aictePermanentId: '1-99882314',
    category: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    program: 'Diploma in Engineering',
    region: 'Eastern',
    state: 'Odisha',
    district: 'Bhubaneswar',
    submittedDate: '2026-10-01',
    currentStage: 'Deficiency Clarification',
    status: 'deficient',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    pendingAction: 'Review Resubmitted Faculty Undertaking Affidavit',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsTotal: 7,
    documentsVerified: 4,
    documentsFlagged: 2,
    intakeRequested: 240,
    intakeApproved: 240,
    obligationsCount: 4,
    slaDueDate: '2026-10-28', // OVERDUE
    lastUpdated: '2026-10-30 09:15',
  },
  {
    id: 'AICTE-2024-00148',
    institutionName: 'St. Xavier Institute of Management Studies',
    aictePermanentId: '1-33445511',
    category: 'Extension of Approval (EoA)',
    academicYear: '2024-25',
    program: 'Management (MBA/PGDM)',
    region: 'Western',
    state: 'Goa',
    district: 'Panaji',
    submittedDate: '2026-10-20',
    currentStage: 'Scrutiny Review',
    status: 'in_scrutiny',
    riskScore: 28,
    riskLevel: 'LOW',
    pendingAction: 'Await Sub-Registrar Lease Certificate Upload',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsTotal: 6,
    documentsVerified: 5,
    documentsFlagged: 0,
    intakeRequested: 120,
    intakeApproved: 120,
    obligationsCount: 1,
    slaDueDate: '2026-11-20',
    lastUpdated: '2026-10-28 14:10',
  },
  {
    id: 'AICTE-2024-00150',
    institutionName: 'Coimbatore Technical Campus for Women',
    aictePermanentId: '1-77881122',
    category: 'Closure of Program / Course',
    academicYear: '2024-25',
    program: 'Civil Engineering (UG)',
    region: 'Southern',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    submittedDate: '2026-10-22',
    currentStage: 'Initial Document Scrutiny',
    status: 'in_scrutiny',
    riskScore: 35,
    riskLevel: 'LOW',
    pendingAction: 'Verify Student Transfer No-Objection Certificates',
    assignedOfficer: 'Dr. Rajesh Kumar',
    documentsTotal: 5,
    documentsVerified: 3,
    documentsFlagged: 0,
    intakeRequested: 0,
    intakeApproved: 60,
    obligationsCount: 2,
    slaDueDate: '2026-11-15',
    lastUpdated: '2026-10-29 17:00',
  }
]

// 3. DETAILED DOCUMENT REPOSITORY WITH OCR EXTRACTION & MASTER MATCH
export const SCRUTINY_DOCUMENTS = {
  'AICTE-2024-00145': [
    {
      doc_id: 'DOC-101',
      name: 'Land Ownership / Registered Title Deed',
      category: 'Legal & Infrastructure',
      required: true,
      file_name: 'land_title_deed_apex_reg42.pdf',
      file_size: '3.4 MB',
      upload_date: '2026-10-14 14:22',
      verification_status: 'FLAGGED_MISMATCH', // VERIFIED | FLAGGED_MISMATCH | PENDING | REJECTED
      extracted_ocr: {
        institution_name: 'Apex Educational Society Trust',
        survey_number: 'Survey No. 42/B, Hinjewadi',
        land_area_acres: '7.25 Acres',
        lease_valid_till: '2044-03-31',
        registration_number: 'MH-PN-2014-9982',
        confidence_score: 94.2,
      },
      master_record: {
        institution_name: 'Apex Institute of Technology & Management',
        survey_number: 'Survey No. 42 (Consolidated)',
        land_area_acres: '7.50 Acres (Min Required: 7.5)',
        lease_valid_till: '30+ Years / Freehold',
        registration_number: 'MH-PN-2014-9982',
      },
      ocr_bounding_box: { page: 1, top: 120, left: 45, width: 320, height: 40 },
      flag_reasons: [
        'Discrepancy: Extracted land area is 7.25 Acres vs AICTE minimum requirement of 7.50 Acres for Urban Category',
        'Title holder name shows "Apex Educational Society Trust" whereas application filed as "Apex Institute of Technology"'
      ],
      officer_notes: 'Institution needs to provide Sub-Registrar rectification deed or clarify trust deed clause 4(b).',
    },
    {
      doc_id: 'DOC-102',
      name: 'State Government No-Objection Certificate (NOC)',
      category: 'Statutory Approvals',
      required: true,
      file_name: 'maharashtra_dte_noc_2024_25.pdf',
      file_size: '1.8 MB',
      upload_date: '2026-10-14 14:25',
      verification_status: 'VERIFIED',
      extracted_ocr: {
        issuing_authority: 'Directorate of Technical Education, Maharashtra',
        reference_no: 'DTE/NOC/2024/7821',
        issue_date: '2024-05-18',
        validity: 'Academic Year 2024-25',
        qr_code_verified: true,
        confidence_score: 98.7,
      },
      master_record: {
        issuing_authority: 'Directorate of Technical Education, Maharashtra',
        reference_no: 'DTE/NOC/2024/7821',
        issue_date: '2024-05-18',
        validity: 'Valid for current academic session',
      },
      flag_reasons: [],
      officer_notes: 'QR code verified via State DTE portal API gateway. Fully compliant.',
    },
    {
      doc_id: 'DOC-103',
      name: 'Fire Safety Certificate & NOC',
      category: 'Safety & Environmental',
      required: true,
      file_name: 'pune_cfo_fire_noc_2023.pdf',
      file_size: '2.1 MB',
      upload_date: '2026-10-14 14:30',
      verification_status: 'FLAGGED_MISMATCH',
      extracted_ocr: {
        issuing_officer: 'Chief Fire Officer, PCMC Pune',
        certificate_no: 'PCMC/FIRE/NOC/2023/1142',
        issue_date: '2023-08-10',
        valid_upto: '2024-08-09',
        confidence_score: 91.5,
      },
      master_record: {
        issuing_officer: 'Chief Fire Officer, PCMC Pune',
        valid_upto: 'Must be valid as of today (Current date: 2026-10-30)',
        max_validity: '1 Year from issue date',
      },
      flag_reasons: [
        'EXPIRED: Certificate expired on 2024-08-09. Current submission is outdated by >2 years.',
        'APH Clause 6.3 requires active, unexpired annual fire safety certificate.'
      ],
      officer_notes: 'Renewal receipt or provisional inspection certificate required immediately.',
    },
    {
      doc_id: 'DOC-104',
      name: 'Building Occupancy & Structural Stability Certificate',
      category: 'Infrastructure',
      required: true,
      file_name: 'structural_stability_pwd_certified.pdf',
      file_size: '4.7 MB',
      upload_date: '2026-10-14 14:35',
      verification_status: 'VERIFIED',
      extracted_ocr: {
        certified_engineer: 'Er. V. M. Deshmukh, Licensed Structural Engineer',
        license_no: 'COA-SE-2018-0941',
        total_builtup_sqm: '18,450 sq.m',
        building_usage: 'Educational / Technical Campus',
        confidence_score: 96.0,
      },
      master_record: {
        certified_engineer: 'Licensed Structural Engineer',
        total_builtup_sqm: 'Min requirement: 14,000 sq.m for 300 intake',
        building_usage: 'Educational Institutional',
      },
      flag_reasons: [],
      officer_notes: 'Exceeds minimum built-up floor area. Architectural drawings match approval plan.',
    }
  ]
}

// 4. DEFICIENCY AND CLARIFICATION TICKETS
export const DEFICIENCY_TICKETS = [
  {
    ticket_id: 'DEF-2026-081',
    application_id: 'AICTE-2024-00145',
    institution_name: 'Apex Institute of Technology & Management',
    deficiency_code: 'DEF-SAFE-01',
    category: 'Fire Safety & NOC',
    aph_clause: 'Chapter II, Clause 2.14.3',
    severity: 'CRITICAL',
    title: 'Expired Fire Safety NOC (Outdated by >2 years)',
    mandatory_reason: 'The submitted Fire Safety NOC issued by PCMC Pune expired on 2024-08-09. AICTE APH regulations strictly mandate a valid, currently active fire clearance certificate.',
    suggested_action: 'Upload renewed Fire Safety NOC or acknowledged renewal application with provisional CFO certificate.',
    status: 'AWAITING_INSTITUTION_RESPONSE', // AWAITING_INSTITUTION_RESPONSE | RESUBMITTED_UNDER_REVIEW | RESOLVED | REJECTED
    raised_by: 'Dr. Rajesh Kumar (Regional Scrutiny Officer)',
    raised_at: '2026-10-25T14:30:00Z',
    deadline: '2026-11-04T17:00:00Z',
    days_remaining: 5,
    messages: [
      {
        id: 'msg-1',
        sender: 'Dr. Rajesh Kumar (AICTE Officer)',
        role: 'officer',
        timestamp: '2026-10-25 14:30',
        content: 'Deficiency raised under Clause 2.14.3. The submitted Fire Safety NOC expired on August 2024. Please provide current academic session compliance.',
        attachment: null
      },
      {
        id: 'msg-2',
        sender: 'Dr. Ramesh S. Patil (Principal)',
        role: 'institution',
        timestamp: '2026-10-27 10:15',
        content: 'Respected Officer, our campus inspection by PCMC Fire Department was conducted on 12th Oct 2026. The inspection report and fee challan have been paid. We are attaching the provisional receipt.',
        attachment: 'pcmc_fire_inspection_challan_receipt.pdf'
      }
    ],
    resubmitted_evidence: [
      {
        id: 'evi-991',
        file_name: 'pcmc_fire_inspection_challan_receipt.pdf',
        uploaded_at: '2026-10-27 10:15',
        file_size: '1.2 MB',
        verification_state: 'PENDING_OFFICER_REVIEW',
      }
    ]
  },
  {
    ticket_id: 'DEF-2026-082',
    application_id: 'AICTE-2024-00145',
    institution_name: 'Apex Institute of Technology & Management',
    deficiency_code: 'DEF-LAND-02',
    category: 'Land & Legal Title',
    aph_clause: 'Chapter I, Clause 1.8.2',
    severity: 'HIGH',
    title: 'Discrepancy in Land Area Acreage and Trust Name',
    mandatory_reason: 'Title deed registers 7.25 Acres under "Apex Educational Society Trust" whereas registered AICTE profile declares 7.50 Acres. Minimum required for non-metro urban area is 7.50 Acres.',
    suggested_action: 'Provide Sub-Registrar certified amalgamation order or additional contiguous parcel title deed.',
    status: 'AWAITING_INSTITUTION_RESPONSE',
    raised_by: 'Dr. Rajesh Kumar (Regional Scrutiny Officer)',
    raised_at: '2026-10-25T15:10:00Z',
    deadline: '2026-11-05T17:00:00Z',
    days_remaining: 6,
    messages: [
      {
        id: 'msg-10',
        sender: 'Dr. Rajesh Kumar (AICTE Officer)',
        role: 'officer',
        timestamp: '2026-10-25 15:10',
        content: 'Clarification required: Discrepancy of 0.25 acres between Master AICTE registration (7.50 Acres) and uploaded deed (7.25 Acres). Please clarify parcel boundary.',
        attachment: null
      }
    ],
    resubmitted_evidence: []
  },
  {
    ticket_id: 'DEF-2026-079',
    application_id: 'AICTE-2024-00147',
    institution_name: 'Kalinga Institute of Polytechnic & Technology',
    deficiency_code: 'DEF-FAC-04',
    category: 'Faculty Cadre & Ratio',
    aph_clause: 'Appendix 7, Clause 7.1',
    severity: 'CRITICAL',
    title: 'Shortfall in Senior Lecturer / HOD Cadre',
    mandatory_reason: 'Submitted faculty undertaking lacks required 1:2:6 cadre ratio in Civil & Electrical diploma sections. Two candidate resumes lack AICTE portal teacher codes.',
    suggested_action: 'Submit revised faculty appointment orders verified by State Board of Technical Education.',
    status: 'RESUBMITTED_UNDER_REVIEW',
    raised_by: 'Dr. Rajesh Kumar',
    raised_at: '2026-10-15T11:00:00Z',
    deadline: '2026-10-28T17:00:00Z', // Overdue
    days_remaining: -2,
    messages: [
      {
        id: 'msg-20',
        sender: 'Dr. Rajesh Kumar',
        role: 'officer',
        timestamp: '2026-10-15 11:00',
        content: 'Cadre ratio deficient in Civil engineering diploma. Clarification deadline set for 28 Oct.',
        attachment: null
      },
      {
        id: 'msg-21',
        sender: 'Principal, Kalinga Polytechnic',
        role: 'institution',
        timestamp: '2026-10-29 18:20',
        content: 'We have ratified appointments of 2 Senior Lecturers with approved State Board orders. Uploaded for urgent verification.',
        attachment: 'sbte_odisha_faculty_ratification.pdf'
      }
    ],
    resubmitted_evidence: [
      {
        id: 'evi-995',
        file_name: 'sbte_odisha_faculty_ratification.pdf',
        uploaded_at: '2026-10-29 18:20',
        file_size: '2.8 MB',
        verification_state: 'READY_FOR_REVERIFICATION',
      }
    ]
  }
]

// 5. EVC (EXPERT VISIT COMMITTEE) SCHEDULING & ROSTER
export const EVC_ROSTER_DATA = [
  {
    evc_id: 'EVC-2026-901',
    application_id: 'AICTE-2024-00146',
    institution_name: 'Delhi Institute of Engineering & Advanced Sciences',
    address: 'Sector 62, Institutional Area, Noida / Delhi NCR',
    region: 'Northern',
    proposed_date: '2026-11-12',
    confirmed_date: '2026-11-12',
    status: 'CONFIRMED', // PROPOSED | CONFIRMED | IN_PROGRESS | COMPLETED | RESCHEDULED
    committee_chair: 'Prof. K. G. Radhakrishnan (IIT Delhi)',
    experts: [
      {
        id: 'EXP-01',
        name: 'Prof. K. G. Radhakrishnan',
        specialization: 'Computer Science & AI',
        institution: 'IIT Delhi',
        conflict_checked: true,
        role: 'Chairman'
      },
      {
        id: 'EXP-02',
        name: 'Dr. Meenakshi Sundaram',
        specialization: 'Electronics & Communication',
        institution: 'NIT Kurukshetra',
        conflict_checked: true,
        role: 'Subject Expert'
      },
      {
        id: 'EXP-03',
        name: 'Er. Alok Srivastava',
        specialization: 'Architectural & Safety Expert',
        institution: 'CPWD / AICTE Emplaneled',
        conflict_checked: true,
        role: 'Civil Infrastructure Expert'
      }
    ],
    conflict_of_interest_status: 'CLEARED',
    conflict_notes: 'Automated algorithm checked: No committee member has graduated, taught, or served on governing body of applicant institute in past 7 years.',
    checklist_status: {
      laboratories_verified: false,
      faculty_biometric_checked: false,
      library_volumes_audited: false,
      hostel_safety_cleared: false,
      video_recording_uploaded: false,
    },
    coordinator_notes: 'Inspection scheduled for full day. Logistics intimation dispatched to Principal.',
  },
  {
    evc_id: 'EVC-2026-902',
    application_id: 'AICTE-2024-00145',
    institution_name: 'Apex Institute of Technology & Management',
    address: 'Survey No. 42, Hinjewadi Phase 1, Pune',
    region: 'Western',
    proposed_date: '2026-11-16',
    confirmed_date: null,
    status: 'PROPOSED',
    committee_chair: 'Prof. Anjali Deshpande (COEP Pune)',
    experts: [
      {
        id: 'EXP-04',
        name: 'Prof. Anjali Deshpande',
        specialization: 'Mechanical Engineering',
        institution: 'COEP Tech University',
        conflict_checked: true,
        role: 'Chairman'
      },
      {
        id: 'EXP-05',
        name: 'Dr. T. R. Venkatesh',
        specialization: 'Computer Engineering',
        institution: 'VJTI Mumbai',
        conflict_checked: true,
        role: 'Subject Expert'
      }
    ],
    conflict_of_interest_status: 'CLEARED',
    conflict_notes: 'Conflict check passed for Western Bureau empanelled roster.',
    checklist_status: {
      laboratories_verified: false,
      faculty_biometric_checked: false,
      library_volumes_audited: false,
      hostel_safety_cleared: false,
      video_recording_uploaded: false,
    },
    coordinator_notes: 'Awaiting final regional officer confirmation after deficiency resolution.',
  }
]

// 6. AVAILABLE COMMITTEE EXPERTS FOR OPTIMIZER SUGGESTIONS
export const AVAILABLE_EXPERTS = [
  { id: 'EXP-101', name: 'Prof. Arvind Kulkarni', specialization: 'Computer Engineering', affiliation: 'IIT Bombay', region: 'Western', visits_this_cycle: 2, max_capacity: 5, active: true },
  { id: 'EXP-102', name: 'Dr. Sunita Rao', specialization: 'Information Technology', affiliation: 'VNIT Nagpur', region: 'Western', visits_this_cycle: 1, max_capacity: 4, active: true },
  { id: 'EXP-103', name: 'Prof. H. S. Rawat', specialization: 'Mechanical Engineering', affiliation: 'DTU Delhi', region: 'Northern', visits_this_cycle: 3, max_capacity: 5, active: true },
  { id: 'EXP-104', name: 'Dr. P. Balachandran', specialization: 'Civil Engineering & Safety', affiliation: 'NIT Trichy', region: 'Southern', visits_this_cycle: 2, max_capacity: 4, active: true },
  { id: 'EXP-105', name: 'Prof. Debashis Sen', specialization: 'Electrical Engineering', affiliation: 'IIT Kharagpur', region: 'Eastern', visits_this_cycle: 1, max_capacity: 4, active: true },
]

// 7. ADMIN USERS & RBAC MATRIX
export const RBAC_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@aicte.gov.in',
    role: 'REGIONAL_OFFICER',
    role_label: 'Regional Scrutiny Officer',
    region: 'Western Region (Mumbai/Pune)',
    status: 'ACTIVE',
    cases_assigned: 14,
    last_login: '2026-10-30 09:40',
    permissions: ['VIEW_ASSIGNED_APPLICATIONS', 'EXECUTE_SCRUTINY', 'RAISE_DEFICIENCY', 'VERIFY_DOCUMENTS', 'GENERATE_EVIDENCE_PACK']
  },
  {
    id: 'USR-002',
    name: 'Shri Amitabh Sharma',
    email: 'amitabh.sharma@aicte.gov.in',
    role: 'SYSTEM_ADMINISTRATOR',
    role_label: 'System Administrator',
    region: 'HQ New Delhi (National)',
    status: 'ACTIVE',
    cases_assigned: 0,
    last_login: '2026-10-30 10:02',
    permissions: ['MANAGE_USERS', 'CONFIGURE_WORKFLOWS', 'PUBLISH_POLICIES', 'TIME_TRAVEL_SIMULATION', 'AUDIT_LOG_EXPLORER', 'SYSTEM_MAINTENANCE']
  },
  {
    id: 'USR-003',
    name: 'Prof. K. V. S. Murthy',
    email: 'kvs.murthy@aicte.gov.in',
    role: 'BUREAU_OFFICER',
    role_label: 'Bureau Officer / Approval Supervisor',
    region: 'HQ New Delhi (National)',
    status: 'ACTIVE',
    cases_assigned: 42,
    last_login: '2026-10-29 17:15',
    permissions: ['VIEW_ALL_BUREAU_QUEUES', 'REVIEW_ESCALATIONS', 'OVERRIDE_DEADLINES_WITH_REASON', 'APPROVE_APPLICATIONS', 'VIEW_RISK_ANALYTICS']
  },
  {
    id: 'USR-004',
    name: 'Mrs. Lakshmi Narayanan',
    email: 'lakshmi.n@aicte.gov.in',
    role: 'EVC_COORDINATOR',
    role_label: 'EVC Logistics Coordinator',
    region: 'Southern Region (Chennai/Bengaluru)',
    status: 'ACTIVE',
    cases_assigned: 19,
    last_login: '2026-10-30 08:30',
    permissions: ['VIEW_EVC_QUEUE', 'SUGGEST_COMMITTEES', 'CONFIRM_EVC_SCHEDULE', 'UPLOAD_VISIT_REPORTS', 'TRACK_EXPERT_CAPACITY']
  },
  {
    id: 'USR-005',
    name: 'Dr. C. P. Chandran',
    email: 'cp.chandran@cag.gov.in',
    role: 'AUDITOR_READONLY',
    role_label: 'Auditor / Statutory Reviewer',
    region: 'External Oversight (CAG/MoE)',
    status: 'ACTIVE',
    cases_assigned: 0,
    last_login: '2026-10-28 14:00',
    permissions: ['VERIFY_HASH_CHAINS', 'EXPORT_EVIDENCE_PACKS', 'VIEW_AUDIT_LOGS', 'READONLY_INSPECTION']
  }
]

// 8. CONFIGURABLE WORKFLOW TEMPLATES (EFFECTIVE-DATED & VERSIONED)
export const WORKFLOW_DEFINITIONS = [
  {
    workflow_id: 'WF-SCRUTINY-EVC-V1',
    name: 'Standard Technical Degree (UG/PG) Approval Flow',
    application_type: 'Extension of Approval / Intake Expansion',
    version: '1.2.0',
    status: 'PUBLISHED_ACTIVE',
    effective_from: '2024-01-01',
    effective_to: '2025-12-31',
    author: 'IT Regulatory Cell',
    approved_by: 'Member Secretary, AICTE (Second-Person Approval)',
    source_aph_reference: 'AICTE Approval Process Handbook 2024-25, Chapter 2',
    change_reason: 'Incorporated automated OCR land deed cross-matching and 15-day EVC window',
    stages: [
      { id: 'APPLICATION_SUBMITTED', name: 'Application Ingestion', owner_role: 'INSTITUTION', deadline_days: 0 },
      { id: 'SCRUTINY_STAGE', name: 'Document Scrutiny & OCR Cross-Match', owner_role: 'REGIONAL_OFFICER', deadline_days: 15 },
      { id: 'DEFICIENCY_WINDOW', name: 'Deficiency Correction Window', owner_role: 'INSTITUTION', deadline_days: 10 },
      { id: 'EVC_INSPECTION', name: 'Expert Visit Committee (EVC)', owner_role: 'EVC_COORDINATOR', deadline_days: 20 },
      { id: 'SAC_SHC_REVIEW', name: 'Standing Hearing Committee (If Deficient)', owner_role: 'BUREAU_SUPERVISOR', deadline_days: 10 },
      { id: 'FINAL_DECISION', name: 'Issuance of EoA / Rejection Letter', owner_role: 'COMPETENT_AUTHORITY', deadline_days: 7 }
    ],
    yaml_config: `workflow:
  id: "WF-SCRUTINY-EVC-V1"
  version: "1.2.0"
  application_type: "ENGINEERING_UG_PG"
  effective_dates:
    from: "2024-01-01"
    to: "2025-12-31"
  governance:
    requires_two_person_approval: true
    allow_deadline_override_with_reason: true
  stages:
    - id: "SCRUTINY"
      owner_role: "REGIONAL_OFFICER"
      sla_days: 15
      business_days_only: true
      completion_requires: ["all_mandatory_docs_verified"]
      on_deficiency: "ROUTE_TO_DEFICIENCY_WINDOW"
    - id: "EVC"
      owner_role: "EVC_COORDINATOR"
      sla_days: 20
      requires_conflict_clearance: true
      completion_requires: ["onsite_visit_uploaded", "biometric_logged"]
    - id: "FINAL_BUREAU"
      owner_role: "BUREAU_OFFICER"
      sla_days: 7
`
  },
  {
    workflow_id: 'WF-ONLY-SCRUTINY-V2',
    name: 'Standalone Diploma / Self-Certified Institutions (No EVC)',
    application_type: 'Extension of Approval (Clean Track Record)',
    version: '2.0.1',
    status: 'PUBLISHED_ACTIVE',
    effective_from: '2024-06-01',
    effective_to: '2026-05-31',
    author: 'AICTE Reforms Committee',
    approved_by: 'Vice Chairman, AICTE',
    source_aph_reference: 'AICTE APH 2024-25, Clause 1.4.1 (Green Channel)',
    change_reason: 'Self-declaration track for NBA accredited tier-1 colleges',
    stages: [
      { id: 'APPLICATION_SUBMITTED', name: 'Application Ingestion', owner_role: 'INSTITUTION', deadline_days: 0 },
      { id: 'DESK_SCRUTINY', name: 'Digital Desk Scrutiny', owner_role: 'REGIONAL_OFFICER', deadline_days: 10 },
      { id: 'AUTO_APPROVAL', name: 'System Assisted EoA Dispatch', owner_role: 'COMPETENT_AUTHORITY', deadline_days: 5 }
    ],
    yaml_config: `workflow:
  id: "WF-ONLY-SCRUTINY-V2"
  version: "2.0.1"
  application_type: "NBA_ACCREDITED_GREEN_CHANNEL"
  effective_dates:
    from: "2024-06-01"
    to: "2026-05-31"
  stages:
    - id: "DESK_SCRUTINY"
      owner_role: "REGIONAL_OFFICER"
      sla_days: 10
      business_days_only: true
`
  }
]

// 9. ALERT & ESCALATION RULES & NOTIFICATION QUEUE
export const ESCALATION_RULES = [
  {
    rule_id: 'RULE-T30',
    trigger: 'T-30 Days',
    offset_days: 30,
    target_role: 'INSTITUTION',
    channel: 'IN_APP & EMAIL',
    description: 'Advance notice for document expiration or upcoming compliance deadline',
    business_calendar_aware: true,
    active: true
  },
  {
    rule_id: 'RULE-T07',
    trigger: 'T-7 Days',
    offset_days: 7,
    target_role: 'REGIONAL_OFFICER & INSTITUTION',
    channel: 'IN_APP & SMS_SIMULATED',
    description: 'Urgent reminder: SLA expiration approaching within 1 week',
    business_calendar_aware: true,
    active: true
  },
  {
    rule_id: 'RULE-T01',
    trigger: 'T-1 Day',
    offset_days: 1,
    target_role: 'ASSIGNED_OFFICER',
    channel: 'IN_APP_POPUP & EMAIL_SIMULATED',
    description: 'Critical 24-hour warning before automated escalation event',
    business_calendar_aware: false,
    active: true
  },
  {
    rule_id: 'RULE-OVERDUE',
    trigger: 'Deadline Passed (T+0)',
    offset_days: 0,
    target_role: 'BUREAU_SUPERVISOR',
    channel: 'IN_APP_ESCALATION & DIGEST',
    description: 'Automatic level-1 administrative escalation to Bureau Officer',
    business_calendar_aware: true,
    active: true
  }
]

export const NOTIFICATION_JOBS_LOG = [
  {
    job_id: 'JOB-9021',
    idempotency_key: 'IDEMP-OBL-101-T07-20261029',
    obligation_id: 'OBL-2026-00101',
    recipient: 'Dr. Rajesh Kumar (Regional Officer)',
    channel: 'IN_APP',
    event: 'T-7 Scrutiny SLA Approaching',
    scheduled_for: '2026-10-29 09:00',
    dispatched_at: '2026-10-29 09:00:12',
    delivery_status: 'DELIVERED',
    acknowledgement_status: 'ACKNOWLEDGED_BY_USER',
    acknowledged_at: '2026-10-29 09:45',
    payload_summary: 'SLA deadline for Apex Institute scrutiny in 6 days'
  },
  {
    job_id: 'JOB-9022',
    idempotency_key: 'IDEMP-OBL-103-OVERDUE-20261028',
    obligation_id: 'OBL-2026-00103',
    recipient: 'Prof. K. V. S. Murthy (Bureau Supervisor)',
    channel: 'ESCALATION_QUEUE',
    event: 'LEVEL_1_OVERDUE_ESCALATION',
    scheduled_for: '2026-10-28 17:01',
    dispatched_at: '2026-10-28 17:01:05',
    delivery_status: 'DELIVERED',
    acknowledgement_status: 'PENDING_REVIEW',
    acknowledged_at: null,
    payload_summary: 'Kalinga Institute undertaking overdue by 48 hours'
  },
  {
    job_id: 'JOB-9023',
    idempotency_key: 'IDEMP-OBL-102-T15-20261028',
    obligation_id: 'OBL-2026-00102',
    recipient: 'Prof. S. K. Mahajan (EVC Coordinator)',
    channel: 'IN_APP',
    event: 'T-15 EVC Planning Window Notice',
    scheduled_for: '2026-10-28 09:00',
    dispatched_at: '2026-10-28 09:00:08',
    delivery_status: 'DELIVERED',
    acknowledgement_status: 'ACKNOWLEDGED_BY_USER',
    acknowledged_at: '2026-10-28 11:30',
    payload_summary: 'Committee slot availability locked for Delhi Institute'
  }
]

// 10. CRYPTOGRAPHICALLY HASH-CHAINED AUDIT EVENTS (SHA-256 SIMULATED CONTINUITY)
export const AUDIT_TRAIL_CHAIN = [
  {
    block_index: 1,
    event_id: 'EVT-001',
    timestamp: '2026-10-14T14:22:10Z',
    actor_id: 'USR-INST-001 (Dr. Ramesh Patil)',
    action: 'APPLICATION_SUBMITTED',
    entity_type: 'APPLICATION',
    entity_id: 'AICTE-2024-00145',
    previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    event_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'CHAIN_VALID',
    reason: 'Initial electronic submission of EoA 2024-25 with 4 attachments',
    metadata: { ip_address: '103.21.144.12', client: 'React Web Portal v1.0' }
  },
  {
    block_index: 2,
    event_id: 'EVT-002',
    timestamp: '2026-10-15T09:30:00Z',
    actor_id: 'SYSTEM_SCHEDULER',
    action: 'OBLIGATION_CREATED',
    entity_type: 'OBLIGATION',
    entity_id: 'OBL-2026-00101',
    previous_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    event_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'CHAIN_VALID',
    reason: 'Initialized Scrutiny Obligation Clock under policy WF-SCRUTINY-EVC-V1',
    metadata: { due_date: '2026-11-05T17:00:00Z', assigned_role: 'REGIONAL_OFFICER' }
  },
  {
    block_index: 3,
    event_id: 'EVT-003',
    timestamp: '2026-10-25T14:30:00Z',
    actor_id: 'USR-001 (Dr. Rajesh Kumar)',
    action: 'DEFICIENCY_RAISED',
    entity_type: 'DEFICIENCY_TICKET',
    entity_id: 'DEF-2026-081',
    previous_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    event_hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    status: 'CHAIN_VALID',
    reason: 'Mandatory reason: Expired Fire Safety Certificate (DEF-SAFE-01)',
    metadata: { aph_clause: 'Chapter II, Clause 2.14.3', days_granted: 10 }
  },
  {
    block_index: 4,
    event_id: 'EVT-004',
    timestamp: '2026-10-27T10:15:30Z',
    actor_id: 'USR-INST-001 (Dr. Ramesh Patil)',
    action: 'EVIDENCE_RESUBMITTED',
    entity_type: 'EVIDENCE_ATTACHMENT',
    entity_id: 'evi-991',
    previous_hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    event_hash: '2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9bbd011cf2b4b1727a',
    status: 'CHAIN_VALID',
    reason: 'Uploaded PCMC Fire inspection fee payment receipt and provisional slip',
    metadata: { file_hash: 'sha256-a1b2c3d4e5f6', size_bytes: 1245000 }
  },
  {
    block_index: 5,
    event_id: 'EVT-005',
    timestamp: '2026-10-29T09:00:12Z',
    actor_id: 'SCHEDULER_WORKER',
    action: 'REMINDER_JOB_DISPATCHED',
    entity_type: 'NOTIFICATION_JOB',
    entity_id: 'JOB-9021',
    previous_hash: '2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9bbd011cf2b4b1727a',
    event_hash: '9f83c60bee855b4e722b406e4099eed71f543666b6c00d41e7372cfbe8ee6d39',
    status: 'CHAIN_VALID',
    reason: 'Idempotent T-7 Alert queued and delivered to Regional Officer inbox',
    metadata: { idempotency_key: 'IDEMP-OBL-101-T07-20261029' }
  }
]
