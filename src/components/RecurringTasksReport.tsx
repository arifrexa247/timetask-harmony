import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { Plus, Pencil, Trash, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RecurringTasksCompletionReport from './RecurringTasksCompletionReport';


const RecurringTasksReport = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    isRecurring: true,
    recurringType: 'daily',
    recurringInterval: 1,
  });

  // Filter only recurring tasks
  const recurringTasks = tasks.filter(task => task.isRecurring);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask({
        ...newTask,
        isRecurring: true,
        recurringType: newTask.recurringType || 'daily',
        recurringInterval: newTask.recurringInterval || 1,
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        isRecurring: true,
        recurringType: 'daily',
        recurringInterval: 1,
      });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateTask = () => {
    if (editingTask && editingTask.title.trim()) {
      updateTask(editingTask.id, {
        ...editingTask,
        isRecurring: true,
        recurringType: editingTask.recurringType || 'daily',
        recurringInterval: editingTask.recurringInterval || 1,
      });
      setEditingTask(null);
      setIsEditMode(false);
      setIsDialogOpen(false);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setIsEditMode(false);
    setIsDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getRecurringText = (task: Task) => {
    if (!task.isRecurring) return 'Not recurring';

    const interval = task.recurringInterval || 1;
    const intervalText = interval > 1 ? `${interval} ${task.recurringType}s` : task.recurringType;

    return `Every ${intervalText}`;
  };

  const renderTaskTable = (filteredTasks: Task[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No recurring tasks found
            </TableCell>
          </TableRow>
        ) : (
          filteredTasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => completeTask(task.id)}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-muted-foreground">{task.description}</div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Repeat className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{getRecurringText(task)}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center ${getPriorityColor(task.priority)}`}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => completeTask(task.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark {task.completed ? 'incomplete' : 'complete'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit task</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive focus:text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete task</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recurring Tasks</h2>
        <Button onClick={() => {
          setIsEditMode(false);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Recurring Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Recurring Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTaskTable(recurringTasks)}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Recurring Task' : 'Add Recurring Task'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update your recurring task details below.'
                : 'Create a new recurring task that repeats at your chosen interval.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={isEditMode ? editingTask?.title || '' : newTask.title}
                onChange={(e) => {
                  if (isEditMode && editingTask) {
                    setEditingTask({ ...editingTask, title: e.target.value });
                  } else {
                    setNewTask({ ...newTask, title: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Enter task description"
                value={isEditMode ? editingTask?.description || '' : newTask.description}
                onChange={(e) => {
                  if (isEditMode && editingTask) {
                    setEditingTask({ ...editingTask, description: e.target.value });
                  } else {
                    setNewTask({ ...newTask, description: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={isEditMode ? editingTask?.priority || 'medium' : newTask.priority}
                onValueChange={(value) => {
                  if (isEditMode && editingTask) {
                    setEditingTask({ ...editingTask, priority: value });
                  } else {
                    setNewTask({ ...newTask, priority: value });
                  }
                }}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurringType">Repeat</Label>
              <Select
                value={isEditMode ? editingTask?.recurringType || 'daily' : newTask.recurringType}
                onValueChange={(value) => {
                  if (isEditMode && editingTask) {
                    setEditingTask({ ...editingTask, recurringType: value });
                  } else {
                    setNewTask({ ...newTask, recurringType: value });
                  }
                }}
              >
                <SelectTrigger id="recurringType">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurringInterval">Every</Label>
              <Select
                value={String(isEditMode ? editingTask?.recurringInterval || 1 : newTask.recurringInterval)}
                onValueChange={(value) => {
                  const interval = parseInt(value, 10);
                  if (isEditMode && editingTask) {
                    setEditingTask({ ...editingTask, recurringInterval: interval });
                  } else {
                    setNewTask({ ...newTask, recurringInterval: interval });
                  }
                }}
              >
                <SelectTrigger id="recurringInterval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={isEditMode ? handleUpdateTask : handleAddTask}>
              {isEditMode ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecurringTasksReport;