'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EpisodeFormProps {
  patientId: string;
  onComplete?: (episode: any) => void;
}

const EpisodeForm: React.FC<EpisodeFormProps> = ({ patientId, onComplete }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    episode_type: 'initial',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    diagnosis_codes: [] as string[],
    treatment_goals: [] as string[],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const episodeTypes = [
    { value: 'initial', label: 'Initial Assessment' },
    { value: 'continuing', label: 'Continuing Care' },
    { value: 'crisis', label: 'Crisis Intervention' },
    { value: 'followup', label: 'Follow-up' }
  ];

  const commonDiagnosisCodes = [
    'F41.9 - Anxiety disorder, unspecified',
    'F32.9 - Major depressive disorder, single episode, unspecified',
    'F33.9 - Major depressive disorder, recurrent, unspecified',
    'F43.10 - Post-traumatic stress disorder, unspecified',
    'F43.20 - Adjustment disorders, unspecified',
    'F90.9 - Attention-deficit hyperactivity disorder, unspecified type',
    'F84.0 - Autistic disorder'
  ];

  const commonTreatmentGoals = [
    'Reduce symptoms of depression',
    'Improve coping strategies',
    'Enhance social functioning',
    'Develop emotional regulation skills',
    'Improve sleep patterns',
    'Reduce anxiety symptoms',
    'Increase medication compliance',
    'Strengthen support system'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiagnosisChange = (diagnosis: string) => {
    setFormData(prev => ({
      ...prev,
      diagnosis_codes: prev.diagnosis_codes.includes(diagnosis)
        ? prev.diagnosis_codes.filter(d => d !== diagnosis)
        : [...prev.diagnosis_codes, diagnosis]
    }));
  };

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      treatment_goals: prev.treatment_goals.includes(goal)
        ? prev.treatment_goals.filter(g => g !== goal)
        : [...prev.treatment_goals, goal]
    }));
  };

  const addCustomGoal = (customGoal: string) => {
    if (customGoal.trim() && !formData.treatment_goals.includes(customGoal.trim())) {
      setFormData(prev => ({
        ...prev,
        treatment_goals: [...prev.treatment_goals, customGoal.trim()]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          patient_id: patientId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create episode');
      }

      const data = await response.json();
      
      if (onComplete) {
        onComplete(data.episode);
      } else {
        router.push(`/patients/${patientId}/episodes`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Create New Episode
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Start a new treatment episode for this patient.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Episode Type and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="episode_type" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Episode Type *
              </label>
              <select
                id="episode_type"
                name="episode_type"
                value={formData.episode_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {episodeTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                min={formData.start_date}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Diagnosis Codes */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              Diagnosis Codes
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonDiagnosisCodes.map(diagnosis => (
                <label
                  key={diagnosis}
                  className={`
                    flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200
                    ${formData.diagnosis_codes.includes(diagnosis)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-300'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.diagnosis_codes.includes(diagnosis)}
                    onChange={() => handleDiagnosisChange(diagnosis)}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 rounded border-2 mr-3 flex items-center justify-center
                    ${formData.diagnosis_codes.includes(diagnosis)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-secondary-400'
                    }
                  `}>
                    {formData.diagnosis_codes.includes(diagnosis) && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-secondary-900 dark:text-white">
                    {diagnosis}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Treatment Goals */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              Treatment Goals
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {commonTreatmentGoals.map(goal => (
                <label
                  key={goal}
                  className={`
                    flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200
                    ${formData.treatment_goals.includes(goal)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-300'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.treatment_goals.includes(goal)}
                    onChange={() => handleGoalChange(goal)}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 rounded border-2 mr-3 flex items-center justify-center
                    ${formData.treatment_goals.includes(goal)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-secondary-400'
                    }
                  `}>
                    {formData.treatment_goals.includes(goal) && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-secondary-900 dark:text-white">
                    {goal}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Goal Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom treatment goal..."
                className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomGoal((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                  addCustomGoal(input.value);
                  input.value = '';
                }}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>

            {/* Selected Goals Display */}
            {formData.treatment_goals.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Selected Goals ({formData.treatment_goals.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.treatment_goals.map(goal => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => handleGoalChange(goal)}
                        className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Initial Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter any initial notes or observations..."
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {error && (
            <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating...' : 'Create Episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpisodeForm;