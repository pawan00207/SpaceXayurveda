import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, KpiCard } from '@/components/ui';
import {
  studyStatusBadge, ctriStatusBadge, approvalStatusBadge, alertBadge, formatDate, pct, exportToCsv,
} from '@/lib/utils';
import { MOCK_NEWS } from '@/data/ministryData';
import type { StudyStatus, Study } from '@/types';
import {
  FolderKanban, Users, Clock, AlertTriangle, Search, ArrowUpDown, ChevronRight,
  Download, CheckCircle2, XCircle, Clock3, Info, ShieldAlert, TrendingUp,
  Newspaper, ExternalLink,
} from 'lucide-react';

type SortKey = 'studyId' | 'title' | 'status' | 'pi' | 'sites' | 'targetEnrollment' | 'currentEnrolled' | 'approval' | 'ctri';

export default function DashboardPage() {
  const { studies, alerts, navigate, aes, can } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('studyId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const totalEnrolled = studies.reduce((sum, s) => sum + s.currentEnrolled, 0);
  const pendingApprovals = studies.filter(s => s.ethicsApproval.status === 'Pending' || s.ctri.status === 'Pending').length;
  const activeAlerts = alerts.filter(a => a.severity === 'red' || a.severity === 'yellow').length;

  const filtered = useMemo(() => {
    let result = studies.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.studyId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchApproval = approvalFilter === 'all' || s.ethicsApproval.status === approvalFilter || s.ctri.status === approvalFilter;
      return matchSearch && matchStatus && matchApproval;
    });
    result.sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === 'sites') { av = a.sites.length; bv = b.sites.length; }
      else if (sortKey === 'approval') { av = a.ethicsApproval.status; bv = b.ethicsApproval.status; }
      else if (sortKey === 'ctri') { av = a.ctri.status; bv = b.ctri.status; }
      else { av = a[sortKey]; bv = b[sortKey]; }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [studies, search, statusFilter, approvalFilter, sortKey, sortDir]);

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleExport = () => {
    exportToCsv('aiia-studies-summary.csv', filtered.map(s => ({
      StudyID: s.studyId, TrialName: s.title, Status: s.status, PI: s.pi,
      Sites: s.sites.length, Target: s.targetEnrollment, Enrolled: s.currentEnrolled,
      Percent: pct(s.currentEnrolled, s.targetEnrollment),
      ApprovalStatus: s.ethicsApproval.status, CTRIStatus: s.ctri.status, CTRINo: s.ctri.regNo,
    })));
  };

  return (
    <div>
      <PageHeader
        title="Portfolio Dashboard"
        subtitle="Clinical research portfolio overview — AIIA"
        actions={can('canExport') && (
          <button onClick={handleExport} className="btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>
        )}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Active Studies" value={studies.filter(s => s.status === 'Active').length} icon={FolderKanban} color="primary" trend={`${studies.length} total in portfolio`} />
        <KpiCard label="Total Enrolled Patients" value={totalEnrolled} icon={Users} color="saffron" trend="across all studies" />
        <KpiCard label="Pending Approvals" value={pendingApprovals} icon={Clock} color="warning" trend="ethics & CTRI" onClick={() => navigate({ name: 'compliance' })} />
        <KpiCard label="Active Alerts" value={activeAlerts} icon={AlertTriangle} color={activeAlerts > 0 ? 'danger' : 'success'} trend={`${alerts.length} total alerts`} />
      </div>

      {/* Latest Ministry Updates widget */}
      <div className="card p-4 mb-6 bg-gradient-to-r from-primary-50 to-gold-50 dark:from-primary-500/10 dark:to-gold-500/10 border-primary-100 dark:border-primary-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Latest Ministry Updates</h3>
          <button onClick={() => navigate({ name: 'home' })} className="ml-auto text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-0.5">
            View All <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_NEWS.slice(0, 3).map(news => (
            <button
              key={news.id}
              onClick={() => navigate({ name: 'home' })}
              className="text-left p-3 rounded-lg bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900/70 transition-all border border-white dark:border-gray-800/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-gold text-[9px]">{news.category}</span>
                <span className="text-[10px] text-gray-400 font-mono">{formatDate(news.date)}</span>
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">{news.title}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Studies Table */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Studies Summary</h3>
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" placeholder="Search study name or ID..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input pl-10 py-1.5 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input py-1.5 text-sm w-auto">
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
              </select>
              <select value={approvalFilter} onChange={e => setApprovalFilter(e.target.value)} className="input py-1.5 text-sm w-auto">
                <option value="all">All Approvals</option>
                <option value="Approved">Ethics: Approved</option>
                <option value="Pending">Ethics: Pending</option>
                <option value="Expired">Ethics: Expired</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {([
                    ['studyId', 'Study ID'], ['title', 'Trial Name'], ['status', 'Status'],
                    ['pi', 'PI'], ['sites', 'Sites'], ['targetEnrollment', 'Target'],
                    ['currentEnrolled', 'Enrolled'], ['approval', 'Approval'], ['ctri', 'CTRI'],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th key={key} className="table-header whitespace-nowrap">
                      <button onClick={() => sort(key)} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                        {label}
                        <ArrowUpDown className={`w-3 h-3 ${sortKey === key ? 'text-primary-600' : 'text-gray-300'}`} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(s => {
                  const stBadge = studyStatusBadge(s.status);
                  const apBadge = approvalStatusBadge(s.ethicsApproval.status);
                  const ctBadge = ctriStatusBadge(s.ctri.status);
                  return (
                    <tr
                      key={s.studyId}
                      onClick={() => navigate({ name: 'study-detail', studyId: s.studyId, tab: 'overview' })}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="table-cell font-mono text-xs font-medium text-primary-600 dark:text-primary-400">{s.studyId}</td>
                      <td className="table-cell max-w-[200px]"><p className="truncate">{s.title}</p></td>
                      <td className="table-cell"><span className={stBadge.class}>{stBadge.label}</span></td>
                      <td className="table-cell text-xs">{s.pi}</td>
                      <td className="table-cell font-mono">{s.sites.length}</td>
                      <td className="table-cell font-mono">{s.targetEnrollment}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{s.currentEnrolled}</span>
                          <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct(s.currentEnrolled, s.targetEnrollment) >= 50 ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: `${pct(s.currentEnrolled, s.targetEnrollment)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="table-cell"><span className={apBadge.class}>{apBadge.label}</span></td>
                      <td className="table-cell"><span className={ctBadge.class}>{ctBadge.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">No studies match your filters.</div>
          )}
        </div>

        {/* Alerts Panel */}
        <div className="card overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Alerts</h3>
            </div>
            <span className="badge-danger">{alerts.length}</span>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {alerts.map(alert => {
              const badge = alertBadge(alert.severity);
              const Icon = alert.severity === 'red' ? XCircle : alert.severity === 'yellow' ? Clock3 : Info;
              return (
                <button
                  key={alert.id}
                  onClick={() => navigate({ name: 'study-detail', studyId: alert.studyId, tab: alert.category.includes('SAE') || alert.category.includes('Ethics') ? 'compliance' : 'overview' })}
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.severity === 'red' ? 'text-danger-500' : alert.severity === 'yellow' ? 'text-warning-500' : 'text-info-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={badge.class}>{badge.label}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{alert.studyId}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{alert.description}</p>
                      {alert.dueDate && <p className="text-[10px] text-gray-400 mt-1 font-mono">Due: {formatDate(alert.dueDate)}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>
                </button>
              );
            })}
            {alerts.length === 0 && (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-success-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No active alerts. All clear.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="card p-4 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary-500" />
          <div><p className="text-xs text-gray-500">Total SAEs</p><p className="text-xl font-bold font-mono">{aes.filter(a => a.seriousness === 'Serious AE').length}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-saffron-500" />
          <div><p className="text-xs text-gray-500">Total AEs</p><p className="text-xl font-bold font-mono">{aes.length}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-success-500" />
          <div><p className="text-xs text-gray-500">Completed Studies</p><p className="text-xl font-bold font-mono">{studies.filter(s => s.status === 'Completed').length}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-info-500" />
          <div><p className="text-xs text-gray-500">Total Sites</p><p className="text-xl font-bold font-mono">{studies.reduce((s, st) => s + st.sites.length, 0)}</p></div>
        </div>
      </div>
    </div>
  );
}
