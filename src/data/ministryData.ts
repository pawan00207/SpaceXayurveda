// Ministry of AYUSH mock data for the integrated portal

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'Event' | 'Partnership' | 'Education' | 'Policy' | 'Research';
  summary: string;
  imageUrl?: string;
  link?: string;
}

export interface TickerItem {
  id: string;
  text: string;
  type: 'trial' | 'scheme' | 'event';
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: 'CME' | 'Event' | 'Deadline' | 'Webinar' | 'Milestone';
  location?: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  budget: string;
  status: 'Active' | 'Ongoing' | 'Upcoming';
  details: { label: string; value: string }[];
}

export interface GuidelineDoc {
  id: string;
  title: string;
  category: 'GCP' | 'Ethics' | 'Regulatory' | 'Drug Standards' | 'Quality';
  description: string;
  date: string;
  format: 'PDF' | 'HTML' | 'Searchable';
}

export interface Notification {
  id: string;
  title: string;
  department: string;
  date: string;
  category: 'Drug Approval' | 'Education' | 'Recruitment' | 'Legal' | 'Policy';
  summary: string;
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  bio: string;
}

export interface ResearchLink {
  id: string;
  title: string;
  url: string;
  description: string;
  system: 'Ayurveda' | 'Yoga' | 'Unani' | 'Siddha' | 'Homeopathy' | 'Sowa-Rigpa';
}

// ==================== NEWS ====================
export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news1',
    title: 'AIIA Hosts 10th National Ayurveda Day - Sept 23, 2025',
    date: '2025-09-23',
    category: 'Event',
    summary: 'AIIA New Delhi and AIIA Goa hosted landmark event with 500+ participants, featuring keynote addresses by the Hon\u2019ble Minister of AYUSH and international delegates from WHO, Sri Lanka, and Mauritius.',
  },
  {
    id: 'news2',
    title: 'WHO-India MoU on Traditional Medicine Signed',
    date: '2025-09-15',
    category: 'Partnership',
    summary: 'Government of India and WHO signed a landmark MoU to co-host the Second WHO Global Summit on Traditional Medicine, strengthening evidence-based research in Ayurveda and traditional systems.',
  },
  {
    id: 'news3',
    title: 'New BAMS Program CME: Panchakarma & Core Principles',
    date: '2025-10-06',
    category: 'Education',
    summary: 'AIIA conducting advanced medical education program for BMS practitioners. 6-day intensive covering Panchakarma protocols, diagnostic principles, and integrative clinical practice.',
  },
  {
    id: 'news4',
    title: 'New Clinical Trial Registered: AIIA-2024-006',
    date: '2025-08-20',
    category: 'Research',
    summary: 'RCT of Triphala in Metabolic Syndrome enrolls first patient. Study targets 300 participants across 4 AYUSH research centers with CTRI registration completed.',
  },
  {
    id: 'news5',
    title: 'NAM Scheme Budget Enhanced for 2025-26',
    date: '2025-07-01',
    category: 'Policy',
    summary: 'Ministry of AYUSH announces enhanced allocation of \u20b9450 Cr for the National AYUSH Mission, with focus on infrastructure upgradation and AYUSH dispensaries in aspirational districts.',
  },
  {
    id: 'news6',
    title: 'NDCT Rules Compliance Workshop for Investigators',
    date: '2025-09-28',
    category: 'Education',
    summary: 'Full-day workshop covering New Drugs and Clinical Trials Rules 2019 compliance, GCP-ASU guidelines implementation, and regulatory submission best practices for AYUSH researchers.',
  },
];

// ==================== TICKER ====================
export const MOCK_TICKER: TickerItem[] = [
  { id: 't1', text: 'New Clinical Trial Registered: AIIA-2024-006', type: 'trial' },
  { id: 't2', text: 'NAM Scheme Update: \u20b9450 Cr allocated for 2025-26', type: 'scheme' },
  { id: 't3', text: 'WHO Summit on Traditional Medicine: Dec 17-19, 2025, New Delhi', type: 'event' },
  { id: 't4', text: 'National Ayurveda Day celebration - Sept 23, 2025', type: 'event' },
  { id: 't5', text: 'GCP-ASU Guidelines v2.1 released - Download from Information Hub', type: 'scheme' },
];

// ==================== EVENTS ====================
export const MOCK_EVENTS: EventItem[] = [
  { id: 'e1', title: 'CME: Panchakarma & Core Principles', date: '2025-10-06', type: 'CME', location: 'AIIA New Delhi' },
  { id: 'e2', title: 'National Ayurveda Day', date: '2025-09-23', type: 'Event', location: 'AIIA New Delhi & Goa' },
  { id: 'e3', title: 'WHO Global Summit on Traditional Medicine', date: '2025-12-17', type: 'Event', location: 'New Delhi' },
  { id: 'e4', title: 'CTRI Registration Deadline - Study AIIA-2024-002', date: '2025-09-01', type: 'Deadline' },
  { id: 'e5', title: 'Webinar: Ayush Research Methodology', date: '2025-10-15', type: 'Webinar', location: 'Online' },
  { id: 'e6', title: 'Ethics Approval Renewal - Study AIIA-2024-001', date: '2025-06-15', type: 'Milestone' },
  { id: 'e7', title: 'NDCT Rules Compliance Workshop', date: '2025-09-28', type: 'CME', location: 'AIIA New Delhi' },
  { id: 'e8', title: 'SAE Regulatory Report Due - SAE-AIIA-2024-003', date: '2025-08-17', type: 'Deadline' },
];

// ==================== SCHEMES ====================
export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'nam',
    name: 'National AYUSH Mission (NAM)',
    shortName: 'NAM',
    description: 'Centrally Sponsored Scheme for promoting AYUSH systems through cost-sharing with State/UT governments. Supports AYUSH dispensaries, hospitals, co-location, quality control, and IEC activities.',
    budget: '\u20b9450 Cr (BE 2025-26)',
    status: 'Active',
    details: [
      { label: 'Budget Estimate 2025-26', value: '\u20b9450.00 Cr' },
      { label: 'Revised Estimate 2024-25', value: '\u20b9398.50 Cr' },
      { label: 'Actual Expenditure 2023-24', value: '\u20b9372.14 Cr' },
      { label: 'States Covered', value: '28 States + 8 UTs' },
      { label: 'AYUSH Dispensaries', value: '4,520 operational' },
      { label: 'Co-located Facilities', value: '1,850 PHCs/CHCs' },
    ],
  },
  {
    id: 'nmpb',
    name: 'National Medicinal Plants Board (NMPB)',
    shortName: 'NMPB',
    description: 'Promotes cultivation of medicinal plants, conservation of rare species, and supply chain development for raw materials used in AYUSH systems.',
    budget: '\u20b9148 Cr (BE 2025-26)',
    status: 'Ongoing',
    details: [
      { label: 'Budget Estimate 2025-26', value: '\u20b9148.00 Cr' },
      { label: 'Species Covered', value: '140 prioritized medicinal plants' },
      { label: 'Cultivation Area', value: '56,000 hectares supported' },
      { label: 'Farmers Benefited', value: '1.2 lakh+ cumulative' },
    ],
  },
  {
    id: 'heal-in-india',
    name: 'Heal in India Initiative',
    shortName: 'Heal in India',
    description: 'Promotes medical value travel for AYUSH treatments. Integrates with Ayushman Bharat for holistic wellness programs targeting international patients.',
    budget: '\u20b985 Cr (BE 2025-26)',
    status: 'Active',
    details: [
      { label: 'Budget Estimate 2025-26', value: '\u20b985.00 Cr' },
      { label: 'Partner Hospitals', value: '42 AYUSH + 18 allopathic' },
      { label: 'International Patients (2024)', value: '12,500+ from 45 countries' },
    ],
  },
  {
    id: 'quality-mark',
    name: 'AYUSH Quality Mark Certification',
    shortName: 'AYUSH QM',
    description: 'Voluntary certification for AYUSH hospitals and dispensaries meeting defined quality standards. Validated through documented SOPs and third-party audits.',
    budget: '\u20b942 Cr (BE 2025-26)',
    status: 'Ongoing',
    details: [
      { label: 'Certified Hospitals', value: '128' },
      { label: 'Certified Dispensaries', value: '890' },
      { label: 'Audit Cycle', value: 'Annual' },
    ],
  },
  {
    id: 'research-council',
    name: 'AYUSH Research Council Initiatives',
    shortName: 'Research Councils',
    description: 'Five research councils (CCRAS, CCRYN, CCRUM, CCRS, CCRH) conduct fundamental, clinical, and drug development research across AYUSH systems.',
    budget: '\u20b9310 Cr (BE 2025-26)',
    status: 'Active',
    details: [
      { label: 'Budget Estimate 2025-26', value: '\u20b9310.00 Cr' },
      { label: 'Active Research Projects', value: '185 ongoing' },
      { label: 'Institutes', value: '31 research institutes' },
      { label: 'Published Papers (2024)', value: '420 peer-reviewed' },
    ],
  },
];

// ==================== GUIDELINES ====================
export const MOCK_GUIDELINES: GuidelineDoc[] = [
  { id: 'g1', title: 'GCP-ASU Guidelines v2.1', category: 'GCP', description: 'Good Clinical Practice guidelines for ASU (Ayurveda, Siddha, Unani) clinical trials. Updated 2025.', date: '2025-06-01', format: 'PDF' },
  { id: 'g2', title: 'ICMR Ethical Guidelines for Biomedical Research', category: 'Ethics', description: 'National Ethical Guidelines for Biomedical and Health Research involving Human Participants.', date: '2023-08-01', format: 'Searchable' },
  { id: 'g3', title: 'NDCT Rules 2019', category: 'Regulatory', description: 'New Drugs and Clinical Trials Rules, 2019 - Full text with amendments.', date: '2019-03-19', format: 'PDF' },
  { id: 'g4', title: 'Ayurvedic Pharmacopoeia of India (API)', category: 'Drug Standards', description: 'Official standards for identity, purity, and strength of Ayurvedic drugs. 6 volumes.', date: '2024-01-01', format: 'PDF' },
  { id: 'g5', title: 'Quality Standards for AYUSH Drugs', category: 'Quality', description: 'BIS and IPC-aligned quality control standards for AYUSH formulations and raw materials.', date: '2024-11-01', format: 'PDF' },
  { id: 'g6', title: 'CDSCO Compliance Documents for AYUSH', category: 'Regulatory', description: 'CDSCO submission formats, checklists, and procedural documents for AYUSH drug approvals.', date: '2024-09-15', format: 'HTML' },
  { id: 'g7', title: 'Informed Consent Guidelines (ICMR)', category: 'Ethics', description: 'Guidelines for obtaining and documenting informed consent in biomedical research.', date: '2023-08-01', format: 'Searchable' },
  { id: 'g8', title: 'Pharmacovigilance Protocol for AYUSH', category: 'Quality', description: 'Standard operating procedures for AYUSH ADR monitoring and reporting via PvPI.', date: '2024-03-01', format: 'PDF' },
];

// ==================== NOTIFICATIONS ====================
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Draft Amendment to NDCT Rules for AYUSH Drugs', department: 'Ministry of AYUSH', date: '2025-08-15', category: 'Policy', summary: 'Public consultation on proposed amendments to clinical trial timelines for ASU drugs.' },
  { id: 'n2', title: 'Approval of New Ayurvedic Formulation for Diabetes', department: 'CDSCO', date: '2025-08-10', category: 'Drug Approval', summary: 'CDSCO grants approval for polyherbal formulation AIIA-DM-01 for Type-2 Diabetes management.' },
  { id: 'n3', title: 'MD (Ayurveda) Admission Notification 2025-26', department: 'AIIA Education Division', date: '2025-07-25', category: 'Recruitment', summary: 'Admissions open for MD Ayurveda in 14 specialties. Entrance exam on Oct 20, 2025.' },
  { id: 'n4', title: 'Faculty Recruitment - Professor Posts', department: 'AIIA HR', date: '2025-07-20', category: 'Recruitment', summary: 'AIIA invites applications for 12 Professor and 18 Associate Professor positions across departments.' },
  { id: 'n5', title: 'Mandatory Pharmacovigilance Reporting for AYUSH Manufacturers', department: 'Ministry of AYUSH', date: '2025-06-30', category: 'Legal', summary: 'All licensed AYUSH drug manufacturers must submit quarterly ADR reports to PvPI effective Q3 2025.' },
  { id: 'n6', title: 'Updated BAMS Curriculum - Implementation Notice', department: 'NCISM', date: '2025-06-15', category: 'Education', summary: 'Revised BAMS curriculum with enhanced clinical training components effective academic year 2025-26.' },
];

// ==================== LEADERSHIP ====================
export const MOCK_LEADERSHIP: Leader[] = [
  { id: 'l1', name: 'Shri Prataprao Jadhav', title: 'Hon\u2019ble Minister of State (Independent Charge), Ministry of AYUSH', bio: 'Overseeing AYUSH portfolio with focus on research integration, international collaboration, and evidence-based traditional medicine.' },
  { id: 'l2', name: 'Shri Vaidya Rajesh Kotecha', title: 'Secretary, Ministry of AYUSH', bio: 'Leading policy formulation, scheme implementation, and regulatory framework development for AYUSH systems.' },
  { id: 'l3', name: 'Prof. Tanuja Nesari', title: 'Director, All India Institute of Ayurveda', bio: 'Spearheading AIIA\u2019s clinical research programs, education initiatives, and international partnerships.' },
  { id: 'l4', name: 'Dr. R. B. Herlekar', title: 'Adviser (Ayurveda), Ministry of AYUSH', bio: 'Technical adviser on Ayurvedic drug standards, clinical trial protocols, and GCP-ASU implementation.' },
];

// ==================== RESEARCH LINKS ====================
export const MOCK_RESEARCH_LINKS: ResearchLink[] = [
  { id: 'r1', title: 'AYUSH Research Portal', url: 'https://ayushportal.nic.in', description: 'Central repository of AYUSH research publications, ongoing projects, and clinical trial results.', system: 'Ayurveda' },
  { id: 'r2', title: 'DHARA - Digital Helpline for Ayurveda Research Articles', url: 'https://dharma.ayush.gov.in', description: 'Searchable database of peer-reviewed Ayurveda research articles with advanced filtering.', system: 'Ayurveda' },
  { id: 'r3', title: 'CCRAS Publications', url: 'https://ccras.nic.in', description: 'Central Council for Research in Ayurvedic Sciences - research monographs and clinical study reports.', system: 'Ayurveda' },
  { id: 'r4', title: 'CTRI - Clinical Trials Registry India', url: 'https://ctri.nic.in', description: 'Official registry for all clinical trials conducted in India. Required for AYUSH trials.', system: 'Ayurveda' },
  { id: 'r5', title: 'Yoga Research Publications', url: 'https://ccryn.nic.in', description: 'Central Council for Research in Yoga & Naturopathy - research on yoga interventions.', system: 'Yoga' },
  { id: 'r6', title: 'Unani Medicine Research', url: 'https://ccrum.nic.in', description: 'Central Council for Research in Unani Medicine - clinical studies and drug development.', system: 'Unani' },
];

// ==================== NAM STATE DATA (for charts) ====================
export const NAM_STATE_DATA: { state: string; patients: number; budget: number }[] = [
  { state: 'Maharashtra', patients: 185000, budget: 38.5 },
  { state: 'Uttar Pradesh', patients: 220000, budget: 42.0 },
  { state: 'Karnataka', patients: 145000, budget: 31.2 },
  { state: 'Kerala', patients: 198000, budget: 35.8 },
  { state: 'Tamil Nadu', patients: 132000, budget: 28.4 },
  { state: 'Rajasthan', patients: 110000, budget: 24.1 },
  { state: 'Gujarat', patients: 98000, budget: 22.3 },
  { state: 'Madhya Pradesh', patients: 87000, budget: 19.6 },
];

export const NAM_YEAR_TREND: { year: string; patients: number; budget: number }[] = [
  { year: '2020-21', patients: 980000, budget: 280 },
  { year: '2021-22', patients: 1120000, budget: 305 },
  { year: '2022-23', patients: 1340000, budget: 342 },
  { year: '2023-24', patients: 1580000, budget: 372 },
  { year: '2024-25', patients: 1820000, budget: 398 },
  { year: '2025-26', patients: 2100000, budget: 450 },
];
