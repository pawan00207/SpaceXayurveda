import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MOCK_NEWS, MOCK_TICKER, MOCK_EVENTS, NAM_STATE_DATA,
} from '@/data/ministryData';
import { formatDate, pct } from '@/lib/utils';
import {
  Calendar, ChevronRight, ExternalLink, Newspaper, FlaskConical,
  ArrowRight, BookOpen, Stethoscope, Award, Users, Building2,
  TrendingUp, Bell, FileText, MapPin,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

export default function HomePage() {
  const { studies, navigate, user } = useApp();
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(i => (i + 1) % MOCK_TICKER.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeStudies = studies.filter(s => s.status === 'Active');
  const totalEnrolled = studies.reduce((sum, s) => sum + s.currentEnrolled, 0);

  return (
    <div className="min-h-screen bg-warm-100 dark:bg-warm-950">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
          {/* Ministry header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-white/20 flex-shrink-0">
              <Stethoscope className="w-8 h-8 text-gold-300" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-serif font-bold tracking-tight">Ministry of AYUSH</h1>
              <p className="text-primary-100 text-sm">All India Institute of Ayurveda - Clinical Trials Portal</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="max-w-3xl">
            <h2 className="text-3xl lg:text-5xl font-serif font-bold leading-tight mb-4">
              Advancing Ayurveda through Evidence-Based Research
            </h2>
            <p className="text-primary-100 text-base lg:text-lg leading-relaxed">
              AIIA Clinical Research Portal - Excellence in Ayurveda Science. Integrated clinical trial management,
              regulatory compliance, and ministry information for India's premier Ayurveda research institution.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              {user ? (
                <button onClick={() => navigate({ name: 'dashboard' })} className="btn-gold">
                  Go to CTMS Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => navigate({ name: 'dashboard' })} className="btn-gold">
                  Sign in to CTMS <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => navigate({ name: 'info-hub', section: 'about' })} className="btn-outline bg-white/10 border-white/20 text-white hover:bg-white/20">
                Explore Information Hub
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Active Trials', value: activeStudies.length, icon: FlaskConical },
              { label: 'Patients Enrolled', value: totalEnrolled, icon: Users },
              { label: 'Research Sites', value: studies.reduce((s, st) => s + st.sites.length, 0), icon: Building2 },
              { label: 'NAM Budget 2025-26', value: '\u20b9450 Cr', icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4 ring-1 ring-white/10">
                <Icon className="w-5 h-5 text-gold-300 mb-2" />
                <p className="text-2xl font-bold font-mono">{value}</p>
                <p className="text-xs text-primary-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* News ticker */}
        <div className="relative z-10 bg-gray-900/40 backdrop-blur border-t border-white/10 py-2.5 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-300 flex-shrink-0">
              <Bell className="w-3.5 h-3.5" /> LIVE
            </span>
            <div className="overflow-hidden flex-1">
              <div key={tickerIndex} className="animate-fade-in whitespace-nowrap text-sm text-primary-100">
                {MOCK_TICKER[tickerIndex].text}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LATEST NEWS + EVENTS ==================== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News grid - takes 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Latest News & Announcements</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_NEWS.slice(0, 4).map((news, i) => (
                <div
                  key={news.id}
                  className={`card card-hover overflow-hidden animate-slide-up ${i === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className={`flex ${i === 0 ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                    <div className={`bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center ${i === 0 ? 'sm:w-48 h-32 sm:h-auto' : 'h-24'}`}>
                      <Newspaper className="w-8 h-8 text-white/70" />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge-gold">{news.category}</span>
                        <span className="text-xs text-gray-400 font-mono">{formatDate(news.date)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2">{news.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{news.summary}</p>
                      <button className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium mt-2 hover:gap-2 transition-all">
                        Read More <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events sidebar */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-secondary-600" />
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            </div>

            <div className="card p-4">
              <div className="space-y-1">
                {MOCK_EVENTS.map(event => {
                  const eventDate = new Date(event.date);
                  const isPast = eventDate < new Date('2025-08-22');
                  return (
                    <div key={event.id} className={`flex items-start gap-3 p-2.5 rounded-lg ${isPast ? 'opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'} transition-colors`}>
                      <div className="flex flex-col items-center flex-shrink-0 w-12">
                        <span className="text-[10px] font-semibold text-primary-600 uppercase">{eventDate.toLocaleString('en', { month: 'short' })}</span>
                        <span className="text-lg font-bold font-mono text-gray-900 dark:text-white leading-none">{eventDate.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`badge ${event.type === 'Deadline' ? 'badge-danger' : event.type === 'CME' ? 'badge-info' : event.type === 'Milestone' ? 'badge-warning' : 'badge-success'} text-[9px]`}>{event.type}</span>
                          {event.location && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{event.location}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Register button */}
            <button className="btn-secondary w-full mt-4">
              <BookOpen className="w-4 h-4" /> Register for CME Programs
            </button>
          </div>
        </div>
      </section>

      {/* ==================== RESEARCH HIGHLIGHTS ==================== */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Research Highlights</h2>
            <span className="text-sm text-gray-400 ml-2">Featured ongoing studies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeStudies.slice(0, 3).map(study => (
              <button
                key={study.studyId}
                onClick={() => navigate({ name: 'study-detail', studyId: study.studyId, tab: 'overview' })}
                className="card card-hover p-5 text-left animate-slide-up"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-medium text-primary-600">{study.studyId}</span>
                  <span className="badge-success">Active</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-3 line-clamp-2">{study.title}</h3>
                <p className="text-xs text-gray-500 mb-3">PI: {study.pi}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Enrollment</span>
                  <span className="text-xs font-mono font-medium">{study.currentEnrolled}/{study.targetEnrollment}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${pct(study.currentEnrolled, study.targetEnrollment)}%` }} />
                </div>
                <p className="text-xs text-secondary-600 mt-3 font-medium flex items-center gap-1">
                  {pct(study.currentEnrolled, study.targetEnrollment)}% enrolled <ChevronRight className="w-3 h-3" />
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NAM SCHEME DASHBOARD ==================== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">National AYUSH Mission (NAM) Tracker</h2>
          </div>
          <button onClick={() => navigate({ name: 'info-hub', section: 'schemes' })} className="btn-ghost text-xs">
            View All Schemes <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State-wise patients */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">State-wise Patient Attendance</h3>
            <p className="text-xs text-gray-500 mb-4">2024-25 cumulative</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={NAM_STATE_DATA} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="patients" fill="#0b7c59" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Year-wise trend */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Budget Allocation Trend</h3>
            <p className="text-xs text-gray-500 mb-4">BE vs Actuals (\u20b9 Crore)</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[
                { year: '2020-21', budget: 280, patients: 980 },
                { year: '2021-22', budget: 305, patients: 1120 },
                { year: '2022-23', budget: 342, patients: 1340 },
                { year: '2023-24', budget: 372, patients: 1580 },
                { year: '2024-25', budget: 398, patients: 1820 },
                { year: '2025-26', budget: 450, patients: 2100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="budget" stroke="#ff9933" strokeWidth={2} dot={{ r: 4 }} name="Budget (\u20b9 Cr)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ==================== QUICK ACCESS LINKS ==================== */}
      <section className="bg-gradient-to-r from-secondary-700 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <h2 className="text-xl font-serif font-bold mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'About Ministry', icon: Building2, section: 'about', view: 'info-hub' as const },
              { label: 'Schemes & Programs', icon: Award, section: 'schemes', view: 'info-hub' as const },
              { label: 'Guidelines & Standards', icon: FileText, section: 'guidelines', view: 'info-hub' as const },
              { label: 'Research Updates', icon: FlaskConical, section: 'research', view: 'info-hub' as const },
            ].map(({ label, icon: Icon, section, view }) => (
              <button
                key={label}
                onClick={() => navigate({ name: view, section })}
                className="bg-white/10 backdrop-blur rounded-xl p-5 text-left hover:bg-white/15 transition-all ring-1 ring-white/10"
              >
                <Icon className="w-6 h-6 text-gold-300 mb-3" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-secondary-200 mt-1 flex items-center gap-1">Explore <ChevronRight className="w-3 h-3" /></p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gradient-to-b from-primary-50 to-white dark:from-warm-950 dark:to-warm-950 border-t-2 border-secondary-600 dark:border-brightteal-500 py-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-gold-600" />
                <span className="font-serif font-bold text-secondary-700 dark:text-brightteal-500">AIIA Clinical Research Portal</span>
              </div>
              <p className="text-xs text-warm-600 dark:text-warm-300 leading-relaxed">
                All India Institute of Ayurveda, Ministry of AYUSH, Government of India.
                Sarita Vihar, New Delhi - 110076.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-warm-800 dark:text-warm-100 uppercase tracking-wider mb-3">Developed By</p>
              <p className="text-sm font-semibold text-warm-800 dark:text-warm-100 mb-2">Pawan Singh</p>
              <div className="space-y-1.5 text-xs text-warm-600 dark:text-warm-300">
                <button onClick={() => navigate({ name: 'info-hub', section: 'about' })} className="block hover:text-secondary-600 dark:hover:text-brightteal-500">About Ministry</button>
                <button onClick={() => navigate({ name: 'info-hub', section: 'regulations' })} className="block hover:text-secondary-600 dark:hover:text-brightteal-500">Regulations & Notifications</button>
                <button onClick={() => navigate({ name: 'dashboard' })} className="block hover:text-secondary-600 dark:hover:text-brightteal-500">CTMS Dashboard</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-warm-800 dark:text-warm-100 uppercase tracking-wider mb-3">Standards & Compliance</p>
              <div className="space-y-1.5 text-xs text-warm-600 dark:text-warm-300">
                <p>ALCOA+ Audit Trail Compliant</p>
                <p>CTRI / CDISC Ready</p>
                <p>ICMR Ethical Guidelines</p>
                <p>NDCT Rules 2019</p>
                <p>GCP-ASU Guidelines v2.1</p>
              </div>
            </div>
          </div>
          <div className="border-t border-warm-300 dark:border-warm-800 mt-6 pt-4 text-xs text-center text-warm-500">
            <p>Government of India | Ministry of AYUSH | &copy; 2025 All India Institute of Ayurveda. Developed by Pawan Singh.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
