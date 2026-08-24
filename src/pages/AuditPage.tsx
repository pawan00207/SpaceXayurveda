import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui';
import { formatDateTimeIST, exportToCsv } from '@/lib/utils';
import { ROLE_LABELS as RL } from '@/types';
import { Download, Filter, ShieldCheck, Search } from 'lucide-react';

export default function AuditPage() {
  const { auditLog, studies } = useApp();
  const [entityFilter, setEntityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = auditLog.filter(entry => {
    if (entityFilter !== 'all' && entry.entityType !== entityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return entry.action.toLowerCase().includes(q) || entry.entityName.toLowerCase().includes(q) || entry.userName.toLowerCase().includes(q) || entry.entityId.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExport = () => {
    exportToCsv('aiia-audit-trail.csv', filtered.map(e => ({
      LogID: e.logId, EntityType: e.entityType, EntityID: e.entityId, EntityName: e.entityName,
      User: e.userName, Role: RL[e.userRole], Action: e.action, Timestamp: e.timestamp,
      IST: formatDateTimeIST(e.timestamp),
      Changes: e.changes.map(c => `${c.field}: ${c.before} → ${c.after}`).join('; '),
    })));
  };

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle="ALCOA+ compliant immutable change log — all timestamps in IST"
        actions={<button onClick={handleExport} className="btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>}
      />

      {/* ALCOA+ principles banner */}
      <div className="card p-4 mb-6 bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20">
        <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-primary-600" /><span className="font-semibold text-primary-700 dark:text-primary-400">ALCOA+ Compliance</span></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 text-xs">
          {['Attributable', 'Legible', 'Contemporaneous', 'Original', 'Accurate', '+ Complete', '+ Consistent', '+ Enduring', '+ Available'].map(p => (
            <span key={p} className="px-2 py-1 bg-white dark:bg-gray-900 rounded text-center font-medium text-primary-700 dark:text-primary-400">{p}</span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by action, entity, user..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
          </div>
          <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="input w-auto">
            <option value="all">All Entity Types</option>
            <option value="study">Study</option>
            <option value="enrollment">Enrollment</option>
            <option value="adverse_event">Adverse Event</option>
            <option value="approval">Approval</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Log table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="table-header">Log ID</th>
                <th className="table-header">Timestamp (IST)</th>
                <th className="table-header">User</th>
                <th className="table-header">Role</th>
                <th className="table-header">Entity</th>
                <th className="table-header">Action</th>
                <th className="table-header">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(entry => (
                <tr key={entry.logId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="table-cell font-mono text-xs text-gray-500">{entry.logId}</td>
                  <td className="table-cell font-mono text-xs">{formatDateTimeIST(entry.timestamp)}</td>
                  <td className="table-cell text-sm">{entry.userName}</td>
                  <td className="table-cell text-xs">{RL[entry.userRole]}</td>
                  <td className="table-cell">
                    <span className="font-mono text-xs text-primary-600">{entry.entityId}</span>
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{entry.entityName}</p>
                  </td>
                  <td className="table-cell text-sm font-medium">{entry.action}</td>
                  <td className="table-cell max-w-[250px]">
                    {entry.changes.map((c, i) => (
                      <div key={i} className="text-xs font-mono text-gray-500">
                        <span className="text-gray-400">{c.field}:</span> <span className="line-through">{c.before}</span> → <span className="text-primary-600">{c.after}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No audit entries match filters.</div>}
      </div>

      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" /> Audit log is immutable. No delete operations permitted — records are marked "Withdrawn" with reason per ALCOA+ guidelines.
      </p>
    </div>
  );
}
