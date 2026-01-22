import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Sparkles,
  Code,
  Layout,
  Zap,
  Link2,
  Search,
  Play,
  Clock,
  CheckCircle2,
  ArrowRight,
  Video,
  FileText,
  Gamepad2,
  Bot,
  Settings,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";
import { TiltCard } from "@/components/animations/TiltCard";

interface Tutorial {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  content: string;
  videoUrl?: string;
  icon: any;
}

const tutorials: Tutorial[] = [
  {
    id: "getting-started-luau",
    title: "Getting Started with Luau",
    category: "scripting",
    duration: "15 min",
    level: "beginner",
    description: "Learn the basics of Luau scripting for Roblox games",
    content: `# Getting Started with Luau

Luau is Roblox's programming language, derived from Lua. This guide will teach you the fundamentals.

## Variables and Types

\`\`\`lua
local playerName = "Player1"  -- string
local score = 100             -- number
local isAlive = true          -- boolean
local inventory = {}          -- table
\`\`\`

## Functions

\`\`\`lua
local function greetPlayer(name)
    print("Welcome, " .. name .. "!")
end

greetPlayer("Alex")
\`\`\`

## Events

\`\`\`lua
game.Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined the game!")
end)
\`\`\`

## Tips
- Always use \`local\` for variables
- Use descriptive variable names
- Comment your code for clarity`,
    icon: Code,
  },
  {
    id: "modern-ui-design",
    title: "Building Modern UIs",
    category: "ui",
    duration: "20 min",
    level: "intermediate",
    description: "Create professional user interfaces with modern design principles",
    content: `# Building Modern UIs

Learn how to create stunning user interfaces for your Roblox games.

## UI Hierarchy

\`\`\`
ScreenGui
├── Frame (Container)
│   ├── UICorner
│   ├── UIStroke
│   └── TextLabel
└── ImageLabel (Background)
\`\`\`

## Best Practices

1. **Use UIScale** for responsive layouts
2. **Apply UICorner** for rounded edges
3. **Add UIGradient** for depth
4. **Implement UIStroke** for outlines

## Animation Tips

\`\`\`lua
local TweenService = game:GetService("TweenService")

local function fadeIn(element)
    element.BackgroundTransparency = 1
    local tween = TweenService:Create(element, TweenInfo.new(0.5), {
        BackgroundTransparency = 0
    })
    tween:Play()
end
\`\`\``,
    icon: Layout,
  },
  {
    id: "script-optimization",
    title: "Script Optimization Guide",
    category: "optimization",
    duration: "25 min",
    level: "advanced",
    description: "Optimize your scripts for better performance and efficiency",
    content: `# Script Optimization Guide

Master the art of writing efficient Luau code.

## Memory Management

\`\`\`lua
-- Bad: Creating functions in loops
for i = 1, 100 do
    button.Clicked:Connect(function() end)
end

-- Good: Define function once
local function onClick() end
button.Clicked:Connect(onClick)
\`\`\`

## Caching

\`\`\`lua
-- Bad: Repeated calls
for i = 1, 1000 do
    game.Players.LocalPlayer.Character
end

-- Good: Cache the reference
local character = game.Players.LocalPlayer.Character
for i = 1, 1000 do
    -- use character
end
\`\`\`

## Event Cleanup

\`\`\`lua
local connection = event:Connect(handler)

-- When done:
connection:Disconnect()
\`\`\``,
    icon: Zap,
  },
  {
    id: "studio-sync-setup",
    title: "Studio Sync Setup",
    category: "plugin",
    duration: "10 min",
    level: "beginner",
    description: "Connect NexusAI to Roblox Studio for seamless workflow",
    content: `# Studio Sync Setup

Connect NexusAI directly to Roblox Studio.

## Installation Steps

1. Open Roblox Studio
2. Go to Plugins > Plugin Manager
3. Search for "NexusAI Sync"
4. Install the plugin

## Configuration

1. Click the NexusAI icon in Studio
2. Enter your API token from nexusai.com/studio-sync
3. Click "Connect"

## Features

- **Real-time sync**: Changes push instantly
- **Script updates**: AI-generated code appears in Studio
- **Asset management**: Import assets directly

## Troubleshooting

- Ensure you're logged into NexusAI
- Check your internet connection
- Regenerate token if expired`,
    icon: Link2,
  },
  {
    id: "ai-tools-mastery",
    title: "AI Tool Mastery",
    category: "ai",
    duration: "30 min",
    level: "intermediate",
    description: "Master all NexusAI tools for maximum productivity",
    content: `# AI Tool Mastery

Learn to leverage NexusAI's full potential.

## Script Generator

The Script Generator creates complete Luau scripts from descriptions.

**Tips:**
- Be specific about functionality
- Mention script type (Server/Client/Module)
- Include desired events

## UI Builder

Create interfaces with natural language.

**Example prompts:**
- "Create a modern inventory system"
- "Build a settings menu with audio controls"

## AI Chat

Your personal game development assistant.

**Best practices:**
- Ask for explanations, not just code
- Request multiple approaches
- Iterate on suggestions

## Advanced Features

- **Mode Selection**: Choose Fast, Balanced, or Quality
- **Context**: Reference previous messages
- **Export**: Download generated code`,
    icon: Sparkles,
  },
  {
    id: "combat-systems",
    title: "Advanced Combat Systems",
    category: "scripting",
    duration: "45 min",
    level: "advanced",
    description: "Build complex combat mechanics with proper architecture",
    content: `# Advanced Combat Systems

Create professional combat mechanics for your game.

## Architecture

\`\`\`
CombatSystem/
├── Server/
│   ├── CombatManager
│   └── DamageHandler
├── Client/
│   └── CombatController
└── Shared/
    └── CombatConfig
\`\`\`

## Damage System

\`\`\`lua
local function calculateDamage(attacker, defender, baseDamage)
    local attackPower = attacker:GetAttribute("Attack") or 10
    local defense = defender:GetAttribute("Defense") or 5
    
    local damage = baseDamage * (attackPower / defense)
    return math.floor(damage)
end
\`\`\`

## Cooldown Management

\`\`\`lua
local cooldowns = {}

local function canAttack(player)
    local lastAttack = cooldowns[player.UserId] or 0
    return tick() - lastAttack >= 0.5
end
\`\`\``,
    icon: Code,
  },
  {
    id: "roblox-api-integration",
    title: "Roblox API Integration",
    category: "scripting",
    duration: "35 min",
    level: "intermediate",
    description: "Use Roblox's APIs for advanced game features",
    content: `# Roblox API Integration

Leverage Roblox's built-in APIs for powerful features.

## DataStoreService

\`\`\`lua
local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData")

local function saveData(player, data)
    local success, err = pcall(function()
        playerData:SetAsync(player.UserId, data)
    end)
    return success
end
\`\`\`

## MessagingService

\`\`\`lua
local MessagingService = game:GetService("MessagingService")

MessagingService:SubscribeAsync("Announcements", function(message)
    -- Handle cross-server messages
end)
\`\`\``,
    icon: Settings,
  },
  {
    id: "multiplayer-basics",
    title: "Multiplayer Game Basics",
    category: "scripting",
    duration: "40 min",
    level: "intermediate",
    description: "Build multiplayer features with RemoteEvents and RemoteFunctions",
    content: `# Multiplayer Game Basics

Create multiplayer experiences in Roblox.

## Client-Server Communication

\`\`\`lua
-- Server Script
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RemoteEvent = ReplicatedStorage.MyEvent

RemoteEvent.OnServerEvent:Connect(function(player, data)
    print(player.Name .. " sent: " .. tostring(data))
end)
\`\`\`

## Best Practices

1. **Never trust the client**
2. **Validate all inputs**
3. **Rate limit requests**
4. **Use RemoteFunctions sparingly**`,
    icon: Users,
  },
];

const categories = [
  { id: "all", name: "All Tutorials", icon: BookOpen },
  { id: "scripting", name: "Scripting", icon: Code },
  { id: "ui", name: "UI Design", icon: Layout },
  { id: "optimization", name: "Optimization", icon: Zap },
  { id: "ai", name: "AI Tools", icon: Bot },
  { id: "plugin", name: "Plugin", icon: Link2 },
];

export default function Learn() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("user_progress")
      .select("tutorial_id, progress_percent, completed")
      .eq("user_id", user.id);

    if (data) {
      const progressMap: Record<string, number> = {};
      data.forEach(p => {
        progressMap[p.tutorial_id] = p.completed ? 100 : p.progress_percent;
      });
      setUserProgress(progressMap);
    }
  };

  const updateProgress = async (tutorialId: string, percent: number) => {
    if (!user) return;

    const completed = percent >= 100;
    
    const { error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: user.id,
        tutorial_id: tutorialId,
        progress_percent: Math.min(percent, 100),
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      }, { onConflict: "user_id,tutorial_id" });

    if (!error) {
      setUserProgress(prev => ({ ...prev, [tutorialId]: percent }));
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => 
    (selectedCategory === "all" || tutorial.category === selectedCategory) &&
    (selectedLevel === "all" || tutorial.level === selectedLevel) &&
    (tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedCount = Object.values(userProgress).filter(p => p >= 100).length;
  const totalProgress = tutorials.length > 0 
    ? Math.round((completedCount / tutorials.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Background */}
      <div className="absolute inset-0 animated-gradient opacity-30" />
      <ParticleField particleCount={25} />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="mb-12 text-center">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="h-4 w-4 text-primary-glow" />
                <span className="text-sm text-muted-foreground">Knowledge Base</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-animated">
                Learn
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master Roblox game development with comprehensive tutorials and guides
              </p>
            </div>
          </FadeIn>

          {/* Progress Overview */}
          {user && (
            <FadeIn delay={0.1}>
              <Card className="p-6 glass-panel mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Your Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {tutorials.length} tutorials completed
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary-glow">
                    {totalProgress}%
                  </div>
                </div>
                <Progress value={totalProgress} className="h-2" />
              </Card>
            </FadeIn>
          )}

          {/* Search and Filters */}
          <FadeIn delay={0.2}>
            <Card className="p-6 glass-panel mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tutorials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-glow"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {["all", "beginner", "intermediate", "advanced"].map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel(level)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="gap-2"
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </Button>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Tutorial Detail View */}
          <AnimatePresence mode="wait">
            {selectedTutorial ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-8 glass-panel mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTutorial(null)}
                    className="mb-4"
                  >
                    ← Back to tutorials
                  </Button>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge className="mb-2 capitalize">{selectedTutorial.level}</Badge>
                      <h2 className="text-3xl font-bold mb-2">{selectedTutorial.title}</h2>
                      <p className="text-muted-foreground">{selectedTutorial.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {selectedTutorial.duration}
                    </div>
                  </div>

                  {user && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">
                          {userProgress[selectedTutorial.id] || 0}%
                        </span>
                      </div>
                      <Progress value={userProgress[selectedTutorial.id] || 0} className="h-2" />
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedTutorial.content}
                    </pre>
                  </div>

                  {user && (
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={() => updateProgress(selectedTutorial.id, 50)}
                        variant="outline"
                      >
                        Mark as In Progress
                      </Button>
                      <Button
                        onClick={() => updateProgress(selectedTutorial.id, 100)}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Tutorials Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
                  {filteredTutorials.map((tutorial) => {
                    const TutorialIcon = tutorial.icon;
                    const progress = userProgress[tutorial.id] || 0;
                    const isCompleted = progress >= 100;
                    
                    return (
                      <StaggerItem key={tutorial.id}>
                        <TiltCard>
                          <Card 
                            className="p-6 glass-panel hover-glow transition-all group cursor-pointer h-full relative overflow-hidden"
                            onClick={() => setSelectedTutorial(tutorial)}
                          >
                            {isCompleted && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-start justify-between mb-4">
                              <motion.div 
                                className={`p-3 rounded-xl ${
                                  tutorial.category === 'scripting' ? 'bg-blue-500/10' :
                                  tutorial.category === 'ui' ? 'bg-purple-500/10' :
                                  tutorial.category === 'optimization' ? 'bg-yellow-500/10' :
                                  tutorial.category === 'plugin' ? 'bg-green-500/10' :
                                  'bg-primary/10'
                                }`}
                                whileHover={{ rotate: 10, scale: 1.1 }}
                              >
                                <TutorialIcon className="h-6 w-6 text-primary-glow" />
                              </motion.div>
                              <Badge variant={
                                tutorial.level === 'beginner' ? 'secondary' :
                                tutorial.level === 'intermediate' ? 'default' :
                                'outline'
                              } className="capitalize">
                                {tutorial.level}
                              </Badge>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                              {tutorial.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {tutorial.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{tutorial.duration}</span>
                              </div>
                              <Badge variant="outline" className="capitalize text-xs">
                                {tutorial.category}
                              </Badge>
                            </div>

                            {user && progress > 0 && progress < 100 && (
                              <Progress value={progress} className="h-1 mb-4" />
                            )}

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {isCompleted ? 'Completed' : progress > 0 ? 'Continue' : 'Start learning'}
                              </span>
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                <ArrowRight className="h-4 w-4 text-primary-glow" />
                              </motion.div>
                            </div>
                          </Card>
                        </TiltCard>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>

                {filteredTutorials.length === 0 && (
                  <Card className="p-12 glass-panel text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground text-lg">No tutorials found matching your criteria</p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <FadeIn delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: Code, count: tutorials.filter(t => t.category === 'scripting').length, label: "Scripting Guides" },
                { icon: Layout, count: tutorials.filter(t => t.category === 'ui').length, label: "UI Tutorials" },
                { icon: Sparkles, count: tutorials.filter(t => t.category === 'ai').length, label: "AI Tool Guides" },
              ].map((stat, i) => (
                <TiltCard key={i}>
                  <Card className="p-6 glass-panel text-center hover-glow transition-all">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="inline-block"
                    >
                      <stat.icon className="h-10 w-10 mx-auto mb-3 text-primary-glow" />
                    </motion.div>
                    <div className="text-2xl font-bold mb-1">{stat.count}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </TiltCard>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <Footer />
    </div>
  );
}
