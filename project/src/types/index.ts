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
  profileIconUrl?: string;
  photoUrl?: string;
}

export interface SummaryData {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColorClass: string;
  textColorClass: string;
  change?: string;
}

export interface TaskData {
  name: string;
  value: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'pie' | 'bar' | 'line' | 'radar' | 'gantt' | 'heatmap' | 'nps' | 'funnel' | 'progress' | 'box';
  data: any[];
}

export interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
  isFavorite?: boolean;
  children?: NavItem[];
}