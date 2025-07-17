import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface DashboardStats {
  totalPatients: number;
  crisisPatients: number;
  todayAppointments: number;
  avgPhq9Score: string;
  treatmentResponse: string;
  avgEpisodeLength: string;
}

interface CrisisEvent {
  id: string;
  patient: {
    first_name: string;
    last_name: string;
    mrn: string;
  };
  severity: string;
  event_type: string;
  occurred_at: string;
  status: string;
}

export function useDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [crisisEvents, setCrisisEvents] = useState<CrisisEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats');
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Fetch crisis events
      const crisisResponse = await fetch('/api/crisis-events');
      if (!crisisResponse.ok) {
        throw new Error('Failed to fetch crisis events');
      }
      const crisisData = await crisisResponse.json();
      setCrisisEvents(crisisData.crisisEvents || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    crisisEvents,
    loading,
    error,
    refetch: fetchDashboardData
  };
}