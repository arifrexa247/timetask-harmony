
import { useTaskContext } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash, Check, Bell, BellOff } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UncompletedTasksTable = () => {
  const { tasks, toggleTaskCompletion, deleteTask, updateTask } = useTaskContext();
  
  // Filter uncompleted tasks
  const uncompletedTasks = tasks.filter(task => !task.completed);
  
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  const toggleAlarm = (taskId: string, currentAlarmState: boolean) => {
    updateTask(taskId, { alarmSet: !currentAlarmState });
  };

  if (uncompletedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Uncompleted Tasks</h2>
        <p className="text-muted-foreground">No uncompleted tasks. Your to-do list is clear!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Uncompleted Tasks</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Due Time</TableHead>
              <TableHead>Alarm</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uncompletedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
                <TableCell>
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '-'}
                </TableCell>
                <TableCell>{task.dueTime ? formatTime(task.dueTime) : '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlarm(task.id, task.alarmSet)}
                    className={task.alarmSet ? "text-todo-warning" : ""}
                    title={task.alarmSet ? "Disable Alarm" : "Enable Alarm"}
                  >
                    {task.alarmSet ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                      title="Mark as Completed"
                    >
                      <Check className="h-4 w-4" />
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

export default UncompletedTasksTable;
