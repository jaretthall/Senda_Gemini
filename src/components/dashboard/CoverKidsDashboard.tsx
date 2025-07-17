'use client';

import React, { useState } from 'react';
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  GlobeAltIcon,
  HeartIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface CoverKidsPatient {
  id: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  lastVisit: string;
  upcomingVisit?: string;
  terminationDate?: string;
  progress: number;
  photoUrl: string;
  activeServices: string[];
}

const CoverKidsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'closed'>('active');

  // Mock data
  const patients: CoverKidsPatient[] = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      dateOfBirth: '2018-03-15',
      phone: '(555) 123-4567',
      lastVisit: '2024-01-10',
      progress: 65,
      photoUrl: 'https://picsum.photos/seed/patient1/100/100',
      activeServices: ['Cover Kids', 'Behavioral Health']
    },
    {
      id: '2',
      name: 'Michael Chen',
      dateOfBirth: '2019-07-22',
      phone: '(555) 234-5678',
      lastVisit: '2024-01-08',
      upcomingVisit: '2024-01-20',
      progress: 40,
      photoUrl: 'https://picsum.photos/seed/patient2/100/100',
      activeServices: ['Cover Kids', 'Referrals', 'Social Services']
    },
    {
      id: '3',
      name: 'Sofia Martinez',
      dateOfBirth: '2017-11-30',
      phone: '(555) 345-6789',
      terminationDate: '2024-01-05',
      progress: 100,
      photoUrl: 'https://picsum.photos/seed/patient3/100/100',
      activeServices: ['Cover Kids']
    }
  ];

  const activePatients = patients.filter(p => !p.terminationDate);
  const upcomingPatients = patients.filter(p => p.upcomingVisit);
  const closedPatients = patients.filter(p => p.terminationDate);

  const getServiceBadge = (service: string) => {
    const colors = {
      'Cover Kids': 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      'Behavioral Health': 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
      'Referrals': 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
      'Social Services': 'bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300'
    };
    return colors[service as keyof typeof colors] || 'bg-secondary-100 text-secondary-800';
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Cover Kids':
        return <UsersIcon className="w-4 h-4" />;
      case 'Behavioral Health':
        return <HeartIcon className="w-4 h-4" />;
      case 'Referrals':
        return <UserGroupIcon className="w-4 h-4" />;
      case 'Social Services':
        return <CogIcon className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  const PatientCard: React.FC<{ patient: CoverKidsPatient; type: 'active' | 'upcoming' | 'closed' }> = ({ patient, type }) => (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <img
          src={patient.photoUrl}
          alt={patient.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {patient.name}
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Phone: {patient.phone}
          </p>
          
          {/* Service Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {patient.activeServices.map((service) => (
              <span
                key={service}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceBadge(service)}`}
              >
                {getServiceIcon(service)}
                <span className="ml-1">{service}</span>
              </span>
            ))}
          </div>

          {/* Date Information */}
          <div className="mt-4 text-sm">
            {type === 'active' && (
              <p className="text-secondary-600 dark:text-secondary-400">
                Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            )}
            {type === 'upcoming' && patient.upcomingVisit && (
              <p className="text-primary-600 dark:text-primary-400 font-medium">
                Upcoming: {new Date(patient.upcomingVisit).toLocaleDateString()}
              </p>
            )}
            {type === 'closed' && patient.terminationDate && (
              <p className="text-success-600 dark:text-success-400 font-medium">
                Completed: {new Date(patient.terminationDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-secondary-600 dark:text-secondary-400">Progress</span>
              <span className="text-secondary-900 dark:text-white font-medium">{patient.progress}%</span>
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  patient.progress === 100 
                    ? 'bg-success-500' 
                    : patient.progress >= 75 
                    ? 'bg-primary-500' 
                    : patient.progress >= 50 
                    ? 'bg-warning-500' 
                    : 'bg-danger-500'
                }`}
                style={{ width: `${patient.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Cover Kids Dashboard
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Health navigation and support services for children
          </p>
        </div>

        {/* Quick Access Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Quick Access
            </button>
            {/* Dropdown would be implemented here */}
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20">
              <UsersIcon className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Active Patients
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {activePatients.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100 dark:bg-warning-900/20">
              <ClockIcon className="w-6 h-6 text-warning-700 dark:text-warning-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Upcoming Visits
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {upcomingPatients.length}
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
                Completed Cases
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {closedPatients.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'active', label: 'Active Patients', count: activePatients.length },
            { id: 'upcoming', label: 'Upcoming Patients', count: upcomingPatients.length },
            { id: 'closed', label: 'Closed Patients', count: closedPatients.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'active' && activePatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} type="active" />
        ))}
        {activeTab === 'upcoming' && upcomingPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} type="upcoming" />
        ))}
        {activeTab === 'closed' && closedPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} type="closed" />
        ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'active' && activePatients.length === 0) ||
        (activeTab === 'upcoming' && upcomingPatients.length === 0) ||
        (activeTab === 'closed' && closedPatients.length === 0)) && (
        <div className="text-center py-12">
          <UsersIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            No {activeTab} patients
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {activeTab === 'active' && 'No active patients in the system.'}
            {activeTab === 'upcoming' && 'No upcoming appointments scheduled.'}
            {activeTab === 'closed' && 'No completed cases to display.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverKidsDashboard;