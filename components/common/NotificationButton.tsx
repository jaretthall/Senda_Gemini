
import * as React from 'react';
import { BellIcon, PlusCircleIcon, ArrowTrendingUpIcon, CalendarIcon, CogIcon } from './icons.tsx';

// Data moved from constants.tsx to prevent circular dependency
const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'New patient "John Doe" assigned.', time: '2m ago', read: false, icon: <PlusCircleIcon className="w-5 h-5 text-primary-500" /> },
  { id: '2', text: 'PHQ-9 score for "Jane Smith" is high.', time: '1h ago', read: false, icon: <ArrowTrendingUpIcon className="w-5 h-5 text-danger-500" /> },
  { id: '3', text: 'Appointment reminder: "Alice Brown" at 2 PM.', time: '3h ago', read: true, icon: <CalendarIcon className="w-5 h-5 text-secondary-500" /> },
  { id: '4', text: 'System maintenance scheduled for tonight.', time: '1d ago', read: true, icon: <CogIcon className="w-5 h-5 text-warning-500" /> },
];

const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : '(no new notifications)'}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-secondary-800" aria-hidden="true"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-secondary-800 rounded-lg shadow-xl z-20 border border-secondary-200 dark:border-secondary-700 overflow-hidden" role="dialog" aria-labelledby="notifications-heading">
          <div className="py-2 px-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 id="notifications-heading" className="font-semibold text-secondary-700 dark:text-secondary-200">Notifications</h3>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-secondary-100 dark:divide-secondary-700">
            {MOCK_NOTIFICATIONS.length > 0 ? MOCK_NOTIFICATIONS.map(notif => (
              <li key={notif.id} className={`hover:bg-secondary-50 dark:hover:bg-secondary-700 ${!notif.read ? 'bg-primary-50 dark:bg-primary-900' : ''}`}>
                <a href="#" className="block p-3 focus:outline-none focus:bg-secondary-100 dark:focus:bg-secondary-600">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5" aria-hidden="true">{notif.icon}</div>
                    <div>
                      <p className={`text-sm ${!notif.read ? 'font-medium text-secondary-800 dark:text-secondary-100' : 'text-secondary-600 dark:text-secondary-300'}`}>{notif.text}</p>
                      <p className="text-xs text-secondary-400 dark:text-secondary-500">{notif.time}</p>
                    </div>
                    {!notif.read && <span className="ml-auto mt-0.5 h-2 w-2 rounded-full bg-primary-500" aria-hidden="true"></span>}
                  </div>
                </a>
              </li>
            )) : (
                 <li className="p-4 text-center text-sm text-secondary-500 dark:text-secondary-400">No new notifications.</li>
            )}
          </ul>
          <div className="py-2 px-4 border-t border-secondary-200 dark:border-secondary-700 text-center">
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">View all notifications</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;