import * as React from 'react';
import SummaryCard from './SummaryCard.tsx';
import CrisisPatientSlider from './CrisisPatientSlider.tsx';
import { SummaryData } from '../../types.ts';
import { UsersIcon, ClipboardListIcon, ExclamationCircleIcon } from '../common/icons.tsx';
import { MOCK_TASK_DATA } from '../../constants.tsx';
import { ChartCardSkeleton, DonutChartSkeleton } from '../common/ChartSkeletons.tsx';

const TasksDonutChart = React.lazy(() => import('./TasksDonutChart.tsx'));
const DashboardCharts = React.lazy(() => import('./DashboardCharts.tsx'));


const mockCrisisPatients = [
  { id: 'cp1', name: 'Alice Wonderland', age: 34, gender: 'Female', language: 'English', mrn: 'MRN007', recentScreenerScores: [{ name: 'PHQ-9', score: 22, date: '2023-10-25' }], isCritical: true, photoUrl: 'https://picsum.photos/seed/patient1/100/100' },
  { id: 'cp2', name: 'Bob The Builder', age: 45, gender: 'Male', language: 'English', mrn: 'MRN008', recentScreenerScores: [{ name: 'GAD-7', score: 18, date: '2023-10-26' }], isCritical: true, photoUrl: 'https://picsum.photos/seed/patient2/100/100' },
  { id: 'cp3', name: 'Charlie Brown', age: 28, gender: 'Male', language: 'Spanish', mrn: 'MRN009', recentScreenerScores: [{ name: 'PCL-5', score: 60, date: '2023-10-24' }], isCritical: true, photoUrl: 'https://picsum.photos/seed/patient3/100/100' },
];

const AnalyticsSectionSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-4">
            <div className="h-7 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3"></div>
            <div className="h-10 bg-primary-300 dark:bg-primary-800 rounded-lg w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
        </div>
    </div>
);


const OverviewDashboardPage: React.FC = () => {
  const summaryCardsData: SummaryData[] = [
    { title: 'Total Personal Patients Active', value: '125', icon: <UsersIcon className="w-8 h-8" />, bgColorClass: 'bg-primary-500', textColorClass: 'text-white' },
    { title: 'Total System Patients Active', value: '850', icon: <UsersIcon className="w-8 h-8" />, bgColorClass: 'bg-success-500', textColorClass: 'text-white' },
    { title: 'Total Patients Completed', value: '340', icon: <ClipboardListIcon className="w-8 h-8" />, bgColorClass: 'bg-secondary-500', textColorClass: 'text-white' },
    { title: 'Active Crisis Patients', value: mockCrisisPatients.length, icon: <ExclamationCircleIcon className="w-8 h-8" />, bgColorClass: 'bg-danger-500', textColorClass: 'text-white' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-secondary-800 dark:text-secondary-100">Overview Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {summaryCardsData.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Crisis Patients & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-secondary-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-secondary-700 dark:text-secondary-200">Active Crisis Patients ({mockCrisisPatients.length})</h3>
          <CrisisPatientSlider patients={mockCrisisPatients} />
        </div>
        <div className="bg-white dark:bg-secondary-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-secondary-700 dark:text-secondary-200">Percentage of Tasks Done</h3>
          <React.Suspense fallback={<DonutChartSkeleton />}>
            <TasksDonutChart data={MOCK_TASK_DATA} />
          </React.Suspense>
        </div>
      </div>

      {/* Graphs/Charts Section */}
      <React.Suspense fallback={<AnalyticsSectionSkeleton />}>
        <DashboardCharts />
      </React.Suspense>
    </div>
  );
};

export default OverviewDashboardPage;
