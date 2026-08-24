import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ROLE_LABELS } from '@/types';
import { MOCK_USERS, DEMO_PASSWORD } from '@/data/mockData';
import { Activity, Lock, Mail, ShieldCheck, ChevronRight, Stethoscope, Home as HomeIcon } from 'lucide-react';

export default function LoginPage() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) setError(result.error || 'Login failed');
      setLoading(false);
    }, 400);
  };

  const quickLogin = (em: string) => {
    setEmail(em);
    setPassword(DEMO_PASSWORD);
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(em, DEMO_PASSWORD);
      if (!result.success) setError(result.error || 'Login failed');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
              <Stethoscope className="w-7 h-7 text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight">Ministry of AYUSH</h1>
              <p className="text-primary-200 text-sm">All India Institute of Ayurveda</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-8 lg:my-0">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4">
            AIIA Clinical Research Portal
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-md">
            Excellence in Ayurveda Science. Manage clinical trials, track regulatory compliance,
            and oversee pharmacovigilance — integrated with official Ministry of AYUSH information.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            {[
              { icon: ShieldCheck, label: 'ALCOA+ Compliant' },
              { icon: Activity, label: 'Real-Time Alerts' },
              { icon: Lock, label: 'Role-Based Access' },
              { icon: Stethoscope, label: 'MedDRA / CDISC Ready' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-primary-100 text-sm">
                <Icon className="w-4 h-4 text-gold-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-300 text-xs">
          <p>Government of India | Ministry of AYUSH</p>
          <p className="mt-1">CTRI Compatible - ICMR Guidelines - NDCT Rules 2019 - GCP-ASU</p>
        </div>
      </div>

      {/* Right login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-warm-100 dark:bg-warm-950">
        <div className="w-full max-w-md">
          {/* Back to portal */}
          <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
            <HomeIcon className="w-4 h-4" /> Back to Portal
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to access the CTMS dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input pl-10" placeholder="you@aiia.gov.in"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pl-10" placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                Remember me
              </label>
              <button type="button" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</button>
            </div>

            {error && (
              <div className="text-sm text-danger-600 bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 rounded-lg px-4 py-3 animate-fade-in">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div>
              <div className="relative flex justify-center"><span className="bg-gray-50 dark:bg-gray-950 px-3 text-xs text-gray-500 uppercase tracking-wider">Quick Demo Login</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {MOCK_USERS.map(u => (
                <button
                  key={u.uid}
                  onClick={() => quickLogin(u.email)}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{ROLE_LABELS[u.role]}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Demo password: {DEMO_PASSWORD}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
