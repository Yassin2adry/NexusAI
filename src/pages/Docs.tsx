import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code, Download, Plug, Sparkles, Wrench } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient-cyber">Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Learn how to build amazing Roblox games with NexusAI
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-muted/50 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="plugin">Plugin</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="glass border-border/50 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Book className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">What is NexusAI?</h2>
                </div>
                
                <p className="text-foreground/80 leading-relaxed">
                  NexusAI is an advanced AI-powered Roblox game creation platform that uses multiple specialized AI agents 
                  to transform your ideas into complete, playable Roblox experiences. Unlike traditional game development, 
                  NexusAI handles everything from concept to code.
                </p>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold">Key Features</h3>
                  <ul className="space-y-3 text-foreground/80">
                    <li className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Multi-Agent System:</strong> Six specialized AI agents work together on every aspect</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Complete Scripts:</strong> Generates optimized Luau code with proper structure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>One-Click Export:</strong> Download ready-to-use RBXL files</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Plug className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Studio Plugin:</strong> Live sync between NexusAI and Roblox Studio</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="quickstart">
              <Card className="glass border-border/50 p-8 space-y-6">
                <h2 className="text-2xl font-bold">Getting Started</h2>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                      Sign Up & Get Credits
                    </h3>
                    <p className="text-sm text-foreground/80 ml-8">
                      Create your account and choose a plan that fits your needs. Each plan comes with generation credits.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                      Describe Your Game
                    </h3>
                    <p className="text-sm text-foreground/80 ml-8">
                      Go to the workspace and type your game idea. Be specific about gameplay, mechanics, and features.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                      Watch AI Build
                    </h3>
                    <p className="text-sm text-foreground/80 ml-8">
                      The AI terminal shows each agent working on your game in real-time, from design to code.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
                      Export & Play
                    </h3>
                    <p className="text-sm text-foreground/80 ml-8">
                      Download your RBXL file and open it in Roblox Studio. Your game is ready to test and publish!
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="agents">
              <Card className="glass border-border/50 p-8 space-y-6">
                <h2 className="text-2xl font-bold">AI Agent System</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Game Designer Agent",
                      description: "Analyzes your prompt and creates a complete game design document including mechanics, systems, theme, difficulty curve, and monetization strategy.",
                    },
                    {
                      name: "World Builder Agent",
                      description: "Generates the game environment, terrain layout, spawn points, prop placement, lighting, and atmosphere settings.",
                    },
                    {
                      name: "Script Engineer Agent",
                      description: "Writes all Luau scripts including server/client logic, modules, game systems, and ensures error-free code.",
                    },
                    {
                      name: "UI Agent",
                      description: "Creates responsive UI layouts, HUDs, menus, and interactive components with proper scaling and animations.",
                    },
                    {
                      name: "Asset Agent",
                      description: "Organizes the Roblox explorer tree, manages assets, and ensures proper file structure and naming conventions.",
                    },
                    {
                      name: "Validator Agent",
                      description: "Tests all scripts, checks for errors, validates logic, and provides debug reports with suggested fixes.",
                    },
                  ].map((agent, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border/30">
                      <h3 className="font-bold mb-2 text-primary">{agent.name}</h3>
                      <p className="text-sm text-foreground/80">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card className="glass border-border/50 p-8 space-y-6">
                <h2 className="text-2xl font-bold">Export System</h2>
                
                <p className="text-foreground/80">
                  NexusAI generates complete RBXL/RBXLX files that contain everything your game needs:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h3 className="font-bold mb-2">📁 Workspace</h3>
                    <p className="text-sm text-foreground/80">Game world, terrain, models, and environment</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h3 className="font-bold mb-2">📜 ServerScriptService</h3>
                    <p className="text-sm text-foreground/80">Server-side game logic and backend scripts</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h3 className="font-bold mb-2">🎮 StarterPlayer</h3>
                    <p className="text-sm text-foreground/80">Client scripts and player character setup</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h3 className="font-bold mb-2">🖼️ StarterGui</h3>
                    <p className="text-sm text-foreground/80">UI components, HUD, menus, and interfaces</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h3 className="font-bold mb-2">🔄 ReplicatedStorage</h3>
                    <p className="text-sm text-foreground/80">Shared modules and assets accessible by both server and client</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="plugin">
              <Card className="glass border-border/50 p-8 space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Plug className="h-6 w-6 text-primary" />
                  Roblox Studio Plugin
                </h2>
                
                <p className="text-foreground/80">
                  The NexusAI plugin enables live sync between our platform and Roblox Studio:
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Installation</h3>
                  <ol className="space-y-3 list-decimal list-inside text-foreground/80">
                    <li>Download the plugin from your dashboard</li>
                    <li>Place it in your Roblox Studio plugins folder</li>
                    <li>Restart Roblox Studio</li>
                    <li>Enter your API key in the plugin settings</li>
                  </ol>

                  <h3 className="text-xl font-bold pt-4">Features</h3>
                  <ul className="space-y-3 text-foreground/80">
                    <li className="flex items-start gap-3">
                      <Wrench className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Live Sync:</strong> Automatically receive updates from NexusAI</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Import Assets:</strong> Pull scripts, models, and UI directly into your game</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Push Changes:</strong> Send modified assets back to NexusAI for AI improvements</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card className="glass border-border/50 p-8 space-y-6">
                <h2 className="text-2xl font-bold">API Reference</h2>
                
                <p className="text-foreground/80">
                  Coming soon: Direct API access for advanced integrations and custom workflows.
                </p>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground/80">
                    Enterprise users will have access to our API for programmatic game generation, 
                    custom integrations, and automated workflows.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
