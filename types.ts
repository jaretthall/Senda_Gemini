import type { ReactNode } from 'react';

export interface User {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  language: string;
  mrn: string;
  recentScreenerScores: { name: string; score: number; date: string }[];
  isCritical: boolean;
  profileIconUrl?: string; // Icon depicting situation
  photoUrl?: string;
}

export interface SummaryData {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColorClass: string;
  textColorClass: string;
}

export interface TaskData {
  name: string;
  value: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'pie' | 'bar' | 'line' | 'radar' | 'gantt' | 'heatmap' | 'nps' | 'funnel' | 'progress' | 'box';
  data: any[]; // This should be more specific based on chart type
}

export interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
  isFavorite?: boolean; // For favorited views
  children?: NavItem[]; // For dropdowns
}