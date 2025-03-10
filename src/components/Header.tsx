
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, AlarmClock } from 'lucide-react';
import PreferencesDialog from './PreferencesDialog';
import { useTaskContext } from '@/contexts/TaskContext';

const Header = () => {
  const { preferences } = useTaskContext();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlarmClock className="h-6 w-6 text-todo-primary" />
          <h1 className="text-xl font-bold">TimeTask Harmony</h1>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => setPreferencesOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
        
        <PreferencesDialog 
          open={preferencesOpen} 
          onOpenChange={setPreferencesOpen} 
        />
      </div>
    </header>
  );
};

export default Header;
