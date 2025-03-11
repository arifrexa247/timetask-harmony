export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurringFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  dueTime?: string;
  isRecurring: boolean;
  recurringType?: RecurringFrequency;
  recurringInterval?: number;
  recurringIntervalUnit?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  lastCompleted?: string;
  completionHistory?: {
    date: string;
    completed: boolean;
  }[];
  missedCount?: number;
}

export interface UserPreferences {
  defaultView: 'today' | 'upcoming' | 'all';
  showCompletedTasks: boolean;
  enableNotifications: boolean;
  nightMode: boolean;
}

export interface Counter {
  id: string;
  name: string;
  count: number;
  createdAt: Date;
  history?: { date: string; count: number }[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  sections: NoteSection[];
  createdAt: Date;
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
}