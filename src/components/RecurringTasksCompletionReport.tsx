
import React, { useMemo } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { format, subDays, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from '@/types/task';
import { CheckCircle, XCircle, Circle } from 'lucide-react';

const RecurringTasksCompletionReport = () => {
  const { tasks } = useTaskContext();
  const recurringTasks = tasks.filter(task => task.isRecurring);
  
  // Generate last 10 days dates
  const last10Days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const date = subDays(today, i);
      return {
        date,
        formattedDate: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM dd')
      };
    }).reverse();
  }, []);
  
  // Calculate completion status for each task for each day
  const taskCompletionData = useMemo(() => {
    return recurringTasks.map(task => {
      const dayCompletions = last10Days.map(day => {
        const dayStart = startOfDay(day.date);
        const dayEnd = endOfDay(day.date);
        
        // Check if task existed on this day (created before or on this day)
        const taskCreatedOn = task.createdAt ? parseISO(task.createdAt) : new Date();
        const taskExistedOnDay = !isWithinInterval(taskCreatedOn, { start: dayEnd, end: new Date() });
        
        if (!taskExistedOnDay) {
          return { status: 'not-applicable' };
        }
        
        // Check if task was completed on this day
        const wasCompleted = task.completionHistory?.some(completion => {
          const completionDate = parseISO(completion.date);
          return isWithinInterval(completionDate, { start: dayStart, end: dayEnd }) && completion.completed;
        });
        
        // Check if task had to be completed on this day
        const shouldBeCompleted = task.dueDate && isWithinInterval(parseISO(task.dueDate), { start: dayStart, end: dayEnd });
        
        if (shouldBeCompleted) {
          return { status: wasCompleted ? 'completed' : 'missed' };
        } else {
          return { status: 'not-due' };
        }
      });
      
      // Calculate completion rate
      const daysRequiringCompletion = dayCompletions.filter(day => day.status === 'completed' || day.status === 'missed').length;
      const daysCompleted = dayCompletions.filter(day => day.status === 'completed').length;
      const completionRate = daysRequiringCompletion > 0 
        ? Math.round((daysCompleted / daysRequiringCompletion) * 100) 
        : 100;
      
      return {
        task,
        dayCompletions,
        completionRate
      };
    });
  }, [recurringTasks, last10Days]);
  
  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'missed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'not-due':
        return <Circle className="h-5 w-5 text-gray-300" />;
      case 'not-applicable':
        return <div className="h-5 w-5">-</div>;
      default:
        return <div className="h-5 w-5">-</div>;
    }
  };
  
  const getTodaysRemainingTasks = () => {
    const today = new Date();
    return recurringTasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = parseISO(task.dueDate);
      return (
        isWithinInterval(dueDate, { start: startOfDay(today), end: endOfDay(today) }) &&
        !task.completed
      );
    });
  };
  
  const todaysRemainingTasks = getTodaysRemainingTasks();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Report (Last 10 Days)</CardTitle>
          <CardDescription>
            Track your recurring task completion progress over the last 10 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                {last10Days.map(day => (
                  <TableHead key={day.formattedDate} className="text-center">
                    {day.displayDate}
                  </TableHead>
                ))}
                <TableHead className="text-right">Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskCompletionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={last10Days.length + 2} className="text-center py-6 text-muted-foreground">
                    No recurring tasks found
                  </TableCell>
                </TableRow>
              ) : (
                taskCompletionData.map(({ task, dayCompletions, completionRate }) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    {dayCompletions.map((day, index) => (
                      <TableCell key={index} className="text-center">
                        {renderStatusIcon(day.status)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium">
                      {completionRate}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Today's Remaining Tasks</CardTitle>
          <CardDescription>
            Recurring tasks that need to be completed today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysRemainingTasks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No remaining recurring tasks for today!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysRemainingTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="capitalize">{task.priority}</TableCell>
                    <TableCell>{task.dueTime || "Anytime"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringTasksCompletionReport;
