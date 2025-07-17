'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import EpisodeForm from '@/components/episodes/EpisodeForm';

export default function NewEpisodePage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <div className="min-h-screen bg-secondary-100 dark:bg-secondary-900">
      <EpisodeForm patientId={patientId} />
    </div>
  );
}