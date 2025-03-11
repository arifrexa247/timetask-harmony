
import { useTaskContext } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const RecurringTasksReport = () => {
  const { getRecurringTasksReport } = useTaskContext();
  const { missedTasks, completionRate } = getRecurringTasksReport();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Recurring Tasks Report
          </CardTitle>
          <CardDescription>
            Track your performance on recurring tasks
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            {missedTasks.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Missed Recurring Tasks
                </h3>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Times Missed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {missedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell className="capitalize">{task.frequency}</TableCell>
                          <TableCell>
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell className="text-destructive font-medium">
                            {task.missedCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No missed recurring tasks. Great job!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringTasksReport;
