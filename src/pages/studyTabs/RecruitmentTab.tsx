import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { SectionCard, ProgressBar } from '@/components/ui';
import { formatDate, pct, exportToCsv, daysUntil } from '@/lib/utils';
import { Download, Users, UserCheck, UserPlus, MapPin, HeartPulse, FileText, ExternalLink, Activity, TrendingUp, Calendar, Clock, Info, ShieldCheck } from 'lucide-react';
import type { Study } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, Legend } from 'recharts';

// ==================== FEATURE 1: ABDM Integration ====================
// Mock patient health record data simulating Ayushman Bharat Digital Mission linkage
const MOCK_HEALTH_RECORDS: Record<string, {
  visits: number;
  medications: number;
  chronicConditions: string;
  lastCheckupDays: number;
}> = {
  default: { visits: 1, medications: 2, chronicConditions: 'Diabetes', lastCheckupDays: 45 },
  asthma: { visits: 3, medications: 4, chronicConditions: 'Asthma, Hypertension', lastCheckupDays: 12 },
  diabetes: { visits: 2, medications: 3, chronicConditions: 'Type-2 Diabetes', lastCheckupDays: 30 },
};

function getMockHealthRecord(study: Study) {
  if (study.title.toLowerCase().includes('diabetes')) return MOCK_HEALTH_RECORDS.diabetes;
  if (study.title.toLowerCase().includes('asthma')) return MOCK_HEALTH_RECORDS.asthma;
  return MOCK_HEALTH_RECORDS.default;
}

function AbdmSection({ study }: { study: Study }) {
  const [abhaId, setAbhaId] = useState(study.currentEnrolled > 0 ? `88-${study.studyId.slice(-6)}-6745-${(study.currentEnrolled * 7 % 9000 + 1000).toString()}` : '');
  const [linkStatus, setLinkStatus] = useState<'Connected' | 'Pending' | 'Not Linked'>(abhaId ? 'Connected' : 'Not Linked');

  const handleLink = () => {
    if (abhaId.length >= 10) setLinkStatus('Connected');
    else setLinkStatus('Pending');
  };

  const healthRecord = getMockHealthRecord(study);

  return (
    <SectionCard
      title="Connected Health Records"
      subtitle="Ayushman Bharat Digital Mission (ABDM) Integration"
      actions={
        <div className="flex items-center gap-2">
          <span className="badge-success flex items-center gap-1 text-xs">
            <ShieldCheck className="w-3 h-3" /> FHIR-Compatible
          </span>
          <a
            href="https://abdm.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            ABDM Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      }
    >
      {/* ABHA ID Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="label flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            Patient ABHA ID (Ayushman Bharat Health Account)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={abhaId}
              onChange={(e) => { setAbhaId(e.target.value); setLinkStatus('Pending'); }}
              placeholder="88-XXXX-XXXX-XXXX"
              className="input font-mono"
            />
            <button onClick={handleLink} className="btn-secondary whitespace-nowrap">
              <HeartPulse className="w-4 h-4" /> Link Record
            </button>
          </div>
        </div>
        <div>
          <label className="label">ABDM Status</label>
          <div className="input flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <span className="text-sm font-medium">
              {linkStatus === 'Connected' && <span className="text-success-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Connected</span>}
              {linkStatus === 'Pending' && <span className="text-warning-600">Pending</span>}
              {linkStatus === 'Not Linked' && <span className="text-gray-500">Not Linked</span>}
            </span>
            <span className={`badge ${linkStatus === 'Connected' ? 'badge-success' : linkStatus === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
              {linkStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Health Data Cards */}
      {linkStatus === 'Connected' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Hospital Visits</span>
              </div>
              <p className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">{healthRecord.visits}</p>
              <p className="text-xs text-teal-600/70 dark:text-teal-500/70 mt-1">in last 6 months</p>
            </div>
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Active Medications</span>
              </div>
              <p className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">{healthRecord.medications}</p>
              <p className="text-xs text-teal-600/70 dark:text-teal-500/70 mt-1">current prescriptions</p>
            </div>
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Chronic Conditions</span>
              </div>
              <p className="text-lg font-bold text-teal-700 dark:text-teal-300">{healthRecord.chronicConditions}</p>
              <p className="text-xs text-teal-600/70 dark:text-teal-500/70 mt-1">diagnosed conditions</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm">
              <span className="text-gray-500">Last Health Checkup: </span>
              <span className="font-mono font-medium">{healthRecord.lastCheckupDays} days ago</span>
            </div>
            <a
              href="https://health.abdm.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm flex items-center gap-1 text-teal-600"
            >
              View Full Health Record <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </>
      )}

      {linkStatus === 'Not Linked' && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center text-sm text-gray-500">
          Enter a patient's ABHA ID and click "Link Record" to view their connected health data from ABDM.
        </div>
      )}
    </SectionCard>
  );
}

// ==================== FEATURE 2: AI Enrollment Prediction ====================
function EnrollmentPrediction({ study }: { study: Study }) {
  const prediction = useMemo(() => {
    const today = new Date('2026-08-21');
    const startDate = new Date(study.startDate);
    const daysSinceStart = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / 86400000));
    const dailyRate = study.currentEnrolled / daysSinceStart;
    const remaining = study.targetEnrollment - study.currentEnrolled;
    const daysToComplete = dailyRate > 0 ? Math.ceil(remaining / dailyRate) : 999;
    const projectedDate = new Date(today);
    projectedDate.setDate(projectedDate.getDate() + daysToComplete);

    // Find the last patient enrolled milestone due date as the deadline
    const lastPatientMilestone = study.milestones.find(m => m.name === 'Last Patient Enrolled');
    const deadlineDate = lastPatientMilestone?.dueDate ? new Date(lastPatientMilestone.dueDate) : null;
    const deadlineStr = lastPatientMilestone?.dueDate || '';
    const daysToDeadline = deadlineDate ? Math.floor((deadlineDate.getTime() - today.getTime()) / 86400000) : 0;

    // Determine status: On Track, Lag Risk, At Risk
    let status: 'On Track' | 'Lag Risk' | 'At Risk' = 'On Track';
    if (study.currentEnrolled >= study.targetEnrollment) status = 'On Track';
    else if (daysToComplete > daysToDeadline + 10) status = 'At Risk';
    else if (daysToComplete > daysToDeadline + 5) status = 'Lag Risk';

    // Confidence based on data consistency
    const velocityVariance = study.enrolledVelocity.length > 0
      ? study.enrolledVelocity.reduce((sum, v, i, arr) => {
          if (i === 0) return 0;
          return sum + Math.abs(v.count - arr[i - 1].count);
        }, 0) / Math.max(1, study.enrolledVelocity.length - 1)
      : 0;
    const confidence = Math.max(60, Math.min(95, Math.round(95 - velocityVariance * 2)));

    // Build chart data: historical (actual) + predicted (future 60 days)
    const chartData: { date: string; actual: number | null; predicted: number | null }[] = [];

    // Historical data from enrolledVelocity
    study.enrolledVelocity.forEach(v => {
      chartData.push({ date: v.date, actual: v.count, predicted: null });
    });

    // Predicted data: extend from current enrolled for 60 days
    if (dailyRate > 0 && remaining > 0) {
      for (let i = 1; i <= 60; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const projectedEnrolled = Math.min(study.targetEnrollment, Math.round(study.currentEnrolled + dailyRate * i));
        chartData.push({
          date: d.toISOString().slice(0, 10),
          actual: null,
          predicted: projectedEnrolled,
        });
      }
    }

    return {
      dailyRate: dailyRate.toFixed(1),
      projectedDateStr: formatDate(projectedDate.toISOString().slice(0, 10)),
      daysToComplete,
      confidence,
      status,
      deadlineStr,
      daysToDeadline,
      chartData,
    };
  }, [study]);

  const statusConfig = {
    'On Track': { class: 'badge-success', color: '#16a34a', label: 'On Track' },
    'Lag Risk': { class: 'badge-warning', color: '#d97706', label: 'Lag Risk' },
    'At Risk': { class: 'badge-danger', color: '#dc2626', label: 'At Risk' },
  };
  const stCfg = statusConfig[prediction.status];

  return (
    <SectionCard
      title="Enrollment Forecast"
      subtitle="AI-based prediction using historical enrollment rate"
      actions={
        <span className={stCfg.class}>{stCfg.label}</span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart: Actual vs Predicted (2 cols) */}
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-primary-600" /> Enrollment Curve: Actual vs Predicted
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prediction.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={d => d.slice(5)}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 11 }} domain={[0, study.targetEnrollment]} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                labelFormatter={d => `Date: ${d}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                name="Actual Enrollment"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#0B7C59"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={false}
                name="Predicted (AI)"
                connectNulls={false}
              />
              <ReferenceLine y={study.targetEnrollment} stroke="#FF9933" strokeDasharray="3 3" label={{ value: 'Target', fontSize: 10, fill: '#FF9933' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats card (1 col) */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Activity className="w-4 h-4 text-teal-600" /> Enrollment Prediction
          </p>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Enrollment Rate</span>
              <span className="font-mono font-bold text-teal-600">{prediction.dailyRate}/day</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Projected Date</span>
              <span className="font-mono font-bold">{prediction.projectedDateStr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Days to Complete</span>
              <span className="font-mono font-bold">{prediction.daysToComplete >= 999 ? '—' : `${prediction.daysToComplete} days`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Confidence</span>
              <span className="font-mono font-bold text-primary-600">{prediction.confidence}%</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${stCfg.class} text-sm font-semibold`}>
            {stCfg.label}
            {prediction.daysToDeadline > 0 && prediction.daysToComplete < 999 && (
              <span className="block text-xs font-normal mt-1 opacity-80">
                {prediction.daysToComplete > prediction.daysToDeadline
                  ? `${prediction.daysToComplete - prediction.daysToDeadline} days behind deadline`
                  : `${prediction.daysToDeadline - prediction.daysToComplete} days ahead of deadline`}
              </span>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ==================== MAIN COMPONENT ====================
export default function RecruitmentTab({ study }: { study: Study }) {
  const { updateStudy } = useApp();

  const handleExport = () => {
    exportToCsv(`${study.studyId}-recruitment.csv`, [
      { Metric: 'Target Enrollment', Value: study.targetEnrollment },
      { Metric: 'Screened', Value: study.screened },
      { Metric: 'Eligible', Value: study.eligible },
      { Metric: 'Enrolled', Value: study.currentEnrolled },
      { Metric: 'Enrollment Percent', Value: pct(study.currentEnrolled, study.targetEnrollment) },
      ...study.sites.map(s => ({ Metric: `Site: ${s.name} - Target`, Value: s.target })),
      ...study.sites.map(s => ({ Metric: `Site: ${s.name} - Enrolled`, Value: s.enrolled })),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* 3-column counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-50 dark:bg-info-500/10 text-info-600 flex items-center justify-center"><Users className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Screened</p><p className="text-2xl font-bold font-mono">{study.screened}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-saffron-50 dark:bg-saffron-500/10 text-saffron-600 flex items-center justify-center"><UserCheck className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Eligible</p><p className="text-2xl font-bold font-mono">{study.eligible}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Enrolled</p><p className="text-2xl font-bold font-mono">{study.currentEnrolled}</p></div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <SectionCard title="Enrollment Progress" subtitle={`${study.currentEnrolled} of ${study.targetEnrollment} enrolled`}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar value={study.currentEnrolled} max={study.targetEnrollment} color={pct(study.currentEnrolled, study.targetEnrollment) >= 50 ? 'success' : 'warning'} />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono text-primary-600">{pct(study.currentEnrolled, study.targetEnrollment)}%</p>
            <p className="text-xs text-gray-500">{study.targetEnrollment - study.currentEnrolled} remaining</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">Screening Rate</p>
            <p className="text-lg font-bold font-mono">{pct(study.eligible, study.screened)}%</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">Eligibility Rate</p>
            <p className="text-lg font-bold font-mono">{pct(study.currentEnrolled, study.eligible)}%</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">Overall Conversion</p>
            <p className="text-lg font-bold font-mono">{pct(study.currentEnrolled, study.screened)}%</p>
          </div>
        </div>
      </SectionCard>

      {/* FEATURE 2: AI Enrollment Prediction */}
      <EnrollmentPrediction study={study} />

      {/* Velocity chart */}
      <SectionCard title="Enrollment Velocity" subtitle="Cumulative enrolled (last 30 days)" actions={<button onClick={handleExport} className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Export CSV</button>}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={study.enrolledVelocity}>
            <defs>
              <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
              labelFormatter={d => `Date: ${d}`}
            />
            <Area type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2} fill="url(#enrollGrad)" name="Enrolled" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Site-wise table */}
      <SectionCard title="Site-wise Enrollment" subtitle={`${study.sites.length} active sites`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="table-header">Site Name</th>
                <th className="table-header">Target</th>
                <th className="table-header">Enrolled</th>
                <th className="table-header">Progress</th>
                <th className="table-header">Activated</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {study.sites.map(site => {
                const sitePct = pct(site.enrolled, site.target);
                return (
                  <tr key={site.id}>
                    <td className="table-cell"><span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {site.name}</span></td>
                    <td className="table-cell font-mono">{site.target}</td>
                    <td className="table-cell font-mono">{site.enrolled}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 w-32">
                        <ProgressBar value={site.enrolled} max={site.target} color={sitePct >= 50 ? 'success' : 'warning'} />
                        <span className="text-xs font-mono w-9">{sitePct}%</span>
                      </div>
                    </td>
                    <td className="table-cell text-xs text-gray-500 font-mono">{formatDate(site.activatedDate)}</td>
                    <td className="table-cell">
                      <span className={sitePct >= 75 ? 'badge-success' : sitePct >= 25 ? 'badge-warning' : 'badge-neutral'}>
                        {sitePct >= 75 ? 'On Track' : sitePct >= 25 ? 'In Progress' : 'Slow'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* FEATURE 1: ABDM Integration */}
      <AbdmSection study={study} />
    </div>
  );
}
