import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Task, UserPreferences } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { addDays, addWeeks, addMonths, isBefore, startOfDay, isEqual, addHours, addYears, addMinutes } from 'date-fns';

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
  getRecurringTasksReport: () => { missedTasks: Task[], completionRate: number };
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
      const todayStart = startOfDay(new Date());
      const taskDateStart = startOfDay(new Date(task.dueDate));
      return taskDateStart.getTime() === todayStart.getTime();
    } else if (activeFilter === 'upcoming') {
      if (!task.dueDate) return true; // Tasks with no due date are considered upcoming
      const todayStart = startOfDay(new Date());
      const taskDateStart = startOfDay(new Date(task.dueDate));
      return taskDateStart.getTime() > todayStart.getTime();
    }

    return true; // 'all' filter shows all tasks
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Check for recurring tasks that need to be reset
  const checkRecurringTasks = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    let updatedTasks = [...tasks];
    let tasksUpdated = false;

    // Check each recurring task
    updatedTasks.forEach((task, index) => {
      if (task.isRecurring && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const taskTime = task.dueTime ? task.dueTime.split(':').map(Number) : [0, 0];
        taskDate.setHours(taskTime[0], taskTime[1], 0, 0);

        let shouldReset = false;
        let nextDueDate: Date | undefined;

        // Record completion history for completed tasks
        if (task.completed && !task.lastCompleted) {
          const completionHistory = task.completionHistory || [];
          completionHistory.push({
            date: now.toISOString(),
            completed: true,
          });

          updatedTasks[index] = {
            ...task,
            lastCompleted: now.toISOString(),
            completionHistory: completionHistory
          };
          tasksUpdated = true;
        }

        // Calculate next due date based on recurring type and interval
        if (task.completed || isBefore(taskDate, now)) {
          const interval = task.recurringInterval || 1;

          switch (task.recurringType) {
            case 'hourly':
              nextDueDate = addHours(taskDate, interval);
              break;
            case 'daily':
              nextDueDate = addDays(taskDate, interval);
              break;
            case 'weekly':
              nextDueDate = addWeeks(taskDate, interval);
              break;
            case 'monthly':
              nextDueDate = addMonths(taskDate, interval);
              break;
            case 'yearly':
              nextDueDate = addYears(taskDate, interval);
              break;
            // Ensure 'custom' with recurringIntervalUnit is handled
            case 'custom':
              switch (task.recurringIntervalUnit) {
                case 'minute':
                  nextDueDate = addMinutes(taskDate, interval);
                  break;
                case 'hour':
                  nextDueDate = addHours(taskDate, interval);
                  break;
                case 'day':
                  nextDueDate = addDays(taskDate, interval);
                  break;
                case 'week':
                  nextDueDate = addWeeks(taskDate, interval);
                  break;
                case 'month':
                  nextDueDate = addMonths(taskDate, interval);
                  break;
                case 'year':
                  nextDueDate = addYears(taskDate, interval);
                  break;
                default: // Default for custom if unit is not set, though UI should prevent this
                  nextDueDate = addDays(taskDate, interval);
              }
              break;
            default:
              nextDueDate = addDays(taskDate, 1);
          }

          shouldReset = task.completed || isBefore(taskDate, now);
        }

        if (shouldReset && nextDueDate) {
          // If the next due date is in the past, keep advancing until it's today or in the future
          while (isBefore(nextDueDate, now)) {
            const interval = task.recurringInterval || 1;

            switch (task.recurringType) {
              case 'hourly':
                nextDueDate = addHours(nextDueDate, interval);
                break;
              case 'daily':
                nextDueDate = addDays(nextDueDate, interval);
                break;
              case 'weekly':
                nextDueDate = addWeeks(nextDueDate, interval);
                break;
              case 'monthly':
                nextDueDate = addMonths(nextDueDate, interval);
                break;
              case 'yearly':
                nextDueDate = addYears(nextDueDate, interval);
                break;
              case 'custom':
                switch (task.recurringIntervalUnit) {
                  case 'minute':
                    nextDueDate = addMinutes(nextDueDate, interval);
                    break;
                  case 'hour':
                    nextDueDate = addHours(nextDueDate, interval);
                    break;
                  case 'day':
                    nextDueDate = addDays(nextDueDate, interval);
                    break;
                  case 'week':
                    nextDueDate = addWeeks(nextDueDate, interval);
                    break;
                  case 'month':
                    nextDueDate = addMonths(nextDueDate, interval);
                    break;
                  case 'year':
                    nextDueDate = addYears(nextDueDate, interval);
                    break;
                  default:
                    nextDueDate = addDays(nextDueDate, interval);
                }
                break;
              default:
                nextDueDate = addDays(nextDueDate, 1);
            }
          }
          // Reset the task for the next occurrence
          updatedTasks[index] = {
            ...task,
            completed: false,
            dueDate: nextDueDate,
            missedCount: 0, // Reset missedCount when task resets
          };

          tasksUpdated = true;
        }
      }
    });

    // Check for missed recurring tasks
    updatedTasks.forEach((task, index) => {
      if (task.isRecurring && !task.completed && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // If the due date was yesterday and task wasn't completed
        if (isEqual(taskDate, yesterday)) {
          updatedTasks[index] = {
            ...task,
            missedCount: (task.missedCount || 0) + 1,
          };
          tasksUpdated = true;
        }
      }
    });

    if (tasksUpdated) {
      setTasks(updatedTasks);
    }
  };

  // Effect for immediate check of recurring tasks when tasks change
  useEffect(() => {
    checkRecurringTasks();
  }, [tasks]);

  // Effect for daily scheduled checks of recurring tasks (runs once on mount)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeToMidnight = tomorrow.getTime() - now.getTime();
    let dailyIntervalId: NodeJS.Timeout | undefined;

    const midnightTimeoutId = setTimeout(() => {
      checkRecurringTasks(); // First check at midnight
      // Then set interval for subsequent days
      dailyIntervalId = setInterval(checkRecurringTasks, 24 * 60 * 60 * 1000);
    }, timeToMidnight);

    return () => {
      clearTimeout(midnightTimeoutId);
      if (dailyIntervalId) {
        clearInterval(dailyIntervalId);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Request notification permission on startup if enabled
  useEffect(() => {
    if (preferences.enableNotifications) {
      requestNotificationPermission();
    }
  }, [preferences.enableNotifications]);

  // Function to request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast({
            title: "Notifications enabled",
            description: "You'll receive alerts for your tasks",
          });
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

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

        // Check if the task is due today
        if (taskDate.getTime() === today.getTime()) {
          const [hours, minutes] = task.dueTime.split(':').map(Number);
          const taskTime = hours * 60 + minutes;

          // If the current time is within 1 minute of the task time
          if (Math.abs(currentTime - taskTime) <= 1) {
            triggerAlarm(task);
          }
        }
      }
    });
  };

  // Separate function to trigger alarms
  const triggerAlarm = (task: Task) => {
    // Show browser notification
    if (Notification.permission === 'granted') {
      const notification = new Notification('Task Reminder', {
        body: `It's time for: ${task.title}`,
        icon: '/favicon.ico'
      });

      // Play sound when notification shows
      const audio = new Audio('/alarm.mp3'); // Path relative to the public directory
      audio.play().catch(e => console.error("Error playing sound:", e));

      // Add click event to focus window when notification is clicked
      notification.onclick = function () {
        window.focus();
        notification.close();
      };
    }

    // Also show a toast notification
    toast({
      title: "⏰ Task Reminder",
      description: `It's time for: ${task.title}`,
      duration: 10000,
    });
  };

  // Get report on recurring tasks
  const getRecurringTasksReport = () => {
    // Filter recurring tasks
    const recurringTasks = tasks.filter(task => task.isRecurring);

    // Find missed recurring tasks
    const missedTasks = recurringTasks.filter(task =>
      (task.missedCount || 0) > 0
    );

    // Calculate completion rate
    const completionRate = recurringTasks.length > 0
      ? Math.round(((recurringTasks.length - missedTasks.length) / recurringTasks.length) * 100)
      : 100;

    return { missedTasks, completionRate };
  };

  // For immediate alarm checks when tasks or notification preferences change
  useEffect(() => {
    if (preferences.enableNotifications) {
      checkAlarms();
    }
  }, [tasks, preferences.enableNotifications]);

  // For the 1-minute interval timer for alarms
  useEffect(() => {
    if (!preferences.enableNotifications) {
      return; // No interval if notifications are off
    }
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
        getRecurringTasksReport,
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