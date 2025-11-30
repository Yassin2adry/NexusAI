import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Zap, Code, Download } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use NexusAI to build Roblox games
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="plugin">Plugin</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-8 border-border space-y-6">
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">What is NexusAI?</h2>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  NexusAI is an AI-powered Roblox game creation platform that uses multiple specialized 
                  AI agents to transform your ideas into complete, playable games with scripts, UI, and assets.
                </p>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-semibold">Key Features</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Multi-Agent System:</strong> Six specialized AI agents collaborate on every aspect</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Complete Scripts:</strong> Generates optimized Luau code with proper structure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong className="text-foreground">One-Click Export:</strong> Download ready-to-use RBXL files</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="quickstart">
              <Card className="p-8 border-border space-y-6">
                <h2 className="text-2xl font-bold">Getting Started</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Sign Up & Get Credits",
                      description: "Create your account and choose a plan with generation credits.",
                    },
                    {
                      step: "2",
                      title: "Describe Your Game",
                      description: "Go to the workspace and describe your game idea in detail.",
                    },
                    {
                      step: "3",
                      title: "Watch AI Build",
                      description: "The AI terminal shows each agent working on your game in real-time.",
                    },
                    {
                      step: "4",
                      title: "Export & Play",
                      description: "Download your RBXL file and open it in Roblox Studio.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="p-4 rounded-lg bg-muted">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                          {item.step}
                        </span>
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground ml-8">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="agents">
              <Card className="p-8 border-border space-y-6">
                <h2 className="text-2xl font-bold">AI Agent System</h2>
                
                <div className="space-y-3">
                  {[
                    {
                      name: "Game Designer Agent",
                      description: "Creates complete game design documents with mechanics, systems, and features.",
                    },
                    {
                      name: "World Builder Agent",
                      description: "Generates environment, terrain, and game world structure.",
                    },
                    {
                      name: "Script Engineer Agent",
                      description: "Writes all Luau scripts with proper server/client architecture.",
                    },
                    {
                      name: "UI Agent",
                      description: "Creates responsive user interfaces and HUD components.",
                    },
                    {
                      name: "Asset Agent",
                      description: "Organizes project structure and manages asset hierarchy.",
                    },
                    {
                      name: "Validator Agent",
                      description: "Tests scripts and validates code quality before export.",
                    },
                  ].map((agent, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <h3 className="font-semibold mb-1 text-primary">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card className="p-8 border-border space-y-6">
                <h2 className="text-2xl font-bold">Export System</h2>
                
                <p className="text-muted-foreground">
                  NexusAI generates complete RBXL files containing all game components properly organized.
                </p>

                <div className="space-y-3">
                  {[
                    { name: "Workspace", description: "Game world, terrain, and models" },
                    { name: "ServerScriptService", description: "Server-side game logic" },
                    { name: "StarterPlayer", description: "Client scripts and player setup" },
                    { name: "StarterGui", description: "UI components and interfaces" },
                    { name: "ReplicatedStorage", description: "Shared modules and assets" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="plugin">
              <Card className="p-8 border-border space-y-6">
                <h2 className="text-2xl font-bold">Roblox Studio Plugin</h2>
                
                <p className="text-muted-foreground">
                  The NexusAI plugin enables live synchronization between our platform and Roblox Studio.
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Installation</h3>
                  <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                    <li>Download the plugin from your dashboard</li>
                    <li>Place it in your Roblox Studio plugins folder</li>
                    <li>Restart Roblox Studio</li>
                    <li>Enter your API key in plugin settings</li>
                  </ol>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card className="p-8 border-border space-y-6">
                <h2 className="text-2xl font-bold">API Reference</h2>
                
                <p className="text-muted-foreground">
                  API access for programmatic game generation will be available for Enterprise users.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
