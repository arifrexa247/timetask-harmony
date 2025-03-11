
import React, { useState } from "react";
import { Counter } from "@/types/task";
import { useCounterContext } from "@/contexts/CounterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CounterChartProps {
  counter: Counter;
}

const CounterChart: React.FC<CounterChartProps> = ({ counter }) => {
  const { getCounterHistory } = useCounterContext();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const chartData = getCounterHistory(counter.id, period);
  
  // Calculate total taps for the period
  const totalTaps = chartData.reduce((sum, entry) => sum + entry.count, 0);
  
  // Calculate average taps per day
  const avgTaps = chartData.length > 0 ? (totalTaps / chartData.length).toFixed(1) : '0';

  // Calculate highest day
  const highestDay = chartData.length > 0 
    ? chartData.reduce((max, entry) => entry.count > max.count ? entry : max, chartData[0])
    : { date: 'N/A', count: 0 };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const renderChartContent = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected period</p>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Taps"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        // For pie chart, group data into meaningful segments
        const pieData = chartData.map(entry => ({
          name: entry.date,
          value: entry.count
        }));
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Tabs value={period} onValueChange={(value) => setPeriod(value as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="pie">Pie</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestDay.count}</div>
            <div className="text-sm text-muted-foreground">{highestDay.date}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-[300px]">
        {renderChartContent()}
      </div>
    </div>
  );
};

export default CounterChart;
