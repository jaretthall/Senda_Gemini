
import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaskData } from '../../types.ts';

interface TasksDonutChartProps {
  data: (TaskData & { color: string })[];
}

const TasksDonutChart: React.FC<TasksDonutChartProps> = ({ data }) => {
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="w-full h-64 md:h-72 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${((value / totalValue) * 100).toFixed(0)}% (${value})`} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconSize={10}
            formatter={(value, entry) => <span className="text-xs text-secondary-600 dark:text-secondary-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
            {totalValue > 0 ? `${((data.find(d => d.name === 'Completed')?.value || 0) / totalValue * 100).toFixed(0)}%` : '0%'}
          </p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default TasksDonutChart;