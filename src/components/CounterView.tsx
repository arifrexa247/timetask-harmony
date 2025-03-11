
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CounterChart from "./CounterChart";
import CounterDetail from "./CounterDetail";
import { useCounterContext } from "@/contexts/CounterContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const CounterView = () => {
  const { counters, addCounter } = useCounterContext();
  const [selectedCounterId, setSelectedCounterId] = useState<string | null>(null);
  const [newCounterName, setNewCounterName] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const selectedCounter = counters.find(c => c.id === selectedCounterId);

  useEffect(() => {
    // Reset to details tab when counter changes
    setActiveTab("details");
  }, [selectedCounterId]);

  const handleAddCounter = () => {
    if (newCounterName.trim()) {
      addCounter(newCounterName.trim());
      setNewCounterName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCounter();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {!selectedCounter ? (
        <>
          <h2 className="text-2xl font-bold">Counters</h2>
          
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="New counter name" 
              value={newCounterName} 
              onChange={(e) => setNewCounterName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddCounter}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {counters.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-muted-foreground mb-4">No counters yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {counters.map(counter => (
                <Card 
                  key={counter.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCounterId(counter.id)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">{counter.name}</h3>
                    <p className="text-3xl font-bold">{counter.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedCounter.name}</h2>
            <Button variant="ghost" onClick={() => setSelectedCounterId(null)}>
              Back to all counters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="chart">Reports</TabsTrigger>
            </TabsList>

            <div className="p-6 flex-1">
              <TabsContent value="details" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <CounterDetail counter={selectedCounter} />
              </TabsContent>
              <TabsContent value="chart" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <CounterChart counter={selectedCounter} />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CounterView;
