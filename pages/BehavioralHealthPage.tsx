
import * as React from 'react';
import { UsersIcon } from '../components/common/icons.tsx';

const BehavioralHealthPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
        <UsersIcon className="w-8 h-8 mr-3 text-primary-500" />
        Behavioral Health Consultation
      </h1>
      <p className="text-secondary-600 dark:text-secondary-300">
        Content related to behavioral health consultations will be displayed here. This includes patient lists, consultation notes, and relevant metrics.
      </p>
       <div className="mt-8 h-96 bg-secondary-200 dark:bg-secondary-700 rounded-md flex items-center justify-center">
        <p className="text-secondary-500 dark:text-secondary-400">BHC Dashboard Placeholder</p>
      </div>
    </div>
  );
};

export default BehavioralHealthPage;