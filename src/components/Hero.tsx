import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Download, Sparkles, Zap, Bot, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TiltCard } from "@/components/animations/TiltCard";
import { AnimatedLetters, AnimatedWords } from "@/components/animations/TypewriterText";
import { ParticleField, FloatingOrbs, GridOverlay } from "@/components/animations/ParticleField";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { useRef, useState } from "react";

// Mouse spotlight effect hook
const useMouseSpotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  return { position, handleMouseMove };
};

export const Hero = () => {
  const { position, handleMouseMove } = useMouseSpotlight();
  const containerRef = useRef<HTMLElement>(null);
  
  return (
    <section 
      ref={containerRef}
      className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background layers */}
      <div className="absolute inset-0 animated-gradient" />
      <FloatingOrbs />
      <ParticleField particleCount={50} />
      <GridOverlay />
      
      {/* Mouse-following spotlight */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: position.x - 300,
          top: position.y - 300,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          left: position.x - 300,
          top: position.y - 300,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />
      
      {/* Top spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_-100px,hsl(270_100%_65%/0.2),transparent_70%)]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <FadeIn delay={0.2}>
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-panel glow-border"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary-glow) / 0.3)" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-primary-glow" />
              </motion.div>
              <span className="text-sm font-medium text-foreground/90">AI-Powered Game Development</span>
              <motion.span 
                className="px-2 py-0.5 rounded-full bg-primary-glow/20 text-xs text-primary-glow font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEW
              </motion.span>
            </motion.div>
          </FadeIn>
          
          {/* Main headline */}
          <FadeIn delay={0.4}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <AnimatedLetters 
                text="NexusAI" 
                className="gradient-text-animated"
                delay={0.6}
                staggerDelay={0.05}
              />
              <br />
              <span className="text-foreground/90">
                <AnimatedWords 
                  text="Build Roblox Games in Minutes" 
                  delay={1.2}
                  staggerDelay={0.08}
                />
              </span>
            </h1>
          </FadeIn>
          
          {/* Subtitle */}
          <FadeIn delay={0.8}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into complete Roblox games with{" "}
              <span className="text-primary-glow font-semibold">advanced multi-agent AI</span>. 
              Generate scripts, UI, assets, and logic instantly.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="gap-2 text-lg px-10 py-7 glow-box hover:glow-box-intense transition-all duration-300 group"
                  >
                    <Zap className="h-5 w-5" />
                    Start Creating Free
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/docs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 text-lg px-10 py-7 glass-panel hover-glow"
                  >
                    View Documentation
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>

          {/* Multi-Agent AI Section */}
          <FadeIn delay={1.2}>
            <div className="pt-16 max-w-5xl mx-auto">
              <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Powered by <span className="gradient-text-animated">Multi-Agent AI</span>
                </h2>
                <p className="text-muted-foreground">
                  Specialized AI agents work together to build your complete game
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Code, title: "Script Agent", desc: "Luau code generation", color: "from-blue-500 to-cyan-500" },
                  { icon: Layers, title: "UI Agent", desc: "Interface design", color: "from-purple-500 to-pink-500" },
                  { icon: Bot, title: "Game Agent", desc: "Mechanics & logic", color: "from-orange-500 to-red-500" },
                  { icon: Wand2, title: "Asset Agent", desc: "Resource creation", color: "from-green-500 to-emerald-500" },
                ].map((agent, i) => (
                  <motion.div
                    key={i}
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className="p-6 rounded-xl glass-panel border border-border/50 h-full relative overflow-hidden"
                      whileHover={{ y: -5, borderColor: "hsl(var(--primary-glow) / 0.5)" }}
                    >
                      {/* Gradient background on hover */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      
                      <motion.div 
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mx-auto mb-3`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <agent.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <h4 className="font-semibold text-sm mb-1">{agent.title}</h4>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Feature Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto" staggerDelay={0.15}>
            {[
              { icon: Code, title: "Full Scripts", desc: "Complete Luau code with modules, services, and game logic" },
              { icon: Layers, title: "UI & Assets", desc: "Generated interfaces, organized structure, and resources" },
              { icon: Download, title: "Export Ready", desc: "Download RBXL files ready for Roblox Studio" },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <TiltCard className="h-full" glowOnHover>
                  <motion.div 
                    className="group p-8 rounded-xl glass-panel hover:border-primary-glow/50 transition-all h-full"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-primary/20 to-primary-glow/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon className="h-8 w-8 text-primary-glow" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-glow transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Stats */}
          <FadeIn delay={1.4}>
            <div className="pt-16 flex flex-wrap justify-center gap-12">
              {[
                { value: "50K+", label: "Scripts Generated" },
                { value: "10K+", label: "Active Users" },
                { value: "4.9", label: "User Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold gradient-text-animated"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
