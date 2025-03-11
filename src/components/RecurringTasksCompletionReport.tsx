
import React, { useMemo } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { format, subDays, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const RecurringTasksCompletionReport: React.FC = () => {
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
        // This is simplified - a more accurate version would check if the task was due on this day
        // based on its recurring pattern
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
      // If task is due today but not completed
      if (task.dueDate && task.dueDate === format(today, 'yyyy-MM-dd') && !task.completed) {
        return true;
      }
      return false;
    });
  };
  
  const todaysRemainingTasks = getTodaysRemainingTasks();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recurring Tasks Completion Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">10-Day History</TabsTrigger>
            <TabsTrigger value="today">Today's Remaining</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <div className="overflow-x-auto">
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
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            completionRate >= 80 ? 'text-green-500' : 
                            completionRate >= 50 ? 'text-amber-500' : 
                            'text-red-500'
                          }`}>
                            {completionRate}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="today">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Time</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysRemainingTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No remaining tasks for today
                    </TableCell>
                  </TableRow>
                ) : (
                  todaysRemainingTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{task.dueTime || 'All day'}</TableCell>
                      <TableCell>
                        {task.recurringType === 'custom' ? 
                          `Every ${task.recurringFrequencyValue} ${task.recurringFrequencyUnit}${task.recurringFrequencyValue !== 1 ? 's' : ''}` :
                          `${task.recurringType?.charAt(0).toUpperCase()}${task.recurringType?.slice(1)} ${task.recurringInterval && task.recurringInterval > 1 ? `(every ${task.recurringInterval})` : ''}`
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecurringTasksCompletionReport;
