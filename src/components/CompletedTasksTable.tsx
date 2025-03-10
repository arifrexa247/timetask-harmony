
import { useTaskContext } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash, RotateCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CompletedTasksTable = () => {
  const { tasks, toggleTaskCompletion, deleteTask } = useTaskContext();
  
  // Filter completed tasks
  const completedTasks = tasks.filter(task => task.completed);
  
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  if (completedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
        <p className="text-muted-foreground">No completed tasks yet. Once you complete tasks, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Due Time</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
                <TableCell>
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '-'}
                </TableCell>
                <TableCell>{task.dueTime ? formatTime(task.dueTime) : '-'}</TableCell>
                <TableCell>{format(new Date(task.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                      title="Mark as Uncompleted"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      title="Delete Task"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompletedTasksTable;
