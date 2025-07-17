
import * as React from 'react';
import { UserCircleIcon } from '../components/common/icons.tsx';

const ProviderViewPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
        <UserCircleIcon className="w-8 h-8 mr-3 text-primary-500" />
        Provider View
      </h1>
      <p className="text-secondary-600 dark:text-secondary-300">
        This page offers a view tailored for medical providers, summarizing patient behavioral health statuses, medication changes, and referral information.
      </p>
      <div className="mt-8 h-96 bg-secondary-200 dark:bg-secondary-700 rounded-md flex items-center justify-center">
        <p className="text-secondary-500 dark:text-secondary-400">Provider Dashboard Placeholder</p>
      </div>
    </div>
  );
};

export default ProviderViewPage;