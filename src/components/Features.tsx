import { Bot, Code2, Palette, Boxes, Download, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Multi-Agent AI System",
    description: "Six specialized AI agents work together: Game Designer, World Builder, Script Engineer, UI Designer, Asset Manager, and Validator.",
    color: "primary",
  },
  {
    icon: Code2,
    title: "Full Luau Scripts",
    description: "Generate complete, optimized scripts with modules, server/client logic, and proper error handling.",
    color: "secondary",
  },
  {
    icon: Palette,
    title: "UI & Asset Generation",
    description: "Create responsive UIs, icons, layouts, and organize your Roblox explorer properly.",
    color: "accent",
  },
  {
    icon: Boxes,
    title: "Any Game Type",
    description: "Build battle royales, simulators, tycoons, obbies, horror games, RPGs, and more.",
    color: "primary",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Download complete RBXL files with scripts, UI, and assets ready for Roblox Studio.",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Live Refinement",
    description: "Iterate on your game with AI. Add features, fix bugs, or modify systems in real-time.",
    color: "accent",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Powered by <span className="text-gradient-cyber">Advanced AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our multi-agent system handles every aspect of game development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="glass border-border/50 p-6 hover:border-primary/50 transition-all group animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-${feature.color}/10 border border-${feature.color}/20 mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
