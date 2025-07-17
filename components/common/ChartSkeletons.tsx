
import * as React from 'react';

export const DonutChartSkeleton: React.FC = () => (
    <div className="w-full h-64 md:h-72 relative flex items-center justify-center animate-pulse">
        <div className="w-48 h-48 rounded-full bg-secondary-200 dark:bg-secondary-700"></div>
    </div>
);

export const ChartCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-secondary-800 p-4 rounded-xl shadow-lg h-[350px] flex flex-col animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="h-5 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
      <div className="h-4 w-4 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
    </div>
    <div className="flex-grow bg-secondary-100 dark:bg-secondary-700 rounded-md mt-2"></div>
  </div>
);
