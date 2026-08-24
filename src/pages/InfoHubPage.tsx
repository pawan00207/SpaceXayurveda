import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MOCK_SCHEMES, MOCK_GUIDELINES, MOCK_NOTIFICATIONS, MOCK_LEADERSHIP,
  MOCK_RESEARCH_LINKS, NAM_STATE_DATA,
} from '@/data/ministryData';
import { formatDate } from '@/lib/utils';
import {
  Building2, Award, FileText, FlaskConical, Scale, ChevronRight, ExternalLink,
  Download, Search, Calendar, User, Briefcase, BookOpen, Filter,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type Section = 'about' | 'schemes' | 'guidelines' | 'research' | 'regulations';

const SECTIONS: { id: Section; label: string; icon: typeof Building2 }[] = [
  { id: 'about', label: 'About Ministry', icon: Building2 },
  { id: 'schemes', label: 'Schemes & Programs', icon: Award },
  { id: 'guidelines', label: 'Guidelines & Standards', icon: FileText },
  { id: 'research', label: 'Research Updates', icon: FlaskConical },
  { id: 'regulations', label: 'Regulations & Notifications', icon: Scale },
];

export default function InfoHubPage({ section: initialSection = 'about' }: { section?: string }) {
  const { navigate } = useApp();
  const [section, setSection] = useState<Section>((initialSection as Section) || 'about');
  const [notifSearch, setNotifSearch] = useState('');
  const [notifDept, setNotifDept] = useState('all');
  const [guidelineFilter, setGuidelineFilter] = useState('all');
  const [researchSystem, setResearchSystem] = useState('all');

  return (
    <div>
      {/* Section header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-6 h-6 text-gold-300" />
          <h1 className="text-2xl font-serif font-bold">Information Hub</h1>
        </div>
        <p className="text-primary-100 text-sm">Official Ministry of AYUSH information, guidelines, schemes, and regulatory resources</p>
      </div>

      {/* Sub-navigation */}
      <div className="card p-2 mb-6 overflow-x-auto">
        <div className="flex gap-1">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  section === s.id ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== ABOUT MINISTRY ==================== */}
      {section === 'about' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">Ministry Mandate</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The Ministry of AYUSH was formed on 9th November 2014 to ensure optimal development and propagation of
              AYUSH systems of healthcare. The Ministry works towards the development of education, research, and
              propagation of indigenous systems of medicine including Ayurveda, Yoga & Naturopathy, Unani, Siddha,
              Sowa-Rigpa, and Homoeopathy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { title: 'Vision', text: 'Positioning AYUSH systems as preferred choice for healthcare and wellness through evidence-based research.' },
                { title: 'Mission', text: 'Mainstreaming AYUSH systems through quality education, robust research, and global promotion of traditional medicine.' },
                { title: 'Mandate', text: 'Policy formulation, standard-setting, research promotion, international cooperation, and education in AYUSH systems.' },
              ].map(({ title, text }) => (
                <div key={title} className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-500/10 border border-secondary-100 dark:border-secondary-500/20">
                  <h3 className="font-semibold text-secondary-700 dark:text-secondary-400 mb-2">{title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div className="card p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Leadership Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_LEADERSHIP.map(leader => (
                <div key={leader.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-gold-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{leader.name}</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{leader.title}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational structure */}
          <div className="card p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Organizational Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Department of Ayurveda, Yoga & Naturopathy, Unani, Siddha and Homoeopathy (AYUSH)', icon: Building2 },
                { name: 'Central Council for Research in Ayurvedic Sciences (CCRAS)', icon: FlaskConical },
                { name: 'Central Council for Research in Yoga & Naturopathy (CCRYN)', icon: FlaskConical },
                { name: 'Central Council for Research in Unani Medicine (CCRUM)', icon: FlaskConical },
                { name: 'Central Council for Research in Siddha (CCRS)', icon: FlaskConical },
                { name: 'Central Council for Research in Homoeopathy (CCRH)', icon: FlaskConical },
                { name: 'National Medicinal Plants Board (NMPB)', icon: Award },
                { name: 'Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)', icon: FileText },
                { name: 'All India Institute of Ayurveda (AIIA)', icon: Briefcase },
              ].map(({ name, icon: Icon }) => (
                <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Annual reports */}
          <div className="card p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Annual Reports & Budget</h2>
            <div className="space-y-2">
              {[
                { title: 'Annual Report 2024-25', date: '2025-03-31', size: '4.2 MB' },
                { title: 'Annual Report 2023-24', date: '2024-03-31', size: '3.8 MB' },
                { title: 'Outcome Budget 2025-26', date: '2025-02-01', size: '2.1 MB' },
                { title: 'Demands for Grants 2025-26', date: '2025-02-01', size: '1.5 MB' },
              ].map(doc => (
                <div key={doc.title} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all">
                  <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.title}</p>
                    <p className="text-xs text-gray-400 font-mono">{formatDate(doc.date)} - {doc.size}</p>
                  </div>
                  <button className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> PDF</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCHEMES & PROGRAMS ==================== */}
      {section === 'schemes' && (
        <div className="space-y-6 animate-fade-in">
          {MOCK_SCHEMES.map(scheme => (
            <div key={scheme.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-gold-600" />
                    <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white">{scheme.name}</h2>
                  </div>
                  <span className={`badge ${scheme.status === 'Active' ? 'badge-success' : 'badge-info'}`}>{scheme.status}</span>
                </div>
                <span className="gov-badge">{scheme.budget}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{scheme.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {scheme.details.map(d => (
                  <div key={d.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500">{d.label}</p>
                    <p className="text-sm font-bold font-mono text-gray-900 dark:text-white mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* NAM-specific chart */}
              {scheme.id === 'nam' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">State-wise Patient Attendance (2024-25)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={NAM_STATE_DATA} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="patients" fill="#0b7c59" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <button className="btn-secondary mt-4 text-xs">View Application Process <ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {/* ==================== GUIDELINES & STANDARDS ==================== */}
      {section === 'guidelines' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {['all', 'GCP', 'Ethics', 'Regulatory', 'Drug Standards', 'Quality'].map(cat => (
              <button
                key={cat}
                onClick={() => setGuidelineFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  guidelineFilter === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_GUIDELINES.filter(g => guidelineFilter === 'all' || g.category === guidelineFilter).map(doc => (
              <div key={doc.id} className="card card-hover p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-gold text-[10px]">{doc.category}</span>
                      <span className="badge-neutral text-[10px]">{doc.format}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{doc.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400 font-mono">{formatDate(doc.date)}</span>
                      <button className="btn-ghost text-xs">
                        {doc.format === 'PDF' ? <><Download className="w-3.5 h-3.5" /> Download PDF</> : doc.format === 'Searchable' ? <><Search className="w-3.5 h-3.5" /> Search</> : <><ExternalLink className="w-3.5 h-3.5" /> View</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== RESEARCH UPDATES ==================== */}
      {section === 'research' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {['all', 'Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homeopathy', 'Sowa-Rigpa'].map(sys => (
              <button
                key={sys}
                onClick={() => setResearchSystem(sys)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  researchSystem === sys ? 'bg-secondary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {sys === 'all' ? 'All Systems' : sys}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_RESEARCH_LINKS.filter(r => researchSystem === 'all' || r.system === researchSystem).map(link => (
              <div key={link.id} className="card card-hover p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="badge-success text-[10px] mb-1">{link.system}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mt-1">{link.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{link.description}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-secondary-600 dark:text-secondary-400 font-medium mt-3 hover:gap-2 transition-all">
                      Visit Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== REGULATIONS & NOTIFICATIONS ==================== */}
      {section === 'regulations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search notifications..." value={notifSearch} onChange={e => setNotifSearch(e.target.value)} className="input pl-10" />
              </div>
              <select value={notifDept} onChange={e => setNotifDept(e.target.value)} className="input w-auto">
                <option value="all">All Departments</option>
                <option value="Ministry of AYUSH">Ministry of AYUSH</option>
                <option value="CDSCO">CDSCO</option>
                <option value="AIIA Education Division">AIIA Education</option>
                <option value="AIIA HR">AIIA HR</option>
                <option value="NCISM">NCISM</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.filter(n => {
              if (notifDept !== 'all' && n.department !== notifDept) return false;
              if (notifSearch && !n.title.toLowerCase().includes(notifSearch.toLowerCase()) && !n.summary.toLowerCase().includes(notifSearch.toLowerCase())) return false;
              return true;
            }).map(notif => (
              <div key={notif.id} className="card p-4 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-[10px] ${notif.category === 'Drug Approval' ? 'badge-success' : notif.category === 'Recruitment' ? 'badge-info' : notif.category === 'Legal' ? 'badge-danger' : 'badge-warning'}`}>{notif.category}</span>
                      <span className="text-xs text-gray-400 font-mono">{formatDate(notif.date)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{notif.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{notif.department}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{notif.summary}</p>
                    <button className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium mt-2">
                      Read Full Notification <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {MOCK_NOTIFICATIONS.filter(n => {
              if (notifDept !== 'all' && n.department !== notifDept) return false;
              if (notifSearch && !n.title.toLowerCase().includes(notifSearch.toLowerCase()) && !n.summary.toLowerCase().includes(notifSearch.toLowerCase())) return false;
              return true;
            }).length === 0 && (
              <div className="card p-8 text-center text-sm text-gray-500">No notifications match your search.</div>
            )}
          </div>
        </div>
      )}

      {/* Back to portal */}
      <div className="mt-8 text-center">
        <button onClick={() => navigate({ name: 'home' })} className="btn-outline">
          Back to Portal Home <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
