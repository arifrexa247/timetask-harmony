
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import CompletedTasksTable from '@/components/CompletedTasksTable';
import UncompletedTasksTable from '@/components/UncompletedTasksTable';
import RecurringTasksReport from '@/components/RecurringTasksReport';
import CounterView from '@/components/CounterView';
import NotesView from '@/components/NotesView';
import { TaskProvider } from '@/contexts/TaskContext';
import { CounterProvider } from '@/contexts/CounterContext';
import { NoteProvider } from '@/contexts/NoteContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ListTodo, RotateCcw, CheckSquare, Repeat, CircleDot, Notebook } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<string>('regular');
  
  return (
    <TaskProvider>
      <CounterProvider>
        <NoteProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">
              <Tabs defaultValue="regular" onValueChange={setActiveView} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 max-w-3xl mx-auto">
                  <TabsTrigger value="regular" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <ListTodo className="h-4 w-4" />
                    <span>Task List</span>
                  </TabsTrigger>
                  <TabsTrigger value="uncompleted" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <RotateCcw className="h-4 w-4" />
                    <span>Uncompleted</span>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <CheckSquare className="h-4 w-4" />
                    <span>Completed</span>
                  </TabsTrigger>
                  <TabsTrigger value="recurring" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <Repeat className="h-4 w-4" />
                    <span>Recurring</span>
                  </TabsTrigger>
                  <TabsTrigger value="counters" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <CircleDot className="h-4 w-4" />
                    <span>Counters</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs sm:text-sm whitespace-normal h-auto py-2 flex flex-col items-center gap-1">
                    <Notebook className="h-4 w-4" />
                    <span>Notes</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="regular" className="mt-0">
                  <TaskList />
                </TabsContent>
                
                <TabsContent value="uncompleted" className="mt-0">
                  <UncompletedTasksTable />
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <CompletedTasksTable />
                </TabsContent>
                
                <TabsContent value="recurring" className="mt-0">
                  <RecurringTasksReport />
                </TabsContent>
                
                <TabsContent value="counters" className="mt-0">
                  <CounterView />
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <NotesView />
                </TabsContent>
              </Tabs>
            </main>
            <Toaster />
          </div>
        </NoteProvider>
      </CounterProvider>
    </TaskProvider>
  );
};

export default Index;
