'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  HeartIcon,
  MapIcon,
  UserPlusIcon,
  CogIcon,
  AcademicCapIcon,
  EyeIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const navigationItems = [
  { name: 'Overview Dashboard', href: '/', icon: HomeIcon, favorited: true },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, favorited: false },
  { name: 'Behavioral Health', href: '/behavioral-health', icon: HeartIcon, favorited: true },
  { name: 'Health Navigation', href: '/health-navigation', icon: MapIcon, favorited: false },
  { name: 'New Patient', href: '/new-patient', icon: UserPlusIcon, favorited: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, favorited: false },
  { name: 'Licensed Professional Counseling', href: '/licensed-professional-counseling', icon: AcademicCapIcon, favorited: true },
  { name: 'Provider View', href: '/provider-view', icon: EyeIcon, favorited: false },
  { name: 'Administration', href: '/administration', icon: ShieldCheckIcon, favorited: false },
  { name: 'Billing Department', href: '/billing-department', icon: CreditCardIcon, favorited: false },
  { name: 'Community Resources', href: '/community-resources', icon: BuildingOfficeIcon, favorited: false },
  { name: 'Men\'s Group', href: '/mens-group', icon: UsersIcon, favorited: true },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const pathname = usePathname();

  const favoritedItems = navigationItems.filter(item => item.favorited);
  const defaultItems = navigationItems.filter(item => !item.favorited);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 
        border-r border-secondary-200 dark:border-secondary-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen ? 'md:w-16' : 'md:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className={`flex items-center ${!isOpen ? 'md:justify-center' : ''}`}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              {isOpen && (
                <span className="ml-3 text-lg font-semibold text-secondary-900 dark:text-white">
                  Senda
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Favorited Section */}
            <div>
              {isOpen && (
                <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3">
                  Favorited
                </h3>
              )}
              <ul className="space-y-1">
                {favoritedItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${isActive 
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                          }
                          ${!isOpen ? 'md:justify-center' : ''}
                        `}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {isOpen && <span className="ml-3 truncate">{item.name}</span>}
                        {isOpen && (
                          <StarIcon className="w-4 h-4 ml-auto text-warning-500 fill-current" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Default Section */}
            <div>
              {isOpen && (
                <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3">
                  Default
                </h3>
              )}
              <ul className="space-y-1">
                {defaultItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${isActive 
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                          }
                          ${!isOpen ? 'md:justify-center' : ''}
                        `}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {isOpen && <span className="ml-3 truncate">{item.name}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={toggleDarkMode}
              className={`
                flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700
                ${!isOpen ? 'md:justify-center' : ''}
              `}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <MoonIcon className="w-5 h-5 flex-shrink-0" />
              )}
              {isOpen && (
                <span className="ml-3">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;