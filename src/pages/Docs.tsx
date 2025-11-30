import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Zap, Code, Download, Sparkles } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">Complete Guide</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to use NexusAI to build amazing Roblox games
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8 glass-panel p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">Overview</TabsTrigger>
              <TabsTrigger value="quickstart" className="data-[state=active]:bg-primary/20">Quick Start</TabsTrigger>
              <TabsTrigger value="agents" className="data-[state=active]:bg-primary/20">AI Agents</TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-primary/20">Export</TabsTrigger>
              <TabsTrigger value="plugin" className="data-[state=active]:bg-primary/20">Plugin</TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-primary/20">API</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Book className="h-8 w-8 text-primary-glow" />
                  </div>
                  <h2 className="text-3xl font-bold">What is NexusAI?</h2>
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  NexusAI is an AI-powered Roblox game creation platform that uses multiple specialized 
                  AI agents to transform your ideas into complete, playable games with scripts, UI, and assets.
                </p>

                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl font-semibold">Key Features</h3>
                  <ul className="space-y-5 text-muted-foreground">
                    <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <Zap className="h-5 w-5 text-primary-glow" />
                      </div>
                      <div>
                        <strong className="text-foreground text-lg block mb-1">Multi-Agent System</strong>
                        <span>Six specialized AI agents collaborate on every aspect of your game</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <Code className="h-5 w-5 text-primary-glow" />
                      </div>
                      <div>
                        <strong className="text-foreground text-lg block mb-1">Complete Scripts</strong>
                        <span>Generates optimized Luau code with proper structure and best practices</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <Download className="h-5 w-5 text-primary-glow" />
                      </div>
                      <div>
                        <strong className="text-foreground text-lg block mb-1">One-Click Export</strong>
                        <span>Download ready-to-use RBXL files that open directly in Roblox Studio</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="quickstart" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <h2 className="text-3xl font-bold">Getting Started</h2>
                
                <div className="space-y-5">
                  {[
                    {
                      step: "1",
                      title: "Sign Up & Get Credits",
                      description: "Create your account and choose a plan with generation credits.",
                    },
                    {
                      step: "2",
                      title: "Describe Your Game",
                      description: "Go to the AI chat and describe your game idea in detail.",
                    },
                    {
                      step: "3",
                      title: "Watch AI Build",
                      description: "The AI generates your complete game with all necessary components.",
                    },
                    {
                      step: "4",
                      title: "Export & Play",
                      description: "Download your RBXL file and open it in Roblox Studio.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="p-6 rounded-xl glass-panel hover-glow transition-all">
                      <h3 className="font-semibold text-xl mb-3 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-lg font-bold">
                          {item.step}
                        </span>
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground ml-13 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <h2 className="text-3xl font-bold">AI Agent System</h2>
                
                <div className="space-y-4">
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
                    <div key={i} className="p-6 rounded-xl glass-panel hover-glow transition-all">
                      <h3 className="font-semibold text-xl mb-2 text-primary-glow">{agent.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <h2 className="text-3xl font-bold">Export System</h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  NexusAI generates complete RBXL files containing all game components properly organized.
                </p>

                <div className="space-y-4">
                  {[
                    { name: "Workspace", description: "Game world, terrain, and models" },
                    { name: "ServerScriptService", description: "Server-side game logic" },
                    { name: "StarterPlayer", description: "Client scripts and player setup" },
                    { name: "StarterGui", description: "UI components and interfaces" },
                    { name: "ReplicatedStorage", description: "Shared modules and assets" },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl glass-panel hover-glow transition-all">
                      <h3 className="font-semibold text-xl mb-2">{item.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="plugin" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <h2 className="text-3xl font-bold">Roblox Studio Plugin</h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  The NexusAI plugin enables live synchronization between our platform and Roblox Studio.
                </p>

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Installation</h3>
                  <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                    <li className="p-4 rounded-lg bg-muted/30">Download the plugin from your dashboard</li>
                    <li className="p-4 rounded-lg bg-muted/30">Place it in your Roblox Studio plugins folder</li>
                    <li className="p-4 rounded-lg bg-muted/30">Restart Roblox Studio</li>
                    <li className="p-4 rounded-lg bg-muted/30">Enter your API key in plugin settings</li>
                  </ol>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="animate-fade-in">
              <Card className="p-10 glass-panel hover-glow space-y-8">
                <h2 className="text-3xl font-bold">API Reference</h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
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
