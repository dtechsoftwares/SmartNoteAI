export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isDeleted?: boolean;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface TocItem {
  topic: string;
  description: string;
  noteIds: string[]; // IDs of notes that belong to this topic
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  QUIZ = 'QUIZ',
  SMART_VIEW = 'SMART_VIEW', // Table of Contents view
  RECYCLE_BIN = 'RECYCLE_BIN',
  USERS = 'USERS',
  SETTINGS = 'SETTINGS'
}

export interface SmartAnalysisResult {
  toc: TocItem[];
  summary: string;
}