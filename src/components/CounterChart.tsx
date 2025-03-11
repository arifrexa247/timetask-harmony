import { useEffect, useState } from "react";
import { Counter } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CounterChartProps {
  counter: Counter;
}

const CounterChart = ({ counter }: CounterChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  useEffect(() => {
    if (counter && counter.history) {
      // Convert history to chart data
      const data = counter.history.map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(),
        value: entry.count,
      }));

      // Only show the last 10 entries if there are more
      const displayData = data.length > 10 ? data.slice(-10) : data;

      setChartData(displayData);
    }
  }, [counter]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[70%] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Count</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-3">{entry.date}</td>
                <td className="py-2 px-3">{entry.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounterChart;