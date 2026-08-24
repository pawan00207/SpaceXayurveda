// Core domain types for AIIA CTMS

export type UserRole =
  | 'principal_investigator'
  | 'study_coordinator'
  | 'clinical_monitor'
  | 'ethics_committee'
  | 'pharmacovigilance'
  | 'admin';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  createdAt: string;
  lastLogin: string;
}

export type StudyStatus = 'Active' | 'Paused' | 'Completed' | 'Terminated';
export type ApprovalStatus = 'Approved' | 'Pending' | 'Expired' | 'Not Required';
export type CtriStatus = 'Registered' | 'Pending' | 'Update Pending' | 'Not Registered';

export interface Site {
  id: string;
  name: string;
  target: number;
  enrolled: number;
  activatedDate: string;
}

export interface Milestone {
  name: string;
  status: 'Completed' | 'Pending' | 'Overdue';
  dueDate?: string;
  completedDate?: string;
  meta?: string;
}

export interface AuditEntry {
  logId: string;
  entityType: 'study' | 'enrollment' | 'adverse_event' | 'approval' | 'user';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  changes: { field: string; before: string; after: string }[];
}

export interface Study {
  studyId: string;
  title: string;
  pi: string;
  status: StudyStatus;
  primarySponsor: string;
  startDate: string;
  targetEnrollment: number;
  currentEnrolled: number;
  screened: number;
  eligible: number;
  sites: Site[];
  ethicsApproval: {
    status: ApprovalStatus;
    approvalDate: string;
    expiryDate: string;
    committeeName: string;
    approvalId: string;
  };
  ctri: {
    status: CtriStatus;
    regNo: string;
    registrationDate: string;
    protocolId: string;
  };
  milestones: Milestone[];
  gcpChecklist: GcpChecklistItem[];
  dataQuality: {
    completeness: number;
    forms: { name: string; score: number }[];
  };
  queries: Query[];
  upcomingActions: { action: string; dueDate: string }[];
  enrolledVelocity: { date: string; count: number }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface GcpChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedDate?: string;
}

export interface Query {
  queryId: string;
  dateRaised: string;
  status: 'Open' | 'Responded' | 'Resolved' | 'Closed';
  daysOpen: number;
  raisedBy: string;
  assignedTo: string;
}

export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
export type Seriousness = 'Non-Serious AE' | 'Serious AE';
export type Causality = 'Unrelated' | 'Unlikely' | 'Possible' | 'Probable' | 'Definite';
export type AeOutcome = 'Recovered' | 'Recovering' | 'Not Recovered' | 'Permanent' | 'Unclear' | 'Fatal';
export type ActionTaken = 'None' | 'Dose Reduction' | 'Dose Held' | 'Discontinued';
export type AeStatus = 'Pending' | 'Submitted' | 'Under Review' | 'Closed';

export interface AdverseEvent {
  aeId: string;
  reportId: string;
  studyId: string;
  studyTitle: string;
  patientId: string;
  eventDate: string;
  reportedDate: string;
  description: string;
  severity: SeverityLevel;
  seriousness: Seriousness;
  soc: string;
  preferredTerm: string;
  actionTaken: ActionTaken;
  outcome: AeOutcome;
  causality: Causality;
  reporterName: string;
  reporterContact: string;
  status: AeStatus;
  regulatoryDueDate: string;
  daysToReport: number;
  createdAt: string;
  createdBy: string;
}

export interface Alert {
  id: string;
  studyId: string;
  studyTitle: string;
  severity: 'red' | 'yellow' | 'blue';
  category: string;
  title: string;
  description: string;
  dueDate?: string;
  daysOverdue?: number;
}

export type AlertSeverity = 'red' | 'yellow' | 'blue';

export interface AlertConfig {
  id: string;
  studyId: string;
  type: 'sae_overdue' | 'ethics_expiring' | 'ctri_pending' | 'enrollment_lag' | 'monitoring_due';
  thresholdDays: number;
  thresholdPercent: number;
  enabled: boolean;
}

// MedDRA System Organ Classes (26)
export const MEDDRA_SOCS: { soc: string; terms: string[] }[] = [
  { soc: 'Blood and Lymphatic System Disorders', terms: ['Anaemia', 'Leukocytosis', 'Thrombocytopenia'] },
  { soc: 'Cardiac Disorders', terms: ['Arrhythmia', 'Palpitations', 'Bradycardia', 'Tachycardia'] },
  { soc: 'Congenital, Familial and Genetic Disorders', terms: ['Congenital anomaly'] },
  { soc: 'Ear and Labyrinth Disorders', terms: ['Vertigo', 'Tinnitus'] },
  { soc: 'Endocrine Disorders', terms: ['Thyroid dysfunction', 'Hyperglycaemia'] },
  { soc: 'Eye Disorders', terms: ['Blurred vision', 'Dry eye', 'Conjunctivitis'] },
  { soc: 'Gastrointestinal Disorders', terms: ['Nausea', 'Vomiting', 'Diarrhoea', 'Constipation', 'Abdominal pain', 'Dyspepsia'] },
  { soc: 'General Disorders and Administration Site Conditions', terms: ['Fatigue', 'Pyrexia', 'Oedema', 'Asthenia'] },
  { soc: 'Hepatobiliary Disorders', terms: ['Hepatic dysfunction', 'Jaundice'] },
  { soc: 'Immune System Disorders', terms: ['Hypersensitivity', 'Anaphylaxis'] },
  { soc: 'Infections and Infestations', terms: ['Upper respiratory tract infection', 'Urinary tract infection'] },
  { soc: 'Injury, Poisoning and Procedural Complications', terms: ['Fall', 'Procedural pain'] },
  { soc: 'Investigations', terms: ['Liver enzyme increased', 'Blood pressure increased'] },
  { soc: 'Metabolism and Nutrition Disorders', terms: ['Decreased appetite', 'Hyperglycaemia', 'Hypokalaemia'] },
  { soc: 'Musculoskeletal and Connective Tissue Disorders', terms: ['Myalgia', 'Arthralgia', 'Back pain', 'Muscle spasms'] },
  { soc: 'Neoplasms (Benign, Malignant and Unspecified)', terms: ['Neoplasm'] },
  { soc: 'Nervous System Disorders', terms: ['Headache', 'Dizziness', 'Somnolence', 'Paraesthesia', 'Tremor'] },
  { soc: 'Pregnancy, Puerperium and Perinatal Conditions', terms: ['Pregnancy'] },
  { soc: 'Psychiatric Disorders', terms: ['Insomnia', 'Anxiety', 'Depression', 'Irritability'] },
  { soc: 'Renal and Urinary Disorders', terms: ['Dysuria', 'Renal impairment'] },
  { soc: 'Reproductive System and Breast Disorders', terms: ['Menstrual disorder'] },
  { soc: 'Respiratory, Thoracic and Mediastinal Disorders', terms: ['Cough', 'Dyspnoea', 'Nasal congestion', 'Pharyngitis'] },
  { soc: 'Skin and Subcutaneous Tissue Disorders', terms: ['Rash', 'Pruritus', 'Urticaria', 'Hyperhidrosis'] },
  { soc: 'Social Circumstances', terms: ['Drug interaction'] },
  { soc: 'Surgical and Medical Procedures', terms: ['Medical procedure'] },
  { soc: 'Vascular Disorders', terms: ['Hypertension', 'Hypotension', 'Hot flush'] },
];

export const ETHICS_COMMITTEES = [
  'Institutional Ethics Committee, AIIA New Delhi',
  'Ethics Committee, AIIA Pune',
  'Independent Ethics Committee, Mumbai',
  'Institutional Review Board, AIIMS Delhi',
  'Ethics Committee for Research on Human Subjects, NIMHANS Bengaluru',
  'Institutional Ethics Committee, PGIMER Chandigarh',
  'Ethics Review Committee, KGMU Lucknow',
  'Human Ethics Committee, JIPMER Puducherry',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  principal_investigator: 'Principal Investigator',
  study_coordinator: 'Study Coordinator',
  clinical_monitor: 'Clinical Monitor',
  ethics_committee: 'Ethics Committee Member',
  pharmacovigilance: 'Pharmacovigance Officer',
  admin: 'Administrator',
};

export const ROLE_PERMISSIONS: Record<UserRole, {
  canViewAllStudies: boolean;
  canEditStudies: boolean;
  canViewSafety: boolean;
  canEditSafety: boolean;
  canViewAudit: boolean;
  canViewApprovals: boolean;
  canManageUsers: boolean;
  canExport: boolean;
}> = {
  principal_investigator: {
    canViewAllStudies: false, canEditStudies: true, canViewSafety: true,
    canEditSafety: false, canViewAudit: false, canViewApprovals: true, canManageUsers: false, canExport: true,
  },
  study_coordinator: {
    canViewAllStudies: false, canEditStudies: true, canViewSafety: false,
    canEditSafety: false, canViewAudit: false, canViewApprovals: true, canManageUsers: false, canExport: true,
  },
  clinical_monitor: {
    canViewAllStudies: true, canEditStudies: true, canViewSafety: true,
    canEditSafety: true, canViewAudit: true, canViewApprovals: true, canManageUsers: false, canExport: true,
  },
  ethics_committee: {
    canViewAllStudies: true, canEditStudies: false, canViewSafety: false,
    canEditSafety: false, canViewAudit: false, canViewApprovals: true, canManageUsers: false, canExport: true,
  },
  pharmacovigilance: {
    canViewAllStudies: true, canEditStudies: false, canViewSafety: true,
    canEditSafety: true, canViewAudit: false, canViewApprovals: false, canManageUsers: false, canExport: true,
  },
  admin: {
    canViewAllStudies: true, canEditStudies: true, canViewSafety: true,
    canEditSafety: true, canViewAudit: true, canViewApprovals: true, canManageUsers: true, canExport: true,
  },
};
