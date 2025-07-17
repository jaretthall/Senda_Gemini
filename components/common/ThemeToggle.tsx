
import * as React from 'react';
import { SunIcon, MoonIcon } from './icons.tsx';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleDarkMode, sidebarOpen }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`w-full flex items-center p-2 rounded-md transition-colors duration-200
                  ${sidebarOpen ? 'justify-start' : 'justify-center'}
                  text-secondary-600 dark:text-secondary-300 
                  hover:bg-secondary-200 dark:hover:bg-secondary-700 
                  focus:outline-none focus:ring-2 focus:ring-primary-500`}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      {sidebarOpen && (
        <span className="ml-3 text-sm font-medium">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;