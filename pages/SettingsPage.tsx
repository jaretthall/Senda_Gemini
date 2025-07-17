
import * as React from 'react';
import { CogIcon } from '../components/common/icons.tsx';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
        <CogIcon className="w-8 h-8 mr-3 text-primary-500" />
        Settings
      </h1>
      <p className="text-secondary-600 dark:text-secondary-300">
        Application settings, user profile management, and other configurations will be available here.
      </p>
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-secondary-700 dark:text-secondary-200">Profile Settings</h2>
          <div className="mt-2 p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">User profile customization options placeholder.</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-secondary-700 dark:text-secondary-200">Notification Preferences</h2>
          <div className="mt-2 p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Notification settings placeholder.</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-secondary-700 dark:text-secondary-200">Appearance</h2>
          <div className="mt-2 p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Theme and display settings placeholder (Dark mode is already functional).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;