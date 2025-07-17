
import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { ChartConfig } from '../../types.ts';
import { TrashIcon } from '../common/icons.tsx';

interface ChartCardProps extends Omit<ChartConfig, 'id'> {
  onRemove: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ChartCard: React.FC<ChartCardProps> = ({ title, type, data, onRemove }) => {
  const renderChart = () => {
    if (!data || data.length === 0) {
      return <p className="text-center text-secondary-500 dark:text-secondary-400 p-4">No data available for this chart.</p>;
    }
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" fill={COLORS[0]} />
            {data[0]?.value2 && <Bar dataKey="value2" fill={COLORS[1]} /> /* For stacked/grouped */}
          </BarChart>
        );
      case 'line': {
         const dataKeys = data[0] ? Object.keys(data[0]).filter(key => key !== 'name') : [];
         return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      }
      // Add more chart types here (radar, gantt, heatmap etc.)
      default:
        return <p className="text-center text-secondary-500 dark:text-secondary-400 p-4">Chart type "{type}" not supported yet.</p>;
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 p-4 rounded-xl shadow-lg h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-md font-semibold text-secondary-700 dark:text-secondary-200">{title}</h4>
        <button 
            onClick={onRemove} 
            className="text-secondary-400 hover:text-danger-500 dark:text-secondary-500 dark:hover:text-danger-400" 
            aria-label={`Remove ${title} chart`}
            title={`Remove ${title} chart`}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;