
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartType = 'bar' | 'line' | 'pie';
type Period = 'weekly' | 'monthly' | 'yearly';

const CounterChart = () => {
  const { tasks } = useTaskContext();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [period, setPeriod] = useState<Period>('weekly');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    generateChartData();
  }, [tasks, period]);

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const generateChartData = () => {
    // Sample data generation logic - replace with your actual data logic
    if (period === 'weekly') {
      setData([
        { name: 'Mon', completed: 5, pending: 2 },
        { name: 'Tue', completed: 7, pending: 3 },
        { name: 'Wed', completed: 4, pending: 1 },
        { name: 'Thu', completed: 8, pending: 2 },
        { name: 'Fri', completed: 6, pending: 4 },
        { name: 'Sat', completed: 3, pending: 1 },
        { name: 'Sun', completed: 5, pending: 0 },
      ]);
    } else if (period === 'monthly') {
      setData([
        { name: 'Week 1', completed: 20, pending: 5 },
        { name: 'Week 2', completed: 25, pending: 8 },
        { name: 'Week 3', completed: 18, pending: 4 },
        { name: 'Week 4', completed: 22, pending: 7 },
      ]);
    } else {
      setData([
        { name: 'Jan', completed: 65, pending: 15 },
        { name: 'Feb', completed: 55, pending: 20 },
        { name: 'Mar', completed: 70, pending: 12 },
        { name: 'Apr', completed: 60, pending: 18 },
        { name: 'May', completed: 80, pending: 10 },
        { name: 'Jun', completed: 75, pending: 15 },
      ]);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" name="Completed" />
        <Bar dataKey="pending" fill="#82ca9d" name="Pending" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="completed" stroke="#8884d8" name="Completed" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="pending" stroke="#82ca9d" name="Pending" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    const pieData = [
      { name: 'Completed', value: data.reduce((acc, curr) => acc + curr.completed, 0) },
      { name: 'Pending', value: data.reduce((acc, curr) => acc + curr.pending, 0) },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Time Period</h3>
          <div className="flex space-x-2">
            <Button
              variant={period === 'weekly' ? 'default' : 'outline'}
              onClick={() => handlePeriodChange('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'default' : 'outline'}
              onClick={() => handlePeriodChange('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={period === 'yearly' ? 'default' : 'outline'}
              onClick={() => handlePeriodChange('yearly')}
            >
              Yearly
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Chart Type</h3>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => handleChartTypeChange('bar')}
            >
              Bar
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => handleChartTypeChange('line')}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              onClick={() => handleChartTypeChange('pie')}
            >
              Pie
            </Button>
          </div>
        </div>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-md">
            Task Completion {period.charAt(0).toUpperCase() + period.slice(1)} Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="h-[300px]">
              {renderChart()}
            </TabsContent>
            <TabsContent value="stats">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <span className="text-2xl font-bold">
                      {data.reduce((acc, curr) => acc + curr.completed, 0)}
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <span className="text-2xl font-bold">
                      {data.reduce((acc, curr) => acc + curr.pending, 0)}
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <span className="text-2xl font-bold">
                      {Math.round(
                        (data.reduce((acc, curr) => acc + curr.completed, 0) /
                          (data.reduce((acc, curr) => acc + curr.completed, 0) +
                            data.reduce((acc, curr) => acc + curr.pending, 0))) *
                          100
                      )}%
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Avg Daily Completion</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <span className="text-2xl font-bold">
                      {Math.round(data.reduce((acc, curr) => acc + curr.completed, 0) / data.length)}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CounterChart;
