
import * as React from 'react';
import { SummaryData } from '../../types.ts';

const SummaryCard: React.FC<SummaryData> = ({ title, value, icon, bgColorClass, textColorClass }) => {
  return (
    <div className={`p-4 md:p-6 rounded-xl shadow-lg flex items-center space-x-4 ${bgColorClass} ${textColorClass}`}>
      <div className="p-3 bg-black bg-opacity-10 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm md:text-base font-medium opacity-80">{title}</p>
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;