import { useApp } from '@/context/AppContext';
import type { StudyTab } from '@/context/AppContext';
import { studyStatusBadge, formatDateTimeIST } from '@/lib/utils';
import {
  Edit3, Archive, Download, ChevronLeft, History, ShieldCheck, Moon, Sun,
} from 'lucide-react';
import type { StudyStatus } from '@/types';
import OverviewTab from '@/pages/studyTabs/OverviewTab';
import RecruitmentTab from '@/pages/studyTabs/RecruitmentTab';
import ComplianceTab from '@/pages/studyTabs/ComplianceTab';
import DataQualityTab from '@/pages/studyTabs/DataQualityTab';
import SafetyTab from '@/pages/studyTabs/SafetyTab';
import { useState } from 'react';

const TABS: { id: StudyTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'recruitment', label: 'Recruitment' },
  { id: 'compliance', label: 'Compliance & Approvals' },
  { id: 'data-quality', label: 'Data Quality' },
  { id: 'safety', label: 'Safety & Pharmacovigilance' },
];

export default function StudyDetailPage({ studyId, tab: initialTab = 'overview' }: { studyId: string; tab?: StudyTab }) {
  const { studies, navigate, updateStudy, can, user, auditLog } = useApp();
  const [activeTab, setActiveTab] = useState<StudyTab>(initialTab);
  const [showAudit, setShowAudit] = useState(false);

  const study = studies.find(s => s.studyId === studyId);
  if (!study) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Study not found.</p>
        <button onClick={() => navigate({ name: 'studies' })} className="btn-primary mt-4">Back to Studies</button>
      </div>
    );
  }

  const badge = studyStatusBadge(study.status);
  const studyAuditLog = auditLog.filter(a => a.entityId === study.studyId);
  const canViewSafety = can('canViewSafety');

  const handleStatusChange = (newStatus: StudyStatus) => {
    if (newStatus === study.status) return;
    updateStudy(study.studyId, { status: newStatus });
  };

  return (
    <div>
      {/* Back link */}
      <button onClick={() => navigate({ name: 'studies' })} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Studies
      </button>

      {/* Header */}
      <div className="card p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">{study.studyId}</span>
              <span className={badge.class}>{badge.label}</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{study.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>PI: <span className="text-gray-700 dark:text-gray-300 font-medium">{study.pi}</span></span>
              <span>Started: <span className="text-gray-700 dark:text-gray-300 font-medium">{study.startDate}</span></span>
              <span>Sponsor: <span className="text-gray-700 dark:text-gray-300 font-medium">{study.primarySponsor}</span></span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-mono">
              <span>Created: {formatDateTimeIST(study.createdAt)}</span>
              <span>•</span>
              <span>Modified: {formatDateTimeIST(study.updatedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {can('canEditStudies') && (
              <select
                value={study.status}
                onChange={e => handleStatusChange(e.target.value as StudyStatus)}
                className="input py-1.5 text-sm w-auto"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
              </select>
            )}
            {can('canEditStudies') && <button className="btn-secondary"><Edit3 className="w-4 h-4" /> Edit</button>}
            {can('canViewAudit') && (
              <button onClick={() => setShowAudit(s => !s)} className="btn-secondary">
                <History className="w-4 h-4" /> Audit ({studyAuditLog.length})
              </button>
            )}
            <button className="btn-secondary"><Archive className="w-4 h-4" /> Archive</button>
            <button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>
          </div>
        </div>
      </div>

      {/* Audit dropdown */}
      {showAudit && can('canViewAudit') && (
        <div className="card p-5 mb-6 animate-slide-up">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Study Audit Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {studyAuditLog.map(entry => (
              <div key={entry.logId} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <ShieldCheck className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.action}</p>
                  <p className="text-xs text-gray-500">
                    {entry.userName} ({entry.userRole}) • {formatDateTimeIST(entry.timestamp)}
                  </p>
                  {entry.changes.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {entry.changes.map((c, i) => (
                        <span key={i} className="font-mono">{c.field}: {c.before} → {c.after}; </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {studyAuditLog.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No audit entries.</p>}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <div className="flex">
            {TABS.map(t => {
              if (t.id === 'safety' && !canViewSafety) return null;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`tab-btn ${activeTab === t.id ? 'tab-active' : 'tab-inactive'}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'overview' && <OverviewTab study={study} />}
          {activeTab === 'recruitment' && <RecruitmentTab study={study} />}
          {activeTab === 'compliance' && <ComplianceTab study={study} />}
          {activeTab === 'data-quality' && <DataQualityTab study={study} />}
          {activeTab === 'safety' && canViewSafety && <SafetyTab study={study} />}
        </div>
      </div>
    </div>
  );
}
