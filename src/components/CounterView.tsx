
import { useState } from 'react';
import { useCounterContext } from '@/contexts/CounterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, RotateCcw, Trash, Edit, CircleDot, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CounterChart from './CounterChart';

const CounterView = () => {
  const { counters, addCounter, incrementCount, resetCount, deleteCounter, updateCounterName } = useCounterContext();
  const [newCounterName, setNewCounterName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<{id: string, name: string} | null>(null);
  const [activeCounter, setActiveCounter] = useState<string | null>(
    counters.length > 0 ? counters[0].id : null
  );
  const [activeTab, setActiveTab] = useState<string>('counter');
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [chartCounterId, setChartCounterId] = useState<string | null>(null);

  const handleAddCounter = () => {
    if (newCounterName.trim()) {
      addCounter(newCounterName.trim());
      setNewCounterName('');
      setIsAddDialogOpen(false);
      
      // Set as active if it's the first counter
      if (counters.length === 0) {
        // We'll need to wait for state update, so we'll set it in the next render
        setTimeout(() => {
          if (counters.length > 0) {
            setActiveCounter(counters[0].id);
          }
        }, 0);
      }
    }
  };

  const handleUpdateCounter = () => {
    if (editingCounter && editingCounter.name.trim()) {
      updateCounterName(editingCounter.id, editingCounter.name.trim());
      setEditingCounter(null);
    }
  };

  const handleIncrement = (id: string) => {
    incrementCount(id);
  };

  const handleReset = (id: string) => {
    resetCount(id);
  };

  const handleDelete = (id: string) => {
    deleteCounter(id);
    if (activeCounter === id) {
      setActiveCounter(counters.length > 1 ? counters[0].id : null);
    }
  };

  const openChartDialog = (id: string) => {
    setChartCounterId(id);
    setIsChartDialogOpen(true);
  };

  const currentCounter = counters.find(counter => counter.id === activeCounter);
  const maxCount = Math.max(...counters.map(counter => counter.count), 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Counters</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Counter
        </Button>
      </div>

      {counters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CircleDot className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No counters yet. Create a counter to start tracking repetitive actions.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(true)} 
              className="mt-4"
            >
              Create your first counter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-medium mb-4">Your Counters</h3>
            {counters.map(counter => (
              <Card 
                key={counter.id}
                className={`cursor-pointer transition-colors ${counter.id === activeCounter ? 'border-primary' : ''}`}
                onClick={() => setActiveCounter(counter.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{counter.name}</h4>
                    <p className="text-sm text-muted-foreground">Count: {counter.count}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(counter.id);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCounter({ id: counter.id, name: counter.name });
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Name</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset(counter.id);
                          }}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          <span>Reset Counter</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChartDialog(counter.id);
                          }}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          <span>View Chart</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(counter.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete Counter</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
                <div className="px-4 pb-2">
                  <Progress 
                    value={(counter.count / maxCount) * 100} 
                    className="h-1" 
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="md:col-span-2">
            {currentCounter && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="counter">Counter</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="counter">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{currentCounter.name}</span>
                        <span className="text-3xl font-bold">{currentCounter.count}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleIncrement(currentCounter.id)}
                            className="flex-1"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Increment
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleReset(currentCounter.id)}
                            className="flex-1"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset
                          </Button>
                        </div>
                        <Progress value={(currentCounter.count / maxCount) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="chart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentCounter && <CounterChart counter={currentCounter} />}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Counter Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Counter Name</th>
                        <th className="text-left py-3 px-2">Count</th>
                        <th className="text-left py-3 px-2">Created On</th>
                        <th className="text-left py-3 px-2">Progress</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {counters.map(counter => (
                        <tr key={counter.id} className="border-b">
                          <td className="py-3 px-2">{counter.name}</td>
                          <td className="py-3 px-2">{counter.count}</td>
                          <td className="py-3 px-2">{new Date(counter.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-2 w-40">
                            <Progress 
                              value={(counter.count / maxCount) * 100} 
                              className="h-2" 
                            />
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncrement(counter.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleReset(counter.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(counter.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Counter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Counter</DialogTitle>
            <DialogDescription>
              Create a new counter to track anything you want to count.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Counter name"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCounter}>Add Counter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Counter Dialog */}
      <Dialog open={!!editingCounter} onOpenChange={(open) => !open && setEditingCounter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Counter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Counter name"
                value={editingCounter?.name || ''}
                onChange={(e) => setEditingCounter(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCounter(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCounter}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chart Dialog */}
      <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {counters.find(c => c.id === chartCounterId)?.name} - Chart
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {chartCounterId && <CounterChart counter={counters.find(c => c.id === chartCounterId)!} />}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsChartDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CounterView;
