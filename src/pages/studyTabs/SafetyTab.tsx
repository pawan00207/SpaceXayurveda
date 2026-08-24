import { useApp } from '@/context/AppContext';
import { SectionCard } from '@/components/ui';
import { formatDate, exportToCsv } from '@/lib/utils';
import { Download, Activity, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import type { Study, AdverseEvent } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#fbbf24'];

export default function SafetyTab({ study }: { study: Study }) {
  const { aes, navigate } = useApp();
  const studyAes = aes.filter(ae => ae.studyId === study.studyId);
  const saes = studyAes.filter(ae => ae.seriousness === 'Serious AE');
  const seriousRate = studyAes.length > 0 ? Math.round((saes.length / studyAes.length) * 100) : 0;

  // AE by SOC
  const socCounts: Record<string, number> = {};
  studyAes.forEach(ae => { socCounts[ae.soc] = (socCounts[ae.soc] || 0) + 1; });
  const socData = Object.entries(socCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Causality distribution
  const causalityCounts: Record<string, number> = {};
  studyAes.forEach(ae => { causalityCounts[ae.causality] = (causalityCounts[ae.causality] || 0) + 1; });
  const causalityData = Object.entries(causalityCounts).map(([name, value]) => ({ name, value }));

  // Outcome distribution
  const outcomeCounts: Record<string, number> = {};
  studyAes.forEach(ae => { outcomeCounts[ae.outcome] = (outcomeCounts[ae.outcome] || 0) + 1; });
  const outcomeData = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }));

  const handleExport = () => {
    exportToCsv(`${study.studyId}-ae-reports.csv`, studyAes.map(ae => ({
      ReportID: ae.reportId, PatientID: ae.patientId, EventDate: ae.eventDate,
      Description: ae.description, Severity: ae.severity, Seriousness: ae.seriousness,
      SOC: ae.soc, PreferredTerm: ae.preferredTerm, ActionTaken: ae.actionTaken,
      Outcome: ae.outcome, Causality: ae.causality, Status: ae.status,
      RegulatoryDue: ae.regulatoryDueDate || 'N/A',
    })));
  };

  const severityBadge = (s: AdverseEvent['severity']) => {
    if (s === 'Life-Threatening' || s === 'Severe') return 'badge-danger';
    if (s === 'Moderate') return 'badge-warning';
    return 'badge-info';
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-50 dark:bg-info-500/10 text-info-600 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Total AE</p><p className="text-2xl font-bold font-mono">{studyAes.length}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger-600 flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Total SAE</p><p className="text-2xl font-bold font-mono">{saes.length}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-saffron-50 dark:bg-saffron-500/10 text-saffron-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <div><p className="text-sm text-gray-500">Serious Rate</p><p className="text-2xl font-bold font-mono">{seriousRate}%</p></div>
          </div>
        </div>
      </div>

      {/* Pending regulatory reports */}
      {saes.filter(s => s.status !== 'Closed').length > 0 && (
        <div className="card p-4 bg-danger-50 dark:bg-danger-500/10 border-danger-200 dark:border-danger-500/20">
          <div className="flex items-center gap-2 text-sm text-danger-700 dark:text-danger-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Pending Regulatory Reports:</span>
            {saes.filter(s => s.status !== 'Closed').map((s, i) => (
              <span key={s.aeId} className="font-mono text-xs">
                {i > 0 && ', '}<button onClick={() => navigate({ name: 'pharmacovigilance' })} className="underline">{s.reportId}</button>
                {s.daysToReport < 0 ? ` (OVERDUE ${Math.abs(s.daysToReport)}d)` : ` (due ${formatDate(s.regulatoryDueDate)})`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => navigate({ name: 'ae-intake', studyId: study.studyId })} className="btn-primary">
          <Plus className="w-4 h-4" /> New AE/SAE Report
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="AE by System Organ Class" subtitle="MedDRA SOC distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={160} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Causality Distribution" subtitle="Assessment outcomes">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={causalityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name}: ${e.value}`}>
                {causalityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Outcome Distribution" subtitle="AE outcomes">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={outcomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e: any) => `${e.name}: ${e.value}`}>
              {outcomeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* SAE Reports Table */}
      <SectionCard title="SAE Reports" subtitle="Serious adverse event reports" actions={<button onClick={handleExport} className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="table-header">Report ID</th>
                <th className="table-header">Date</th>
                <th className="table-header">Patient</th>
                <th className="table-header">Description</th>
                <th className="table-header">Severity</th>
                <th className="table-header">Causality</th>
                <th className="table-header">Status</th>
                <th className="table-header">Days to Report</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {saes.map(sae => (
                <tr key={sae.aeId} className={sae.daysToReport < 0 ? 'bg-danger-50/50 dark:bg-danger-500/5' : ''}>
                  <td className="table-cell font-mono text-xs text-primary-600">{sae.reportId}</td>
                  <td className="table-cell text-xs font-mono">{formatDate(sae.eventDate)}</td>
                  <td className="table-cell font-mono text-xs">{sae.patientId}</td>
                  <td className="table-cell max-w-[200px]"><p className="truncate text-xs">{sae.description}</p></td>
                  <td className="table-cell"><span className={severityBadge(sae.severity)}>{sae.severity}</span></td>
                  <td className="table-cell text-xs">{sae.causality}</td>
                  <td className="table-cell"><span className={sae.status === 'Closed' ? 'badge-success' : sae.status === 'Submitted' ? 'badge-info' : 'badge-warning'}>{sae.status}</span></td>
                  <td className="table-cell font-mono text-xs">
                    {sae.regulatoryDueDate ? (
                      <span className={sae.daysToReport < 0 ? 'text-danger-600 font-bold' : 'text-gray-600'}>
                        {sae.daysToReport < 0 ? `${Math.abs(sae.daysToReport)}d overdue` : `${sae.daysToReport}d left`}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="table-cell">
                    <button onClick={() => navigate({ name: 'pharmacovigilance' })} className="text-primary-600 hover:text-primary-700"><ArrowRight className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {saes.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No SAEs reported for this study.</div>}
        </div>
      </SectionCard>
    </div>
  );
}
