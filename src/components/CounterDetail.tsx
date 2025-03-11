
import React from "react";
import { Counter } from "@/types/task";
import { Button } from "@/components/ui/button";
import { useCounterContext as useCounter } from "@/contexts/CounterContext";

interface CounterDetailProps {
  counter: Counter;
}

const CounterDetail = ({ counter }: CounterDetailProps) => {
  const { incrementCount, resetCount } = useCounter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center mb-6">
        <h3 className="text-3xl font-bold">{counter.count}</h3>
        <p className="text-muted-foreground">Current Count</p>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <Button onClick={() => incrementCount(counter.id)}>Increment</Button>
        <Button variant="outline" onClick={() => resetCount(counter.id)}>
          Reset
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">History</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {counter.history && counter.history.length > 0 ? (
                counter.history.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{entry.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-muted-foreground">
                    No history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CounterDetail;
