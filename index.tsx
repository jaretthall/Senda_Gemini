
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { HashRouter, Routes, Route } from 'react-router-dom';
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App>
        <Routes>
          <Route path="/" element={<OverviewDashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/behavioral-health" element={<BehavioralHealthPage />} />
          <Route path="/health-navigation" element={<HealthNavigationPage />} />
          <Route path="/new-patient" element={<NewPatientPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/licensed-professional-counseling" element={<LicensedProfessionalCounselingPage />} />
          <Route path="/provider-view" element={<ProviderViewPage />} />
          <Route path="/administration" element={<AdministrationPage />} />
          <Route path="/billing-department" element={<BillingDepartmentPage />} />
          <Route path="/community-resources" element={<CommunityResourcesPage />} />
          <Route path="/mens-group" element={<MensGroupPage />} />
        </Routes>
      </App>
    </HashRouter>
  </React.StrictMode>
);