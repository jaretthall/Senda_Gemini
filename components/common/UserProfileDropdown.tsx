
import * as React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, CogIcon, LogoutIcon, ChevronDownIcon } from './icons.tsx';
import { MOCK_USER } from '../../constants.tsx';

const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img 
          src={MOCK_USER.avatarUrl || `https://picsum.photos/seed/user/40/40`} 
          alt="User Avatar" 
          className="w-8 h-8 rounded-full" 
        />
        <span className="hidden md:inline text-sm font-medium text-secondary-700 dark:text-secondary-200">{MOCK_USER.name.split(' ')[0]}</span>
        <ChevronDownIcon className="hidden md:inline w-4 h-4 text-secondary-500 dark:text-secondary-400" aria-hidden="true" />
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-md shadow-xl z-20 border border-secondary-200 dark:border-secondary-700 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button" // Assuming the button above has id="user-menu-button" or similar linking
        >
          <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
            <p className="text-sm font-semibold text-secondary-800 dark:text-secondary-100" id="user-menu-name">{MOCK_USER.name}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400" id="user-menu-role">{MOCK_USER.role || 'User'}</p>
          </div>
          <ul className="py-1" role="none">
            <li role="none">
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                role="menuitem"
              >
                <CogIcon className="w-5 h-5 mr-2 text-secondary-500 dark:text-secondary-400" aria-hidden="true"/>
                Settings
              </Link>
            </li>
            <li role="none">
              <button
                onClick={() => { alert('Logout clicked'); setIsOpen(false); }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-700"
                role="menuitem"
              >
                <LogoutIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;