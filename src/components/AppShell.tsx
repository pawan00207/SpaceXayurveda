import { useApp } from '@/context/AppContext';
import { ROLE_LABELS } from '@/types';
import {
  Home, LayoutDashboard, FolderKanban, Activity, ShieldAlert, FileBarChart,
  ScrollText, Settings, Menu, LogOut, Moon, Sun, ChevronLeft, ChevronRight,
  Stethoscope, Bell, UserCircle, Info, Plus, Github, Linkedin, Mail,
} from 'lucide-react';
import type { View } from '@/context/AppContext';
import type { ReactNode } from 'react';

const NAV_SECTIONS: { label: string }[] = [{ label: 'Portal' }, { label: 'Clinical Trials' }, { label: 'Administration' }];

const NAV_ITEMS: { label: string; icon: typeof Home; view: View; section: string; permission?: string }[] = [
  { label: 'Portal Home', icon: Home, view: { name: 'home' }, section: 'Portal' },
  { label: 'Information Hub', icon: Info, view: { name: 'info-hub', section: 'about' }, section: 'Portal' },
  { label: 'CTMS Dashboard', icon: LayoutDashboard, view: { name: 'dashboard' }, section: 'Clinical Trials' },
  { label: 'Studies', icon: FolderKanban, view: { name: 'studies' }, section: 'Clinical Trials' },
  { label: 'Pharmacovigilance', icon: Activity, view: { name: 'pharmacovigilance' }, section: 'Clinical Trials', permission: 'canViewSafety' },
  { label: 'Compliance', icon: ShieldAlert, view: { name: 'compliance' }, section: 'Clinical Trials', permission: 'canViewApprovals' },
  { label: 'Reports & Export', icon: FileBarChart, view: { name: 'reports' }, section: 'Clinical Trials', permission: 'canExport' },
  { label: 'Audit Trail', icon: ScrollText, view: { name: 'audit' }, section: 'Administration', permission: 'canViewAudit' },
  { label: 'Admin Settings', icon: Settings, view: { name: 'admin' }, section: 'Administration', permission: 'canManageUsers' },
];

function Breadcrumbs() {
  const { view, navigate, studies } = useApp();

  const crumbs: { label: string; view?: View }[] = [{ label: 'Home', view: { name: 'home' } }];

  if (view.name === 'home') crumbs.push({ label: 'Portal Home' });
  else if (view.name === 'info-hub') {
    crumbs.push({ label: 'Information Hub', view: { name: 'info-hub', section: 'about' } });
    if (view.section) {
      const labels: Record<string, string> = { about: 'About Ministry', schemes: 'Schemes & Programs', guidelines: 'Guidelines & Standards', research: 'Research Updates', regulations: 'Regulations & Notifications' };
      crumbs.push({ label: labels[view.section] || view.section });
    }
  } else if (view.name === 'dashboard') crumbs.push({ label: 'CTMS Dashboard' });
  else if (view.name === 'studies') crumbs.push({ label: 'Studies' });
  else if (view.name === 'study-detail') {
    crumbs.push({ label: 'Studies', view: { name: 'studies' } });
    const study = studies.find(s => s.studyId === view.studyId);
    crumbs.push({ label: study ? `${study.studyId}` : view.studyId });
  } else if (view.name === 'pharmacovigilance') crumbs.push({ label: 'Pharmacovigilance' });
  else if (view.name === 'ae-intake') {
    crumbs.push({ label: 'Pharmacovigilance', view: { name: 'pharmacovigilance' } });
    crumbs.push({ label: 'AE/SAE Intake Form' });
  } else if (view.name === 'audit') crumbs.push({ label: 'Audit Trail' });
  else if (view.name === 'reports') crumbs.push({ label: 'Reports & Export' });
  else if (view.name === 'compliance') crumbs.push({ label: 'Compliance' });
  else if (view.name === 'admin') crumbs.push({ label: 'Admin Settings' });

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-warm-400" />}
          {crumb.view ? (
            <button onClick={() => navigate(crumb.view!)} className="text-warm-500 hover:text-secondary-600 dark:hover:text-brightteal-500 transition-colors">
              {crumb.label}
            </button>
          ) : (
            <span className="text-warm-900 dark:text-warm-100 font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="no-print mt-auto bg-gradient-to-b from-primary-50 to-white dark:from-warm-950 dark:to-warm-950 border-t-2 border-secondary-600 dark:border-brightteal-500">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand & mission */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-gold-600" />
              <span className="font-serif font-bold text-secondary-700 dark:text-brightteal-500">AIIA CTMS</span>
            </div>
            <p className="text-xs text-warm-600 dark:text-warm-300 leading-relaxed">
              All India Institute of Ayurveda, Ministry of AYUSH, Government of India.
              Sarita Vihar, New Delhi - 110076. Excellence in Ayurveda Science through evidence-based research.
            </p>
          </div>
          {/* Column 2: Developer credit */}
          <div>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-100 uppercase tracking-wider mb-3">Developed By</p>
            <p className="text-sm font-semibold text-warm-800 dark:text-warm-100 mb-2">Pawan Singh</p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/pawan00207" target="_blank" rel="noopener noreferrer" className="text-warm-500 hover:text-secondary-600 dark:hover:text-brightteal-500 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/in/pawansingh" target="_blank" rel="noopener noreferrer" className="text-warm-500 hover:text-secondary-600 dark:hover:text-brightteal-500 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:pawan@example.com" className="text-warm-500 hover:text-secondary-600 dark:hover:text-brightteal-500 transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          {/* Column 3: Quick links */}
          <div>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-100 uppercase tracking-wider mb-3">Standards & Compliance</p>
            <div className="space-y-1.5 text-xs text-warm-600 dark:text-warm-300">
              <p>ALCOA+ Audit Trail Compliant</p>
              <p>CTRI / CDISC Ready</p>
              <p>ICMR Ethical Guidelines</p>
              <p>NDCT Rules 2019 - GCP-ASU v2.1</p>
              <button onClick={() => navigate({ name: 'info-hub', section: 'about' })} className="block hover:text-secondary-600 dark:hover:text-brightteal-500 transition-colors mt-2">
                About Ministry &rarr;
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-warm-300 dark:border-warm-800 mt-6 pt-4 text-xs text-center text-warm-500">
          <p>Government of India | Ministry of AYUSH | &copy; 2025 All India Institute of Ayurveda. Developed by Pawan Singh.</p>
        </div>
      </div>
    </footer>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const {
    user, view, navigate, logout, darkMode, toggleDarkMode,
    sidebarCollapsed, toggleSidebar, alerts, can,
  } = useApp();

  if (!user) return <>{children}</>;

  const navItems = NAV_ITEMS.filter(item => !item.permission || can(item.permission as never));
  const activeAlerts = alerts.filter(a => a.severity === 'red' || a.severity === 'yellow').length;

  const isActive = (item: View) => {
    if (item.name === view.name) {
      if (item.name === 'info-hub' && view.name === 'info-hub') return true;
      return true;
    }
    if (item.name === 'studies' && view.name === 'study-detail') return true;
    if (item.name === 'pharmacovigilance' && view.name === 'ae-intake') return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-warm-100 dark:bg-warm-950">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-30 bg-white dark:bg-warm-950 border-r border-warm-300 dark:border-warm-800 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-warm-300 dark:border-warm-800 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-serif font-bold text-secondary-700 dark:text-brightteal-500 text-sm leading-tight">AIIA Portal</h1>
              <p className="text-[10px] text-warm-500 dark:text-warm-300 truncate">Ministry of AYUSH</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Main navigation">
          {NAV_SECTIONS.map(sec => {
            const sectionItems = navItems.filter(item => item.section === sec.label);
            if (sectionItems.length === 0) return null;
            return (
              <div key={sec.label} className="mb-2">
                {!sidebarCollapsed && (
                  <p className="px-3 py-2 text-[10px] font-bold text-warm-400 uppercase tracking-wider">{sec.label}</p>
                )}
                {sectionItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.view)}
                      className={`nav-link w-full ${isActive(item.view) ? 'nav-link-active' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-current={isActive(item.view) ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {!sidebarCollapsed && (
            <>
              <p className="px-3 py-2 mt-2 text-[10px] font-bold text-warm-400 uppercase tracking-wider">Quick Actions</p>
              <button
                onClick={() => navigate({ name: 'study-detail', studyId: 'AIIA-2024-001', tab: 'overview' })}
                className="nav-link w-full"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                <span>New Study</span>
              </button>
            </>
          )}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-warm-300 dark:border-warm-800 hidden lg:block">
          <button onClick={toggleSidebar} className="nav-link w-full justify-center" aria-label="Toggle sidebar">
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="no-print h-16 bg-white dark:bg-warm-950 border-b border-warm-300 dark:border-warm-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2" aria-label="Toggle menu">
              <Menu className="w-5 h-5" />
            </button>
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            {/* Home button */}
            <button onClick={() => navigate({ name: 'home' })} className="btn-ghost p-2" title="Portal Home" aria-label="Portal Home">
              <Home className="w-5 h-5" />
            </button>

            {/* Alerts bell */}
            <button
              onClick={() => navigate({ name: 'dashboard' })}
              className="relative btn-ghost p-2"
              title="Active alerts"
              aria-label="Active alerts"
            >
              <Bell className="w-5 h-5" />
              {activeAlerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </button>

            {/* Dark mode */}
            <button onClick={toggleDarkMode} className="btn-ghost p-2" title="Toggle theme" aria-label="Toggle dark mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-warm-300 dark:border-warm-800">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-warm-900 dark:text-warm-100 leading-tight">{user.name}</p>
                <p className="text-[10px] text-warm-500 dark:text-warm-300">{ROLE_LABELS[user.role]}</p>
              </div>
              <button onClick={logout} className="btn-ghost p-2" title="Sign out" aria-label="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in bg-white dark:bg-warm-950">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
