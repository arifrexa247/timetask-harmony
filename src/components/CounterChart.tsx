
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
import { Counter } from '@/types/task';

interface CounterChartProps {
  counter: Counter;
}

const CounterChart = ({ counter }: CounterChartProps) => {
  // Simple chart component
  const maxBars = 10;
  const barHeight = 20;
  const maxValue = Math.max(counter.count, 10);
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{counter.name}</h3>
        <p className="text-sm text-muted-foreground">Current count: {counter.count}</p>
      </div>
      
      <div className="relative h-[200px] w-full">
        <div className="absolute left-0 bottom-0 w-full h-full flex items-end">
          <div 
            className="bg-primary/80 rounded-t-md transition-all duration-500 ease-in-out"
            style={{ 
              width: '100%', 
              height: `${Math.min(100, (counter.count / maxValue) * 100)}%`
            }}
          />
        </div>
        
        {/* Y-axis markers */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <span className="text-xs text-muted-foreground pr-2">
                {Math.round(maxValue - (maxValue / 4) * index)}
              </span>
              <div className="w-2 border-t border-border" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Created on {new Date(counter.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default CounterChart;
