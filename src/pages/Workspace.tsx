import { Navigation } from "@/components/Navigation";
import { AITerminal } from "@/components/AITerminal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function Workspace() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold mb-4">Game Concept</h2>
              
              <Textarea
                placeholder="Describe your Roblox game idea in detail. Example: Create a battle royale game with 100 players, shrinking zone, weapon pickups..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 mb-4 bg-background border-border"
              />
              
              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <Play className="h-4 w-4" />
                  Generate Game
                </Button>
                <Button variant="outline" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <Tabs defaultValue="concept" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="concept">Concept</TabsTrigger>
                  <TabsTrigger value="scripts">Scripts</TabsTrigger>
                  <TabsTrigger value="ui">UI</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="concept" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Design Document</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      Your game design document will appear here after generation...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scripts" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Generated Scripts</h3>
                    <div className="p-4 rounded bg-muted font-mono text-sm">
                      <p className="text-muted-foreground">-- Scripts will be generated here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ui" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">UI Components</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      UI layouts will be shown here...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Asset Organization</h3>
                    <div className="p-4 rounded bg-muted text-sm text-muted-foreground">
                      Explorer structure will appear here...
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Export Project</h3>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download RBXL File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <AITerminal />
          </div>
        </div>
      </div>
    </div>
  );
}
