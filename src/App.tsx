import { AppProvider, useApp } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import InfoHubPage from '@/pages/InfoHubPage';
import DashboardPage from '@/pages/DashboardPage';
import StudiesPage from '@/pages/StudiesPage';
import StudyDetailPage from '@/pages/StudyDetailPage';
import PharmacovigilancePage from '@/pages/PharmacovigilancePage';
import AeIntakePage from '@/pages/AeIntakePage';
import AuditPage from '@/pages/AuditPage';
import ReportsPage from '@/pages/ReportsPage';
import CompliancePage from '@/pages/CompliancePage';
import AdminPage from '@/pages/AdminPage';

function Router() {
  const { user, view } = useApp();

  let page;
  switch (view.name) {
    case 'home': page = <HomePage />; break;
    case 'info-hub': page = <InfoHubPage section={view.section} />; break;
    case 'dashboard': page = user ? <DashboardPage /> : <LoginPage />; break;
    case 'studies': page = user ? <StudiesPage /> : <LoginPage />; break;
    case 'study-detail': page = user ? <StudyDetailPage studyId={view.studyId} tab={view.tab} /> : <LoginPage />; break;
    case 'pharmacovigilance': page = user ? <PharmacovigilancePage /> : <LoginPage />; break;
    case 'ae-intake': page = user ? <AeIntakePage studyId={view.studyId} /> : <LoginPage />; break;
    case 'audit': page = user ? <AuditPage /> : <LoginPage />; break;
    case 'reports': page = user ? <ReportsPage /> : <LoginPage />; break;
    case 'compliance': page = user ? <CompliancePage /> : <LoginPage />; break;
    case 'admin': page = user ? <AdminPage /> : <LoginPage />; break;
    default: page = <HomePage />;
  }

  const needsShell = view.name !== 'home' && user;
  return needsShell ? <AppShell>{page}</AppShell> : page;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
