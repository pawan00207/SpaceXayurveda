import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui';
import { studyStatusBadge, ctriStatusBadge, formatDate, pct } from '@/lib/utils';
import { FolderKanban, ChevronRight, MapPin, Users, Calendar } from 'lucide-react';

export default function StudiesPage() {
  const { studies, navigate } = useApp();

  return (
    <div>
      <PageHeader title="Studies" subtitle={`${studies.length} studies in research portfolio`} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {studies.map(study => {
          const badge = studyStatusBadge(study.status);
          const ctBadge = ctriStatusBadge(study.ctri.status);
          return (
            <button
              key={study.studyId}
              onClick={() => navigate({ name: 'study-detail', studyId: study.studyId, tab: 'overview' })}
              className="card card-hover p-5 text-left animate-slide-up"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-xs font-medium text-primary-600 dark:text-primary-400">{study.studyId}</span>
                <span className={badge.class}>{badge.label}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{study.title}</h3>
              <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> PI: {study.pi}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {study.sites.length} sites • {study.sites.map(s => s.name).join(', ').slice(0, 40)}...</p>
                <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Started {formatDate(study.startDate)}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Enrollment</span>
                  <span className="text-xs font-mono font-medium">{study.currentEnrolled}/{study.targetEnrollment} ({pct(study.currentEnrolled, study.targetEnrollment)}%)</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct(study.currentEnrolled, study.targetEnrollment) >= 50 ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: `${pct(study.currentEnrolled, study.targetEnrollment)}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={ctBadge.class}>{ctBadge.label}</span>
                <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
