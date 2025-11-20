
export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'file' | 'drawing';
  mimeType: string;
  data: string; // Base64 string
  fileName?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  folderId?: string;
  isDeleted?: boolean;
  isPinned?: boolean;
  isLocked?: boolean; // App lock feature
  attachments?: Attachment[];
  collaborators?: string[]; // Emails of people shared with
}

export interface Task {
  id: string;
  content: string;
  isCompleted: boolean;
  dueDate?: number;
  priority?: 'high' | 'medium' | 'low'; // Eisenhower matrix
  sourceNoteId?: string;
}

export type SubscriptionTier = 'FREE' | 'PREMIUM';

export interface User {
  username: string;
  email?: string;
  isAuthenticated: boolean;
  biometricEnabled?: boolean;
  subscriptionTier: SubscriptionTier;
  profileImage?: string;
}

export interface TocItem {
  topic: string;
  description: string;
  noteIds: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  QUIZ = 'QUIZ',
  STUDY = 'STUDY',
  MINDMAP = 'MINDMAP',
  FOCUS = 'FOCUS',
  SMART_VIEW = 'SMART_VIEW', // Table of Contents view
  RECYCLE_BIN = 'RECYCLE_BIN',
  USERS = 'USERS',
  SETTINGS = 'SETTINGS',
  CHAT = 'CHAT',
  ADMIN = 'ADMIN',
  MEETING = 'MEETING'
}

export type Theme = 'light' | 'dark' | 'amoled' | 'system';

// AI Specific Types
export enum RewriteMode {
  FORMAL = 'Formal',
  FRIENDLY = 'Friendly',
  ACADEMIC = 'Academic',
  PROFESSIONAL = 'Professional',
  SEO = 'SEO Optimized',
  CONCISE = 'Concise',
  EXPANDED = 'Expanded'
}

export enum SummaryType {
  ONE_SENTENCE = '1-Sentence',
  SHORT = 'Short Paragraph',
  DETAILED = 'Detailed',
  ACTION_POINTS = 'Action Points'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}
