
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
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id 
          ? { ...counter, count: counter.count + 1 } 
          : counter
      )
    );
  };

  const resetCount = (id: string) => {
    const counter = counters.find(c => c.id === id);
    
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id 
          ? { ...counter, count: 0 } 
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

  return (
    <CounterContext.Provider
      value={{
        counters,
        addCounter,
        deleteCounter,
        incrementCount,
        resetCount,
        updateCounterName,
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
