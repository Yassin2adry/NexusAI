import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link2, 
  Sparkles, 
  Download,
  RefreshCw,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function StudioSync() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Link2 className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-muted-foreground">Real-Time Integration</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              Studio Sync
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect NexusAI directly to Roblox Studio for seamless project synchronization
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
            <Card className="p-6 glass-panel hover-glow transition-all text-center">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <RefreshCw className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
              <p className="text-sm text-muted-foreground">
                Instant synchronization between NexusAI and Roblox Studio
              </p>
            </Card>

            <Card className="p-6 glass-panel hover-glow transition-all text-center">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <Zap className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Updates</h3>
              <p className="text-sm text-muted-foreground">
                Push and pull changes without leaving Studio
              </p>
            </Card>

            <Card className="p-6 glass-panel hover-glow transition-all text-center">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Connection</h3>
              <p className="text-sm text-muted-foreground">
                API key authentication for complete security
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="p-8 glass-panel hover-glow mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Download Plugin",
                  description: "Get the NexusAI plugin from your dashboard",
                },
                {
                  step: "2",
                  title: "Install in Studio",
                  description: "Place the plugin in your Roblox Studio plugins folder",
                },
                {
                  step: "3",
                  title: "Connect Account",
                  description: "Enter your API key from the Account page to link your account",
                },
                {
                  step: "4",
                  title: "Start Syncing",
                  description: "Projects automatically sync between NexusAI and Studio",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 p-6 rounded-xl glass-panel hover-glow transition-all">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xl font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground opacity-50 flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Features List */}
          <Card className="p-8 glass-panel hover-glow mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Plugin Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Bidirectional synchronization",
                "Project version control",
                "Script hot-reloading",
                "Asset management",
                "Real-time collaboration",
                "Conflict resolution",
                "Backup and restore",
                "Team permissions",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* API Connection */}
          <Card className="p-8 glass-panel hover-glow text-center animate-fade-in">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-glow" />
            <h2 className="text-2xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Download the plugin and get your API key from your account dashboard to start syncing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Download Plugin
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => window.location.href = '/account'}>
                <Shield className="h-5 w-5" />
                Get API Key
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
