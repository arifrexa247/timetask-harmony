
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCounterContext } from '@/contexts/CounterContext';

interface CounterChartProps {
  counterId: string;
}

const CounterChart: React.FC<CounterChartProps> = ({ counterId }) => {
  const { counters, getCounterHistory } = useCounterContext();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  
  const counter = counters.find(c => c.id === counterId);
  if (!counter) return null;
  
  const data = getCounterHistory(counterId, period);
  const chartType = period === 'yearly' ? 'line' : 'bar';
  
  // Get total counts for the period
  const totalCounts = data.reduce((sum, item) => sum + item.count, 0);
  const avgPerDay = totalCounts / data.length || 0;
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Stats for "{counter.name}"</CardTitle>
        <Tabs defaultValue="weekly" onValueChange={(value) => setPeriod(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-xs">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-muted rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Total Count</p>
              <p className="text-2xl font-semibold">{counter.count}</p>
            </div>
            <div className="bg-muted rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Period Total</p>
              <p className="text-2xl font-semibold">{totalCounts}</p>
            </div>
            <div className="bg-muted rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Avg Per Day</p>
              <p className="text-2xl font-semibold">{avgPerDay.toFixed(1)}</p>
            </div>
            <div className="bg-muted rounded-md p-3 text-center">
              <p className="text-sm text-muted-foreground">Created On</p>
              <p className="text-2xl font-semibold">{counter.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="h-[300px] mt-4">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Count" />
                  </BarChart>
                ) : (
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      name="Count"
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available for this period</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterChart;
