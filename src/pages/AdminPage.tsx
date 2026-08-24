import { useApp } from '@/context/AppContext';
import { PageHeader, SectionCard } from '@/components/ui';
import { ROLE_LABELS } from '@/types';
import { formatDateTimeIST } from '@/lib/utils';
import { MOCK_USERS } from '@/data/mockData';
import {
  Users, ShieldCheck, Database, Settings, Activity, FolderKanban, Bell, Lock,
} from 'lucide-react';

export default function AdminPage() {
  const { studies, aes, auditLog, alerts, user } = useApp();

  const roleCounts: Record<string, number> = {};
  MOCK_USERS.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });

  return (
    <div>
      <PageHeader title="Admin Settings" subtitle="System administration and user management" />

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: MOCK_USERS.length, icon: Users, color: 'text-primary-600 bg-primary-50 dark:bg-primary-500/10' },
          { label: 'Active Studies', value: studies.length, icon: FolderKanban, color: 'text-saffron-600 bg-saffron-50 dark:bg-saffron-500/10' },
          { label: 'Audit Entries', value: auditLog.length, icon: ShieldCheck, color: 'text-info-600 bg-info-50 dark:bg-info-500/10' },
          { label: 'System Alerts', value: alerts.length, icon: Bell, color: 'text-danger-600 bg-danger-50 dark:bg-danger-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold font-mono">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <SectionCard title="User Management" subtitle="Registered users and roles">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {MOCK_USERS.map(u => (
                  <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="table-cell text-sm font-medium">{u.name}</td>
                    <td className="table-cell text-xs font-mono">{u.email}</td>
                    <td className="table-cell"><span className="badge-neutral">{ROLE_LABELS[u.role]}</span></td>
                    <td className="table-cell text-xs font-mono text-gray-500">{formatDateTimeIST(u.lastLogin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Role Distribution */}
        <SectionCard title="Role Distribution" subtitle="Access control overview">
          <div className="space-y-3">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 flex items-center justify-center"><Lock className="w-4 h-4" /></div>
                  <span className="text-sm font-medium">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 mb-2">RBAC Permission Matrix</p>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <div key={role} className="px-2 py-1 bg-white dark:bg-gray-900 rounded text-center truncate" title={label}>{label.split(' ')[0]}</div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SectionCard title="System Configuration" subtitle="Platform settings">
          <div className="space-y-2 text-sm">
            {[
              { label: 'Session Timeout', value: '30 minutes' },
              { label: 'Audit Standard', value: 'ALCOA+' },
              { label: 'Regulatory Format', value: 'CTRI / CDISC' },
              { label: 'MedDRA Version', value: 'v26.1 (26 SOCs)' },
              { label: 'Data Storage', value: 'Supabase PostgreSQL' },
              { label: 'Auth Method', value: 'JWT + RBAC' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Data Storage" subtitle="Backend status">
          <div className="space-y-3">
            {[
              { table: 'users', count: MOCK_USERS.length, icon: Users },
              { table: 'studies', count: studies.length, icon: FolderKanban },
              { table: 'adverseEvents', count: aes.length, icon: Activity },
              { table: 'auditLog', count: auditLog.length, icon: ShieldCheck },
            ].map(({ table, count, icon: Icon }) => (
              <div key={table} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-primary-500" /><span className="font-mono text-sm">{table}</span></div>
                <span className="font-mono font-bold">{count} rows</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Admin Actions" subtitle="System maintenance">
          <div className="space-y-2">
            {[
              { label: 'Export Full Database', icon: Database },
              { label: 'Manage User Roles', icon: Users },
              { label: 'Configure Alert Thresholds', icon: Settings },
              { label: 'View System Logs', icon: ShieldCheck },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-all text-left">
                <Icon className="w-4 h-4 text-primary-500" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
