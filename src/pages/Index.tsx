
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import CompletedTasksTable from '@/components/CompletedTasksTable';
import UncompletedTasksTable from '@/components/UncompletedTasksTable';
import { TaskProvider } from '@/contexts/TaskContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeView, setActiveView] = useState<string>('regular');
  
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Tabs defaultValue="regular" onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 max-w-md mx-auto">
              <TabsTrigger value="regular" className="text-xs sm:text-sm whitespace-normal h-auto py-2">Task List</TabsTrigger>
              <TabsTrigger value="uncompleted" className="text-xs sm:text-sm whitespace-normal h-auto py-2">Uncompleted</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm whitespace-normal h-auto py-2">Completed</TabsTrigger>
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
          </Tabs>
        </main>
        <Toaster />
      </div>
    </TaskProvider>
  );
};

export default Index;
