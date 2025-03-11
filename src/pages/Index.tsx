
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
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import { ListTodo, RotateCcw, CheckSquare, Repeat, CircleDot, Notebook } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<string>('regular');
  
  const navItems = [
    { id: 'regular', label: 'Tasks', icon: ListTodo },
    { id: 'uncompleted', label: 'Uncompleted', icon: RotateCcw },
    { id: 'completed', label: 'Completed', icon: CheckSquare },
    { id: 'recurring', label: 'Recurring', icon: Repeat },
    { id: 'counters', label: 'Counters', icon: CircleDot },
    { id: 'notes', label: 'Notes', icon: Notebook },
  ];
  
  return (
    <TaskProvider>
      <CounterProvider>
        <NoteProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">
              <div className="mb-8 overflow-hidden">
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card 
                        key={item.id}
                        className={`cursor-pointer transition-all hover:bg-accent flex-grow sm:flex-grow-0 sm:w-auto min-w-[80px] sm:min-w-[100px] ${
                          activeView === item.id 
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary' 
                            : 'bg-card hover:shadow-sm'
                        }`}
                        onClick={() => setActiveView(item.id)}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                          <Icon className={`h-5 w-5 mb-1 ${activeView === item.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          <span className={`text-xs sm:text-sm font-medium ${activeView === item.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6">
                {activeView === 'regular' && <TaskList />}
                {activeView === 'uncompleted' && <UncompletedTasksTable />}
                {activeView === 'completed' && <CompletedTasksTable />}
                {activeView === 'recurring' && <RecurringTasksReport />}
                {activeView === 'counters' && <CounterView />}
                {activeView === 'notes' && <NotesView />}
              </div>
            </main>
            <Toaster />
          </div>
        </NoteProvider>
      </CounterProvider>
    </TaskProvider>
  );
};

export default Index;
