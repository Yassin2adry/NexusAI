import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/animations/TiltCard";
import { AnimatedLetters, AnimatedWords } from "@/components/animations/TypewriterText";
import { ParticleField, FloatingOrbs, GridOverlay } from "@/components/animations/ParticleField";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Animated background layers */}
      <div className="absolute inset-0 animated-gradient" />
      <FloatingOrbs />
      <ParticleField particleCount={40} />
      <GridOverlay />
      
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_-100px,hsl(270_100%_65%/0.15),transparent_70%)]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <FadeIn delay={0.2}>
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel glow-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-primary-glow" />
              </motion.div>
              <span className="text-sm text-foreground/80">AI-Powered Game Development</span>
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
              Transform your ideas into complete Roblox games with advanced multi-agent AI. 
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
                    className="gap-2 text-lg px-8 py-6 glow-box hover:glow-box-intense transition-all duration-300 group"
                  >
                    Start Creating 
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
                    className="gap-2 text-lg px-8 py-6 glass-panel hover-glow"
                  >
                    View Docs
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>

          {/* Feature Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto" staggerDelay={0.15}>
            {[
              { icon: Code, title: "Full Scripts", desc: "Complete Luau code with modules and logic" },
              { icon: Layers, title: "UI & Assets", desc: "Generated interfaces and organized structure" },
              { icon: Download, title: "Export Ready", desc: "Download RBXL files for Roblox Studio" },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <TiltCard className="h-full">
                  <motion.div 
                    className="group p-8 rounded-xl glass-panel hover-glow h-full"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
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
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
