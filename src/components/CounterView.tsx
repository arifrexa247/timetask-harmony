
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CounterChart from "./CounterChart";
import CounterDetail from "./CounterDetail";
import { useCounterContext as useCounter } from "@/contexts/CounterContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CounterView = () => {
  const { selectedCounter } = useCounter();
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // Reset to details tab when counter changes
    setActiveTab("details");
  }, [selectedCounter?.id]);

  if (!selectedCounter) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a counter to view details</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{selectedCounter.name}</h2>
      </div>

      <Card className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>

          <CardContent className="p-6 h-[calc(100%-48px)]">
            <TabsContent value="details" className="h-full">
              <CounterDetail counter={selectedCounter} />
            </TabsContent>
            <TabsContent value="chart" className="h-full">
              <CounterChart counter={selectedCounter} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CounterView;
