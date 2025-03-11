
import React, { useState } from "react";
import { Counter } from "@/types/task";
import { useCounterContext } from "@/contexts/CounterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CounterChartProps {
  counter: Counter;
}

const CounterChart: React.FC<CounterChartProps> = ({ counter }) => {
  const { getCounterHistory } = useCounterContext();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const chartData = getCounterHistory(counter.id, period);
  
  // Calculate total taps for the period
  const totalTaps = chartData.reduce((sum, entry) => sum + entry.count, 0);
  
  // Calculate average taps per day
  const avgTaps = chartData.length > 0 ? (totalTaps / chartData.length).toFixed(1) : '0';

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as any)} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Taps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTaps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Taps Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTaps}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Taps" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterChart;
