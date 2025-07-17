'use client';

import React, { useState, useEffect } from 'react';
import { ChartBarIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Assessment {
  id: string;
  assessment_type: string;
  score: number;
  max_score: number;
  interpretation: string;
  administered_date: string;
  provider: {
    full_name: string;
  };
}

interface AssessmentHistoryProps {
  patientId: string;
  assessmentType?: 'phq9' | 'gad7' | 'all';
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ 
  patientId, 
  assessmentType = 'all' 
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessments();
  }, [patientId, assessmentType]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const url = assessmentType === 'all' 
        ? `/api/assessments/patient/${patientId}`
        : `/api/assessments/patient/${patientId}?type=${assessmentType}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      
      const data = await response.json();
      setAssessments(data.assessments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, maxScore: number, type: string) => {
    const percentage = (score / maxScore) * 100;
    
    if (type === 'phq9') {
      if (percentage <= 14.8) return 'text-success-600'; // Minimal (0-4)
      if (percentage <= 33.3) return 'text-warning-600'; // Mild (5-9)
      if (percentage <= 51.9) return 'text-warning-700'; // Moderate (10-14)
      if (percentage <= 70.4) return 'text-danger-600'; // Moderately severe (15-19)
      return 'text-danger-700'; // Severe (20-27)
    } else {
      if (percentage <= 19) return 'text-success-600'; // Minimal (0-4)
      if (percentage <= 42.9) return 'text-warning-600'; // Mild (5-9)
      if (percentage <= 66.7) return 'text-warning-700'; // Moderate (10-14)
      return 'text-danger-600'; // Severe (15-21)
    }
  };

  const getScoreBadge = (score: number, maxScore: number, type: string) => {
    const percentage = (score / maxScore) * 100;
    
    if (type === 'phq9') {
      if (percentage <= 14.8) return { label: 'Minimal', color: 'bg-success-100 text-success-800' };
      if (percentage <= 33.3) return { label: 'Mild', color: 'bg-warning-100 text-warning-800' };
      if (percentage <= 51.9) return { label: 'Moderate', color: 'bg-warning-100 text-warning-800' };
      if (percentage <= 70.4) return { label: 'Mod. Severe', color: 'bg-danger-100 text-danger-800' };
      return { label: 'Severe', color: 'bg-danger-100 text-danger-800' };
    } else {
      if (percentage <= 19) return { label: 'Minimal', color: 'bg-success-100 text-success-800' };
      if (percentage <= 42.9) return { label: 'Mild', color: 'bg-warning-100 text-warning-800' };
      if (percentage <= 66.7) return { label: 'Moderate', color: 'bg-warning-100 text-warning-800' };
      return { label: 'Severe', color: 'bg-danger-100 text-danger-800' };
    }
  };

  const getTrend = (assessments: Assessment[]) => {
    if (assessments.length < 2) return null;
    
    const latest = assessments[0];
    const previous = assessments[1];
    const change = latest.score - previous.score;
    
    if (change > 0) {
      return { direction: 'up', change, icon: TrendingUpIcon, color: 'text-danger-600' };
    } else if (change < 0) {
      return { direction: 'down', change: Math.abs(change), icon: TrendingDownIcon, color: 'text-success-600' };
    }
    return { direction: 'stable', change: 0, icon: null, color: 'text-secondary-600' };
  };

  const prepareChartData = (assessments: Assessment[]) => {
    return assessments
      .slice()
      .reverse()
      .map((assessment, index) => ({
        date: new Date(assessment.administered_date).toLocaleDateString(),
        score: assessment.score,
        percentage: (assessment.score / assessment.max_score) * 100,
        assessment: assessment.assessment_type.toUpperCase()
      }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-secondary-200 dark:bg-secondary-700 h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
        <p className="text-danger-700 dark:text-danger-300">{error}</p>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8">
        <ChartBarIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
          No Assessments Found
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          No assessment history available for this patient.
        </p>
      </div>
    );
  }

  const groupedAssessments = assessments.reduce((acc, assessment) => {
    const type = assessment.assessment_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(assessment);
    return acc;
  }, {} as Record<string, Assessment[]>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedAssessments).map(([type, typeAssessments]) => {
          const latest = typeAssessments[0];
          const trend = getTrend(typeAssessments);
          const badge = getScoreBadge(latest.score, latest.max_score, type);
          
          return (
            <div key={type} className="bg-white dark:bg-secondary-800 p-6 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  {type.toUpperCase()}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-3xl font-bold ${getScoreColor(latest.score, latest.max_score, type)}`}>
                    {latest.score}
                    <span className="text-lg text-secondary-500">/{latest.max_score}</span>
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {new Date(latest.administered_date).toLocaleDateString()}
                  </div>
                </div>
                
                {trend && trend.icon && (
                  <div className={`flex items-center ${trend.color}`}>
                    <trend.icon className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">{trend.change}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-xs text-secondary-500 dark:text-secondary-400">
                {typeAssessments.length} assessment{typeAssessments.length !== 1 ? 's' : ''} total
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {assessments.length > 1 && (
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg border border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Score Trends Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData(assessments)}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value} points`,
                    name === 'score' ? 'Score' : name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Assessment List */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Assessment History
          </h3>
        </div>
        
        <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {assessments.map((assessment) => {
            const badge = getScoreBadge(assessment.score, assessment.max_score, assessment.assessment_type);
            
            return (
              <div key={assessment.id} className="p-6 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-secondary-900 dark:text-white">
                        {assessment.assessment_type.toUpperCase()}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
                      <span>
                        Administered: {new Date(assessment.administered_date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Provider: {assessment.provider.full_name}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.score, assessment.max_score, assessment.assessment_type)}`}>
                      {assessment.score}
                      <span className="text-lg text-secondary-500">/{assessment.max_score}</span>
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {((assessment.score / assessment.max_score) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;