import { User } from '@/types';

export const APP_NAME = "Senda";

export const FOOTER_LINKS = {
  contactInfo: "Contact Us: (123) 456-7890",
  privacyPolicyUrl: "/privacy-policy",
  termsOfServiceUrl: "/terms-of-service",
};

// Mock data for charts
export const MOCK_TASK_DATA = [
  { name: 'Completed', value: 60, color: '#22c55e' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Not Started', value: 15, color: '#ef4444' },
];

export const MOCK_PATIENT_DEMOGRAPHICS_PIE = [
    { name: 'Adults (25-64)', value: 400 },
    { name: 'Seniors (65+)', value: 300 },
    { name: 'Young Adults (18-24)', value: 200 },
    { name: 'Adolescents (13-17)', value: 100 },
];

export const MOCK_MENTAL_HEALTH_DISTRIBUTION = [
    { name: 'Anxiety Disorders', value: 270 },
    { name: 'Depressive Disorders', value: 180 },
    { name: 'PTSD', value: 90 },
    { name: 'Other', value: 120 },
];

export const MOCK_CRISIS_EVENTS_LINE = [
  { name: 'Jan', events: 4 }, { name: 'Feb', events: 3 }, { name: 'Mar', events: 5 },
  { name: 'Apr', events: 2 }, { name: 'May', events: 6 }, { name: 'Jun', events: 3 },
];

export const MOCK_USER: User = {
  name: "Dr. Eleanor Vance",
  role: "Admin",
  avatarUrl: "https://picsum.photos/seed/user1/100/100"
};

export const MOCK_PATIENT_SEARCH_RESULTS = [
    { id: 'p1', name: 'Johnathan Doe', mrn: 'MRN001' },
    { id: 'p2', name: 'Jane Doe Smith', mrn: 'MRN002' },
    { id: 'p3', name: 'Robert Johnson', mrn: 'MRN003' },
];

export const MOCK_STICKY_NOTES = [
  { id: 'note1', text: 'Follow up with Dr. Smith re: patient X.', color: 'bg-yellow-200 dark:bg-yellow-700/80' },
  { id: 'note2', text: 'Prepare report for weekly meeting.', color: 'bg-blue-200 dark:bg-blue-700/80' },
  { id: 'note3', text: 'Review new patient intake forms.', color: 'bg-green-200 dark:bg-green-700/80' },
];