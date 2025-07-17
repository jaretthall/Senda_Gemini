'use client';

import React, { useState } from 'react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { ClipboardListIcon } from '../common/icons';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStickyNotes, setShowStickyNotes] = useState(false);

  const notifications = [
    { id: 1, message: 'New patient referral received', time: '5 min ago', unread: true },
    { id: 2, message: 'Crisis patient alert resolved', time: '1 hour ago', unread: true },
    { id: 3, message: 'Weekly report generated', time: '2 hours ago', unread: false },
  ];

  const stickyNotes = [
    { id: 1, content: 'Follow up with John Doe - medication adjustment', color: 'bg-warning-100' },
    { id: 2, content: 'Team meeting tomorrow at 2 PM', color: 'bg-primary-100' },
    { id: 3, content: 'Review crisis protocols with new staff', color: 'bg-danger-100' },
  ];

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients, episodes, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-80 pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Sticky Notes */}
          <div className="relative">
            <button
              onClick={() => setShowStickyNotes(!showStickyNotes)}
              className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              <ClipboardListIcon className="w-5 h-5" />
            </button>
            
            {showStickyNotes && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
                    Sticky Notes
                  </h3>
                  <div className="space-y-2">
                    {stickyNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg ${note.color} dark:opacity-80`}
                      >
                        <p className="text-sm text-secondary-800 dark:text-secondary-200">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 relative"
            >
              <BellIcon className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
                    Notifications
                  </h3>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${
                          notification.unread 
                            ? 'bg-primary-50 dark:bg-primary-900/20' 
                            : 'bg-secondary-50 dark:bg-secondary-700'
                        }`}
                      >
                        <p className="text-sm text-secondary-800 dark:text-secondary-200">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-sm font-medium text-secondary-900 dark:text-white">
                Dr. Sarah Johnson
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    Preferences
                  </a>
                  <hr className="my-1 border-secondary-200 dark:border-secondary-600" />
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;