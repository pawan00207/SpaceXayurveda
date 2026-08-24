import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Study, AdverseEvent, Alert, AuditEntry, UserRole } from '@/types';
import { ROLE_PERMISSIONS } from '@/types';
import {
  MOCK_USERS, MOCK_STUDIES, MOCK_ADVERSE_EVENTS, MOCK_AUDIT_LOG,
  computeAlerts, DEMO_PASSWORD,
} from '@/data/mockData';

export type View =
  | { name: 'home' }
  | { name: 'info-hub'; section?: string }
  | { name: 'dashboard' }
  | { name: 'studies' }
  | { name: 'study-detail'; studyId: string; tab?: StudyTab }
  | { name: 'pharmacovigilance' }
  | { name: 'ae-intake'; studyId?: string }
  | { name: 'audit' }
  | { name: 'reports' }
  | { name: 'compliance' }
  | { name: 'admin' };

export type StudyTab = 'overview' | 'recruitment' | 'compliance' | 'data-quality' | 'safety';

interface AppState {
  user: User | null;
  studies: Study[];
  aes: AdverseEvent[];
  alerts: Alert[];
  auditLog: AuditEntry[];
  darkMode: boolean;
  view: View;
  sidebarCollapsed: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  navigate: (view: View) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateStudy: (studyId: string, updates: Partial<Study>) => void;
  addAdverseEvent: (ae: AdverseEvent) => void;
  addAuditEntry: (entry: AuditEntry) => void;
  can: (permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => boolean;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'aiia-ctms-session';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studies, setStudies] = useState<Study[]>(MOCK_STUDIES);
  const [aes, setAes] = useState<AdverseEvent[]>(MOCK_ADVERSE_EVENTS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(MOCK_AUDIT_LOG);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<View>({ name: 'home' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const alerts = computeAlerts(studies, aes);

  // Restore session & preferences
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
      } catch { /* ignore */ }
    }
    const prefDark = localStorage.getItem('aiia-dark-mode');
    if (prefDark === 'true') setDarkMode(true);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('aiia-dark-mode', String(darkMode));
  }, [darkMode]);

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, darkMode }));
    }
  }, [user, darkMode]);

  // Session timeout (30 min inactivity)
  useEffect(() => {
    if (!user) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setUser(null);
        setView({ name: 'home' });
      }, 30 * 60 * 1000);
    };
    const events = ['mousedown', 'keydown', 'mousemove', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'No account found with that email.' };
    if (password !== DEMO_PASSWORD) return { success: false, error: 'Incorrect password.' };
    setUser(found);
    setView({ name: 'home' });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setView({ name: 'home' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const navigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(s => !s), []);

  const updateStudy = useCallback((studyId: string, updates: Partial<Study>) => {
    setStudies(prev => prev.map(s => s.studyId === studyId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
  }, []);

  const addAdverseEvent = useCallback((ae: AdverseEvent) => {
    setAes(prev => [ae, ...prev]);
  }, []);

  const addAuditEntry = useCallback((entry: AuditEntry) => {
    setAuditLog(prev => [entry, ...prev]);
  }, []);

  const can = useCallback((permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role][permission];
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, studies, aes, alerts, auditLog, darkMode, view, sidebarCollapsed,
      login, logout, navigate, toggleDarkMode, toggleSidebar,
      updateStudy, addAdverseEvent, addAuditEntry, can,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
