
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlarmClock, Repeat } from 'lucide-react';
import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  dueTime: z.string().optional(),
  alarmSet: z.boolean().default(false),
  completed: z.boolean().default(false),
  recurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  initialData?: Task;
  mode: 'add' | 'edit';
}

const TaskForm = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  initialData,
  mode
}: TaskFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      dueTime: '',
      alarmSet: false,
      completed: false,
      recurring: false,
      frequency: 'daily',
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description || '',
          dueDate: initialData.dueDate,
          dueTime: initialData.dueTime || '',
          alarmSet: initialData.alarmSet,
          completed: initialData.completed,
          recurring: initialData.recurring || false,
          frequency: initialData.frequency || 'daily',
        });
      } else {
        form.reset({
          title: '',
          description: '',
          dueDate: undefined,
          dueTime: '',
          alarmSet: false,
          completed: false,
          recurring: false,
          frequency: 'daily',
        });
      }
    }
  }, [open, initialData, form]);

  // Custom handler for time input
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('dueTime', e.target.value);
    // If time is set, also set alarmSet to true by default
    if (e.target.value) {
      form.setValue('alarmSet', true);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    // If alarm is set but no time is provided, unset the alarm
    if (data.alarmSet && !data.dueTime) {
      data.alarmSet = false;
    }
    
    // Ensure frequency is set when recurring is true
    const frequency = data.recurring ? data.frequency : undefined;
    
    // Ensure title is not undefined or empty to satisfy the Task type
    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: data.title, // This is required by the schema so it's never undefined
      description: data.description,
      completed: data.completed,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      alarmSet: data.alarmSet,
      recurring: data.recurring,
      frequency,
      missedCount: initialData?.missedCount || 0,
    };
    
    onSubmit(taskData);
    onOpenChange(false);
  };

  const isRecurring = form.watch('recurring');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add details about this task" 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="time" 
                          className="pl-9"
                          value={field.value || ''}
                          onChange={handleTimeChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center">
                      <Repeat className="mr-2 h-4 w-4" />
                      Recurring task
                    </FormLabel>
                    <FormDescription>
                      This task repeats on a regular schedule
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name="recurringType"
                  render={({ field }) => (
                    <FormItem className="p-3 border rounded-lg">
                      <FormLabel>Frequency Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset interval unit when changing frequency type
                            if (value !== 'custom' && form.getValues('recurringIntervalUnit')) {
                              form.setValue('recurringIntervalUnit', undefined);
                            }
                          }}
                          defaultValue={field.value}
                          value={field.value}
                          className="flex flex-col space-y-1 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="hourly" />
                            </FormControl>
                            <FormLabel className="font-normal">Hourly</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="daily" />
                            </FormControl>
                            <FormLabel className="font-normal">Daily</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="weekly" />
                            </FormControl>
                            <FormLabel className="font-normal">Weekly</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="monthly" />
                            </FormControl>
                            <FormLabel className="font-normal">Monthly</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yearly" />
                            </FormControl>
                            <FormLabel className="font-normal">Yearly</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" />
                            </FormControl>
                            <FormLabel className="font-normal">Custom</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="recurringInterval"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Repeat every</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('recurringType') === 'custom' && (
                    <FormField
                      control={form.control}
                      name="recurringIntervalUnit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Unit</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minute">Minute(s)</SelectItem>
                              <SelectItem value="hour">Hour(s)</SelectItem>
                              <SelectItem value="day">Day(s)</SelectItem>
                              <SelectItem value="week">Week(s)</SelectItem>
                              <SelectItem value="month">Month(s)</SelectItem>
                              <SelectItem value="year">Year(s)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </>
                          </FormControl>
                          <FormLabel className="font-normal">Weekly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="monthly" />
                          </FormControl>
                          <FormLabel className="font-normal">Monthly</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="alarmSet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center">
                      <AlarmClock className="mr-2 h-4 w-4" />
                      Set reminder
                    </FormLabel>
                    <FormDescription>
                      Receive a notification when it's time for this task
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('dueTime')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Mark as completed</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'add' ? 'Add Task' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
