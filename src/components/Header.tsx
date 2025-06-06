
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, AlarmClock, Moon, Sun, Calendar } from 'lucide-react';
import PreferencesDialog from './PreferencesDialog';
import { useTaskContext } from '@/contexts/TaskContext';
import { format } from 'date-fns';

const Header = () => {
  const { preferences, updatePreferences } = useTaskContext();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Apply dark mode class based on preferences
  useEffect(() => {
    if (preferences.nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.nightMode]);

  const toggleDarkMode = () => {
    updatePreferences({ nightMode: !preferences.nightMode });
  };
  
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlarmClock className="h-6 w-6 text-todo-primary" />
          <h1 className="text-xl font-bold">TimeTask Harmony</h1>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {format(currentDateTime, 'MMM dd, yyyy hh:mm:ss a')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={preferences.nightMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {preferences.nightMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setPreferencesOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <PreferencesDialog 
          open={preferencesOpen} 
          onOpenChange={setPreferencesOpen} 
        />
      </div>
    </header>
  );
};

export default Header;
