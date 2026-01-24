import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Zap, Code, Download, Sparkles, Rocket, Settings, Terminal, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const DocSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const FeatureItem = ({ icon: Icon, title, description, index }: { 
  icon: any; 
  title: string; 
  description: string; 
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li 
      className="flex items-start gap-4 p-4 rounded-xl glass-panel transition-all relative overflow-hidden group"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: 5 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <motion.div 
        className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-lg mt-1 relative z-10"
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="h-5 w-5 text-primary-glow" />
      </motion.div>
      
      <div className="relative z-10">
        <strong className="text-foreground text-lg block mb-1">{title}</strong>
        <span className="text-muted-foreground">{description}</span>
      </div>
    </motion.li>
  );
};

const StepCard = ({ step, title, description, index }: { 
  step: string; 
  title: string; 
  description: string; 
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="p-6 rounded-xl glass-panel relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <h3 className="font-semibold text-xl mb-3 flex items-center gap-3 relative z-10">
        <motion.span 
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-lg font-bold"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {step}
        </motion.span>
        <span className="group-hover:text-primary-glow transition-colors">{title}</span>
      </h3>
      <p className="text-muted-foreground ml-13 leading-relaxed relative z-10">{description}</p>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
};

export default function Docs() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "quickstart", label: "Quick Start", icon: Rocket },
    { id: "agents", label: "AI Agents", icon: Zap },
    { id: "export", label: "Export", icon: Download },
    { id: "plugin", label: "Plugin", icon: Settings },
    { id: "api", label: "API", icon: Terminal },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={30} />
            <FloatingOrbs />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
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
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Book className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Complete Guide</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  Documentation
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Learn how to use NexusAI to build amazing Roblox games
              </motion.p>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8 glass-panel p-1 h-auto">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id}
                      value={tab.id} 
                      className="data-[state=active]:bg-primary/20 py-3 flex items-center gap-2 transition-all"
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden md:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                <TabsContent key="overview" value="overview">
                  <DocSection>
                    <Card className="p-10 glass-panel space-y-8 relative overflow-hidden">
                      <motion.div
                        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Book className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">What is NexusAI?</h2>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                        NexusAI is an AI-powered Roblox game creation platform that uses multiple specialized 
                        AI agents to transform your ideas into complete, playable games with scripts, UI, and assets.
                      </p>

                      <div className="space-y-6 pt-4 relative z-10">
                        <h3 className="text-2xl font-semibold">Key Features</h3>
                        <ul className="space-y-5">
                          <FeatureItem 
                            icon={Zap} 
                            title="Multi-Agent System" 
                            description="Six specialized AI agents collaborate on every aspect of your game"
                            index={0}
                          />
                          <FeatureItem 
                            icon={Code} 
                            title="Complete Scripts" 
                            description="Generates optimized Luau code with proper structure and best practices"
                            index={1}
                          />
                          <FeatureItem 
                            icon={Download} 
                            title="One-Click Export" 
                            description="Download ready-to-use RBXL files that open directly in Roblox Studio"
                            index={2}
                          />
                        </ul>
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>

                <TabsContent key="quickstart" value="quickstart">
                  <DocSection delay={0.1}>
                    <Card className="p-10 glass-panel space-y-8 relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                      />

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Rocket className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">Getting Started</h2>
                      </div>
                      
                      <div className="space-y-5 relative z-10">
                        {[
                          { step: "1", title: "Sign Up & Get Credits", description: "Create your account and choose a plan with generation credits." },
                          { step: "2", title: "Describe Your Game", description: "Go to the AI chat and describe your game idea in detail." },
                          { step: "3", title: "Watch AI Build", description: "The AI generates your complete game with all necessary components." },
                          { step: "4", title: "Export & Play", description: "Download your RBXL file and open it in Roblox Studio." },
                        ].map((item, i) => (
                          <StepCard key={item.step} {...item} index={i} />
                        ))}
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>

                <TabsContent key="agents" value="agents">
                  <DocSection delay={0.1}>
                    <Card className="p-10 glass-panel space-y-8 relative overflow-hidden">
                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Zap className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">AI Agent System</h2>
                      </div>
                      
                      <div className="grid gap-4 relative z-10">
                        {[
                          { name: "Game Designer Agent", description: "Creates complete game design documents with mechanics, systems, and features.", gradient: "from-purple-500 to-pink-500" },
                          { name: "World Builder Agent", description: "Generates environment, terrain, and game world structure.", gradient: "from-blue-500 to-cyan-500" },
                          { name: "Script Engineer Agent", description: "Writes all Luau scripts with proper server/client architecture.", gradient: "from-green-500 to-emerald-500" },
                          { name: "UI Agent", description: "Creates responsive user interfaces and HUD components.", gradient: "from-orange-500 to-amber-500" },
                          { name: "Asset Agent", description: "Organizes project structure and manages asset hierarchy.", gradient: "from-red-500 to-rose-500" },
                          { name: "Validator Agent", description: "Tests scripts and validates code quality before export.", gradient: "from-indigo-500 to-violet-500" },
                        ].map((agent, i) => (
                          <motion.div 
                            key={i} 
                            className="p-6 rounded-xl glass-panel relative overflow-hidden group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            whileHover={{ x: 5, scale: 1.01 }}
                          >
                            <motion.div
                              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${agent.gradient} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}
                            />
                            <h3 className="font-semibold text-xl mb-2 text-primary-glow relative z-10">{agent.name}</h3>
                            <p className="text-muted-foreground leading-relaxed relative z-10">{agent.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>

                <TabsContent key="export" value="export">
                  <DocSection delay={0.1}>
                    <Card className="p-10 glass-panel space-y-8">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Download className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">Export System</h2>
                      </div>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        NexusAI generates complete RBXL files containing all game components properly organized.
                      </p>

                      <div className="grid gap-4">
                        {[
                          { name: "Workspace", description: "Game world, terrain, and models" },
                          { name: "ServerScriptService", description: "Server-side game logic" },
                          { name: "StarterPlayer", description: "Client scripts and player setup" },
                          { name: "StarterGui", description: "UI components and interfaces" },
                          { name: "ReplicatedStorage", description: "Shared modules and assets" },
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            className="p-6 rounded-xl glass-panel group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <h3 className="font-semibold text-xl mb-2 group-hover:text-primary-glow transition-colors">{item.name}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>

                <TabsContent key="plugin" value="plugin">
                  <DocSection delay={0.1}>
                    <Card className="p-10 glass-panel space-y-8">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Settings className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">Roblox Studio Plugin</h2>
                      </div>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        The NexusAI plugin enables live synchronization between our platform and Roblox Studio.
                      </p>

                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Installation</h3>
                        <ol className="space-y-4">
                          {[
                            "Download the plugin from your dashboard",
                            "Place it in your Roblox Studio plugins folder",
                            "Restart Roblox Studio",
                            "Enter your API key in plugin settings",
                          ].map((step, i) => (
                            <motion.li 
                              key={i} 
                              className="p-4 rounded-lg glass-panel flex items-center gap-4 group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm">
                                {i + 1}
                              </span>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors">{step}</span>
                            </motion.li>
                          ))}
                        </ol>
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>

                <TabsContent key="api" value="api">
                  <DocSection delay={0.1}>
                    <Card className="p-10 glass-panel space-y-8">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Terminal className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold">API Reference</h2>
                      </div>
                      
                      <div className="p-8 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="h-12 w-12 text-primary-glow mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          API access for programmatic game generation will be available for Enterprise users.
                        </p>
                      </div>
                    </Card>
                  </DocSection>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
