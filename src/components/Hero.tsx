import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Download } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            AI-Powered Roblox<br />Game Generator
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into complete Roblox games with advanced multi-agent AI. 
            Generate scripts, UI, assets, and logic in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Creating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="gap-2">
                View Docs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <Code className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Full Scripts</h3>
              <p className="text-sm text-muted-foreground">Complete Luau code with modules and logic</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <Layers className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">UI & Assets</h3>
              <p className="text-sm text-muted-foreground">Generated interfaces and organized structure</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <Download className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Export Ready</h3>
              <p className="text-sm text-muted-foreground">Download RBXL files for Roblox Studio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
