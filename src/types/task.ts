export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurringType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type FrequencyUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

export interface CompletionRecord {
  date: string; // ISO string
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  dueDate?: string;  // YYYY-MM-DD
  dueTime?: string;  // HH:MM
  priority: TaskPriority;
  tags?: string[];

  // Recurring task properties
  isRecurring: boolean;
  recurringType?: RecurringType;
  recurringInterval?: number; // e.g., every 2 weeks
  recurringDays?: number[]; // 0-6 for specific days of week
  recurringDate?: number; // specific date of month (1-31)
  recurringMonths?: number[]; // 0-11 for specific months
  recurringEndDate?: string; // ISO string for end of recurring
  recurringFrequencyValue?: number; // the number value for custom frequency
  recurringFrequencyUnit?: FrequencyUnit; // the unit for custom frequency

  // Tracking and reporting
  lastCompleted?: string; // ISO string
  completionHistory?: CompletionRecord[];
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