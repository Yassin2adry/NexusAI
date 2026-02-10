import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code, Layers, Download, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const spotlightX = useTransform(mouseX, (v) => `${v}px`);
  const spotlightY = useTransform(mouseY, (v) => `${v}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Mouse spotlight */}
      <motion.div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          left: spotlightX,
          top: spotlightY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.3), transparent 70%)",
        }}
      />
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Slow ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-pink/6 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
              <span className="text-xs font-medium text-foreground">AI-Powered Game Development</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="gradient-text-animated">NexusAI</span>
            <br />
            <span className="text-foreground">Build Roblox Games</span>
            <br />
            <span className="text-muted-foreground">in Minutes</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform ideas into complete Roblox games with multi-agent AI. 
            Generate scripts, UI, assets, and game logic instantly.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/signup">
              <Button size="xl" className="gap-2 shadow-glow group">
                Start Creating Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="xl" variant="outline" className="gap-2">
                Documentation
              </Button>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { icon: Code, title: "Full Scripts", desc: "Complete Luau code with modules" },
              { icon: Layers, title: "UI & Assets", desc: "Generated interfaces & resources" },
              { icon: Download, title: "Export Ready", desc: "Download RBXL for Studio" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-base"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/15 transition-colors">
                  <item.icon className="h-5 w-5 text-primary-glow" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-12 pt-12 border-t border-border/30"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              { value: "50K+", label: "Scripts Generated" },
              { value: "10K+", label: "Active Users" },
              { value: "4.9", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <motion.div 
                  className="text-3xl font-bold text-primary-glow mb-1"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
