'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BehavioralHealthDashboard from '@/components/dashboard/BehavioralHealthDashboard';
import { useTheme } from '@/providers/ThemeProvider';

export default function BehavioralHealthPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen font-sans">
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
          <BehavioralHealthDashboard />
        </main>
      </div>
    </div>
  );
}