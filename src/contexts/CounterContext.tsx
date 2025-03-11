
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Counter } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

interface CounterContextType {
  counters: Counter[];
  addCounter: (name: string) => void;
  deleteCounter: (id: string) => void;
  incrementCount: (id: string) => void;
  resetCount: (id: string) => void;
  updateCounterName: (id: string, name: string) => void;
  getCounterHistory: (id: string, period: 'weekly' | 'monthly' | 'yearly') => { date: string; count: number }[];
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [counters, setCounters] = useState<Counter[]>(() => {
    const savedCounters = localStorage.getItem('counters');
    return savedCounters 
      ? JSON.parse(savedCounters).map((counter: any) => ({
          ...counter,
          createdAt: new Date(counter.createdAt),
          history: counter.history || []
        })) 
      : [];
  });

  // Save counters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('counters', JSON.stringify(counters));
  }, [counters]);

  const addCounter = (name: string) => {
    const newCounter: Counter = {
      id: crypto.randomUUID(),
      name,
      count: 0,
      createdAt: new Date(),
      history: []
    };
    
    setCounters(prev => [...prev, newCounter]);
    
    toast({
      title: "Counter added",
      description: `"${name}" counter has been created.`,
    });
  };

  const deleteCounter = (id: string) => {
    const counterToDelete = counters.find(counter => counter.id === id);
    if (!counterToDelete) return;
    
    setCounters(prev => prev.filter(counter => counter.id !== id));
    
    toast({
      title: "Counter deleted",
      description: `"${counterToDelete.name}" counter has been removed.`,
      variant: "destructive",
    });
  };

  const incrementCount = (id: string) => {
    const now = new Date();
    
    setCounters(prev => 
      prev.map(counter => {
        if (counter.id !== id) return counter;
        
        // Add to history with timestamp
        const history = counter.history || [];
        const newHistory = [
          ...history,
          { date: now.toISOString(), count: 1 }
        ];
        
        return { 
          ...counter, 
          count: counter.count + 1,
          history: newHistory
        };
      })
    );
  };

  const resetCount = (id: string) => {
    const counter = counters.find(c => c.id === id);
    
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id 
          ? { 
              ...counter, 
              count: 0,
              // Keep history for reporting, just reset current count
            } 
          : counter
      )
    );
    
    if (counter) {
      toast({
        title: "Counter reset",
        description: `"${counter.name}" counter has been reset to 0.`,
      });
    }
  };

  const updateCounterName = (id: string, name: string) => {
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id 
          ? { ...counter, name } 
          : counter
      )
    );
  };

  // Function to get historical data for charts
  const getCounterHistory = (id: string, period: 'weekly' | 'monthly' | 'yearly'): { date: string; count: number }[] => {
    const counter = counters.find(c => c.id === id);
    if (!counter || !counter.history) return [];

    const now = new Date();
    const history = counter.history;
    
    let filteredHistory;
    let dateFormat;
    
    // Filter based on period
    if (period === 'weekly') {
      // Last 7 days
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filteredHistory = history.filter(entry => new Date(entry.date) >= weekAgo);
      dateFormat = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (period === 'monthly') {
      // Last 30 days
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      filteredHistory = history.filter(entry => new Date(entry.date) >= monthAgo);
      dateFormat = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // Yearly - last 12 months
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredHistory = history.filter(entry => new Date(entry.date) >= yearAgo);
      dateFormat = (date: Date) => `${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    // Group by date
    const groupedByDate = filteredHistory.reduce((acc: Record<string, number>, entry) => {
      const date = new Date(entry.date);
      const formattedDate = dateFormat(date);
      
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      
      acc[formattedDate] += entry.count;
      return acc;
    }, {});

    // Convert to array for recharts
    return Object.entries(groupedByDate).map(([date, count]) => ({
      date,
      count
    }));
  };

  return (
    <CounterContext.Provider
      value={{
        counters,
        addCounter,
        deleteCounter,
        incrementCount,
        resetCount,
        updateCounterName,
        getCounterHistory
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export const useCounterContext = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounterContext must be used within a CounterProvider');
  }
  return context;
};
