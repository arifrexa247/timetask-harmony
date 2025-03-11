import { useCounterContext } from '@/contexts/CounterContext';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CounterChartProps {
  counterId: string;
}

const CounterChart = ({ counterId }: CounterChartProps) => {
  const { getCounterHistory } = useCounterContext();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const chartData = getCounterHistory(counterId, period);

  // No data case
  if (chartData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground text-center">
          No data available for the selected period. Start counting to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as 'weekly' | 'monthly' | 'yearly')}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="weekly">Last 7 Days</TabsTrigger>
            <TabsTrigger value="monthly">Last 30 Days</TabsTrigger>
            <TabsTrigger value="yearly">Last 12 Months</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="yearly" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
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
                <td className="py-2 px-3">{entry.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounterChart;
import { useEffect, useState } from "react";
import { Counter } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CounterChartProps {
  counter: Counter;
}

const CounterChart2 = ({ counter }: CounterChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (counter && counter.history) {
      // Convert history to chart data
      const data = counter.history.map((entry) => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        value: entry.value,
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
    <div className="h-full w-full">
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
  );
};

export default CounterChart2;