
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

export interface Counter {
  id: string;
  name: string;
  count: number;
  createdAt: Date;
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
