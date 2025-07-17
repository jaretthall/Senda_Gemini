'use client';

import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface BHCPatient {
  id: string;
  name: string;
  mrn: string;
  initialDate: string;
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  status: string;
  lastContact: string;
  nextAction: string;
}

const BehavioralHealthDashboard: React.FC = () => {
  const [patients, setPatients] = useState<BHCPatient[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Mock data - replace with real API call
  useEffect(() => {
    const mockPatients: BHCPatient[] = [
      {
        id: '1',
        name: 'John Doe',
        mrn: 'MRN001',
        initialDate: '2024-01-15',
        urgency: 'high',
        status: 'Needs to be contacted',
        lastContact: '2024-01-14',
        nextAction: 'Initial outreach call'
      },
      {
        id: '2',
        name: 'Jane Smith',
        mrn: 'MRN002',
        initialDate: '2024-01-10',
        urgency: 'moderate',
        status: 'Being seen by Beatriz',
        lastContact: '2024-01-12',
        nextAction: 'Follow-up in 2 weeks'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        mrn: 'MRN003',
        initialDate: '2024-01-08',
        urgency: 'critical',
        status: 'Unable to reach by phone',
        lastContact: '2024-01-07',
        nextAction: 'Emergency contact outreach'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        mrn: 'MRN004',
        initialDate: '2024-01-12',
        urgency: 'low',
        status: 'WHO completed',
        lastContact: '2024-01-13',
        nextAction: 'Schedule counseling'
      }
    ];
    setPatients(mockPatients);
  }, []);

  const statusOptions = [
    'Needs to be contacted',
    'Unable to reach by phone',
    'WHO scheduled',
    'WHO completed',
    'In the process of filling out paperwork',
    'Being scheduled for counseling',
    'Being seen by Beatriz',
    'Being seen by Juan',
    'Being seen by Jarett',
    'Needs follow up',
    'No longer interested',
    'Referred out',
    'No longer responding to phone calls',
    'Missed previous appointment and needs follow up',
    'Terminated'
  ];

  const urgencyColors = {
    low: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
    moderate: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
    high: 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300',
    critical: 'bg-danger-200 text-danger-900 dark:bg-danger-800 dark:text-danger-100'
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('completed') || status.includes('scheduled')) {
      return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
    }
    if (status.includes('unable') || status.includes('terminated')) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />;
    }
    if (status.includes('contact') || status.includes('phone')) {
      return <PhoneIcon className="w-5 h-5 text-primary-500" />;
    }
    return <ClockIcon className="w-5 h-5 text-warning-500" />;
  };

  const filteredPatients = patients.filter(patient => {
    const statusMatch = filter === 'all' || patient.status === filter;
    const urgencyMatch = urgencyFilter === 'all' || patient.urgency === urgencyFilter;
    return statusMatch && urgencyMatch;
  });

  const stats = {
    total: patients.length,
    needsContact: patients.filter(p => p.status === 'Needs to be contacted').length,
    inProgress: patients.filter(p => p.status.includes('Being seen')).length,
    critical: patients.filter(p => p.urgency === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Behavioral Health Consultation Dashboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Manage patient referrals and consultation workflow
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20">
              <UsersIcon className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100 dark:bg-warning-900/20">
              <PhoneIcon className="w-6 h-6 text-warning-700 dark:text-warning-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Needs Contact
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.needsContact}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100 dark:bg-success-900/20">
              <CheckCircleIcon className="w-6 h-6 text-success-700 dark:text-success-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-danger-100 dark:bg-danger-900/20">
              <ExclamationTriangleIcon className="w-6 h-6 text-danger-700 dark:text-danger-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Critical
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.critical}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="urgency-filter" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Filter by Urgency
            </label>
            <select
              id="urgency-filter"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Patient Consultation Queue ({filteredPatients.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-secondary-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Initial Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {patient.name}
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {patient.mrn}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                    {new Date(patient.initialDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${urgencyColors[patient.urgency]}`}>
                      {patient.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(patient.status)}
                      <span className="ml-2 text-sm text-secondary-900 dark:text-white">
                        {patient.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                    {new Date(patient.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        <PhoneIcon className="w-4 h-4" />
                      </button>
                      <button className="text-success-600 hover:text-success-900 dark:text-success-400 dark:hover:text-success-300">
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                      <button className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300">
                        <DocumentTextIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BehavioralHealthDashboard;