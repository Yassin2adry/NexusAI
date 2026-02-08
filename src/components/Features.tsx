import { Brain, Wand2, FileCode, Layout, Layers, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Game Designer",
    description: "Create complete game design documents with mechanics, systems, and features.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
  },
  {
    icon: Wand2,
    title: "World Builder",
    description: "Generate immersive environments, terrain, and game world structures.",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
  },
  {
    icon: FileCode,
    title: "Script Engine",
    description: "Write professional Luau code with proper server/client architecture.",
    color: "text-neon-green",
    bg: "bg-neon-green/10",
  },
  {
    icon: Layout,
    title: "UI Generator",
    description: "Design responsive user interfaces and HUD components.",
    color: "text-neon-orange",
    bg: "bg-neon-orange/10",
  },
  {
    icon: Layers,
    title: "Asset Manager",
    description: "Organize project structure and manage asset hierarchy.",
    color: "text-neon-pink",
    bg: "bg-neon-pink/10",
  },
  {
    icon: CheckCircle,
    title: "Code Validator",
    description: "Test scripts and validate code quality before export.",
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary-glow">Powered by AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Multi-Agent <span className="text-primary-glow">AI System</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six specialized AI agents working together to build your perfect game
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card interactive glow className="h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
