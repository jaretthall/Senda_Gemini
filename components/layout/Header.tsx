
import * as React from 'react';
import { MenuIcon, XIcon, SearchIcon, BellIcon, ClipboardListIcon } from '../common/icons.tsx';
import PatientSearchBar from '../common/PatientSearchBar.tsx';
import NotificationButton from '../common/NotificationButton.tsx';
import UserProfileDropdown from '../common/UserProfileDropdown.tsx';
import StickyNotesPanel from '../common/StickyNotesPanel.tsx';
import { APP_NAME } from '../../constants.tsx';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [isStickyNotesOpen, setIsStickyNotesOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-md p-4 flex items-center justify-between sticky top-0 z-40 h-16">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-secondary-600 dark:text-secondary-300 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none md:hidden mr-3"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
        <h1 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 hidden md:block">{APP_NAME}</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <PatientSearchBar />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        <button 
          onClick={() => setIsStickyNotesOpen(!isStickyNotesOpen)}
          className="p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none"
          aria-label="Toggle Sticky Notes To-Do List"
          title="Sticky Notes / To-Do List"
        >
          <ClipboardListIcon className="w-6 h-6" />
        </button>
        <StickyNotesPanel isOpen={isStickyNotesOpen} onClose={() => setIsStickyNotesOpen(false)} />
        <NotificationButton />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;