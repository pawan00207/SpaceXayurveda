import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label, value, icon: Icon, color, trend, onClick,
}: {
  label: string; value: string | number; icon: typeof import('lucide-react').Activity;
  color: 'primary' | 'saffron' | 'danger' | 'warning' | 'success' | 'info';
  trend?: string; onClick?: () => void;
}) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    saffron: 'bg-saffron-50 dark:bg-saffron-500/10 text-saffron-600 dark:text-saffron-400',
    danger: 'bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400',
    warning: 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400',
    success: 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400',
    info: 'bg-info-50 dark:bg-info-500/10 text-info-600 dark:text-info-400',
  };
  return (
    <div
      className={`card p-5 ${onClick ? 'cursor-pointer card-hover' : ''} animate-slide-up`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 font-mono">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'primary', showLabel = false }: { value: number; max?: number; color?: string; showLabel?: boolean }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors: Record<string, string> = {
    primary: 'bg-primary-500', success: 'bg-success-500', warning: 'bg-warning-500', danger: 'bg-danger-500',
  };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color] || colors.primary} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 flex-shrink-0 w-12 text-right">{pct}%</span>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: typeof import('lucide-react').Activity; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
