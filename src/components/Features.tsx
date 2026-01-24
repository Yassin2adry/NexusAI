import { Brain, Wand2, FileCode, Layout, Layers, CheckCircle, Sparkles, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TiltCard } from "@/components/animations/TiltCard";

const features = [
  {
    icon: Brain,
    title: "AI Game Designer",
    description: "Create complete game design documents with mechanics, systems, and features using advanced AI.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0,
  },
  {
    icon: Wand2,
    title: "World Builder",
    description: "Generate immersive environments, terrain, and game world structures automatically.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: FileCode,
    title: "Script Engine",
    description: "Write professional Luau code with proper server/client architecture and optimizations.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.2,
  },
  {
    icon: Layout,
    title: "UI Generator",
    description: "Design responsive user interfaces and HUD components that match your game's style.",
    gradient: "from-orange-500 to-amber-500",
    delay: 0.3,
  },
  {
    icon: Layers,
    title: "Asset Manager",
    description: "Organize project structure and manage asset hierarchy for clean, professional projects.",
    gradient: "from-red-500 to-rose-500",
    delay: 0.4,
  },
  {
    icon: CheckCircle,
    title: "Code Validator",
    description: "Test scripts and validate code quality before export to ensure bug-free games.",
    gradient: "from-indigo-500 to-violet-500",
    delay: 0.5,
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = feature.icon;

  return (
    <TiltCard
      className="h-full"
      glowOnHover
    >
      <motion.div
        className="relative h-full p-6 rounded-xl glass-panel border border-border/50 overflow-hidden group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: feature.delay }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
        />
        
        {/* Floating particles on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-glow rounded-full"
                  initial={{ 
                    x: Math.random() * 100, 
                    y: Math.random() * 100,
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    y: [null, -50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity 
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Icon container */}
        <motion.div 
          className={`relative w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-full h-full bg-background rounded-[7px] flex items-center justify-center">
            <IconComponent className="h-7 w-7 text-primary-glow" />
          </div>
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-primary-glow" />
          </motion.div>
        </motion.div>

        {/* Title with gradient on hover */}
        <motion.h3 
          className="text-xl font-semibold mb-2 transition-all duration-300"
          animate={{ 
            color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))"
          }}
        >
          {feature.title}
        </motion.h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Bottom gradient line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`absolute top-2 right-2 w-8 h-0.5 bg-gradient-to-l ${feature.gradient} rounded-full`} />
          <div className={`absolute top-2 right-2 w-0.5 h-8 bg-gradient-to-b ${feature.gradient} rounded-full`} />
        </motion.div>
      </motion.div>
    </TiltCard>
  );
};

import { AnimatePresence } from "framer-motion";

export const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]"
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Zap className="h-4 w-4 text-primary-glow" />
            <span className="text-sm font-medium text-primary-glow">Powered by AI</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
              Multi-Agent AI
            </span>
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🤖
            </motion.span>
          </motion.h2>

          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Six specialized AI agents working together to build your perfect game
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Explore All Features</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
