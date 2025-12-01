import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Beaker, 
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AILab() {
  const experiments = [
    {
      name: "GPT-5 Integration",
      status: "active",
      description: "Testing next-gen language model for better code generation",
      progress: 75,
    },
    {
      name: "Visual Scripting",
      status: "beta",
      description: "Node-based visual programming interface for beginners",
      progress: 60,
    },
    {
      name: "Voice Commands",
      status: "coming",
      description: "Create games using voice input and natural language",
      progress: 30,
    },
  ];

  const updates = [
    {
      date: "2025-11-28",
      version: "v2.4.0",
      title: "Enhanced AI Models",
      changes: [
        "Added Expert mode with 2x smarter responses",
        "Improved script optimization algorithms",
        "Better error detection and fixing",
        "Faster map generation",
      ],
    },
    {
      date: "2025-11-20",
      version: "v2.3.0",
      title: "UI Builder Improvements",
      changes: [
        "New drag-and-drop preview",
        "Custom color scheme support",
        "Responsive design templates",
        "Animation presets",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Beaker className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">Experimental Features</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              AI Lab
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore cutting-edge AI features and upcoming improvements
            </p>
          </div>

          <Tabs defaultValue="experiments" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-8 glass-panel p-1">
              <TabsTrigger value="experiments">Experiments</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>

            <TabsContent value="experiments" className="space-y-6 animate-fade-in">
              {experiments.map((exp, i) => (
                <Card key={i} className="p-6 glass-panel hover-glow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="h-6 w-6 text-primary-glow" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{exp.name}</h3>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </div>
                    <Badge variant={
                      exp.status === 'active' ? 'default' : 
                      exp.status === 'beta' ? 'secondary' : 
                      'outline'
                    }>
                      {exp.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{exp.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all"
                        style={{ width: `${exp.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="updates" className="space-y-6 animate-fade-in">
              {updates.map((update, i) => (
                <Card key={i} className="p-6 glass-panel hover-glow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary-glow" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{update.title}</h3>
                        <Badge>{update.version}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                      <ul className="space-y-2">
                        {update.changes.map((change, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6 animate-fade-in">
              <Card className="p-6 glass-panel">
                <h3 className="text-2xl font-bold mb-6">Coming Soon</h3>
                <div className="space-y-4">
                  {[
                    {
                      quarter: "Q1 2025",
                      features: [
                        "Advanced terrain generation",
                        "Real-time collaboration",
                        "Mobile app support",
                      ],
                    },
                    {
                      quarter: "Q2 2025",
                      features: [
                        "3D model generation",
                        "Animation timeline editor",
                        "Team workspaces",
                      ],
                    },
                    {
                      quarter: "Q3 2025",
                      features: [
                        "Multiplayer systems generator",
                        "Economy balance tools",
                        "Advanced analytics",
                      ],
                    },
                  ].map((roadmap, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{roadmap.quarter}</Badge>
                        <Sparkles className="h-4 w-4 text-primary-glow" />
                      </div>
                      <ul className="space-y-2 ml-4">
                        {roadmap.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 glass-panel bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-primary-glow flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Want to Request a Feature?</h4>
                    <p className="text-sm text-muted-foreground">
                      We're always listening to our community. Share your ideas and help shape the future of NexusAI!
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
