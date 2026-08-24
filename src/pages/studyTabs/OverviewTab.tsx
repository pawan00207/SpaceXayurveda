import { useApp } from '@/context/AppContext';
import { SectionCard, ProgressBar } from '@/components/ui';
import {
  formatDate, daysUntil, pct, exportToCsv,
} from '@/lib/utils';
import {
  CheckCircle2, Clock, AlertCircle, Download, FileText, FileCheck2, Building2,
  Calendar, ClipboardList, User,
} from 'lucide-react';
import type { Study } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function OverviewTab({ study }: { study: Study }) {
  const { navigate } = useApp();

  const timelinePhases = [
    { name: 'Protocol', start: '2024-01-01', end: '2024-01-15', status: 'done' },
    { name: 'Ethics', start: '2024-01-15', end: '2024-06-15', status: 'done' },
    { name: 'CTRI', start: '2024-03-01', end: '2024-04-15', status: 'done' },
    { name: 'Recruitment', start: '2024-03-05', end: '2026-12-01', status: study.status === 'Active' ? 'active' : study.status === 'Completed' ? 'done' : 'pending' },
    { name: 'Analysis', start: '2026-12-01', end: '2027-04-01', status: 'pending' },
    { name: 'Closeout', start: '2027-04-01', end: '2027-06-30', status: 'pending' },
  ];

  const milestoneIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 className="w-5 h-5 text-success-500" />;
    if (status === 'Overdue') return <AlertCircle className="w-5 h-5 text-danger-500" />;
    return <Clock className="w-5 h-5 text-warning-500" />;
  };

  const handleExport = () => {
    exportToCsv(`${study.studyId}-milestones.csv`, study.milestones.map(m => ({
      Milestone: m.name, Status: m.status, DueDate: m.dueDate || '', CompletedDate: m.completedDate || '', Details: m.meta || '',
    })));
  };

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <SectionCard title="Study Timeline" subtitle="Protocol through closeout phases" actions={<button onClick={handleExport} className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Export</button>}>
        <div className="space-y-3">
          {timelinePhases.map((phase, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-28 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">{phase.name}</div>
              <div className="flex-1 relative">
                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg flex items-center px-3 text-xs font-medium ${
                      phase.status === 'done' ? 'bg-success-500 text-white' :
                      phase.status === 'active' ? 'bg-primary-500 text-white' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                    style={{ width: '100%' }}
                  >
                    {phase.status === 'done' && 'Completed'}
                    {phase.status === 'active' && 'In Progress'}
                    {phase.status === 'pending' && 'Upcoming'}
                    <span className="ml-auto opacity-80 text-[10px]">{formatDate(phase.start)} → {formatDate(phase.end)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones */}
        <SectionCard title="Key Milestones" subtitle="Regulatory and operational milestones">
          <div className="space-y-3">
            {study.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                {milestoneIcon(m.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{m.name}</p>
                    <span className={`text-xs ${m.status === 'Completed' ? 'text-success-600' : m.status === 'Overdue' ? 'text-danger-600' : 'text-warning-600'}`}>{m.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    {m.completedDate && <span className="font-mono">Completed: {formatDate(m.completedDate)}</span>}
                    {m.dueDate && <span className="font-mono">Due: {formatDate(m.dueDate)}</span>}
                    {m.meta && <span className="text-primary-600 dark:text-primary-400">{m.meta}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Upcoming Actions */}
        <SectionCard title="Upcoming Actions" subtitle="Next 5 actions with due dates">
          <div className="space-y-3">
            {study.upcomingActions.map((action, i) => {
              const days = daysUntil(action.dueDate);
              const isOverdue = days < 0;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isOverdue ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-600' : 'bg-primary-50 dark:bg-primary-500/10 text-primary-600'}`}>
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{action.action}</p>
                    <p className={`text-xs font-mono ${isOverdue ? 'text-danger-600' : 'text-gray-500'}`}>
                      Due {formatDate(action.dueDate)} {isOverdue ? `(${Math.abs(days)} days overdue)` : `(${days} days)`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Study metadata */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: 'Sponsor', value: study.primarySponsor },
          { icon: User, label: 'Principal Investigator', value: study.pi },
          { icon: Calendar, label: 'Start Date', value: formatDate(study.startDate) },
          { icon: FileText, label: 'Sites', value: `${study.sites.length} active` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2"><Icon className="w-4 h-4" /><span className="text-xs">{label}</span></div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
