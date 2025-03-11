
import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash, Clock, AlarmClock, Edit, ChevronDown, ChevronUp, Repeat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onEdit }: TaskItemProps) => {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  const getFrequencyText = (frequency?: 'daily' | 'weekly' | 'monthly') => {
    switch (frequency) {
      case 'daily': return 'Repeats daily';
      case 'weekly': return 'Repeats weekly';
      case 'monthly': return 'Repeats monthly';
      default: return '';
    }
  };

  return (
    <Card 
      className={cn(
        "mb-3 border-l-4 transition-all duration-200",
        task.completed 
          ? "border-l-todo-success bg-muted/30" 
          : task.alarmSet 
            ? "border-l-todo-warning" 
            : task.recurring
              ? "border-l-green-600"
              : "border-l-todo-primary"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={cn(
              "mt-1",
              task.completed && "bg-todo-success border-todo-success"
            )}
          />
          
          <div className="flex-1">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 
                    className={cn(
                      "font-medium text-lg truncate",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </h3>
                  
                  {task.recurring && (
                    <Badge variant="outline" className="gap-1 flex items-center text-green-600 border-green-600">
                      <Repeat className="h-3 w-3" />
                      {task.frequency}
                    </Badge>
                  )}
                  
                  {task.missedCount && task.missedCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      Missed: {task.missedCount}
                    </Badge>
                  )}
                </div>
                
                {(task.dueDate || task.dueTime) && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {task.dueDate && format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    {task.dueTime && ` at ${formatTime(task.dueTime)}`}
                    
                    {task.alarmSet && (
                      <AlarmClock className="h-3.5 w-3.5 ml-2 text-todo-warning" />
                    )}
                  </div>
                )}
                
                {task.recurring && (
                  <div className="flex items-center text-sm text-green-600 gap-1 mt-1">
                    <Repeat className="h-3.5 w-3.5" />
                    {getFrequencyText(task.frequency)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {expanded && (
              <div className="mt-3">
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                )}
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEdit}
                    className="h-8"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDelete}
                    className="h-8"
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
