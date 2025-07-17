'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import AssessmentForm from '@/components/assessments/AssessmentForm';

export default function NewAssessmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = params.id as string;
  const assessmentType = searchParams.get('type') as 'phq9' | 'gad7' || 'phq9';

  return (
    <div className="min-h-screen bg-secondary-100 dark:bg-secondary-900">
      <AssessmentForm 
        patientId={patientId} 
        assessmentType={assessmentType}
      />
    </div>
  );
}