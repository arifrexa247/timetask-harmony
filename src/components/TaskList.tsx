
import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const TaskList = () => {
  const { 
    filteredTasks, 
    tasks,
    addTask, 
    updateTask, 
    activeFilter, 
    setActiveFilter 
  } = useTaskContext();
  
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  
  // Get recurring tasks for today's view
  const getTodayRecurringTasks = () => {
    // Find recurring tasks that are for today
    return tasks.filter(task => {
      // Include all recurring tasks in today's view 
      if (task.recurring && task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }
      return false;
    });
  };
  
  // Combine filtered tasks with recurring tasks when in today view
  const displayTasks = () => {
    if (activeFilter === 'today') {
      // For Today view, add recurring tasks that should be shown today
      const recurringToday = getTodayRecurringTasks();
      
      // Create a map of filtered task IDs for quick lookup
      const filteredTaskIds = new Set(filteredTasks.map(task => task.id));
      
      // Add recurring tasks that aren't already in filtered tasks
      const additionalRecurring = recurringToday.filter(task => !filteredTaskIds.has(task.id));
      
      return [...filteredTasks, ...additionalRecurring];
    }
    
    return filteredTasks;
  };
  
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setAddTaskOpen(false);
  };
  
  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (currentTask) {
      updateTask(currentTask.id, taskData);
      setEditTaskOpen(false);
    }
  };
  
  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setEditTaskOpen(true);
  };
  
  const getNoTasksMessage = () => {
    switch (activeFilter) {
      case 'today':
        return 'No tasks scheduled for today. Enjoy your day!';
      case 'upcoming':
        return 'No upcoming tasks. Your schedule is clear!';
      default:
        return 'No tasks found. Add a task to get started!';
    }
  };

  const tasksToDisplay = displayTasks();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <Button onClick={() => setAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <Tabs 
        defaultValue={activeFilter} 
        onValueChange={(value) => setActiveFilter(value as 'today' | 'upcoming' | 'all')}
        className="w-full"
      >
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="h-5 w-5 text-muted-foreground" />
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="today" className="mt-0">
          <TasksTabContent 
            tasks={tasksToDisplay} 
            onEditTask={openEditModal} 
            emptyMessage="No tasks for today. Enjoy your day!"
          />
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          <TasksTabContent 
            tasks={tasksToDisplay} 
            onEditTask={openEditModal} 
            emptyMessage="No upcoming tasks. Your schedule is clear!"
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <TasksTabContent 
            tasks={tasksToDisplay} 
            onEditTask={openEditModal} 
            emptyMessage="No tasks found. Add a task to get started!"
          />
        </TabsContent>
      </Tabs>
      
      <TaskForm
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        onSubmit={handleAddTask}
        mode="add"
      />
      
      <TaskForm
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        onSubmit={handleEditTask}
        initialData={currentTask}
        mode="edit"
      />
    </>
  );
};

interface TasksTabContentProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  emptyMessage: string;
}

const TasksTabContent = ({ tasks, onEditTask, emptyMessage }: TasksTabContentProps) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  );
};

export default TaskList;
