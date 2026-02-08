import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code, Layers, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-sm font-medium text-foreground">AI-Powered Game Development</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="gradient-text-animated">NexusAI</span>
            <br />
            <span className="text-foreground">Build Roblox Games</span>
            <br />
            <span className="text-muted-foreground">in Minutes</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform your ideas into complete Roblox games with advanced multi-agent AI. 
            Generate scripts, UI, assets, and logic instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
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
                View Documentation
              </Button>
            </Link>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { icon: Code, title: "Full Scripts", desc: "Complete Luau code with modules and services" },
              { icon: Layers, title: "UI & Assets", desc: "Generated interfaces and organized resources" },
              { icon: Download, title: "Export Ready", desc: "Download RBXL files for Roblox Studio" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl glass border border-border/50 hover:border-primary/30 transition-all duration-base hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="h-6 w-6 text-primary-glow" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-12 mt-16 pt-16 border-t border-border/50"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              { value: "50K+", label: "Scripts Generated" },
              { value: "10K+", label: "Active Users" },
              { value: "4.9", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary-glow mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
