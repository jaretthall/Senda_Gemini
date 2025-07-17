
import * as React from 'react';
import { ChartConfig } from '../../types.ts';
import { PlusCircleIcon } from '../common/icons.tsx';
import { MOCK_PATIENT_DEMOGRAPHICS_PIE, MOCK_MENTAL_HEALTH_DISTRIBUTION, MOCK_CRISIS_EVENTS_LINE } from '../../constants.tsx';
import { ChartCardSkeleton } from '../common/ChartSkeletons.tsx';

const ChartCard = React.lazy(() => import('./ChartCard.tsx'));

const DashboardCharts: React.FC = () => {
  const initialCharts: ChartConfig[] = [
    { id: 'demographics', title: 'Patient Demographics Overview', type: 'pie', data: MOCK_PATIENT_DEMOGRAPHICS_PIE },
    { id: 'mentalHealth', title: 'Mental Health Condition Distribution', type: 'pie', data: MOCK_MENTAL_HEALTH_DISTRIBUTION },
    { id: 'crisisEvents', title: 'Crisis Events Over Time', type: 'line', data: MOCK_CRISIS_EVENTS_LINE },
    { id: 'riskLevel', title: 'Risk Level by Patient', type: 'bar', data: [{name: 'Low', value: 120}, {name: 'Medium', value: 80}, {name: 'High', value: 30}] },
    { id: 'treatmentProgress', title: 'Treatment Progress', type: 'line', data: [{name: 'W1', progress: 10}, {name: 'W2', progress: 25}, {name: 'W3', progress: 40}, {name: 'W4', progress: 60}] },
    { id: 'medAdherence', title: 'Medication Adherence', type: 'bar', data: [{name: 'Adherent', value: 75}, {name: 'Non-Adherent', value: 25}] },
  ];

  const [charts, setCharts] = React.useState<ChartConfig[]>(initialCharts);

  const handleAddChart = () => alert('Add chart functionality coming soon!');
  const handleRemoveChart = (id: string) => {
    setCharts(prevCharts => prevCharts.filter(chart => chart.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl md:text-2xl font-semibold text-secondary-800 dark:text-secondary-100">Analytics & Reports</h3>
        <button 
          onClick={handleAddChart}
          className="flex items-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Chart
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {charts.map(chart => (
          <React.Suspense key={chart.id} fallback={<ChartCardSkeleton />}>
              <ChartCard title={chart.title} type={chart.type} data={chart.data} onRemove={() => handleRemoveChart(chart.id)} />
          </React.Suspense>
        ))}
      </div>
    </div>
  );
};

export default DashboardCharts;