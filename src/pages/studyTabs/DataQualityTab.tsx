import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SectionCard } from '@/components/ui';
import { exportToCsv, formatDate } from '@/lib/utils';
import { Download, Search, Gauge, FileBarChart, MessageSquare, Filter } from 'lucide-react';
import type { Study, Query } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DataQualityTab({ study }: { study: Study }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { } = useApp();

  const filteredQueries = study.queries.filter(q => statusFilter === 'all' || q.status === statusFilter);
  const openQueries = study.queries.filter(q => q.status === 'Open' || q.status === 'Responded').length;

  const gaugeSize = 140;
  const strokeWidth = 14;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (study.dataQuality.completeness / 100) * circumference;

  const handleExport = () => {
    exportToCsv(`${study.studyId}-queries.csv`, study.queries.map(q => ({
      QueryID: q.queryId, DateRaised: q.dateRaised, Status: q.status,
      DaysOpen: q.daysOpen, RaisedBy: q.raisedBy, AssignedTo: q.assignedTo,
    })));
  };

  const queryStatusColor = (status: Query['status']) => {
    switch (status) {
      case 'Open': return 'badge-danger';
      case 'Responded': return 'badge-warning';
      case 'Resolved': return 'badge-info';
      case 'Closed': return 'badge-success';
    }
  };

  const barColors = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completeness Gauge */}
        <SectionCard title="Data Completeness" subtitle="Required fields filled">
          <div className="flex flex-col items-center py-4">
            <div className="relative" style={{ width: gaugeSize, height: gaugeSize }}>
              <svg width={gaugeSize} height={gaugeSize} className="-rotate-90">
                <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} className="dark:stroke-gray-800" />
                <circle
                  cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius} fill="none"
                  stroke="#0d9488" strokeWidth={strokeWidth} strokeDasharray={circumference}
                  strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono text-primary-600">{study.dataQuality.completeness}%</span>
                <span className="text-xs text-gray-500">complete</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Open Queries</p>
                <p className="text-lg font-bold font-mono text-danger-600">{openQueries}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Total Queries</p>
                <p className="text-lg font-bold font-mono">{study.queries.length}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Form Quality Scores */}
        <div className="lg:col-span-2">
          <SectionCard title="Data Quality Score by Form" subtitle="Per-form completeness percentages">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={study.dataQuality.forms} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {study.dataQuality.forms.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      </div>

      {/* Query Log */}
      <SectionCard title="Query Log" subtitle="Data queries and resolutions"
        actions={
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input py-1.5 text-sm w-auto">
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Responded">Responded</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <button onClick={handleExport} className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
        }>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="table-header">Query ID</th>
                <th className="table-header">Date Raised</th>
                <th className="table-header">Status</th>
                <th className="table-header">Days Open</th>
                <th className="table-header">Raised By</th>
                <th className="table-header">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredQueries.map(q => (
                <tr key={q.queryId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="table-cell font-mono text-xs text-primary-600">{q.queryId}</td>
                  <td className="table-cell text-xs font-mono">{formatDate(q.dateRaised)}</td>
                  <td className="table-cell"><span className={queryStatusColor(q.status)}>{q.status}</span></td>
                  <td className="table-cell font-mono">{q.daysOpen}</td>
                  <td className="table-cell text-xs">{q.raisedBy}</td>
                  <td className="table-cell text-xs">{q.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQueries.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No queries match filter.</div>}
        </div>
      </SectionCard>

      {/* Recent queries */}
      <SectionCard title="Recent Queries" subtitle="Last 5 raised">
        <div className="space-y-2">
          {study.queries.slice(0, 5).map(q => (
            <div key={q.queryId} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{q.queryId}</p>
                <p className="text-xs text-gray-500">Raised by {q.raisedBy} • {formatDate(q.dateRaised)}</p>
              </div>
              <span className={queryStatusColor(q.status)}>{q.status}</span>
            </div>
          ))}
          {study.queries.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No queries raised.</p>}
        </div>
      </SectionCard>
    </div>
  );
}
