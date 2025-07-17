'use client';

import React from 'react';
import {
  UsersIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  HeartIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const OverviewDashboard: React.FC = () => {
  // Mock data - will be replaced with real data later
  const summaryData = [
    {
      title: 'Total Active Patients',
      value: '187',
      icon: UsersIcon,
      bgColorClass: 'bg-primary-100 dark:bg-primary-900',
      textColorClass: 'text-primary-700 dark:text-primary-300',
      change: '+12 this month'
    },
    {
      title: 'Crisis Patients',
      value: '3',
      icon: ExclamationTriangleIcon,
      bgColorClass: 'bg-danger-100 dark:bg-danger-900',
      textColorClass: 'text-danger-700 dark:text-danger-300',
      change: '-1 from yesterday'
    },
    {
      title: 'Appointments Today',
      value: '24',
      icon: CalendarDaysIcon,
      bgColorClass: 'bg-success-100 dark:bg-success-900',
      textColorClass: 'text-success-700 dark:text-success-300',
      change: '8 completed'
    },
    {
      title: 'Avg PHQ-9 Score',
      value: '8.2',
      icon: ChartBarIcon,
      bgColorClass: 'bg-warning-100 dark:bg-warning-900',
      textColorClass: 'text-warning-700 dark:text-warning-300',
      change: '-0.5 from last week'
    },
    {
      title: 'Treatment Response',
      value: '73%',
      icon: HeartIcon,
      bgColorClass: 'bg-info-100 dark:bg-info-900',
      textColorClass: 'text-info-700 dark:text-info-300',
      change: '+5% improvement'
    },
    {
      title: 'Avg Episode Length',
      value: '12.4 weeks',
      icon: ClockIcon,
      bgColorClass: 'bg-secondary-100 dark:bg-secondary-700',
      textColorClass: 'text-secondary-700 dark:text-secondary-300',
      change: 'Within target range'
    }
  ];

  const crisisPatients = [
    {
      id: 1,
      name: 'John Doe',
      mrn: 'MRN-001234',
      riskLevel: 'High',
      lastContact: '2 hours ago',
      provider: 'Dr. Smith'
    },
    {
      id: 2,
      name: 'Jane Smith',
      mrn: 'MRN-005678',
      riskLevel: 'Medium',
      lastContact: '4 hours ago',
      provider: 'Dr. Johnson'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      mrn: 'MRN-009012',
      riskLevel: 'High',
      lastContact: '1 hour ago',
      provider: 'Dr. Brown'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'assessment',
      message: 'PHQ-9 assessment completed for John Doe',
      time: '10 minutes ago',
      provider: 'Dr. Smith'
    },
    {
      id: 2,
      type: 'appointment',
      message: 'Appointment scheduled for Jane Smith',
      time: '25 minutes ago',
      provider: 'Dr. Johnson'
    },
    {
      id: 3,
      type: 'crisis',
      message: 'Crisis alert resolved for Mike Wilson',
      time: '1 hour ago',
      provider: 'Dr. Brown'
    },
    {
      id: 4,
      type: 'note',
      message: 'Treatment plan updated for Sarah Davis',
      time: '2 hours ago',
      provider: 'Dr. Smith'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Overview Dashboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Welcome back, Dr. Sarah Johnson. Here's what's happening with your caseload today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${item.bgColorClass}`}>
                <item.icon className={`w-6 h-6 ${item.textColorClass}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  {item.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Crisis Patients Alert */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-danger-600 dark:text-danger-400 mr-2" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Crisis Patients Requiring Attention
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {crisisPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      {patient.name}
                    </h3>
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {patient.mrn}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      patient.riskLevel === 'High' 
                        ? 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                        : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                    }`}>
                      {patient.riskLevel} Risk
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <span>Last contact: {patient.lastContact}</span>
                    <span>Provider: {patient.provider}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'crisis' ? 'bg-danger-500' :
                    activity.type === 'assessment' ? 'bg-primary-500' :
                    activity.type === 'appointment' ? 'bg-success-500' :
                    'bg-secondary-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900 dark:text-white">
                      {activity.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.provider}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200">
                <UsersIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Add New Patient
                </p>
              </button>
              <button className="p-4 text-left bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors duration-200">
                <CalendarDaysIcon className="w-6 h-6 text-success-600 dark:text-success-400 mb-2" />
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Schedule Appointment
                </p>
              </button>
              <button className="p-4 text-left bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors duration-200">
                <ChartBarIcon className="w-6 h-6 text-warning-600 dark:text-warning-400 mb-2" />
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Run Assessment
                </p>
              </button>
              <button className="p-4 text-left bg-info-50 dark:bg-info-900/20 rounded-lg hover:bg-info-100 dark:hover:bg-info-900/30 transition-colors duration-200">
                <HeartIcon className="w-6 h-6 text-info-600 dark:text-info-400 mb-2" />
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Generate Report
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;