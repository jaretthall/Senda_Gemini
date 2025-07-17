'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

interface AssessmentFormProps {
  patientId: string;
  assessmentType: 'phq9' | 'gad7' | 'edinburgh';
  onComplete?: (score: number) => void;
}

const PHQ9_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Little interest or pleasure in doing things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q2',
    text: 'Feeling down, depressed, or hopeless',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q3',
    text: 'Trouble falling or staying asleep, or sleeping too much',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q4',
    text: 'Feeling tired or having little energy',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q5',
    text: 'Poor appetite or overeating',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q6',
    text: 'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q7',
    text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q8',
    text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q9',
    text: 'Thoughts that you would be better off dead, or of hurting yourself',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const GAD7_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Feeling nervous, anxious, or on edge',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q2',
    text: 'Not being able to stop or control worrying',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q3',
    text: 'Worrying too much about different things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q4',
    text: 'Trouble relaxing',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q5',
    text: 'Being so restless that it is hard to sit still',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q6',
    text: 'Becoming easily annoyed or irritable',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'q7',
    text: 'Feeling afraid, as if something awful might happen',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  patientId, 
  assessmentType, 
  onComplete 
}) => {
  const router = useRouter();
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = assessmentType === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const maxScore = assessmentType === 'phq9' ? 27 : 21;
  const assessmentTitle = assessmentType === 'phq9' ? 'PHQ-9 Depression Screening' : 'GAD-7 Anxiety Screening';

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, value) => sum + value, 0);
  };

  const getInterpretation = (score: number) => {
    if (assessmentType === 'phq9') {
      if (score <= 4) return 'Minimal depression';
      if (score <= 9) return 'Mild depression';
      if (score <= 14) return 'Moderate depression';
      if (score <= 19) return 'Moderately severe depression';
      return 'Severe depression';
    } else {
      if (score <= 4) return 'Minimal anxiety';
      if (score <= 9) return 'Mild anxiety';
      if (score <= 14) return 'Moderate anxiety';
      return 'Severe anxiety';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(responses).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const score = calculateScore();
      const interpretation = getInterpretation(score);

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          assessment_type: assessmentType,
          score,
          max_score: maxScore,
          responses,
          interpretation,
          administered_date: new Date().toISOString().split('T')[0]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment');
      }

      if (onComplete) {
        onComplete(score);
      } else {
        router.push(`/patients/${patientId}/assessments`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentScore = calculateScore();
  const isComplete = Object.keys(responses).length === questions.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {assessmentTitle}
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
              <span>Progress: {Object.keys(responses).length} of {questions.length}</span>
              {isComplete && (
                <span className="font-medium">
                  Score: {currentScore}/{maxScore} - {getInterpretation(currentScore)}
                </span>
              )}
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(responses).length / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                  {index + 1}. {question.text}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200
                        ${responses[question.id] === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                        className="sr-only"
                      />
                      <div className={`
                        w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                        ${responses[question.id] === option.value
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-secondary-400'
                        }
                      `}>
                        {responses[question.id] === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                          {option.value} points
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!isComplete || loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Saving...' : 'Complete Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;