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
import { useDashboard } from '@/hooks/useDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RealTimeOverviewDashboard: React.FC = () => {
  const { stats, crisisEvents, loading, error } = useDashboard();

  // Mock data for charts (will be replaced with real data)
  const assessmentTrends = [
    { month: 'Jan', phq9: 8.2, gad7: 7.1 },
    { month: 'Feb', phq9: 7.8, gad7: 6.9 },
    { month: 'Mar', phq9: 7.5, gad7: 6.7 },
    { month: 'Apr', phq9: 7.2, gad7: 6.4 },
    { month: 'May', phq9: 6.9, gad7: 6.1 },
    { month: 'Jun', phq9: 6.6, gad7: 5.8 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 65, color: '#22c55e' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 8, color: '#ef4444' },
    { name: 'Critical', value: 2, color: '#dc2626' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-secondary-200 dark:bg-secondary-700 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
        <h3 className="text-lg font-semibold text-danger-800 dark:text-danger-200 mb-2">
          Dashboard Error
        </h3>
        <p className="text-danger-700 dark:text-danger-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Active Patients',
      value: stats?.totalPatients || 0,
      icon: UsersIcon,
      bgColorClass: 'bg-primary-100 dark:bg-primary-900/20',
      textColorClass: 'text-primary-700 dark:text-primary-300',
      change: '+12 this month',
      trend: 'up'
    },
    {
      title: 'Crisis Patients',
      value: stats?.crisisPatients || 0,
      icon: ExclamationTriangleIcon,
      bgColorClass: 'bg-danger-100 dark:bg-danger-900/20',
      textColorClass: 'text-danger-700 dark:text-danger-300',
      change: '-1 from yesterday',
      trend: 'down'
    },
    {
      title: 'Appointments Today',
      value: stats?.todayAppointments || 0,
      icon: CalendarDaysIcon,
      bgColorClass: 'bg-success-100 dark:bg-success-900/20',
      textColorClass: 'text-success-700 dark:text-success-300',
      change: '8 completed',
      trend: 'stable'
    },
    {
      title: 'Avg PHQ-9 Score',
      value: stats?.avgPhq9Score || '0.0',
      icon: ChartBarIcon,
      bgColorClass: 'bg-warning-100 dark:bg-warning-900/20',
      textColorClass: 'text-warning-700 dark:text-warning-300',
      change: '-0.5 from last week',
      trend: 'down'
    },
    {
      title: 'Treatment Response',
      value: stats?.treatmentResponse || '0%',
      icon: HeartIcon,
      bgColorClass: 'bg-info-100 dark:bg-info-900/20',
      textColorClass: 'text-info-700 dark:text-info-300',
      change: '+5% improvement',
      trend: 'up'
    },
    {
      title: 'Avg Episode Length',
      value: stats?.avgEpisodeLength || '0 weeks',
      icon: ClockIcon,
      bgColorClass: 'bg-secondary-100 dark:bg-secondary-700',
      textColorClass: 'text-secondary-700 dark:text-secondary-300',
      change: 'Within target range',
      trend: 'stable'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Real-Time Dashboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Live analytics and patient monitoring for behavioral health management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((item, index) => (
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
                <div className="flex items-center mt-1">
                  {item.trend === 'up' && <TrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />}
                  {item.trend === 'down' && <TrendingDownIcon className="w-4 h-4 text-danger-500 mr-1" />}
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {item.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Trends */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Assessment Score Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentTrends}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="phq9" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="PHQ-9 Average"
                />
                <Line 
                  type="monotone" 
                  dataKey="gad7" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="GAD-7 Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Patient Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Crisis Events Alert */}
      {crisisEvents && crisisEvents.length > 0 && (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-danger-600 dark:text-danger-400 mr-2" />
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Active Crisis Events ({crisisEvents.length})
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {crisisEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-secondary-900 dark:text-white">
                        {event.patient.first_name} {event.patient.last_name}
                      </h3>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {event.patient.mrn}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.severity === 'critical' 
                          ? 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                          : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                      }`}>
                        {event.severity} - {event.event_type}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                      Occurred: {new Date(event.occurred_at).toLocaleString()}
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
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  );
};

export default RealTimeOverviewDashboard;