
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Sidebar from './components/layout/Sidebar.tsx';
import OverviewDashboardPage from './components/dashboard/OverviewDashboardPage.tsx';
import CalendarPage from './pages/CalendarPage.tsx';
import BehavioralHealthPage from './pages/BehavioralHealthPage.tsx';
import HealthNavigationPage from './pages/HealthNavigationPage.tsx';
import NewPatientPage from './pages/NewPatientPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import LicensedProfessionalCounselingPage from './pages/LicensedProfessionalCounselingPage.tsx';
import ProviderViewPage from './pages/ProviderViewPage.tsx';
import AdministrationPage from './pages/AdministrationPage.tsx';
import BillingDepartmentPage from './pages/BillingDepartmentPage.tsx';
import CommunityResourcesPage from './pages/CommunityResourcesPage.tsx';
import MensGroupPage from './pages/MensGroupPage.tsx';
import { useDarkMode } from './hooks/useDarkMode.ts';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`flex h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-100 dark:bg-secondary-900 p-4 md:p-6 lg:p-8">
          {/* This App.tsx is not used in Next.js - routing is handled by the app directory */}
        </main>
      </div>
    </div>
  );
};

export default App;