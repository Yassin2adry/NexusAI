import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link2, 
  Sparkles, 
  Download,
  RefreshCw,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Plug,
  Cloud
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const features = [
  {
    icon: RefreshCw,
    title: "Real-Time Sync",
    description: "Instant synchronization between NexusAI and Roblox Studio",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Live Updates",
    description: "Push and pull changes without leaving Studio",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Shield,
    title: "Secure Connection",
    description: "API key authentication for complete security",
    gradient: "from-green-500 to-emerald-500",
  },
];

const steps = [
  { step: "1", title: "Download Plugin", description: "Get the NexusAI plugin from your dashboard" },
  { step: "2", title: "Install in Studio", description: "Place the plugin in your Roblox Studio plugins folder" },
  { step: "3", title: "Connect Account", description: "Enter your API key from the Account page to link your account" },
  { step: "4", title: "Start Syncing", description: "Projects automatically sync between NexusAI and Studio" },
];

const pluginFeatures = [
  "Bidirectional synchronization",
  "Project version control",
  "Script hot-reloading",
  "Asset management",
  "Real-time collaboration",
  "Conflict resolution",
  "Backup and restore",
  "Team permissions",
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="p-6 glass-panel text-center relative overflow-hidden h-full">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0`}
            animate={{ opacity: isHovered ? 0.1 : 0 }}
          />

          <motion.div 
            className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 relative z-10`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>

          <motion.h3 
            className="text-xl font-bold mb-2 relative z-10 transition-colors"
            animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
          >
            {feature.title}
          </motion.h3>

          <p className="text-sm text-muted-foreground relative z-10">
            {feature.description}
          </p>

          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

const StepCard = ({ item, index }: { item: typeof steps[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-start gap-6 p-6 rounded-xl glass-panel relative overflow-hidden group"
        whileHover={{ x: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        <motion.div 
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xl font-bold flex-shrink-0 relative z-10"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {item.step}
        </motion.div>

        <div className="flex-1 relative z-10">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-glow transition-colors">
            {item.title}
          </h3>
          <p className="text-muted-foreground">{item.description}</p>
        </div>

        <motion.div
          className="relative z-10"
          animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0.3 }}
        >
          <ArrowRight className="h-6 w-6 text-primary-glow" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function StudioSync() {
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: true });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={35} />
            <FloatingOrbs />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
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
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Link2 className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Real-Time Integration</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  Studio Sync
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Connect NexusAI directly to Roblox Studio for seamless project synchronization
              </motion.p>
            </motion.div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} index={i} />
              ))}
            </div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-panel mb-12 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Plug className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold">How It Works</h2>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {steps.map((item, i) => (
                    <StepCard key={item.step} item={item} index={i} />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-panel mb-12 relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                />

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Cloud className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold">Plugin Features</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {pluginFeatures.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-3 p-4 rounded-lg glass-panel group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm group-hover:text-primary-glow transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 30 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-panel text-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-glow" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-4 relative z-10">Ready to Connect?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto relative z-10">
                  Download the plugin and get your API key from your account dashboard to start syncing
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="gap-2 group relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      />
                      <Download className="h-5 w-5 group-hover:animate-bounce relative z-10" />
                      <span className="relative z-10">Download Plugin</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="gap-2" onClick={() => window.location.href = '/account'}>
                      <Shield className="h-5 w-5" />
                      Get API Key
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
