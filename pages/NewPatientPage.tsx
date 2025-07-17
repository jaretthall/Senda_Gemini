
import * as React from 'react';
import { PlusCircleIcon } from '../components/common/icons.tsx';

const NewPatientPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4 flex items-center">
        <PlusCircleIcon className="w-8 h-8 mr-3 text-primary-500" />
        New Patient Intake
      </h1>
      <p className="text-secondary-600 dark:text-secondary-300">
        This is where the new patient intake form will be located. It will guide users through collecting demographics, presenting concerns, health history, and other necessary information.
      </p>
       <div className="mt-8 min-h-[500px] bg-secondary-200 dark:bg-secondary-700 rounded-md flex items-center justify-center">
        <p className="text-secondary-500 dark:text-secondary-400">New Patient Form Placeholder</p>
      </div>
    </div>
  );
};

export default NewPatientPage;