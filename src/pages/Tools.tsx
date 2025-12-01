import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Code, 
  Layout, 
  Map, 
  Bug, 
  Zap, 
  Film, 
  MessageSquare, 
  Boxes, 
  Hammer,
  Mountain,
  Sparkles
} from "lucide-react";

const tools = [
  {
    id: "script-generator",
    name: "AI Script Generator",
    description: "Generate optimized Luau scripts for any game mechanic or system",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    credits: 5,
  },
  {
    id: "ui-builder",
    name: "AI UI Builder",
    description: "Create modern, responsive user interfaces with custom designs",
    icon: Layout,
    color: "from-purple-500 to-pink-500",
    credits: 3,
  },
  {
    id: "map-creator",
    name: "AI Map Creator",
    description: "Generate complete game maps with terrain and structures",
    icon: Map,
    color: "from-green-500 to-emerald-500",
    credits: 8,
  },
  {
    id: "bug-fixer",
    name: "AI Bug Fixer",
    description: "Analyze and fix errors in your Luau code automatically",
    icon: Bug,
    color: "from-red-500 to-orange-500",
    credits: 2,
  },
  {
    id: "optimization-tool",
    name: "AI Optimization Tool",
    description: "Optimize scripts for better performance and efficiency",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    credits: 3,
  },
  {
    id: "animation-maker",
    name: "AI Animation Maker",
    description: "Create custom animations and tween sequences",
    icon: Film,
    color: "from-indigo-500 to-purple-500",
    credits: 4,
  },
  {
    id: "dialogue-writer",
    name: "AI Dialogue Writer",
    description: "Generate NPC dialogue and quest text for your game",
    icon: MessageSquare,
    color: "from-pink-500 to-rose-500",
    credits: 2,
  },
  {
    id: "module-maker",
    name: "AI Module Maker",
    description: "Build reusable ModuleScripts with proper structure",
    icon: Boxes,
    color: "from-teal-500 to-cyan-500",
    credits: 4,
  },
  {
    id: "build-assistant",
    name: "AI Build Assistant",
    description: "Get guidance on building structures and game worlds",
    icon: Hammer,
    color: "from-orange-500 to-red-500",
    credits: 3,
  },
  {
    id: "obby-generator",
    name: "AI Obby Generator",
    description: "Generate complete obby courses with unique obstacles",
    icon: Mountain,
    color: "from-violet-500 to-purple-500",
    credits: 6,
  },
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">AI-Powered Tools</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              NexusAI Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional AI tools for every aspect of Roblox game development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="group"
                >
                  <Card className="p-6 glass-panel hover-glow transition-all h-full hover:scale-105 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                        {tool.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {tool.credits} {tool.credits === 1 ? 'credit' : 'credits'} per use
                        </span>
                        <Sparkles className="h-4 w-4 text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
