import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Code, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-circuit">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 glow-primary">
            <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
            <span className="text-sm font-medium">Next-Gen AI Game Builder</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build Full
            <span className="text-gradient-cyber"> Roblox Games</span>
            <br />
            in Minutes
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Advanced multi-agent AI system that transforms your ideas into complete Roblox experiences
            with scripts, UI, assets, and logic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-cyber hover:opacity-90 transition-opacity glow-primary text-lg px-8 py-6"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Building Now
              </Button>
            </Link>
            <Link to="/docs">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 text-lg px-8 py-6"
              >
                <Code className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            {[
              { icon: Layers, text: "Multi-Agent AI" },
              { icon: Code, text: "Full Scripts" },
              { icon: Sparkles, text: "UI & Assets" },
              { icon: Rocket, text: "One-Click Export" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-border/50 hover:border-primary/50 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards demo */}
        <div className="mt-20 relative h-64 hidden lg:block">
          <div className="absolute top-0 left-1/4 glass p-4 rounded-lg border border-primary/20 glow-primary animate-float">
            <Code className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium">Script Generator</p>
          </div>
          <div
            className="absolute top-16 right-1/4 glass p-4 rounded-lg border border-secondary/20 glow-secondary animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <Layers className="h-6 w-6 text-secondary mb-2" />
            <p className="text-sm font-medium">UI Builder</p>
          </div>
          <div
            className="absolute bottom-0 left-1/3 glass p-4 rounded-lg border border-accent/20 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="h-6 w-6 text-accent mb-2" />
            <p className="text-sm font-medium">Asset Creator</p>
          </div>
        </div>
      </div>
    </div>
  );
};
