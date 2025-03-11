
import React from "react";
import { Counter } from "@/types/task";
import { Button } from "@/components/ui/button";
import { useCounterContext } from "@/contexts/CounterContext";

interface CounterDetailProps {
  counter: Counter;
}

const CounterDetail: React.FC<CounterDetailProps> = ({ counter }) => {
  const { incrementCount, resetCount } = useCounterContext();

  const handleTap = () => {
    incrementCount(counter.id);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">{counter.name}</h3>
        <p className="text-5xl font-bold">{counter.count}</p>
      </div>
      
      {/* Tap Circle */}
      <div 
        className="w-48 h-48 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center cursor-pointer mb-8 transition-all duration-200 active:scale-95"
        onClick={handleTap}
      >
        <span className="text-lg font-medium">TAP</span>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => resetCount(counter.id)}
        className="mt-4"
      >
        Reset Counter
      </Button>
    </div>
  );
};

export default CounterDetail;
