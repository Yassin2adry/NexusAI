import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Code, 
  Layout, 
  Map, 
  Bug, 
  Zap, 
  Film, 
  MessageSquare, 
  Boxes, 
  Hammer,
  Mountain,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const tools = [
  {
    id: "script-generator",
    name: "AI Script Generator",
    description: "Generate optimized Luau scripts for any game mechanic or system",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    credits: 5,
  },
  {
    id: "ui-builder",
    name: "AI UI Builder",
    description: "Create modern, responsive user interfaces with custom designs",
    icon: Layout,
    gradient: "from-purple-500 to-pink-500",
    credits: 3,
  },
  {
    id: "map-creator",
    name: "AI Map Creator",
    description: "Generate complete game maps with terrain and structures",
    icon: Map,
    gradient: "from-green-500 to-emerald-500",
    credits: 8,
  },
  {
    id: "bug-fixer",
    name: "AI Bug Fixer",
    description: "Analyze and fix errors in your Luau code automatically",
    icon: Bug,
    gradient: "from-red-500 to-orange-500",
    credits: 2,
  },
  {
    id: "optimization-tool",
    name: "AI Optimization Tool",
    description: "Optimize scripts for better performance and efficiency",
    icon: Zap,
    gradient: "from-yellow-500 to-amber-500",
    credits: 3,
  },
  {
    id: "animation-maker",
    name: "AI Animation Maker",
    description: "Create custom animations and tween sequences",
    icon: Film,
    gradient: "from-indigo-500 to-purple-500",
    credits: 4,
  },
  {
    id: "dialogue-writer",
    name: "AI Dialogue Writer",
    description: "Generate NPC dialogue and quest text for your game",
    icon: MessageSquare,
    gradient: "from-pink-500 to-rose-500",
    credits: 2,
  },
  {
    id: "module-maker",
    name: "AI Module Maker",
    description: "Build reusable ModuleScripts with proper structure",
    icon: Boxes,
    gradient: "from-teal-500 to-cyan-500",
    credits: 4,
  },
  {
    id: "build-assistant",
    name: "AI Build Assistant",
    description: "Get guidance on building structures and game worlds",
    icon: Hammer,
    gradient: "from-orange-500 to-red-500",
    credits: 3,
  },
  {
    id: "obby-generator",
    name: "AI Obby Generator",
    description: "Generate complete obby courses with unique obstacles",
    icon: Mountain,
    gradient: "from-violet-500 to-purple-500",
    credits: 6,
  },
];

const ToolCard = ({ tool, index }: { tool: typeof tools[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = tool.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/tools/${tool.id}`} className="block group">
        <motion.div
          ref={cardRef}
          className="relative h-full"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="p-6 glass-panel h-full relative overflow-hidden border-border/50">
            {/* Gradient spotlight effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 50%)`,
              }}
            />
            
            {/* Animated corner gradient */}
            <motion.div 
              className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${tool.gradient} blur-3xl pointer-events-none`}
              animate={{ 
                opacity: isHovered ? 0.25 : 0.1,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ 
                x: isHovered ? "100%" : "-100%",
                opacity: isHovered ? 0.3 : 0,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(90deg, transparent, white, transparent)",
                mixBlendMode: "overlay",
              }}
            />

            <div className="relative z-10">
              {/* Icon with gradient background */}
              <motion.div 
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.gradient} mb-4 relative overflow-hidden`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="h-6 w-6 text-white relative z-10" />
                
                {/* Icon glow */}
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{ 
                    opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Title */}
              <motion.h3 
                className="text-xl font-bold mb-2 transition-colors"
                animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
              >
                {tool.name}
              </motion.h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {tool.description}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {tool.credits} {tool.credits === 1 ? 'credit' : 'credits'} per use
                </span>
                
                <motion.div
                  className="flex items-center gap-1 text-primary-glow"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs font-medium">Open</span>
                  <ArrowRight className="h-3 w-3" />
                </motion.div>
              </div>
            </div>
            
            {/* Bottom gradient line */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tool.gradient}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function Tools() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={40} />
            <FloatingOrbs />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">AI-Powered Tools</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  NexusAI Tools
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Professional AI tools for every aspect of Roblox game development
              </motion.p>
            </motion.div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
