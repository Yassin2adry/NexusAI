import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Sparkles,
  Code,
  Layout,
  Zap,
  Link2,
  Search,
  Play,
  Clock
} from "lucide-react";
import { useState } from "react";

const tutorials = [
  {
    id: 1,
    title: "Getting Started with Luau",
    category: "scripting",
    duration: "15 min",
    level: "beginner",
    description: "Learn the basics of Luau scripting for Roblox games",
    icon: Code,
  },
  {
    id: 2,
    title: "Building Modern UIs",
    category: "ui",
    duration: "20 min",
    level: "intermediate",
    description: "Create professional user interfaces with modern design principles",
    icon: Layout,
  },
  {
    id: 3,
    title: "Script Optimization Guide",
    category: "optimization",
    duration: "25 min",
    level: "advanced",
    description: "Optimize your scripts for better performance and efficiency",
    icon: Zap,
  },
  {
    id: 4,
    title: "Studio Sync Setup",
    category: "plugin",
    duration: "10 min",
    level: "beginner",
    description: "Connect NexusAI to Roblox Studio for seamless workflow",
    icon: Link2,
  },
  {
    id: 5,
    title: "AI Tool Mastery",
    category: "ai",
    duration: "30 min",
    level: "intermediate",
    description: "Master all NexusAI tools for maximum productivity",
    icon: Sparkles,
  },
  {
    id: 6,
    title: "Advanced Combat Systems",
    category: "scripting",
    duration: "45 min",
    level: "advanced",
    description: "Build complex combat mechanics with proper architecture",
    icon: Code,
  },
];

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredTutorials = tutorials.filter(tutorial => 
    (selectedLevel === "all" || tutorial.level === selectedLevel) &&
    (tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <BookOpen className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">Knowledge Base</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              Learn
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master Roblox game development with comprehensive tutorials and guides
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 glass-panel mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Tutorials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredTutorials.map((tutorial) => {
              const TutorialIcon = tutorial.icon;
              return (
                <Card key={tutorial.id} className="p-6 glass-panel hover-glow transition-all hover:scale-105 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      tutorial.category === 'scripting' ? 'bg-blue-500/10' :
                      tutorial.category === 'ui' ? 'bg-purple-500/10' :
                      tutorial.category === 'optimization' ? 'bg-yellow-500/10' :
                      tutorial.category === 'plugin' ? 'bg-green-500/10' :
                      'bg-primary/10'
                    }`}>
                      <TutorialIcon className="h-6 w-6 text-primary-glow" />
                    </div>
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

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Start learning</span>
                    <Play className="h-4 w-4 text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredTutorials.length === 0 && (
            <Card className="p-12 glass-panel text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">No tutorials found matching your criteria</p>
            </Card>
          )}

          {/* Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 glass-panel text-center hover-glow transition-all">
              <Code className="h-10 w-10 mx-auto mb-3 text-primary-glow" />
              <div className="text-2xl font-bold mb-1">12</div>
              <div className="text-sm text-muted-foreground">Scripting Guides</div>
            </Card>
            <Card className="p-6 glass-panel text-center hover-glow transition-all">
              <Layout className="h-10 w-10 mx-auto mb-3 text-primary-glow" />
              <div className="text-2xl font-bold mb-1">8</div>
              <div className="text-sm text-muted-foreground">UI Tutorials</div>
            </Card>
            <Card className="p-6 glass-panel text-center hover-glow transition-all">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary-glow" />
              <div className="text-2xl font-bold mb-1">15</div>
              <div className="text-sm text-muted-foreground">AI Tool Guides</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
