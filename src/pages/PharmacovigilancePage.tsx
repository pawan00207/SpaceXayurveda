import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, KpiCard, SectionCard } from '@/components/ui';
import { exportToCsv, formatDate, daysUntil } from '@/lib/utils';
import { buildAeTrend } from '@/data/mockData';
import {
  Activity, AlertTriangle, TrendingUp, Download, Plus, Filter, Hospital, Clock,
} from 'lucide-react';
import type { AdverseEvent } from '@/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#fbbf24', '#fb923c', '#ef4444'];

export default function PharmacovigilancePage() {
  const { aes, studies, navigate, can } = useApp();
  const [dateRange, setDateRange] = useState('all');
  const [studyFilter, setStudyFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [causalityFilter, setCausalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const canEdit = can('canEditSafety');

  const filtered = useMemo(() => {
    return aes.filter(ae => {
      if (studyFilter !== 'all' && ae.studyId !== studyFilter) return false;
      if (severityFilter !== 'all' && ae.severity !== severityFilter) return false;
      if (causalityFilter !== 'all' && ae.causality !== causalityFilter) return false;
      if (statusFilter !== 'all' && ae.status !== statusFilter) return false;
      return true;
    });
  }, [aes, studyFilter, severityFilter, causalityFilter, statusFilter]);

  const totalAe = filtered.length;
  const totalSae = filtered.filter(a => a.seriousness === 'Serious AE').length;
  const hospitalizations = filtered.filter(a => a.description.toLowerCase().includes('hospital')).length;
  const pendingReports = filtered.filter(a => a.seriousness === 'Serious AE' && a.status !== 'Closed');

  const trend = buildAeTrend(aes);

  // SOC distribution (top 10)
  const socCounts: Record<string, number> = {};
  filtered.forEach(ae => { socCounts[ae.soc] = (socCounts[ae.soc] || 0) + 1; });
  const socData = Object.entries(socCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);

  // Causality
  const causalityCounts: Record<string, number> = {};
  filtered.forEach(ae => { causalityCounts[ae.causality] = (causalityCounts[ae.causality] || 0) + 1; });
  const causalityData = Object.entries(causalityCounts).map(([name, value]) => ({ name, value }));

  // Outcome
  const outcomeCounts: Record<string, number> = {};
  filtered.forEach(ae => { outcomeCounts[ae.outcome] = (outcomeCounts[ae.outcome] || 0) + 1; });
  const outcomeData = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }));

  const handleExport = () => {
    exportToCsv('aiia-ae-reports.csv', filtered.map(ae => ({
      ReportID: ae.reportId, StudyID: ae.studyId, StudyTitle: ae.studyTitle,
      PatientID: ae.patientId, EventDate: ae.eventDate, ReportedDate: ae.reportedDate,
      Description: ae.description, Severity: ae.severity, Seriousness: ae.seriousness,
      SOC: ae.soc, PreferredTerm: ae.preferredTerm, ActionTaken: ae.actionTaken,
      Outcome: ae.outcome, Causality: ae.causality, Status: ae.status,
      RegulatoryDue: ae.regulatoryDueDate || 'N/A', Reporter: ae.reporterName,
    })));
  };

  const severityBadge = (s: AdverseEvent['severity']) => {
    if (s === 'Life-Threatening' || s === 'Severe') return 'badge-danger';
    if (s === 'Moderate') return 'badge-warning';
    return 'badge-info';
  };

  return (
    <div>
      <PageHeader
        title="Pharmacovigilance Dashboard"
        subtitle="Adverse event tracking and regulatory reporting"
        actions={
          <div className="flex gap-2">
            {canEdit && <button onClick={() => navigate({ name: 'ae-intake' })} className="btn-primary"><Plus className="w-4 h-4" /> New AE/SAE Report</button>}
            <button onClick={handleExport} className="btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total AE" value={totalAe} icon={Activity} color="primary" />
        <KpiCard label="Total SAE" value={totalSae} icon={AlertTriangle} color="danger" />
        <KpiCard label="Hospitalizations" value={hospitalizations} icon={Hospital} color="saffron" />
        <KpiCard label="Pending Reports" value={pendingReports.length} icon={Clock} color="warning" />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3"><Filter className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="input py-1.5 text-sm">
            <option value="all">All Dates</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select value={studyFilter} onChange={e => setStudyFilter(e.target.value)} className="input py-1.5 text-sm">
            <option value="all">All Studies</option>
            {studies.map(s => <option key={s.studyId} value={s.studyId}>{s.studyId}</option>)}
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="input py-1.5 text-sm">
            <option value="all">All Severity</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Life-Threatening">Life-Threatening</option>
          </select>
          <select value={causalityFilter} onChange={e => setCausalityFilter(e.target.value)} className="input py-1.5 text-sm">
            <option value="all">All Causality</option>
            <option value="Unrelated">Unrelated</option>
            <option value="Unlikely">Unlikely</option>
            <option value="Possible">Possible</option>
            <option value="Probable">Probable</option>
            <option value="Definite">Definite</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input py-1.5 text-sm">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Pending regulatory reports */}
      {pendingReports.length > 0 && (
        <SectionCard title="SAE Reports Pending Regulatory Filing" subtitle="Expedited reporting deadlines" actions={<span className="badge-danger">{pendingReports.length} pending</span>}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="table-header">Report ID</th>
                  <th className="table-header">Study</th>
                  <th className="table-header">Date Reported</th>
                  <th className="table-header">Outcome</th>
                  <th className="table-header">Days Until Due</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pendingReports.map(r => (
                  <tr key={r.aeId} className={r.daysToReport < 0 ? 'bg-danger-50 dark:bg-danger-500/5' : ''}>
                    <td className="table-cell font-mono text-xs text-primary-600">{r.reportId}</td>
                    <td className="table-cell font-mono text-xs">{r.studyId}</td>
                    <td className="table-cell text-xs font-mono">{formatDate(r.reportedDate)}</td>
                    <td className="table-cell text-xs">{r.outcome}</td>
                    <td className="table-cell font-mono">
                      <span className={`text-xs font-bold ${r.daysToReport < 0 ? 'text-danger-600' : r.daysToReport <= 3 ? 'text-warning-600' : 'text-gray-600'}`}>
                        {r.daysToReport < 0 ? `${Math.abs(r.daysToReport)} days OVERDUE` : `${r.daysToReport} days left`}
                      </span>
                    </td>
                    <td className="table-cell"><span className={r.status === 'Submitted' ? 'badge-info' : 'badge-warning'}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SectionCard title="AE Trend" subtitle="Cumulative AE count (last 90 days)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2} dot={false} name="Cumulative AE" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="AE by System Organ Class" subtitle="Top 10 MedDRA SOCs">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={socData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={160} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Causality Distribution" subtitle="Causality assessments">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={causalityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e: any) => `${e.name}: ${e.value}`}>
                {causalityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Outcome Distribution" subtitle="AE outcomes">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={outcomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e: any) => `${e.name}: ${e.value}`}>
                {outcomeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Full AE Log */}
      <div className="mt-6">
        <SectionCard title="All Adverse Events" subtitle={`${filtered.length} events`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="table-header">Report ID</th>
                  <th className="table-header">Study</th>
                  <th className="table-header">Patient</th>
                  <th className="table-header">Event Date</th>
                  <th className="table-header">Severity</th>
                  <th className="table-header">Seriousness</th>
                  <th className="table-header">SOC</th>
                  <th className="table-header">Causality</th>
                  <th className="table-header">Outcome</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(ae => (
                  <tr key={ae.aeId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="table-cell font-mono text-xs text-primary-600">{ae.reportId}</td>
                    <td className="table-cell font-mono text-xs">{ae.studyId}</td>
                    <td className="table-cell font-mono text-xs">{ae.patientId}</td>
                    <td className="table-cell text-xs font-mono">{formatDate(ae.eventDate)}</td>
                    <td className="table-cell"><span className={severityBadge(ae.severity)}>{ae.severity}</span></td>
                    <td className="table-cell"><span className={ae.seriousness === 'Serious AE' ? 'badge-danger' : 'badge-neutral'}>{ae.seriousness}</span></td>
                    <td className="table-cell text-xs max-w-[150px] truncate">{ae.soc}</td>
                    <td className="table-cell text-xs">{ae.causality}</td>
                    <td className="table-cell text-xs">{ae.outcome}</td>
                    <td className="table-cell"><span className={ae.status === 'Closed' ? 'badge-success' : ae.status === 'Submitted' ? 'badge-info' : 'badge-warning'}>{ae.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No adverse events match filters.</div>}
        </SectionCard>
      </div>
    </div>
  );
}
