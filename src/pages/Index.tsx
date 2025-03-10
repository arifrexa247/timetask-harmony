
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import CompletedTasksTable from '@/components/CompletedTasksTable';
import UncompletedTasksTable from '@/components/UncompletedTasksTable';
import { TaskProvider } from '@/contexts/TaskContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const Index = () => {
  const [activeView, setActiveView] = useState<string>('regular');
  
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Tabs defaultValue="regular" onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="regular">Task List</TabsTrigger>
              <TabsTrigger value="uncompleted">Uncompleted Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
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
      </div>
    </TaskProvider>
  );
};

export default Index;
