import { Brain, Wand2, FileCode, Layout, Layers, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Game Designer",
    description: "Create complete game design documents with mechanics, systems, and features using advanced AI.",
  },
  {
    icon: Wand2,
    title: "World Builder",
    description: "Generate immersive environments, terrain, and game world structures automatically.",
  },
  {
    icon: FileCode,
    title: "Script Engine",
    description: "Write professional Luau code with proper server/client architecture and optimizations.",
  },
  {
    icon: Layout,
    title: "UI Generator",
    description: "Design responsive user interfaces and HUD components that match your game's style.",
  },
  {
    icon: Layers,
    title: "Asset Manager",
    description: "Organize project structure and manage asset hierarchy for clean, professional projects.",
  },
  {
    icon: CheckCircle,
    title: "Code Validator",
    description: "Test scripts and validate code quality before export to ensure bug-free games.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powered by Multi-Agent AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six specialized AI agents working together to build your perfect game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl glass-panel hover-glow transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-glow transition-colors">
                {feature.title}
              </h3>
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
