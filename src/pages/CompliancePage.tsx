import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, SectionCard, ProgressBar } from '@/components/ui';
import {
  approvalStatusBadge, ctriStatusBadge, formatDate, daysUntil, pct,
} from '@/lib/utils';
import {
  ShieldCheck, ShieldAlert, FileCheck2, AlertTriangle, ChevronRight, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import type { Study } from '@/types';

export default function CompliancePage() {
  const { studies, alerts, navigate } = useApp();
  const [tab, setTab] = useState<'ethics' | 'ctri' | 'gcp'>('ethics');

  const ethicsAlerts = alerts.filter(a => a.category.includes('Ethics'));
  const ctriAlerts = alerts.filter(a => a.category.includes('CTRI'));
  const totalGcpItems = studies.reduce((s, st) => s + st.gcpChecklist.length, 0);
  const completedGcp = studies.reduce((s, st) => s + st.gcpChecklist.filter(c => c.completed).length, 0);

  const stats = [
    { label: 'Ethics Approved', value: studies.filter(s => s.ethicsApproval.status === 'Approved').length, total: studies.length, color: 'success' as const, icon: CheckCircle2 },
    { label: 'Ethics Expired', value: studies.filter(s => s.ethicsApproval.status === 'Expired').length, total: studies.length, color: 'danger' as const, icon: XCircle },
    { label: 'CTRI Registered', value: studies.filter(s => s.ctri.status === 'Registered').length, total: studies.length, color: 'success' as const, icon: FileCheck2 },
    { label: 'CTRI Pending', value: studies.filter(s => s.ctri.status === 'Pending').length, total: studies.length, color: 'warning' as const, icon: Clock },
    { label: 'GCP Compliance', value: completedGcp, total: totalGcpItems, color: 'primary' as const, icon: ShieldCheck },
  ];

  return (
    <div>
      <PageHeader
        title="Compliance Overview"
        subtitle="Ethics approvals, CTRI registration, and GCP compliance across all studies"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, total, color, icon: Icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color === 'success' ? 'text-success-500' : color === 'danger' ? 'text-danger-500' : color === 'warning' ? 'text-warning-500' : 'text-primary-500'}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className="text-2xl font-bold font-mono">{value}<span className="text-sm text-gray-400 font-normal">/{total}</span></p>
          </div>
        ))}
      </div>

      {/* Active compliance alerts */}
      {(ethicsAlerts.length > 0 || ctriAlerts.length > 0) && (
        <div className="card p-4 mb-6 bg-danger-50 dark:bg-danger-500/10 border-danger-200 dark:border-danger-500/20">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-danger-600" /><span className="font-semibold text-danger-700 dark:text-danger-400">Compliance Alerts</span></div>
          <div className="space-y-1 text-sm text-danger-700 dark:text-danger-400">
            {ethicsAlerts.map(a => <p key={a.id}>• {a.title}: {a.description}</p>)}
            {ctriAlerts.map(a => <p key={a.id}>• {a.title}: {a.description}</p>)}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 flex">
          {[
            { id: 'ethics' as const, label: 'Ethics Committee' },
            { id: 'ctri' as const, label: 'CTRI Registration' },
            { id: 'gcp' as const, label: 'GCP Compliance' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'tab-active' : 'tab-inactive'}`}>{t.label}</button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'ethics' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="table-header">Study</th>
                    <th className="table-header">Committee</th>
                    <th className="table-header">Approval ID</th>
                    <th className="table-header">Approval Date</th>
                    <th className="table-header">Expiry Date</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Days Left</th>
                    <th className="table-header"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {studies.map((s: Study) => {
                    const badge = approvalStatusBadge(s.ethicsApproval.status);
                    const days = daysUntil(s.ethicsApproval.expiryDate);
                    return (
                      <tr key={s.studyId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => navigate({ name: 'study-detail', studyId: s.studyId, tab: 'compliance' })}>
                        <td className="table-cell"><span className="font-mono text-xs text-primary-600">{s.studyId}</span><p className="text-xs text-gray-500 truncate max-w-[180px]">{s.title}</p></td>
                        <td className="table-cell text-xs max-w-[160px] truncate">{s.ethicsApproval.committeeName}</td>
                        <td className="table-cell font-mono text-xs">{s.ethicsApproval.approvalId}</td>
                        <td className="table-cell text-xs font-mono">{formatDate(s.ethicsApproval.approvalDate)}</td>
                        <td className="table-cell text-xs font-mono">{formatDate(s.ethicsApproval.expiryDate)}</td>
                        <td className="table-cell"><span className={badge.class}>{badge.label}</span></td>
                        <td className="table-cell font-mono text-xs">
                          <span className={days < 0 ? 'text-danger-600 font-bold' : days <= 30 ? 'text-warning-600' : 'text-gray-600'}>
                            {days < 0 ? `${Math.abs(days)}d expired` : `${days}d`}
                          </span>
                        </td>
                        <td className="table-cell"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'ctri' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="table-header">Study</th>
                    <th className="table-header">Protocol ID</th>
                    <th className="table-header">CTRI Registration No</th>
                    <th className="table-header">Registration Date</th>
                    <th className="table-header">Status</th>
                    <th className="table-header"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {studies.map((s: Study) => {
                    const badge = ctriStatusBadge(s.ctri.status);
                    return (
                      <tr key={s.studyId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => navigate({ name: 'study-detail', studyId: s.studyId, tab: 'compliance' })}>
                        <td className="table-cell"><span className="font-mono text-xs text-primary-600">{s.studyId}</span><p className="text-xs text-gray-500 truncate max-w-[180px]">{s.title}</p></td>
                        <td className="table-cell font-mono text-xs">{s.ctri.protocolId}</td>
                        <td className="table-cell font-mono text-xs">{s.ctri.regNo || '—'}</td>
                        <td className="table-cell text-xs font-mono">{formatDate(s.ctri.registrationDate)}</td>
                        <td className="table-cell"><span className={badge.class}>{badge.label}</span></td>
                        <td className="table-cell"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'gcp' && (
            <div className="space-y-4">
              {studies.map(s => {
                const completed = s.gcpChecklist.filter(c => c.completed).length;
                const p = pct(completed, s.gcpChecklist.length);
                return (
                  <button key={s.studyId} onClick={() => navigate({ name: 'study-detail', studyId: s.studyId, tab: 'compliance' })}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-500/40 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div><span className="font-mono text-xs text-primary-600">{s.studyId}</span><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.title}</p></div>
                      <span className={`badge ${p >= 75 ? 'badge-success' : p >= 50 ? 'badge-warning' : 'badge-danger'}`}>{p}% complete</span>
                    </div>
                    <ProgressBar value={completed} max={s.gcpChecklist.length} color={p >= 75 ? 'success' : p >= 50 ? 'warning' : 'danger'} />
                    <p className="text-xs text-gray-500 mt-2">{completed} of {s.gcpChecklist.length} items completed</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
