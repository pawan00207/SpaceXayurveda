# AIIA Clinical Research Portal

**AIIA Clinical Trial Management System (CTMS) + Ministry of AYUSH Information Portal**

> Excellence in Ayurveda Science — Advancing Ayurveda through Evidence-Based Research

An integrated, cloud-based platform combining clinical trial management with official Ministry of AYUSH news, schemes, guidelines, and research information.

## Features

### Portal
- **Homepage**: Hero banner with ministry seal, live news ticker, news cards, upcoming events widget, research highlights carousel, NAM scheme tracker
- **Information Hub**: About Ministry, Schemes & Programs (NAM, NMPB, Heal in India), Guidelines & Standards (GCP-ASU, ICMR, NDCT Rules), Research Updates (AYUSH Portal, DHARA, CTRI), Regulations & Notifications

### Clinical Trial Management System (CTMS)
- **Role-based login**: 6 roles (PI, Study Coordinator, Clinical Monitor, Ethics Committee, Pharmacovigilance Officer, Admin)
- **Portfolio Dashboard**: KPI cards, studies table, real-time alerts panel, ministry updates widget
- **5 Study Tabs**: Overview, Recruitment, Compliance, Data Quality, Safety & Pharmacovigilance

### Advanced Features (SIH Winning)
1. **ABDM Integration** — Ayushman Bharat Digital Mission health records linkage with ABHA ID input, FHIR-compatible badge, patient health data display (hospital visits, medications, chronic conditions)
2. **AI-Based Enrollment Prediction** — Linear regression model projecting enrollment completion date using historical velocity, with actual vs predicted chart, confidence score, and On Track/Lag Risk/At Risk status
3. **Automated Compliance Scoring** — Circular gauge displaying compliance score (0-100), 8 auto-checked compliance items with pass/warning/fail status, compliance standards badges (CTRI-Ready, GCP-ASU, ICMR, ALCOA+, CDISC, FHIR), CSV report export

### Pharmacovigilance Module
- AE/SAE dashboard with KPIs, 90-day trend chart, MedDRA SOC breakdown
- AE/SAE intake form with auto-generated report IDs
- Regulatory filing tracker with deadline alerts
- CSV export (CDISC-compatible)

### Reports & Exports
- Study Summary, Enrollment Report, AE Report (CDISC), CTRI Registration Data (JSON), Audit Trail (CSV), Compliance Scorecard

### Admin & Settings
- User management, system settings, dark mode toggle, data management, ministry updates

### Audit Trail (ALCOA+ Compliant)
- Immutable change log, searchable/filterable, IST timestamps, CSV export

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Saffron #FF9933 / Teal #0B7C59 / Gold #FFD700 theme)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)

## Getting Started
```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run typecheck # Type checking
```

## Mock Data
5 realistic AYUSH clinical trials with full study data, adverse events, audit logs, and ministry information.

## License
Government of India — Ministry of AYUSH
