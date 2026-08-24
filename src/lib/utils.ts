import type { StudyStatus, CtriStatus, ApprovalStatus, AlertSeverity } from '@/types';

export function exportToCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const val = String(row[h] ?? '');
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTimeIST(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata', timeZoneName: 'short',
  });
}

export function daysUntil(dateStr: string, from = new Date('2026-08-21')): number {
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - from.getTime()) / 86400000);
}

export function studyStatusBadge(status: StudyStatus) {
  switch (status) {
    case 'Active': return { class: 'badge-success', label: 'Active' };
    case 'Paused': return { class: 'badge-warning', label: 'Paused' };
    case 'Completed': return { class: 'badge-neutral', label: 'Completed' };
    case 'Terminated': return { class: 'badge-danger', label: 'Terminated' };
  }
}

export function ctriStatusBadge(status: CtriStatus) {
  switch (status) {
    case 'Registered': return { class: 'badge-success', label: 'Registered' };
    case 'Pending': return { class: 'badge-warning', label: 'Pending' };
    case 'Update Pending': return { class: 'badge-info', label: 'Update Pending' };
    case 'Not Registered': return { class: 'badge-neutral', label: 'Not Registered' };
  }
}

export function approvalStatusBadge(status: ApprovalStatus) {
  switch (status) {
    case 'Approved': return { class: 'badge-success', label: 'Approved' };
    case 'Pending': return { class: 'badge-warning', label: 'Pending' };
    case 'Expired': return { class: 'badge-danger', label: 'Expired' };
    case 'Not Required': return { class: 'badge-neutral', label: 'N/A' };
  }
}

export function alertBadge(severity: AlertSeverity) {
  switch (severity) {
    case 'red': return { class: 'badge-danger', label: 'Critical' };
    case 'yellow': return { class: 'badge-warning', label: 'Warning' };
    case 'blue': return { class: 'badge-info', label: 'Info' };
  }
}

export function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}
