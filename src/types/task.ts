
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  alarmSet: boolean;
  createdAt: Date;
  category?: string;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
  missedCount?: number;
}

export interface UserPreferences {
  defaultView: 'today' | 'upcoming' | 'all';
  showCompletedTasks: boolean;
  enableNotifications: boolean;
  nightMode: boolean;
}
