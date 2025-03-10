
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import { TaskProvider } from '@/contexts/TaskContext';

const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <TaskList />
        </main>
      </div>
    </TaskProvider>
  );
};

export default Index;
