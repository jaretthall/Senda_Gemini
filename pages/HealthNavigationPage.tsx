
import * as React from 'react';
import { ShieldCheckIcon } from '../components/common/icons.tsx';

const HealthNavigationPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
        <ShieldCheckIcon className="w-8 h-8 mr-3 text-primary-500" />
        Health Navigation (Cover Kids)
      </h1>
      <p className="text-secondary-600 dark:text-secondary-300">
        This section is dedicated to Health Navigation, with a focus on services for children (Cover Kids program).
        Patient tracking, resource management, and appointment coordination for this program will be available here.
      </p>
      <div className="mt-8 h-96 bg-secondary-200 dark:bg-secondary-700 rounded-md flex items-center justify-center">
        <p className="text-secondary-500 dark:text-secondary-400">Cover Kids Dashboard Placeholder</p>
      </div>
    </div>
  );
};

export default HealthNavigationPage;