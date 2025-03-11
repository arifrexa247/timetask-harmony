import React from "react";
import { Counter } from "@/types/task";
import { Button } from "@/components/ui/button";
import { useCounterContext } from "@/contexts/CounterContext";

interface CounterDetailProps {
  counter: Counter;
}

const CounterDetail: React.FC<CounterDetailProps> = ({ counter }) => {
  const { incrementCount, resetCount } = useCounterContext();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Circular counter button */}
      <div 
        className="w-48 h-48 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center mb-8 cursor-pointer transition-all duration-200 select-none active:scale-95 shadow-lg"
        onClick={() => incrementCount(counter.id)}
      >
        <span className="text-5xl font-bold">{counter.count}</span>
      </div>

      <p className="text-center mb-6">Tap the circle to increment counter</p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => resetCount(counter.id)}>
          Reset Counter
        </Button>
      </div>
    </div>
  );
};

export default CounterDetail;