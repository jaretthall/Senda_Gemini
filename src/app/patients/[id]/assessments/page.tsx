'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import AssessmentHistory from '@/components/assessments/AssessmentHistory';

export default function PatientAssessmentsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [selectedType, setSelectedType] = useState<'all' | 'phq9' | 'gad7'>('all');

  const assessmentTypes = [
    { value: 'all', label: 'All Assessments' },
    { value: 'phq9', label: 'PHQ-9 (Depression)' },
    { value: 'gad7', label: 'GAD-7 (Anxiety)' }
  ];

  return (
    <div className="min-h-screen bg-secondary-100 dark:bg-secondary-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Patient Assessments
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                View and manage clinical assessments for this patient
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/patients/${patientId}/assessments/new?type=phq9`}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New PHQ-9
              </Link>
              
              <Link
                href={`/patients/${patientId}/assessments/new?type=gad7`}
                className="inline-flex items-center px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New GAD-7
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 border-b border-secondary-200 dark:border-secondary-700">
            <nav className="-mb-px flex space-x-8">
              {assessmentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as any)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${selectedType === type.value
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Assessment History */}
        <AssessmentHistory 
          patientId={patientId} 
          assessmentType={selectedType}
        />
      </div>
    </div>
  );
}