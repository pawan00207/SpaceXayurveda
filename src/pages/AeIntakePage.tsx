import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui';
import { MEDDRA_SOCS, type AdverseEvent, type SeverityLevel, type Seriousness, type Causality, type AeOutcome, type ActionTaken } from '@/types';
import {
  Activity, Save, ChevronLeft, Send, CheckCircle2, Info, AlertTriangle,
} from 'lucide-react';

export default function AeIntakePage({ studyId: preselectedStudyId }: { studyId?: string }) {
  const { studies, navigate, addAdverseEvent, addAuditEntry, user, aes } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studyId: preselectedStudyId || studies[0]?.studyId || '',
    patientId: '',
    eventDate: '',
    description: '',
    severity: 'Mild' as SeverityLevel,
    seriousness: 'Non-Serious AE' as Seriousness,
    soc: '',
    preferredTerm: '',
    actionTaken: 'None' as ActionTaken,
    outcome: 'Recovered' as AeOutcome,
    causality: 'Possible' as Causality,
    reporterName: user?.name || '',
    reporterContact: user?.email || '',
  });

  const selectedSoc = MEDDRA_SOCS.find(s => s.soc === form.soc);
  const reportId = `SAE-AIIA-${new Date().getFullYear()}-${String(aes.length + 1).padStart(3, '0')}`;

  // Regulatory due date: 7 days for life-threatening, 15 days for other serious
  const isSerious = form.seriousness === 'Serious AE';
  const dueDays = form.severity === 'Life-Threatening' ? 7 : 15;
  const regulatoryDue = isSerious && form.eventDate
    ? new Date(new Date(form.eventDate).getTime() + dueDays * 86400000).toISOString().slice(0, 10)
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const study = studies.find(s => s.studyId === form.studyId);
    const newAe: AdverseEvent = {
      aeId: `AE-${Date.now()}`,
      reportId,
      studyId: form.studyId,
      studyTitle: study?.title || '',
      patientId: form.patientId,
      eventDate: form.eventDate,
      reportedDate: new Date().toISOString().slice(0, 10),
      description: form.description,
      severity: form.severity,
      seriousness: form.seriousness,
      soc: form.soc,
      preferredTerm: form.preferredTerm,
      actionTaken: form.actionTaken,
      outcome: form.outcome,
      causality: form.causality,
      reporterName: form.reporterName,
      reporterContact: form.reporterContact,
      status: 'Pending',
      regulatoryDueDate: regulatoryDue,
      daysToReport: regulatoryDue ? Math.floor((new Date(regulatoryDue).getTime() - new Date('2026-08-21').getTime()) / 86400000) : 0,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || '',
    };
    addAdverseEvent(newAe);
    if (user) addAuditEntry({
      logId: `LOG-${Date.now()}`, entityType: 'adverse_event', entityId: reportId, entityName: 'AE/SAE Report',
      userId: user.uid, userName: user.name, userRole: user.role,
      action: `${form.seriousness === 'Serious AE' ? 'SAE' : 'AE'} Report Created`,
      timestamp: new Date().toISOString(),
      changes: [
        { field: 'reportId', before: '(none)', after: reportId },
        { field: 'studyId', before: '(none)', after: form.studyId },
        { field: 'severity', before: '(none)', after: form.severity },
        { field: 'causality', before: '(none)', after: form.causality },
      ],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <button onClick={() => navigate({ name: 'pharmacovigilance' })} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Pharmacovigilance
        </button>
        <div className="card p-8 max-w-lg mx-auto text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Submitted Successfully</h2>
          <p className="text-sm text-gray-500 mb-4">Report ID: <span className="font-mono font-medium text-primary-600">{reportId}</span></p>

          <div className="text-left p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Alerts Sent To</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Study PI — {studies.find(s => s.studyId === form.studyId)?.pi}</li>
              <li>• Ethics Committee Chair</li>
              <li>• AIIA Medical Officer</li>
            </ul>
          </div>

          {isSerious && (
            <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/20 flex items-center gap-2 text-sm text-warning-700 dark:text-warning-400 mb-4">
              <AlertTriangle className="w-4 h-4" />
              Regulatory report due by <span className="font-mono font-bold">{regulatoryDue}</span> ({dueDays} days)
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <button onClick={() => { setSubmitted(false); setForm(f => ({ ...f, patientId: '', description: '' })); }} className="btn-secondary">File Another Report</button>
            <button onClick={() => navigate({ name: 'pharmacovigilance' })} className="btn-primary">View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate({ name: 'pharmacovigilance' })} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Pharmacovigilance
      </button>

      <PageHeader
        title="AE/SAE Intake Form"
        subtitle={`Report ID: ${reportId} (auto-generated)`}
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Report Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Report ID (auto-generated)</label>
              <input type="text" value={reportId} readOnly className="input bg-gray-50 dark:bg-gray-800/50 font-mono" />
            </div>
            <div>
              <label className="label">Study ID</label>
              <select value={form.studyId} onChange={e => setForm(f => ({ ...f, studyId: e.target.value }))} className="input" required>
                {studies.map(s => <option key={s.studyId} value={s.studyId}>{s.studyId} — {s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Patient ID (de-identified)</label>
              <input type="text" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} className="input font-mono" placeholder="PT_001" required />
            </div>
            <div>
              <label className="label">Event Date</label>
              <input type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} className="input" required />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Event Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input min-h-[100px]" placeholder="Describe the adverse event in detail..." required />
          </div>
        </div>

        {/* Severity & Seriousness */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Severity & Seriousness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Severity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Mild', 'Moderate', 'Severe', 'Life-Threatening'] as SeverityLevel[]).map(s => (
                  <label key={s} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${form.severity === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="severity" value={s} checked={form.severity === s} onChange={e => setForm(f => ({ ...f, severity: e.target.value as SeverityLevel }))} className="text-primary-600" />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Seriousness</label>
              <div className="space-y-2">
                {(['Non-Serious AE', 'Serious AE'] as Seriousness[]).map(s => (
                  <label key={s} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${form.seriousness === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="seriousness" value={s} checked={form.seriousness === s} onChange={e => setForm(f => ({ ...f, seriousness: e.target.value as Seriousness }))} className="text-primary-600" />
                    <span className="text-sm">{s}</span>
                    {s === 'Serious AE' && <span className="text-xs text-danger-600 ml-auto">Expedited reporting required</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MedDRA */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">MedDRA Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">System Organ Class (SOC)</label>
              <select value={form.soc} onChange={e => setForm(f => ({ ...f, soc: e.target.value, preferredTerm: '' }))} className="input" required>
                <option value="">Select SOC...</option>
                {MEDDRA_SOCS.map(s => <option key={s.soc} value={s.soc}>{s.soc}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preferred Term</label>
              <select value={form.preferredTerm} onChange={e => setForm(f => ({ ...f, preferredTerm: e.target.value }))} className="input" required disabled={!selectedSoc}>
                <option value="">Select term...</option>
                {selectedSoc?.terms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Action & Outcome */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Action & Outcome</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Action Taken with Study Drug</label>
              <select value={form.actionTaken} onChange={e => setForm(f => ({ ...f, actionTaken: e.target.value as ActionTaken }))} className="input">
                {(['None', 'Dose Reduction', 'Dose Held', 'Discontinued'] as ActionTaken[]).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Outcome</label>
              <select value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value as AeOutcome }))} className="input">
                {(['Recovered', 'Recovering', 'Not Recovered', 'Permanent', 'Unclear', 'Fatal'] as AeOutcome[]).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Causality Assessment</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(['Unrelated', 'Unlikely', 'Possible', 'Probable', 'Definite'] as Causality[]).map(c => (
                <label key={c} className={`flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer text-xs transition-all ${form.causality === c ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="causality" value={c} checked={form.causality === c} onChange={e => setForm(f => ({ ...f, causality: e.target.value as Causality }))} className="text-primary-600" />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Reporter */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reporter Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Reporter Name</label>
              <input type="text" value={form.reporterName} onChange={e => setForm(f => ({ ...f, reporterName: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">Reporter Contact (Email)</label>
              <input type="email" value={form.reporterContact} onChange={e => setForm(f => ({ ...f, reporterContact: e.target.value }))} className="input" required />
            </div>
          </div>
        </div>

        {/* Regulatory due notice */}
        {isSerious && (
          <div className="card p-4 bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-warning-700 dark:text-warning-400">
                <p className="font-medium">Regulatory Report Due</p>
                <p>This is a Serious AE. Regulatory report due in <span className="font-bold">{dueDays} days</span>
                  {form.eventDate && <span> (by <span className="font-mono">{regulatoryDue}</span>)</span>}.
                  Email alerts will be sent to Study PI, Ethics Committee Chair, and AIIA Medical Officer upon submission.</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate({ name: 'pharmacovigilance' })} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary"><Send className="w-4 h-4" /> Submit Report</button>
        </div>
      </form>
    </div>
  );
}
