import type { Study, AdverseEvent, User, Alert, AuditEntry, GcpChecklistItem } from '@/types';

// ==================== USERS ====================
export const MOCK_USERS: User[] = [
  { uid: 'u001', email: 'pi@aiia.gov.in', name: 'Dr. Raj Kumar', role: 'principal_investigator', department: 'Kayachikitsa', createdAt: '2024-01-01T00:00:00Z', lastLogin: '2026-08-21T08:30:00Z' },
  { uid: 'u002', email: 'coordinator@aiia.gov.in', name: 'Anita Desai', role: 'study_coordinator', department: 'Clinical Research', createdAt: '2024-01-05T00:00:00Z', lastLogin: '2026-08-21T07:45:00Z' },
  { uid: 'u003', email: 'monitor@aiia.gov.in', name: 'Dr. Vikram Singh', role: 'clinical_monitor', department: 'Clinical Operations', createdAt: '2024-01-10T00:00:00Z', lastLogin: '2026-08-21T09:00:00Z' },
  { uid: 'u004', email: 'ethics@aiia.gov.in', name: 'Prof. Meena Iyer', role: 'ethics_committee', department: 'Ethics Review', createdAt: '2024-01-15T00:00:00Z', lastLogin: '2026-08-20T14:20:00Z' },
  { uid: 'u005', email: 'pharma@aiia.gov.in', name: 'Dr. Sanjay Gupta', role: 'pharmacovigilance', department: 'Pharmacovigilance', createdAt: '2024-01-20T00:00:00Z', lastLogin: '2026-08-21T06:15:00Z' },
  { uid: 'u006', email: 'admin@aiia.gov.in', name: 'Dr. Priya Sharma', role: 'admin', department: 'Administration', createdAt: '2024-01-01T00:00:00Z', lastLogin: '2026-08-21T10:00:00Z' },
];

// Password for all demo accounts
export const DEMO_PASSWORD = 'aiia2024';

// ==================== GCP CHECKLIST TEMPLATE ====================
const GCP_ITEMS: { id: string; label: string }[] = [
  { id: 'g1', label: 'Informed Consent Form approved' },
  { id: 'g2', label: 'Safety report filed with ethics committee' },
  { id: 'g3', label: 'Adverse event tracking initiated' },
  { id: 'g4', label: 'Protocol deviations documented' },
  { id: 'g5', label: "Monitor's Report submitted" },
  { id: 'g6', label: 'Data Quality Review completed' },
  { id: 'g7', label: 'Investigator brochure current' },
  { id: 'g8', label: 'Source data verification completed' },
  { id: 'g9', label: 'Regulatory approvals obtained' },
  { id: 'g10', label: 'Trial Master File indexed' },
  { id: 'g11', label: 'Essential documents archived' },
  { id: 'g12', label: 'Risk assessment documented' },
];

function buildChecklist(completedIndices: number[]): GcpChecklistItem[] {
  return GCP_ITEMS.map((item, i) => ({
    ...item,
    completed: completedIndices.includes(i),
    completedDate: completedIndices.includes(i)
      ? `2024-0${(i % 6) + 1}-15T00:00:00Z`
      : undefined,
  }));
}

// ==================== ENROLLMENT VELOCITY (30 days) ====================
function buildVelocity(startCount: number, endCount: number): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const today = new Date('2026-08-21');
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const progress = (29 - i) / 29;
    const count = Math.round(startCount + (endCount - startCount) * progress);
    data.push({ date: d.toISOString().slice(0, 10), count });
  }
  return data;
}

// ==================== STUDIES ====================
export const MOCK_STUDIES: Study[] = [
  {
    studyId: 'AIIA-2024-001',
    title: 'RCT of Ashwagandha in ADHD',
    pi: 'Dr. Raj Kumar',
    status: 'Active',
    primarySponsor: 'AIIA',
    startDate: '2024-01-15',
    targetEnrollment: 100,
    currentEnrolled: 65,
    screened: 112,
    eligible: 78,
    sites: [
      { id: 's1', name: 'AIIA Delhi', target: 40, enrolled: 28, activatedDate: '2024-01-20' },
      { id: 's2', name: 'AIIA Pune', target: 35, enrolled: 22, activatedDate: '2024-02-01' },
      { id: 's3', name: 'Regional Research Center, Jaipur', target: 25, enrolled: 15, activatedDate: '2024-02-15' },
    ],
    ethicsApproval: {
      status: 'Approved', approvalDate: '2024-06-15', expiryDate: '2025-06-15',
      committeeName: 'Institutional Ethics Committee, AIIA New Delhi', approvalId: 'IEC/AIIA/2024/042',
    },
    ctri: { status: 'Registered', regNo: 'CTRI/2024/04/056789', registrationDate: '2024-04-10', protocolId: 'AIIA-ADHD-001' },
    milestones: [
      { name: 'Protocol Approval', status: 'Completed', completedDate: '2024-01-10' },
      { name: 'Ethics Approval', status: 'Completed', completedDate: '2024-06-15' },
      { name: 'CTRI Registration', status: 'Completed', completedDate: '2024-04-10', meta: 'CTRI/2024/04/056789' },
      { name: 'First Site Activation', status: 'Completed', completedDate: '2024-01-20' },
      { name: 'First Patient Enrolled', status: 'Completed', completedDate: '2024-03-05' },
      { name: 'Last Patient Enrolled', status: 'Pending', dueDate: '2026-12-01' },
      { name: 'Final Report Due', status: 'Pending', dueDate: '2027-06-30' },
    ],
    gcpChecklist: buildChecklist([0, 1, 2, 3, 6, 8, 9]),
    dataQuality: {
      completeness: 92,
      forms: [
        { name: 'Demographics', score: 98 },
        { name: 'Vital Signs', score: 91 },
        { name: 'Medical History', score: 95 },
        { name: 'Adverse Events', score: 100 },
        { name: 'Concomitant Meds', score: 84 },
        { name: 'Efficacy Assessments', score: 87 },
      ],
    },
    queries: [
      { queryId: 'Q-001-01', dateRaised: '2026-08-01', status: 'Open', daysOpen: 20, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Anita Desai' },
      { queryId: 'Q-001-02', dateRaised: '2026-08-05', status: 'Responded', daysOpen: 16, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Dr. Raj Kumar' },
      { queryId: 'Q-001-03', dateRaised: '2026-08-10', status: 'Resolved', daysOpen: 11, raisedBy: 'Anita Desai', assignedTo: 'Dr. Raj Kumar' },
      { queryId: 'Q-001-04', dateRaised: '2026-08-15', status: 'Closed', daysOpen: 6, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Anita Desai' },
      { queryId: 'Q-001-05', dateRaised: '2026-08-19', status: 'Open', daysOpen: 2, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Dr. Raj Kumar' },
    ],
    upcomingActions: [
      { action: 'Submit Interim Safety Report', dueDate: '2026-09-01' },
      { action: 'Monitoring Visit - AIIA Pune', dueDate: '2026-09-10' },
      { action: 'Data Quality Review', dueDate: '2026-09-15' },
      { action: 'Ethics Committee Progress Report', dueDate: '2026-10-01' },
      { action: 'Protocol Amendment Review', dueDate: '2026-10-15' },
    ],
    enrolledVelocity: buildVelocity(45, 65),
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2026-08-21T05:30:00Z',
    createdBy: 'Dr. Priya Sharma (Admin)', lastModifiedBy: 'Dr. Vikram Singh (Clinical Monitor)',
  },
  {
    studyId: 'AIIA-2024-002',
    title: 'Observational Study: Ayurveda in Type-2 Diabetes',
    pi: 'Dr. Priya Sharma',
    status: 'Active',
    primarySponsor: 'AIIA',
    startDate: '2024-03-01',
    targetEnrollment: 200,
    currentEnrolled: 145,
    screened: 220,
    eligible: 175,
    sites: [
      { id: 's1', name: 'AIIA Delhi', target: 50, enrolled: 38, activatedDate: '2024-03-10' },
      { id: 's2', name: 'AIIA Pune', target: 40, enrolled: 30, activatedDate: '2024-03-15' },
      { id: 's3', name: 'Regional Research Center, Jaipur', target: 40, enrolled: 28, activatedDate: '2024-04-01' },
      { id: 's4', name: 'NIA Jaipur', target: 40, enrolled: 29, activatedDate: '2024-04-10' },
      { id: 's5', name: 'ITRA Jamnagar', target: 30, enrolled: 20, activatedDate: '2024-05-01' },
    ],
    ethicsApproval: {
      status: 'Approved', approvalDate: '2025-08-20', expiryDate: '2026-08-20',
      committeeName: 'Institutional Ethics Committee, AIIA New Delhi', approvalId: 'IEC/AIIA/2024/078',
    },
    ctri: { status: 'Pending', regNo: '', registrationDate: '', protocolId: 'AIIA-DM-002' },
    milestones: [
      { name: 'Protocol Approval', status: 'Completed', completedDate: '2024-02-20' },
      { name: 'Ethics Approval', status: 'Completed', completedDate: '2024-02-25' },
      { name: 'CTRI Registration', status: 'Overdue', dueDate: '2024-04-01', meta: 'Pending - 12 days overdue' },
      { name: 'First Site Activation', status: 'Completed', completedDate: '2024-03-10' },
      { name: 'First Patient Enrolled', status: 'Completed', completedDate: '2024-04-05' },
      { name: 'Last Patient Enrolled', status: 'Pending', dueDate: '2026-10-01' },
      { name: 'Final Report Due', status: 'Pending', dueDate: '2027-03-30' },
    ],
    gcpChecklist: buildChecklist([0, 2, 3, 6, 8]),
    dataQuality: {
      completeness: 88,
      forms: [
        { name: 'Demographics', score: 96 },
        { name: 'Vital Signs', score: 87 },
        { name: 'Medical History', score: 92 },
        { name: 'Adverse Events', score: 95 },
        { name: 'Concomitant Meds', score: 79 },
        { name: 'Efficacy Assessments', score: 82 },
      ],
    },
    queries: [
      { queryId: 'Q-002-01', dateRaised: '2026-08-03', status: 'Open', daysOpen: 18, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Anita Desai' },
      { queryId: 'Q-002-02', dateRaised: '2026-08-08', status: 'Responded', daysOpen: 13, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Dr. Priya Sharma' },
      { queryId: 'Q-002-03', dateRaised: '2026-08-12', status: 'Open', daysOpen: 9, raisedBy: 'Anita Desai', assignedTo: 'Dr. Priya Sharma' },
      { queryId: 'Q-002-04', dateRaised: '2026-08-18', status: 'Resolved', daysOpen: 3, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Anita Desai' },
    ],
    upcomingActions: [
      { action: 'Complete CTRI Registration (OVERDUE)', dueDate: '2026-08-21' },
      { action: 'SAE Report Follow-up', dueDate: '2026-08-25' },
      { action: 'Site Monitoring - NIA Jaipur', dueDate: '2026-09-05' },
      { action: 'Quarterly Progress Report', dueDate: '2026-09-20' },
      { action: 'Data Lock Preparation', dueDate: '2026-10-15' },
    ],
    enrolledVelocity: buildVelocity(120, 145),
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2026-08-21T04:15:00Z',
    createdBy: 'Dr. Priya Sharma (Admin)', lastModifiedBy: 'Dr. Priya Sharma (Principal Investigator)',
  },
  {
    studyId: 'AIIA-2024-003',
    title: 'Asthma Management with Herbal Protocol',
    pi: 'Dr. Arjun Mehta',
    status: 'Paused',
    primarySponsor: 'AIIA',
    startDate: '2023-11-01',
    targetEnrollment: 80,
    currentEnrolled: 22,
    screened: 45,
    eligible: 30,
    sites: [
      { id: 's1', name: 'AIIA Delhi', target: 40, enrolled: 12, activatedDate: '2023-11-15' },
      { id: 's2', name: 'AIIA Pune', target: 25, enrolled: 7, activatedDate: '2023-12-01' },
      { id: 's3', name: 'Regional Research Center, Jaipur', target: 15, enrolled: 3, activatedDate: '2023-12-15' },
    ],
    ethicsApproval: {
      status: 'Expired', approvalDate: '2023-06-01', expiryDate: '2024-06-01',
      committeeName: 'Ethics Committee, AIIA Pune', approvalId: 'IEC/AIIA-P/2023/015',
    },
    ctri: { status: 'Registered', regNo: 'CTRI/2023/11/045678', registrationDate: '2023-10-15', protocolId: 'AIIA-ASM-003' },
    milestones: [
      { name: 'Protocol Approval', status: 'Completed', completedDate: '2023-09-15' },
      { name: 'Ethics Approval', status: 'Completed', completedDate: '2023-06-01' },
      { name: 'CTRI Registration', status: 'Completed', completedDate: '2023-10-15', meta: 'CTRI/2023/11/045678' },
      { name: 'First Site Activation', status: 'Completed', completedDate: '2023-11-15' },
      { name: 'First Patient Enrolled', status: 'Completed', completedDate: '2023-12-20' },
      { name: 'Last Patient Enrolled', status: 'Pending', dueDate: '2026-06-01' },
      { name: 'Final Report Due', status: 'Pending', dueDate: '2026-12-01' },
    ],
    gcpChecklist: buildChecklist([0, 1, 2, 8]),
    dataQuality: {
      completeness: 75,
      forms: [
        { name: 'Demographics', score: 90 },
        { name: 'Vital Signs', score: 78 },
        { name: 'Medical History', score: 82 },
        { name: 'Adverse Events', score: 88 },
        { name: 'Concomitant Meds', score: 65 },
        { name: 'Efficacy Assessments', score: 72 },
      ],
    },
    queries: [
      { queryId: 'Q-003-01', dateRaised: '2026-07-15', status: 'Open', daysOpen: 37, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Dr. Arjun Mehta' },
      { queryId: 'Q-003-02', dateRaised: '2026-07-20', status: 'Open', daysOpen: 32, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Anita Desai' },
    ],
    upcomingActions: [
      { action: 'Renew Ethics Approval (EXPIRED)', dueDate: '2024-06-01' },
      { action: 'Resume recruitment pending EC approval', dueDate: '2026-09-30' },
      { action: 'Investigator re-training', dueDate: '2026-10-15' },
      { action: 'Protocol deviation review', dueDate: '2026-10-30' },
      { action: 'Updated IB distribution', dueDate: '2026-11-15' },
    ],
    enrolledVelocity: buildVelocity(18, 22),
    createdAt: '2023-11-01T00:00:00Z', updatedAt: '2026-08-15T11:20:00Z',
    createdBy: 'Dr. Priya Sharma (Admin)', lastModifiedBy: 'Dr. Priya Sharma (Admin)',
  },
  {
    studyId: 'AIIA-2024-004',
    title: 'IBS Treatment RCT',
    pi: 'Dr. Nisha Reddy',
    status: 'Completed',
    primarySponsor: 'AIIA',
    startDate: '2023-06-01',
    targetEnrollment: 120,
    currentEnrolled: 120,
    screened: 150,
    eligible: 132,
    sites: [
      { id: 's1', name: 'AIIA Delhi', target: 50, enrolled: 50, activatedDate: '2023-06-10' },
      { id: 's2', name: 'AIIA Pune', target: 40, enrolled: 40, activatedDate: '2023-06-20' },
      { id: 's3', name: 'Regional Research Center, Jaipur', target: 30, enrolled: 30, activatedDate: '2023-07-01' },
    ],
    ethicsApproval: {
      status: 'Approved', approvalDate: '2023-04-10', expiryDate: '2024-04-10',
      committeeName: 'Independent Ethics Committee, Mumbai', approvalId: 'IEC-MUM/2023/089',
    },
    ctri: { status: 'Registered', regNo: 'CTRI/2023/05/034567', registrationDate: '2023-05-15', protocolId: 'AIIA-IBS-004' },
    milestones: [
      { name: 'Protocol Approval', status: 'Completed', completedDate: '2023-03-15' },
      { name: 'Ethics Approval', status: 'Completed', completedDate: '2023-04-10' },
      { name: 'CTRI Registration', status: 'Completed', completedDate: '2023-05-15', meta: 'CTRI/2023/05/034567' },
      { name: 'First Site Activation', status: 'Completed', completedDate: '2023-06-10' },
      { name: 'First Patient Enrolled', status: 'Completed', completedDate: '2023-07-01' },
      { name: 'Last Patient Enrolled', status: 'Completed', completedDate: '2025-03-15' },
      { name: 'Final Report Due', status: 'Pending', dueDate: '2026-12-30' },
    ],
    gcpChecklist: buildChecklist([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    dataQuality: {
      completeness: 98,
      forms: [
        { name: 'Demographics', score: 100 },
        { name: 'Vital Signs', score: 98 },
        { name: 'Medical History', score: 99 },
        { name: 'Adverse Events', score: 100 },
        { name: 'Concomitant Meds', score: 96 },
        { name: 'Efficacy Assessments', score: 97 },
      ],
    },
    queries: [
      { queryId: 'Q-004-01', dateRaised: '2026-06-01', status: 'Closed', daysOpen: 0, raisedBy: 'Dr. Vikram Singh', assignedTo: 'Dr. Nisha Reddy' },
      { queryId: 'Q-004-02', dateRaised: '2026-06-05', status: 'Closed', daysOpen: 0, raisedBy: 'Anita Desai', assignedTo: 'Dr. Nisha Reddy' },
    ],
    upcomingActions: [
      { action: 'Final CSR Submission', dueDate: '2026-12-30' },
      { action: 'Trial Master File Finalization', dueDate: '2026-11-15' },
      { action: 'Data Archive', dueDate: '2026-11-30' },
      { action: 'Publication Preparation', dueDate: '2027-01-15' },
      { action: 'Regulatory Closure Notification', dueDate: '2026-12-15' },
    ],
    enrolledVelocity: buildVelocity(110, 120),
    createdAt: '2023-06-01T00:00:00Z', updatedAt: '2026-08-10T14:00:00Z',
    createdBy: 'Dr. Priya Sharma (Admin)', lastModifiedBy: 'Dr. Nisha Reddy (Principal Investigator)',
  },
  {
    studyId: 'AIIA-2024-005',
    title: 'Rheumatoid Arthritis Observational Study',
    pi: 'Dr. Suresh Patel',
    status: 'Active',
    primarySponsor: 'AIIA',
    startDate: '2024-07-01',
    targetEnrollment: 150,
    currentEnrolled: 0,
    screened: 5,
    eligible: 2,
    sites: [
      { id: 's1', name: 'AIIA Delhi', target: 60, enrolled: 0, activatedDate: '2024-07-15' },
      { id: 's2', name: 'AIIA Pune', target: 50, enrolled: 0, activatedDate: '2024-08-01' },
      { id: 's3', name: 'NIA Jaipur', target: 40, enrolled: 0, activatedDate: '2024-08-15' },
    ],
    ethicsApproval: {
      status: 'Approved', approvalDate: '2024-06-20', expiryDate: '2025-06-20',
      committeeName: 'Institutional Ethics Committee, AIIA New Delhi', approvalId: 'IEC/AIIA/2024/091',
    },
    ctri: { status: 'Registered', regNo: 'CTRI/2024/06/067890', registrationDate: '2024-06-25', protocolId: 'AIIA-RA-005' },
    milestones: [
      { name: 'Protocol Approval', status: 'Completed', completedDate: '2024-05-15' },
      { name: 'Ethics Approval', status: 'Completed', completedDate: '2024-06-20' },
      { name: 'CTRI Registration', status: 'Completed', completedDate: '2024-06-25', meta: 'CTRI/2024/06/067890' },
      { name: 'First Site Activation', status: 'Completed', completedDate: '2024-07-15' },
      { name: 'First Patient Enrolled', status: 'Pending', dueDate: '2026-09-01' },
      { name: 'Last Patient Enrolled', status: 'Pending', dueDate: '2027-07-01' },
      { name: 'Final Report Due', status: 'Pending', dueDate: '2028-01-30' },
    ],
    gcpChecklist: buildChecklist([0, 2, 8, 9]),
    dataQuality: {
      completeness: 100,
      forms: [
        { name: 'Demographics', score: 100 },
        { name: 'Vital Signs', score: 100 },
        { name: 'Medical History', score: 100 },
        { name: 'Adverse Events', score: 100 },
        { name: 'Concomitant Meds', score: 100 },
        { name: 'Efficacy Assessments', score: 100 },
      ],
    },
    queries: [],
    upcomingActions: [
      { action: 'Begin Patient Recruitment', dueDate: '2026-09-01' },
      { action: 'Site Initiation Visit - NIA Jaipur', dueDate: '2026-08-25' },
      { action: 'Investigator Meeting', dueDate: '2026-09-10' },
      { action: 'Recruitment Strategy Review', dueDate: '2026-09-30' },
      { action: 'First Interim Safety Review', dueDate: '2026-12-15' },
    ],
    enrolledVelocity: buildVelocity(0, 0),
    createdAt: '2024-07-01T00:00:00Z', updatedAt: '2026-08-19T09:45:00Z',
    createdBy: 'Dr. Priya Sharma (Admin)', lastModifiedBy: 'Dr. Suresh Patel (Principal Investigator)',
  },
];

// ==================== ADVERSE EVENTS ====================
export const MOCK_ADVERSE_EVENTS: AdverseEvent[] = [
  {
    aeId: 'AE-001', reportId: 'AE-AIIA-2024-001', studyId: 'AIIA-2024-001', studyTitle: 'RCT of Ashwagandha in ADHD',
    patientId: 'PT_001', eventDate: '2026-07-15', reportedDate: '2026-07-16',
    description: 'Moderate headache with mild nausea following morning dose, resolved within 48 hours.',
    severity: 'Moderate', seriousness: 'Non-Serious AE', soc: 'Nervous System Disorders', preferredTerm: 'Headache',
    actionTaken: 'None', outcome: 'Recovered', causality: 'Possible', reporterName: 'Dr. Raj Kumar', reporterContact: 'pi@aiia.gov.in',
    status: 'Closed', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-07-16T10:30:00Z', createdBy: 'Dr. Raj Kumar',
  },
  {
    aeId: 'AE-002', reportId: 'AE-AIIA-2024-002', studyId: 'AIIA-2024-001', studyTitle: 'RCT of Ashwagandha in ADHD',
    patientId: 'PT_012', eventDate: '2026-07-22', reportedDate: '2026-07-23',
    description: 'Mild gastrointestinal discomfort and loose stools for 3 days.',
    severity: 'Mild', seriousness: 'Non-Serious AE', soc: 'Gastrointestinal Disorders', preferredTerm: 'Diarrhoea',
    actionTaken: 'None', outcome: 'Recovered', causality: 'Possible', reporterName: 'Dr. Raj Kumar', reporterContact: 'pi@aiia.gov.in',
    status: 'Closed', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-07-23T08:15:00Z', createdBy: 'Dr. Raj Kumar',
  },
  {
    aeId: 'AE-003', reportId: 'SAE-AIIA-2024-001', studyId: 'AIIA-2024-001', studyTitle: 'RCT of Ashwagandha in ADHD',
    patientId: 'PT_023', eventDate: '2026-07-28', reportedDate: '2026-07-29',
    description: 'Patient hospitalized for severe allergic reaction with generalized urticaria and mild bronchospasm. Treated with antihistamines and steroids. Recovered in 3 days.',
    severity: 'Severe', seriousness: 'Serious AE', soc: 'Immune System Disorders', preferredTerm: 'Hypersensitivity',
    actionTaken: 'Dose Held', outcome: 'Recovered', causality: 'Probable', reporterName: 'Dr. Raj Kumar', reporterContact: 'pi@aiia.gov.in',
    status: 'Submitted', regulatoryDueDate: '2026-08-12', daysToReport: -9,
    createdAt: '2026-07-29T14:00:00Z', createdBy: 'Dr. Raj Kumar',
  },
  {
    aeId: 'AE-004', reportId: 'SAE-AIIA-2024-002', studyId: 'AIIA-2024-001', studyTitle: 'RCT of Ashwagandha in ADHD',
    patientId: 'PT_034', eventDate: '2026-08-05', reportedDate: '2026-08-06',
    description: 'Patient presented with elevated liver enzymes (ALT 3x ULN). Hospitalized for observation. Suspected hepatotoxicity.',
    severity: 'Severe', seriousness: 'Serious AE', soc: 'Hepatobiliary Disorders', preferredTerm: 'Hepatic dysfunction',
    actionTaken: 'Discontinued', outcome: 'Recovering', causality: 'Possible', reporterName: 'Dr. Raj Kumar', reporterContact: 'pi@aiia.gov.in',
    status: 'Submitted', regulatoryDueDate: '2026-08-20', daysToReport: -1,
    createdAt: '2026-08-06T16:30:00Z', createdBy: 'Dr. Raj Kumar',
  },
  {
    aeId: 'AE-005', reportId: 'AE-AIIA-2024-003', studyId: 'AIIA-2024-001', studyTitle: 'RCT of Ashwagandha in ADHD',
    patientId: 'PT_045', eventDate: '2026-08-10', reportedDate: '2026-08-11',
    description: 'Insomnia reported by patient, difficulty falling asleep for past week.',
    severity: 'Mild', seriousness: 'Non-Serious AE', soc: 'Psychiatric Disorders', preferredTerm: 'Insomnia',
    actionTaken: 'None', outcome: 'Recovering', causality: 'Possible', reporterName: 'Dr. Raj Kumar', reporterContact: 'pi@aiia.gov.in',
    status: 'Under Review', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-08-11T09:00:00Z', createdBy: 'Dr. Raj Kumar',
  },
  {
    aeId: 'AE-006', reportId: 'AE-AIIA-2024-004', studyId: 'AIIA-2024-002', studyTitle: 'Observational Study: Ayurveda in Type-2 Diabetes',
    patientId: 'PT_101', eventDate: '2026-07-18', reportedDate: '2026-07-19',
    description: 'Mild hypoglycemia episode, blood glucose 58 mg/dL, resolved with oral glucose.',
    severity: 'Mild', seriousness: 'Non-Serious AE', soc: 'Metabolism and Nutrition Disorders', preferredTerm: 'Hyperglycaemia',
    actionTaken: 'None', outcome: 'Recovered', causality: 'Possible', reporterName: 'Dr. Priya Sharma', reporterContact: 'admin@aiia.gov.in',
    status: 'Closed', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-07-19T11:00:00Z', createdBy: 'Dr. Priya Sharma',
  },
  {
    aeId: 'AE-007', reportId: 'SAE-AIIA-2024-003', studyId: 'AIIA-2024-002', studyTitle: 'Observational Study: Ayurveda in Type-2 Diabetes',
    patientId: 'PT_115', eventDate: '2026-08-02', reportedDate: '2026-08-03',
    description: 'Patient hospitalized with severe hyperglycemia (BG 480 mg/dL) and diabetic ketoacidosis. Required ICU admission for 2 days.',
    severity: 'Severe', seriousness: 'Serious AE', soc: 'Metabolism and Nutrition Disorders', preferredTerm: 'Hyperglycaemia',
    actionTaken: 'Dose Reduction', outcome: 'Recovered', causality: 'Unlikely', reporterName: 'Dr. Priya Sharma', reporterContact: 'admin@aiia.gov.in',
    status: 'Submitted', regulatoryDueDate: '2026-08-17', daysToReport: -4,
    createdAt: '2026-08-03T13:45:00Z', createdBy: 'Dr. Priya Sharma',
  },
  {
    aeId: 'AE-008', reportId: 'AE-AIIA-2024-005', studyId: 'AIIA-2024-002', studyTitle: 'Observational Study: Ayurveda in Type-2 Diabetes',
    patientId: 'PT_128', eventDate: '2026-08-08', reportedDate: '2026-08-09',
    description: 'Mild skin rash on forearms, pruritic. Treated with topical antihistamine.',
    severity: 'Mild', seriousness: 'Non-Serious AE', soc: 'Skin and Subcutaneous Tissue Disorders', preferredTerm: 'Rash',
    actionTaken: 'None', outcome: 'Recovering', causality: 'Possible', reporterName: 'Dr. Priya Sharma', reporterContact: 'admin@aiia.gov.in',
    status: 'Under Review', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-08-09T10:20:00Z', createdBy: 'Dr. Priya Sharma',
  },
  {
    aeId: 'AE-009', reportId: 'AE-AIIA-2024-006', studyId: 'AIIA-2024-002', studyTitle: 'Observational Study: Ayurveda in Type-2 Diabetes',
    patientId: 'PT_140', eventDate: '2026-08-14', reportedDate: '2026-08-15',
    description: 'Gastrointestinal upset with nausea and abdominal discomfort after medication.',
    severity: 'Mild', seriousness: 'Non-Serious AE', soc: 'Gastrointestinal Disorders', preferredTerm: 'Nausea',
    actionTaken: 'None', outcome: 'Recovered', causality: 'Possible', reporterName: 'Dr. Priya Sharma', reporterContact: 'admin@aiia.gov.in',
    status: 'Pending', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-08-15T15:00:00Z', createdBy: 'Dr. Priya Sharma',
  },
  {
    aeId: 'AE-010', reportId: 'AE-AIIA-2024-007', studyId: 'AIIA-2024-003', studyTitle: 'Asthma Management with Herbal Protocol',
    patientId: 'PT_201', eventDate: '2026-06-10', reportedDate: '2026-06-11',
    description: 'Mild wheezing and shortness of breath, resolved with bronchodilator.',
    severity: 'Moderate', seriousness: 'Non-Serious AE', soc: 'Respiratory, Thoracic and Mediastinal Disorders', preferredTerm: 'Dyspnoea',
    actionTaken: 'None', outcome: 'Recovered', causality: 'Unlikely', reporterName: 'Dr. Arjun Mehta', reporterContact: 'arjun@aiia.gov.in',
    status: 'Closed', regulatoryDueDate: '', daysToReport: 0,
    createdAt: '2026-06-11T08:00:00Z', createdBy: 'Dr. Arjun Mehta',
  },
];

// ==================== ALERTS (computed from studies) ====================
export function computeAlerts(studies: Study[], aes: AdverseEvent[]): Alert[] {
  const alerts: Alert[] = [];
  const today = new Date('2026-08-21');

  studies.forEach((study) => {
    // Overdue SAE reports (>7 days)
    aes.filter(ae => ae.studyId === study.studyId && ae.seriousness === 'Serious AE' && ae.status !== 'Closed').forEach(ae => {
      if (ae.daysToReport < 0) {
        alerts.push({
          id: `alert-sae-${ae.aeId}`, studyId: study.studyId, studyTitle: study.title,
          severity: 'red', category: 'SAE Report Overdue',
          title: `Overdue SAE Report: ${ae.reportId}`,
          description: `${ae.description.slice(0, 80)}... ${Math.abs(ae.daysToReport)} days overdue for regulatory submission.`,
          dueDate: ae.regulatoryDueDate, daysOverdue: Math.abs(ae.daysToReport),
        });
      }
    });

    // Ethics approval expiring (within 30 days) or expired
    if (study.ethicsApproval.status === 'Expired') {
      alerts.push({
        id: `alert-ethics-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
        severity: 'red', category: 'Ethics Approval Expired',
        title: `Ethics Approval Expired: ${study.studyId}`,
        description: `Ethics approval expired on ${study.ethicsApproval.expiryDate}. Study is paused pending renewal.`,
        dueDate: study.ethicsApproval.expiryDate,
      });
    } else if (study.ethicsApproval.status === 'Approved') {
      const expiry = new Date(study.ethicsApproval.expiryDate);
      const days = Math.floor((expiry.getTime() - today.getTime()) / 86400000);
      if (days <= 30 && days >= 0) {
        alerts.push({
          id: `alert-ethics-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
          severity: 'yellow', category: 'Ethics Approval Expiring',
          title: `Ethics Approval Expiring: ${study.studyId}`,
          description: `Ethics approval expires in ${days} days (${study.ethicsApproval.expiryDate}). Renewal required.`,
          dueDate: study.ethicsApproval.expiryDate,
        });
      }
    }

    // CTRI registration pending
    if (study.ctri.status === 'Pending') {
      alerts.push({
        id: `alert-ctri-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
        severity: 'yellow', category: 'CTRI Registration Pending',
        title: `CTRI Registration Pending: ${study.studyId}`,
        description: `CTRI registration not completed. Protocol ID: ${study.ctri.protocolId}. Required before enrollment.`,
      });
    }

    // Enrollment lag (< 50% target at 50% timeline) — for active studies
    if (study.status === 'Active' && study.targetEnrollment > 0) {
      const start = new Date(study.startDate);
      const progress = Math.min(1, Math.floor((today.getTime() - start.getTime()) / 86400000) / 730);
      const enrollmentPct = study.currentEnrolled / study.targetEnrollment;
      if (progress > 0.5 && enrollmentPct < 0.5) {
        alerts.push({
          id: `alert-enroll-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
          severity: 'yellow', category: 'Enrollment Lag',
          title: `Enrollment Lag: ${study.studyId}`,
          description: `Enrollment at ${Math.round(enrollmentPct * 100)}% of target but timeline is ${Math.round(progress * 100)}% elapsed.`,
        });
      }
      // New study, 0 enrolled
      if (study.currentEnrolled === 0 && study.startDate) {
        const monthsSinceStart = Math.floor((today.getTime() - start.getTime()) / (86400000 * 30));
        if (monthsSinceStart >= 1) {
          alerts.push({
            id: `alert-enroll0-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
            severity: 'yellow', category: 'Enrollment Not Started',
            title: `No Patients Enrolled: ${study.studyId}`,
            description: `Study started ${study.startDate} but 0 patients enrolled. Recruitment action needed.`,
          });
        }
      }
    }

    // Monitoring visit due (overdue) — mock: visit was due 30 days ago for active studies
    if (study.status === 'Active') {
      alerts.push({
        id: `alert-mon-${study.studyId}`, studyId: study.studyId, studyTitle: study.title,
        severity: 'blue', category: 'Monitoring Visit Due',
        title: `Monitoring Visit Due: ${study.studyId}`,
        description: `Routine monitoring visit overdue. Last visit was over 90 days ago.`,
        dueDate: '2026-07-21',
      });
    }
  });

  return alerts.sort((a, b) => {
    const order = { red: 0, yellow: 1, blue: 2 };
    return order[a.severity] - order[b.severity];
  });
}

// ==================== AUDIT LOG ====================
export const MOCK_AUDIT_LOG: AuditEntry[] = [
  {
    logId: 'LOG-001', entityType: 'study', entityId: 'AIIA-2024-001', entityName: 'RCT of Ashwagandha in ADHD',
    userId: 'u006', userName: 'Dr. Priya Sharma', userRole: 'admin',
    action: 'Study Created', timestamp: '2024-01-15T05:30:00Z',
    changes: [{ field: 'status', before: '(none)', after: 'Active' }],
  },
  {
    logId: 'LOG-002', entityType: 'approval', entityId: 'AIIA-2024-001', entityName: 'Ethics Approval',
    userId: 'u004', userName: 'Prof. Meena Iyer', userRole: 'ethics_committee',
    action: 'Approval Granted', timestamp: '2024-06-15T10:00:00Z',
    changes: [
      { field: 'ethicsApproval.status', before: 'Pending', after: 'Approved' },
      { field: 'ethicsApproval.approvalId', before: '(none)', after: 'IEC/AIIA/2024/042' },
    ],
  },
  {
    logId: 'LOG-003', entityType: 'study', entityId: 'AIIA-2024-002', entityName: 'Ayurveda in Type-2 Diabetes',
    userId: 'u006', userName: 'Dr. Priya Sharma', userRole: 'admin',
    action: 'Enrollment Updated', timestamp: '2026-08-20T04:15:00Z',
    changes: [
      { field: 'currentEnrolled', before: '140', after: '145' },
      { field: 'updatedAt', before: '2026-08-19T04:15:00Z', after: '2026-08-20T04:15:00Z' },
    ],
  },
  {
    logId: 'LOG-004', entityType: 'adverse_event', entityId: 'SAE-AIIA-2024-001', entityName: 'SAE Report',
    userId: 'u001', userName: 'Dr. Raj Kumar', userRole: 'principal_investigator',
    action: 'SAE Report Created', timestamp: '2026-07-29T14:00:00Z',
    changes: [
      { field: 'severity', before: '(none)', after: 'Severe' },
      { field: 'seriousness', before: '(none)', after: 'Serious AE' },
      { field: 'causality', before: '(none)', after: 'Probable' },
    ],
  },
  {
    logId: 'LOG-005', entityType: 'study', entityId: 'AIIA-2024-003', entityName: 'Asthma Management with Herbal Protocol',
    userId: 'u006', userName: 'Dr. Priya Sharma', userRole: 'admin',
    action: 'Study Status Changed', timestamp: '2024-06-02T09:00:00Z',
    changes: [
      { field: 'status', before: 'Active', after: 'Paused' },
      { field: 'reason', before: '(none)', after: 'Ethics approval expired' },
    ],
  },
  {
    logId: 'LOG-006', entityType: 'adverse_event', entityId: 'SAE-AIIA-2024-003', entityName: 'SAE Report',
    userId: 'u006', userName: 'Dr. Priya Sharma', userRole: 'principal_investigator',
    action: 'SAE Report Created', timestamp: '2026-08-03T13:45:00Z',
    changes: [
      { field: 'severity', before: '(none)', after: 'Severe' },
      { field: 'seriousness', before: '(none)', after: 'Serious AE' },
      { field: 'outcome', before: '(none)', after: 'Recovered' },
    ],
  },
  {
    logId: 'LOG-007', entityType: 'study', entityId: 'AIIA-2024-004', entityName: 'IBS Treatment RCT',
    userId: 'u006', userName: 'Dr. Nisha Reddy', userRole: 'principal_investigator',
    action: 'Data Lock Completed', timestamp: '2026-08-10T14:00:00Z',
    changes: [
      { field: 'status', before: 'Active', after: 'Completed' },
      { field: 'dataLocked', before: 'false', after: 'true' },
    ],
  },
  {
    logId: 'LOG-008', entityType: 'enrollment', entityId: 'AIIA-2024-001', entityName: 'Enrollment Record',
    userId: 'u002', userName: 'Anita Desai', userRole: 'study_coordinator',
    action: 'Patient Enrolled', timestamp: '2026-08-19T11:30:00Z',
    changes: [
      { field: 'patientId', before: '(none)', after: 'PT_065' },
      { field: 'enrollDate', before: '(none)', after: '2026-08-19' },
    ],
  },
];

// ==================== AE TREND (90 days) ====================
export function buildAeTrend(aes: AdverseEvent[]): { date: string; count: number }[] {
  const trend: { date: string; count: number }[] = [];
  const today = new Date('2026-08-21');
  let cumulative = 0;
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(0, 10);
    const newAes = aes.filter(ae => ae.reportedDate === dStr).length;
    cumulative += newAes;
    trend.push({ date: dStr, count: cumulative });
  }
  return trend;
}
