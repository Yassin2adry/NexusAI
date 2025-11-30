import { Navigation } from "@/components/Navigation";
import { AITerminal } from "@/components/AITerminal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Play, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Workspace() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <Card className="glass border-primary/20 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Describe Your Game
              </h2>
              
              <Textarea
                placeholder="Example: Create a battle royale game with 100 players, shrinking zone, weapon pickups, building mechanics, and a storm system..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 mb-4 bg-background/50 border-border/50 focus:border-primary"
              />
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-cyber glow-primary">
                  <Play className="mr-2 h-5 w-5" />
                  Generate Game
                </Button>
                <Button variant="outline" className="border-primary/30">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </Card>

            {/* Project Output Tabs */}
            <Card className="glass border-border/50 p-6">
              <Tabs defaultValue="concept" className="w-full">
                <TabsList className="grid grid-cols-5 w-full bg-muted/50">
                  <TabsTrigger value="concept">Concept</TabsTrigger>
                  <TabsTrigger value="scripts">Scripts</TabsTrigger>
                  <TabsTrigger value="ui">UI</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="concept" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Game Design Document</h3>
                    <div className="p-4 rounded-lg bg-muted/50 text-muted-foreground">
                      <p>Your game concept and design will appear here after generation...</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scripts" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Generated Scripts</h3>
                    <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                      <p className="text-muted-foreground">-- Scripts will be generated here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ui" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">UI Components</h3>
                    <div className="p-4 rounded-lg bg-muted/50 text-muted-foreground">
                      <p>UI layouts and components will appear here...</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Asset Organization</h3>
                    <div className="p-4 rounded-lg bg-muted/50 text-muted-foreground">
                      <p>Roblox explorer structure will be shown here...</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Export Project</h3>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <Button className="bg-gradient-cyber glow-primary w-full">
                        <Download className="mr-2 h-5 w-5" />
                        Download RBXL File
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* AI Terminal Sidebar */}
          <div className="lg:col-span-1">
            <AITerminal />
          </div>
        </div>
      </div>
    </div>
  );
}
