import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(270_100%_60%/0.1),transparent_50%)]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4">
            <Sparkles className="h-4 w-4 text-primary-glow" />
            <span className="text-sm text-muted-foreground">AI-Powered Game Development</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
            NexusAI – Build Roblox<br />Games in Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into complete Roblox games with advanced multi-agent AI. 
            Generate scripts, UI, assets, and logic instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/signup">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 hover-glow group">
                Start Creating 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 glass-panel hover-glow">
                View Docs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            <div className="group p-8 rounded-xl glass-panel hover-glow transition-all duration-300 hover:scale-105">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Full Scripts</h3>
              <p className="text-sm text-muted-foreground">Complete Luau code with modules and logic</p>
            </div>
            
            <div className="group p-8 rounded-xl glass-panel hover-glow transition-all duration-300 hover:scale-105">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Layers className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="font-semibold text-lg mb-2">UI & Assets</h3>
              <p className="text-sm text-muted-foreground">Generated interfaces and organized structure</p>
            </div>
            
            <div className="group p-8 rounded-xl glass-panel hover-glow transition-all duration-300 hover:scale-105">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Download className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Export Ready</h3>
              <p className="text-sm text-muted-foreground">Download RBXL files for Roblox Studio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
