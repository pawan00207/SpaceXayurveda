import { useApp } from '@/context/AppContext';
import { PageHeader, SectionCard } from '@/components/ui';
import { exportToCsv, formatDate, pct, formatDateTimeIST } from '@/lib/utils';
import { MOCK_USERS } from '@/data/mockData';
import { ROLE_LABELS } from '@/types';
import {
  Download, FileText, FileBarChart, FileSpreadsheet, FileCheck2, Database,
  ScrollText, FileJson, FileCode,
} from 'lucide-react';
import type { Study, AdverseEvent } from '@/types';

export default function ReportsPage() {
  const { studies, aes, auditLog } = useApp();

  const totalEnrolled = studies.reduce((s, st) => s + st.currentEnrolled, 0);

  const exportStudies = () => exportToCsv('aiia-studies-summary.csv', studies.map(s => ({
    StudyID: s.studyId, Title: s.title, PI: s.pi, Status: s.status,
    Sponsor: s.primarySponsor, StartDate: s.startDate,
    Target: s.targetEnrollment, Enrolled: s.currentEnrolled, Percent: pct(s.currentEnrolled, s.targetEnrollment),
    Sites: s.sites.length, EthicsStatus: s.ethicsApproval.status, EthicsExpiry: s.ethicsApproval.expiryDate,
    CTRIStatus: s.ctri.status, CTRINo: s.ctri.regNo, CreatedAt: s.createdAt, UpdatedAt: s.updatedAt,
  })));

  const exportEnrollment = () => {
    const rows: Record<string, string | number>[] = [];
    studies.forEach(s => s.sites.forEach(site => {
      rows.push({
        StudyID: s.studyId, Site: site.name, Target: site.target,
        Enrolled: site.enrolled, Percent: pct(site.enrolled, site.target),
        ActivatedDate: site.activatedDate,
      });
    }));
    exportToCsv('aiia-enrollment-report.csv', rows);
  };

  const exportAe = () => exportToCsv('aiia-ae-reports-cdisc.csv', aes.map((ae: AdverseEvent) => ({
    STUDYID: ae.studyId, AESEQ: ae.aeId, AEREPORTID: ae.reportId,
    USUBJID: ae.patientId, AESTDTC: ae.eventDate, 'AE-reportDate': ae.reportedDate,
    AETERM: ae.preferredTerm, AEDECOD: ae.preferredTerm, AEBODSYS: ae.soc,
    AESEV: ae.severity, AESER: ae.seriousness === 'Serious AE' ? 'Y' : 'N',
    AEACT: ae.actionTaken, AEOUT: ae.outcome, AEREL: ae.causality,
    AESTAT: ae.status, RegulatoryDue: ae.regulatoryDueDate || 'N/A',
    Reporter: ae.reporterName, CreatedAt: ae.createdAt,
  })));

  const exportCtri = () => {
    const data = studies.filter(s => s.ctri.status === 'Registered').map(s => ({
      trialName: s.title, protocolId: s.ctri.protocolId, ctriRegistrationNo: s.ctri.regNo,
      registrationDate: s.ctri.registrationDate, sponsor: s.primarySponsor,
      pi: s.pi, status: s.status, enrollmentTarget: s.targetEnrollment,
      enrollmentCurrent: s.currentEnrolled, sites: s.sites.map(site => site.name),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'aiia-ctri-registration.json'; link.click();
    URL.revokeObjectURL(url);
  };

  const exportAudit = () => exportToCsv('aiia-audit-trail.csv', auditLog.map(e => ({
    LogID: e.logId, EntityType: e.entityType, EntityID: e.entityId, EntityName: e.entityName,
    User: e.userName, Role: ROLE_LABELS[e.userRole], Action: e.action,
    TimestampUTC: e.timestamp, TimestampIST: formatDateTimeIST(e.timestamp),
    Changes: e.changes.map(c => `${c.field}: ${c.before} -> ${c.after}`).join('; '),
  })));

  const reports: {
    title: string; description: string; icon: typeof FileText; format: string;
    onClick: () => void;
  }[] = [
    { title: 'Study Summary', description: 'Complete study portfolio with status, enrollment, approvals, CTRI data', icon: FileText, format: 'CSV', onClick: exportStudies },
    { title: 'Enrollment Report', description: 'Site-wise enrollment data across all studies', icon: FileBarChart, format: 'CSV', onClick: exportEnrollment },
    { title: 'AE Report (CDISC)', description: 'Adverse event reports in CDISC-compatible format for regulatory submission', icon: FileSpreadsheet, format: 'CSV', onClick: exportAe },
    { title: 'CTRI Registration Data', description: 'CTRI registration data in ctri.nic.in JSON format', icon: FileJson, format: 'JSON', onClick: exportCtri },
    { title: 'Audit Trail', description: 'Complete ALCOA+ compliant audit log with IST timestamps', icon: ScrollText, format: 'CSV', onClick: exportAudit },
  ];

  return (
    <div>
      <PageHeader title="Reports & Export" subtitle="Generate and export reports for regulatory submission and analysis" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Studies', value: studies.length, icon: FileText, color: 'text-primary-600 bg-primary-50 dark:bg-primary-500/10' },
          { label: 'Enrolled Patients', value: totalEnrolled, icon: FileBarChart, color: 'text-saffron-600 bg-saffron-50 dark:bg-saffron-500/10' },
          { label: 'Adverse Events', value: aes.length, icon: FileCheck2, color: 'text-danger-600 bg-danger-50 dark:bg-danger-500/10' },
          { label: 'Audit Entries', value: auditLog.length, icon: ScrollText, color: 'text-info-600 bg-info-50 dark:bg-info-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold font-mono">{value}</p></div>
          </div>
        ))}
      </div>

      <SectionCard title="Available Reports" subtitle="Click to download. Exports are generated in real-time from current data.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.title}
                onClick={r.onClick}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{r.title}</h4>
                    <span className="badge-neutral text-[10px]">{r.format}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.description}</p>
                </div>
                <Download className="w-5 h-5 text-gray-300 group-hover:text-primary-600 flex-shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Database schema */}
      <div className="mt-6">
        <SectionCard title="Database Schema Documentation" subtitle="Data model reference for the CTMS platform">
          <div className="space-y-3">
            {[
              { table: 'users', fields: 'uid, email, role, name, department, createdAt, lastLogin', icon: Database },
              { table: 'studies', fields: 'studyId, title, pi, status, targetEnrollment, sites, ethicsApproval, ctri, milestones, gcpChecklist, dataQuality, queries, createdAt, updatedAt', icon: FileText },
              { table: 'enrollments', fields: 'enrollmentId, studyId, patientId, screenDate, enrollDate, siteId', icon: FileBarChart },
              { table: 'approvals', fields: 'approvalId, studyId, type, approvalDate, expiryDate, committeeName, approvalId', icon: FileCheck2 },
              { table: 'adverseEvents', fields: 'aeId, studyId, reportId, date, severity, causality, soc, preferredTerm, outcome, status', icon: FileSpreadsheet },
              { table: 'auditLog', fields: 'logId, entityType, entityId, userId, action, timestamp, changes[]', icon: ScrollText },
            ].map(({ table, fields, icon: Icon }) => (
              <div key={table} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Icon className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">{table}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{fields}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
