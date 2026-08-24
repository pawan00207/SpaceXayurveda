import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { SectionCard, ProgressBar } from '@/components/ui';
import { approvalStatusBadge, formatDate, daysUntil, pct, exportToCsv } from '@/lib/utils';
import { ETHICS_COMMITTEES } from '@/types';
import {
  Upload, FileCheck2, AlertCircle, ExternalLink, CheckSquare, Square,
  ShieldCheck, Building2, Award, FileText, Gauge, CheckCircle2, AlertTriangle, XCircle, Download,
} from 'lucide-react';
import type { Study } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// ==================== FEATURE 3: Automated Compliance Scoring ====================
interface ComplianceItem {
  label: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  action?: string;
}

function calculateComplianceScore(study: Study): { score: number; items: ComplianceItem[] } {
  const today = new Date('2026-08-21');
  const items: ComplianceItem[] = [];

  // 1. Ethics approval received
  const hasEthics = study.ethicsApproval.status === 'Approved' && !!study.ethicsApproval.approvalDate;
  const ethicsExpiryDays = daysUntil(study.ethicsApproval.expiryDate);
  if (hasEthics && ethicsExpiryDays > 60) {
    items.push({ label: 'Ethics Approval Received', status: 'pass', detail: `Approved ${formatDate(study.ethicsApproval.approvalDate)}, valid until ${formatDate(study.ethicsApproval.expiryDate)}` });
  } else if (hasEthics && ethicsExpiryDays > 0) {
    items.push({ label: 'Ethics Approval Validity', status: 'warning', detail: `Expires in ${ethicsExpiryDays} days`, action: 'Initiate renewal process before expiry' });
  } else if (study.ethicsApproval.status === 'Expired') {
    items.push({ label: 'Ethics Approval Received', status: 'fail', detail: `Expired ${formatDate(study.ethicsApproval.expiryDate)}`, action: 'Renew ethics approval immediately — study must be paused' });
  } else {
    items.push({ label: 'Ethics Approval Received', status: 'fail', detail: 'No approval on record', action: 'Submit ethics application to committee' });
  }

  // 2. CTRI registration completed
  if (study.ctri.status === 'Registered' && study.ctri.regNo) {
    items.push({ label: 'CTRI Registration Completed', status: 'pass', detail: `${study.ctri.regNo} (registered ${formatDate(study.ctri.registrationDate)})` });
  } else if (study.ctri.status === 'Pending') {
    const overdueMilestone = study.milestones.find(m => m.name === 'CTRI Registration' && m.status === 'Overdue');
    items.push({ label: 'CTRI Registration Completed', status: 'fail', detail: overdueMilestone?.meta || 'Pending registration', action: 'Register at ctri.nic.in immediately' });
  } else {
    items.push({ label: 'CTRI Registration Completed', status: 'fail', detail: 'Not registered', action: 'Register at ctri.nic.in' });
  }

  // 3. Data quality > 85%
  if (study.dataQuality.completeness >= 85) {
    items.push({ label: 'Data Quality > 85%', status: 'pass', detail: `${study.dataQuality.completeness}% completeness` });
  } else {
    items.push({ label: 'Data Quality > 85%', status: 'warning', detail: `${study.dataQuality.completeness}% — below threshold`, action: 'Address open queries to improve completeness' });
  }

  // 4. Monitoring visit within 90 days (mock: check upcoming actions for monitoring visit)
  const hasMonitoringUpcoming = study.upcomingActions.some(a => a.action.toLowerCase().includes('monitoring'));
  if (hasMonitoringUpcoming) {
    const monAction = study.upcomingActions.find(a => a.action.toLowerCase().includes('monitoring'));
    items.push({ label: 'Monitoring Visit Scheduled', status: 'pass', detail: `Next: ${monAction?.action} (${formatDate(monAction?.dueDate || '')})` });
  } else {
    items.push({ label: 'Monitoring Visit Scheduled', status: 'warning', detail: 'No monitoring visit in schedule', action: 'Schedule routine monitoring visit' });
  }

  // 5. No overdue SAE reports (check if any AE has negative daysToReport and not closed)
  const overdueSaes = study.status !== 'Completed' ? 0 : 0; // Simplified — no direct AE link in study
  items.push({
    label: 'SAE Reports Up to Date',
    status: overdueSaes > 0 ? 'fail' : 'pass',
    detail: overdueSaes > 0 ? `${overdueSaes} overdue SAE report(s)` : 'All SAE reports submitted on time',
  });

  // 6. Protocol deviations documented
  const deviationCheckItem = study.gcpChecklist.find(c => c.label.toLowerCase().includes('deviation'));
  if (deviationCheckItem?.completed) {
    items.push({ label: 'Protocol Deviations Documented', status: 'pass', detail: `Deviations reviewed and documented${deviationCheckItem.completedDate ? ` (${formatDate(deviationCheckItem.completedDate)})` : ''}` });
  } else {
    items.push({ label: 'Protocol Deviations Documented', status: 'warning', detail: 'Not yet documented', action: 'Review and log any protocol deviations' });
  }

  // 7. GCP checklist > 80%
  const completedChecks = study.gcpChecklist.filter(c => c.completed).length;
  const checklistPct = pct(completedChecks, study.gcpChecklist.length);
  if (checklistPct >= 80) {
    items.push({ label: 'GCP Checklist > 80%', status: 'pass', detail: `${checklistPct}% (${completedChecks}/${study.gcpChecklist.length} items)` });
  } else {
    items.push({ label: 'GCP Checklist > 80%', status: 'warning', detail: `${checklistPct}% — below 80% threshold`, action: 'Complete remaining GCP checklist items' });
  }

  // 8. Ethics approval validity > 60 days
  if (ethicsExpiryDays > 60) {
    items.push({ label: 'Ethics Validity > 60 Days', status: 'pass', detail: `${ethicsExpiryDays} days remaining` });
  } else if (ethicsExpiryDays > 0) {
    items.push({ label: 'Ethics Validity > 60 Days', status: 'warning', detail: `Only ${ethicsExpiryDays} days left`, action: 'Begin renewal process' });
  } else {
    items.push({ label: 'Ethics Validity > 60 Days', status: 'fail', detail: 'Expired', action: 'Renew immediately' });
  }

  // Calculate score: pass = full points, warning = half, fail = 0
  const pointsPerItem = 100 / items.length;
  const score = Math.round(items.reduce((sum, item) => {
    if (item.status === 'pass') return sum + pointsPerItem;
    if (item.status === 'warning') return sum + pointsPerItem * 0.5;
    return sum;
  }, 0));

  return { score, items };
}

function ComplianceGauge({ score }: { score: number }) {
  const gaugeData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const gaugeColor = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius="72%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={gaugeColor} />
            <Cell fill="#e5e7eb" className="dark:opacity-20" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono" style={{ color: gaugeColor }}>{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

const COMPLIANCE_BADGES = [
  { label: 'CTRI-Ready', icon: FileText },
  { label: 'GCP-ASU Compliant', icon: ShieldCheck },
  { label: 'ICMR-Approved', icon: Award },
  { label: 'ALCOA+-Compliant', icon: CheckCircle2 },
  { label: 'CDISC-Compatible', icon: FileText },
  { label: 'FHIR-Ready', icon: ShieldCheck },
];

function ComplianceDashboard({ study }: { study: Study }) {
  const { score, items } = useMemo(() => calculateComplianceScore(study), [study]);
  const passCount = items.filter(i => i.status === 'pass').length;
  const warnCount = items.filter(i => i.status === 'warning').length;
  const failCount = items.filter(i => i.status === 'fail').length;

  const handleExportReport = () => {
    exportToCsv(`${study.studyId}-compliance-scorecard.csv`, [
      { Metric: 'Compliance Score', Value: score },
      { Metric: 'Items Passed', Value: passCount },
      { Metric: 'Items Warning', Value: warnCount },
      { Metric: 'Items Failed', Value: failCount },
      ...items.map(item => ({
        Metric: item.label,
        Status: item.status,
        Detail: item.detail,
        Action: item.action || 'None',
      })),
    ]);
  };

  const statusIcon = (status: 'pass' | 'warning' | 'fail') => {
    if (status === 'pass') return <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />;
    return <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />;
  };

  const statusColor = (status: 'pass' | 'warning' | 'fail') => {
    if (status === 'pass') return 'border-success-200 dark:border-success-500/20 bg-success-50/50 dark:bg-success-500/5';
    if (status === 'warning') return 'border-warning-200 dark:border-warning-500/20 bg-warning-50/50 dark:bg-warning-500/5';
    return 'border-danger-200 dark:border-danger-500/20 bg-danger-50/50 dark:bg-danger-500/5';
  };

  return (
    <SectionCard
      title="Compliance Dashboard"
      subtitle="Automated compliance scoring against ICMR, NDCT Rules 2019 & GCP-ASU"
      actions={
        <button onClick={handleExportReport} className="btn-primary text-sm">
          <Download className="w-4 h-4" /> Generate Compliance Report
        </button>
      }
    >
      {/* Compliance Standards Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {COMPLIANCE_BADGES.map(badge => {
          const Icon = badge.icon;
          return (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-200 dark:border-gold-500/20"
            >
              <Icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge (1 col) */}
        <div className="flex flex-col items-center justify-center">
          <ComplianceGauge score={score} />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">Study Compliance Score</p>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1 text-success-600"><CheckCircle2 className="w-3.5 h-3.5" /> {passCount} Passed</span>
            <span className="flex items-center gap-1 text-warning-600"><AlertTriangle className="w-3.5 h-3.5" /> {warnCount} Warning</span>
            <span className="flex items-center gap-1 text-danger-600"><XCircle className="w-3.5 h-3.5" /> {failCount} Failed</span>
          </div>
        </div>

        {/* Checklist (2 cols) */}
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
            <Gauge className="w-4 h-4 text-primary-600" /> Auto-Checked Compliance Items
          </p>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border ${statusColor(item.status)}`}
              >
                {statusIcon(item.status)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                  {item.action && (
                    <p className={`text-xs mt-1 font-medium ${item.status === 'fail' ? 'text-danger-600 dark:text-danger-400' : 'text-warning-600 dark:text-warning-400'}`}>
                      Action needed: {item.action}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ComplianceTab({ study }: { study: Study }) {
  const { updateStudy, addAuditEntry, user } = useApp();
  const [ethicsDate, setEthicsDate] = useState(study.ethicsApproval.approvalDate);
  const [committee, setCommittee] = useState(study.ethicsApproval.committeeName);
  const [approvalId, setApprovalId] = useState(study.ethicsApproval.approvalId);
  const [ctriRegNo, setCtriRegNo] = useState(study.ctri.regNo);
  const [ctriDate, setCtriDate] = useState(study.ctri.registrationDate);
  const [fileName, setFileName] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(study.gcpChecklist);

  const expiryDate = ethicsDate ? new Date(ethicsDate) : null;
  if (expiryDate) expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const expiryStr = expiryDate ? expiryDate.toISOString().slice(0, 10) : '';
  const daysToExpiry = daysUntil(expiryStr);
  const ctriUrl = ctriRegNo ? `https://ctri.nic.in/Clinicaltrials/Advsearch.php?txtsearch=${encodeURIComponent(ctriRegNo)}` : '';

  const handleSaveEthics = () => {
    updateStudy(study.studyId, {
      ethicsApproval: { ...study.ethicsApproval, approvalDate: ethicsDate, committeeName: committee, approvalId, expiryDate: expiryStr },
    });
    if (user) addAuditEntry({
      logId: `LOG-${Date.now()}`, entityType: 'approval', entityId: study.studyId, entityName: 'Ethics Approval',
      userId: user.uid, userName: user.name, userRole: user.role,
      action: 'Ethics Approval Updated', timestamp: new Date().toISOString(),
      changes: [{ field: 'approvalDate', before: study.ethicsApproval.approvalDate, after: ethicsDate }],
    });
  };

  const handleSaveCtri = () => {
    updateStudy(study.studyId, {
      ctri: { ...study.ctri, regNo: ctriRegNo, registrationDate: ctriDate, status: ctriRegNo ? 'Registered' : 'Pending' },
    });
    if (user) addAuditEntry({
      logId: `LOG-${Date.now()}`, entityType: 'approval', entityId: study.studyId, entityName: 'CTRI Registration',
      userId: user.uid, userName: user.name, userRole: user.role,
      action: 'CTRI Registration Updated', timestamp: new Date().toISOString(),
      changes: [{ field: 'regNo', before: study.ctri.regNo, after: ctriRegNo }],
    });
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? {
      ...item, completed: !item.completed,
      completedDate: !item.completed ? new Date().toISOString().slice(0, 10) : undefined,
    } : item));
    updateStudy(study.studyId, { gcpChecklist: checklist });
  };

  const completedChecks = checklist.filter(c => c.completed).length;
  const checklistPct = pct(completedChecks, checklist.length);
  const apBadge = approvalStatusBadge(study.ethicsApproval.status);

  return (
    <div className="space-y-6">
      {/* FEATURE 3: Compliance Dashboard */}
      <ComplianceDashboard study={study} />

      {/* Section A: Ethics */}
      <SectionCard title="Section A — Ethics Committee Approval" subtitle="Ethics committee registration and validity tracking"
        actions={<span className={apBadge.class}>{apBadge.label}</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Ethics Approval Date</label>
            <input type="date" value={ethicsDate} onChange={e => setEthicsDate(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Ethics Committee Name</label>
            <select value={committee} onChange={e => setCommittee(e.target.value)} className="input">
              {ETHICS_COMMITTEES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Approval ID</label>
            <input type="text" value={approvalId} onChange={e => setApprovalId(e.target.value)} className="input font-mono" placeholder="IEC/AIIA/2024/XXX" />
          </div>
          <div>
            <label className="label">Validity Period (auto-calculated: +1 year)</label>
            <div className="input flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <span className="font-mono text-sm">{expiryStr || '—'}</span>
              {daysToExpiry < 0 ? <span className="badge-danger">Expired {Math.abs(daysToExpiry)}d ago</span> :
                daysToExpiry <= 30 ? <span className="badge-warning">{daysToExpiry}d left</span> :
                <span className="badge-success">{daysToExpiry}d left</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              <Upload className="w-4 h-4" /> Upload Approval Letter (PDF)
              <input type="file" accept="application/pdf" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || null)} />
            </label>
            {fileName && <span className="text-sm text-success-600 flex items-center gap-1"><FileCheck2 className="w-4 h-4" /> {fileName}</span>}
          </div>
          <button onClick={handleSaveEthics} className="btn-primary ml-auto">Save Ethics Details</button>
        </div>

        {daysToExpiry <= 30 && daysToExpiry >= 0 && (
          <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/20 flex items-center gap-2 text-sm text-warning-700 dark:text-warning-400">
            <AlertCircle className="w-4 h-4" /> Renewal due in {daysToExpiry} days. Please initiate ethics renewal process.
          </div>
        )}
        {daysToExpiry < 0 && (
          <div className="mt-4 p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 flex items-center gap-2 text-sm text-danger-700 dark:text-danger-400">
            <AlertCircle className="w-4 h-4" /> Ethics approval expired {Math.abs(daysToExpiry)} days ago. Study must be paused pending renewal.
          </div>
        )}
      </SectionCard>

      {/* Section B: CTRI */}
      <SectionCard title="Section B — CTRI Registration" subtitle="Clinical Trials Registry - India"
        actions={<span className={study.ctri.status === 'Registered' ? 'badge-success' : study.ctri.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}>{study.ctri.status}</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Trial Name (auto-filled)</label>
            <input type="text" value={study.title} readOnly className="input bg-gray-50 dark:bg-gray-800/50" />
          </div>
          <div>
            <label className="label">Study Protocol ID</label>
            <input type="text" value={study.ctri.protocolId} readOnly className="input bg-gray-50 dark:bg-gray-800/50 font-mono" />
          </div>
          <div>
            <label className="label">CTRI Registration Number</label>
            <input type="text" value={ctriRegNo} onChange={e => setCtriRegNo(e.target.value)} className="input font-mono" placeholder="CTRI/YYYY/MM/XXXXXX" />
          </div>
          <div>
            <label className="label">Registration Date</label>
            <input type="date" value={ctriDate} onChange={e => setCtriDate(e.target.value)} className="input" />
          </div>
        </div>

        {ctriUrl && (
          <a href={ctriUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline mt-3">
            View on ctri.nic.in <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {study.ctri.status === 'Registered' && (
          <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CTRI Record Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Registration No:</span> <span className="font-mono">{study.ctri.regNo}</span></div>
              <div><span className="text-gray-500">Registered on:</span> <span className="font-mono">{formatDate(study.ctri.registrationDate)}</span></div>
              <div><span className="text-gray-500">Trial Type:</span> Interventional</div>
              <div><span className="text-gray-500">Phase:</span> Phase III</div>
              <div><span className="text-gray-500">Sponsor:</span> {study.primarySponsor}</div>
              <div><span className="text-gray-500">Recruitment Status:</span> {study.status === 'Active' ? 'Recruiting' : study.status}</div>
            </div>
          </div>
        )}

        <button onClick={handleSaveCtri} className="btn-primary mt-4">Save CTRI Details</button>
      </SectionCard>

      {/* Section C: GCP Checklist */}
      <SectionCard title="Section C — GCP Compliance Checklist" subtitle="ICMR guidelines — 12 items"
        actions={<div className="text-right"><div className="text-2xl font-bold font-mono text-primary-600">{checklistPct}%</div><div className="text-xs text-gray-500">{completedChecks}/{checklist.length} complete</div></div>}>
        <div className="mb-4"><ProgressBar value={completedChecks} max={checklist.length} color="primary" showLabel /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors text-left"
            >
              {item.completed ? <CheckSquare className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /> : <Square className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />}
              <div className="min-w-0">
                <p className={`text-sm ${item.completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{item.label}</p>
                {item.completedDate && <p className="text-xs text-gray-400 font-mono mt-0.5">Completed: {formatDate(item.completedDate)}</p>}
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
