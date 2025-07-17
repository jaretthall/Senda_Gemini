
import * as React from 'react';
import { Link } from 'react-router-dom';
import { usePathname } from 'next/navigation';
import { NavItem } from '../../types.ts';
import { APP_NAME, FOOTER_LINKS, MOCK_USER } from '../../constants.tsx';
import { 
    ChevronDownIcon, ChevronRightIcon, LogoutIcon, CogIcon, PlusCircleIcon, XIcon, MenuIcon, HomeIcon, 
    CalendarIcon, UsersIcon, DocumentTextIcon, BriefcaseIcon, UserGroupIcon, ScaleIcon, ShieldCheckIcon, 
    ArrowTrendingUpIcon, PresentationChartLineIcon, UserCircleIcon 
} from '../common/icons.tsx';
import ThemeToggle from '../common/ThemeToggle.tsx';

// Data moved from constants.tsx to prevent circular dependency
const DEFAULT_VIEWS: NavItem[] = [
  { name: 'Overview', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <CalendarIcon className="w-5 h-5" /> },
  { name: 'Behavioral Health Consultation', path: '/behavioral-health', icon: <UsersIcon className="w-5 h-5" /> },
  { name: 'Health Navigation (Cover Kids)', path: '/health-navigation', icon: <ShieldCheckIcon className="w-5 h-5" /> },
  { name: 'Licensed Professional Counseling', path: '/licensed-professional-counseling', icon: <BriefcaseIcon className="w-5 h-5" /> },
  { name: 'Provider View', path: '/provider-view', icon: <UserCircleIcon className="w-5 h-5" /> },
  { name: 'Administration', path: '/administration', icon: <CogIcon className="w-5 h-5" /> },
  { name: 'Billing Department', path: '/billing-department', icon: <DocumentTextIcon className="w-5 h-5" /> },
  { name: 'Community Resources', path: '/community-resources', icon: <UserGroupIcon className="w-5 h-5" /> },
  { name: 'Men\'s Group', path: '/mens-group', icon: <ScaleIcon className="w-5 h-5" /> },
];

const FAVORITED_VIEWS: NavItem[] = [
  { name: 'My Patients Stats', path: '/fav/patient-stats', icon: <ArrowTrendingUpIcon className="w-5 h-5" />, isFavorite: true },
  { name: 'Urgent Follow-ups', path: '/fav/urgent-followups', icon: <PresentationChartLineIcon className="w-5 h-5" />, isFavorite: true },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SidebarNavItem: React.FC<{ item: NavItem; isOpen: boolean }> = ({ item, isOpen }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const [isChildrenVisible, setIsChildrenVisible] = React.useState(false);

  const handleToggleChildren = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsChildrenVisible(!isChildrenVisible);
  };
  
  const linkClasses = `flex items-center py-2.5 px-4 rounded-md transition duration-200 ease-in-out
    ${isActive 
      ? 'bg-primary-500 text-white dark:bg-primary-600' 
      : 'text-secondary-600 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-700 hover:text-primary-600 dark:hover:text-primary-300'
    }
    ${!isOpen ? 'justify-center' : ''}`;

  if (item.children && item.children.length > 0) {
    return (
      <li> {/* Wrap in li */}
        <a href="#" onClick={handleToggleChildren} className={`${linkClasses} justify-between`} aria-expanded={isChildrenVisible}>
          <div className="flex items-center">
            {item.icon}
            {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
          </div>
          {isOpen && (isChildrenVisible ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />)}
        </a>
        {isOpen && isChildrenVisible && (
          <ul className="pl-8 py-1 space-y-1"> {/* Nested ul for children */}
            {item.children.map(child => (
              <SidebarNavItem key={child.path} item={child} isOpen={isOpen} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li> {/* Wrap in li */}
      <Link to={item.path} className={linkClasses} title={isOpen ? '' : item.name} aria-label={isOpen ? undefined : item.name}>
        {item.icon}
        {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
      </Link>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const [isFavOpen, setIsFavOpen] = React.useState(true);
  const [isDefaultOpen, setIsDefaultOpen] = React.useState(true);

  return (
    <aside className={`bg-white dark:bg-secondary-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col
      ${isOpen ? 'w-64' : 'w-20'} sticky top-0 h-screen z-50`}
      aria-label="Main navigation sidebar"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700 h-16">
        {isOpen && <h1 className="text-2xl font-semibold text-primary-600 dark:text-primary-400">{APP_NAME}</h1>}
        <button
          onClick={toggleSidebar}
          className="text-secondary-600 dark:text-secondary-300 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none md:block hidden"
          aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* User Profile / Settings Icon Area - Top */}
      <div className={`p-4 border-b border-secondary-200 dark:border-secondary-700 ${!isOpen && 'flex flex-col items-center'}`}>
        <div className="flex items-center space-x-3 mb-2">
          <img src={MOCK_USER.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          {isOpen && (
            <div>
              <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-200">{MOCK_USER.name}</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">{MOCK_USER.role || 'User'}</p>
            </div>
          )}
        </div>
        {isOpen && (
           <div className="flex space-x-2 mt-2">
            <Link to="/settings" className="flex items-center text-xs py-1 px-2 rounded bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-200">
              <CogIcon className="w-4 h-4 mr-1" /> Settings
            </Link>
            <button className="flex items-center text-xs py-1 px-2 rounded bg-danger-100 dark:bg-danger-700 hover:bg-danger-200 dark:hover:bg-danger-600 text-danger-700 dark:text-danger-200">
              <LogoutIcon className="w-4 h-4 mr-1" /> Logout
            </button>
          </div>
        )}
         {!isOpen && (
          <>
            <Link to="/settings" aria-label="Settings" title="Settings" className="mt-2 p-2 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-300">
              <CogIcon className="w-5 h-5" />
            </Link>
            <button aria-label="Logout" title="Logout" className="mt-1 p-2 rounded-full hover:bg-danger-100 dark:hover:bg-danger-700 text-danger-600 dark:text-danger-300">
              <LogoutIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Favorited Views Dropdown */}
        <section aria-labelledby="favorited-views-heading">
          <h2 id="favorited-views-heading" className={`sr-only ${isOpen ? '' : 'hidden'}`}>Favorited Views</h2>
          <button 
            onClick={() => setIsFavOpen(!isFavOpen)}
            aria-expanded={isFavOpen}
            aria-controls="favorited-views-list"
            className={`w-full flex items-center justify-between py-2 px-1 text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 ${!isOpen && 'hidden'}`}
          >
            Favorited Views
            {isFavOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
          <ul id="favorited-views-list" className={`${(isOpen ? isFavOpen : true) ? '' : 'hidden'}`}>
             {FAVORITED_VIEWS.map(item => <SidebarNavItem key={item.path} item={item} isOpen={isOpen} />)}
          </ul>
        </section>

        {/* Default Views Dropdown */}
        <section aria-labelledby="default-views-heading">
          <h2 id="default-views-heading" className={`sr-only ${isOpen ? '' : 'hidden'}`}>Default Views</h2>
          <button 
            onClick={() => setIsDefaultOpen(!isDefaultOpen)}
            aria-expanded={isDefaultOpen}
            aria-controls="default-views-list"
            className={`w-full flex items-center justify-between py-2 px-1 text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 ${!isOpen && 'hidden'}`}
          >
            Default Views
            {isDefaultOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
          <ul id="default-views-list" className={`${(isOpen ? isDefaultOpen : true) ? '' : 'hidden'}`}>
            {DEFAULT_VIEWS.map(item => <SidebarNavItem key={item.path} item={item} isOpen={isOpen} />)}
          </ul>
        </section>
        
        {/* New Patient Link */}
        <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700">
          <Link 
            to="/new-patient" 
            className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ease-in-out bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-600 dark:hover:bg-primary-700 ${!isOpen ? 'justify-center' : ''}`}
            aria-label={isOpen ? undefined : 'New Patient'}
            title={isOpen ? '' : 'New Patient'}
          >
            <PlusCircleIcon className="w-5 h-5" />
            {isOpen && <span className="ml-3 text-sm font-medium">New Patient</span>}
          </Link>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} sidebarOpen={isOpen}/>
        {isOpen && (
          <div className="mt-4 text-center">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">{FOOTER_LINKS.contactInfo}</p>
            <div className="text-xs">
              <Link to={FOOTER_LINKS.privacyPolicyUrl} className="text-primary-600 hover:underline dark:text-primary-400">Privacy Policy</Link>
              <span className="mx-1 text-secondary-400 dark:text-secondary-500">|</span>
              <Link to={FOOTER_LINKS.termsOfServiceUrl} className="text-primary-600 hover:underline dark:text-primary-400">Terms of Service</Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;