
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Task, UserPreferences } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilter: 'today' | 'upcoming' | 'all';
  preferences: UserPreferences;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setActiveFilter: (filter: 'today' | 'upcoming' | 'all') => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  defaultView: 'today',
  showCompletedTasks: true,
  enableNotifications: true,
  nightMode: false,
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks 
      ? JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
        })) 
      : [];
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });
  
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'all'>(
    preferences.defaultView
  );

  // Calculate filtered tasks based on active filter
  const filteredTasks = tasks.filter(task => {
    if (!preferences.showCompletedTasks && task.completed) {
      return false;
    }

    if (activeFilter === 'today') {
      if (!task.dueDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    } else if (activeFilter === 'upcoming') {
      if (!task.dueDate) return true; // Tasks with no due date are considered upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime();
    }
    
    return true; // 'all' filter shows all tasks
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    checkAlarms();
  }, [tasks]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Check for alarms that need to be triggered
  const checkAlarms = () => {
    if (!preferences.enableNotifications) return;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    tasks.forEach(task => {
      if (task.alarmSet && task.dueDate && task.dueTime && !task.completed) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (taskDate.getTime() === today.getTime()) {
          const [hours, minutes] = task.dueTime.split(':').map(Number);
          const taskTime = hours * 60 + minutes;
          
          // If the current time is within 1 minute of the task time
          if (Math.abs(currentTime - taskTime) <= 1) {
            // Trigger notification
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: `It's time for: ${task.title}`,
                icon: '/favicon.ico'
              });
            }
            
            // Also show a toast notification
            toast({
              title: "⏰ Task Reminder",
              description: `It's time for: ${task.title}`,
              duration: 5000,
            });
          }
        }
      }
    });
  };

  // Request notification permission
  useEffect(() => {
    if (preferences.enableNotifications && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Set up a timer to check alarms every minute
    const alarmInterval = setInterval(checkAlarms, 60000);
    return () => clearInterval(alarmInterval);
  }, [preferences.enableNotifications]);

  // Context methods
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task added",
      description: `"${taskData.title}" has been added to your tasks.`,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;
    
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been removed.`,
      variant: "destructive",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      toast({
        title: newStatus ? "Task completed" : "Task reopened",
        description: `"${task.title}" is ${newStatus ? 'now marked as done' : 'back on your list'}.`,
        variant: newStatus ? "default" : "default", // Changed from "secondary" to "default"
      });
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    
    // If default view is updated, also update active filter
    if (updates.defaultView) {
      setActiveFilter(updates.defaultView);
    }
    
    toast({
      title: "Preferences updated",
      description: "Your changes have been saved.",
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        activeFilter,
        preferences,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        setActiveFilter,
        updatePreferences,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
