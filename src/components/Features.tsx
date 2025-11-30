import { Bot, FileCode, Palette, Box, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Multi-Agent AI System",
    description: "Six specialized AI agents collaborate: Game Designer, World Builder, Script Engineer, UI Designer, Asset Manager, and Validator.",
  },
  {
    icon: FileCode,
    title: "Complete Scripts",
    description: "Generate optimized Luau code with proper structure, modules, and server/client logic.",
  },
  {
    icon: Palette,
    title: "UI Components",
    description: "Create responsive interfaces with HUDs, menus, and interactive elements.",
  },
  {
    icon: Box,
    title: "Asset Organization",
    description: "Properly structured Roblox explorer with organized folders and naming conventions.",
  },
  {
    icon: Zap,
    title: "Real-Time Generation",
    description: "Watch AI agents work step-by-step through the live terminal interface.",
  },
  {
    icon: CheckCircle,
    title: "Quality Validation",
    description: "Automated testing and error checking before export to ensure code quality.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful AI-Driven Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology that handles every aspect of game development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
