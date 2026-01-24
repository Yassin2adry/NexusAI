import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Beaker, 
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket,
  Target,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const experiments = [
  {
    name: "GPT-5 Integration",
    status: "active",
    description: "Testing next-gen language model for better code generation",
    progress: 75,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Visual Scripting",
    status: "beta",
    description: "Node-based visual programming interface for beginners",
    progress: 60,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Voice Commands",
    status: "coming",
    description: "Create games using voice input and natural language",
    progress: 30,
    gradient: "from-purple-500 to-pink-500",
  },
];

const updates = [
  {
    date: "2025-11-28",
    version: "v2.4.0",
    title: "Enhanced AI Models",
    gradient: "from-primary to-primary-glow",
    changes: [
      "Added Expert mode with 2x smarter responses",
      "Improved script optimization algorithms",
      "Better error detection and fixing",
      "Faster map generation",
    ],
  },
  {
    date: "2025-11-20",
    version: "v2.3.0",
    title: "UI Builder Improvements",
    gradient: "from-accent to-primary",
    changes: [
      "New drag-and-drop preview",
      "Custom color scheme support",
      "Responsive design templates",
      "Animation presets",
    ],
  },
];

const roadmapItems = [
  {
    quarter: "Q1 2025",
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Advanced terrain generation",
      "Real-time collaboration",
      "Mobile app support",
    ],
  },
  {
    quarter: "Q2 2025",
    gradient: "from-purple-500 to-pink-500",
    features: [
      "3D model generation",
      "Animation timeline editor",
      "Team workspaces",
    ],
  },
  {
    quarter: "Q3 2025",
    gradient: "from-green-500 to-emerald-500",
    features: [
      "Multiplayer systems generator",
      "Economy balance tools",
      "Advanced analytics",
    ],
  },
];

const ExperimentCard = ({ exp, index }: { exp: typeof experiments[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div whileHover={{ y: -5, scale: 1.01 }}>
        <Card className="p-6 glass-panel relative overflow-hidden group">
          <motion.div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exp.gradient} blur-3xl pointer-events-none`}
            animate={{ opacity: isHovered ? 0.3 : 0.1, scale: isHovered ? 1.2 : 1 }}
          />

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`p-2 rounded-lg bg-gradient-to-br ${exp.gradient}`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Zap className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold group-hover:text-primary-glow transition-colors">{exp.name}</h3>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
            </div>
            <Badge variant={
              exp.status === 'active' ? 'default' : 
              exp.status === 'beta' ? 'secondary' : 
              'outline'
            }>
              {exp.status}
            </Badge>
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <motion.span 
                className="font-medium"
                key={exp.progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {exp.progress}%
              </motion.span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${exp.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${exp.progress}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const UpdateCard = ({ update, index }: { update: typeof updates[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div whileHover={{ y: -5 }}>
        <Card className="p-6 glass-panel relative overflow-hidden group">
          <motion.div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${update.gradient} blur-3xl pointer-events-none`}
            animate={{ opacity: isHovered ? 0.3 : 0.1 }}
          />

          <div className="flex items-start gap-4 mb-4 relative z-10">
            <motion.div 
              className={`p-2 rounded-lg bg-gradient-to-br ${update.gradient}`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold group-hover:text-primary-glow transition-colors">{update.title}</h3>
                <Badge className={`bg-gradient-to-r ${update.gradient} text-white border-0`}>{update.version}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>{new Date(update.date).toLocaleDateString()}</span>
              </div>
              <ul className="space-y-2">
                {update.changes.map((change, j) => (
                  <motion.li 
                    key={j} 
                    className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + j * 0.1 }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{change}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default function AILab() {
  const [activeTab, setActiveTab] = useState("experiments");

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
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Beaker className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Experimental Features</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  AI Lab
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Explore cutting-edge AI features and upcoming improvements
              </motion.p>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="grid grid-cols-3 w-full mb-8 glass-panel p-1 h-14">
                  {[
                    { id: "experiments", label: "Experiments", icon: Beaker },
                    { id: "updates", label: "Updates", icon: TrendingUp },
                    { id: "roadmap", label: "Roadmap", icon: Target },
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-primary/20 flex items-center gap-2 transition-all"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                <TabsContent value="experiments" className="space-y-6">
                  {experiments.map((exp, i) => (
                    <ExperimentCard key={exp.name} exp={exp} index={i} />
                  ))}
                </TabsContent>

                <TabsContent value="updates" className="space-y-6">
                  {updates.map((update, i) => (
                    <UpdateCard key={update.version} update={update} index={i} />
                  ))}
                </TabsContent>

                <TabsContent value="roadmap" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 glass-panel relative overflow-hidden">
                      <motion.div
                        className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
                      />

                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Rocket className="h-6 w-6 text-primary-glow" />
                        </motion.div>
                        Coming Soon
                      </h3>

                      <div className="space-y-6 relative z-10">
                        {roadmapItems.map((roadmap, i) => (
                          <motion.div 
                            key={i} 
                            className="p-4 rounded-xl glass-panel group"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.15 }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={`bg-gradient-to-r ${roadmap.gradient} text-white border-0`}>
                                {roadmap.quarter}
                              </Badge>
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="h-4 w-4 text-primary-glow" />
                              </motion.div>
                            </div>
                            <ul className="space-y-2 ml-4">
                              {roadmap.features.map((feature, j) => (
                                <motion.li 
                                  key={j} 
                                  className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 + j * 0.1 }}
                                >
                                  <motion.div 
                                    className={`h-2 w-2 rounded-full bg-gradient-to-r ${roadmap.gradient}`}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: j * 0.2 }}
                                  />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="p-6 glass-panel bg-gradient-to-r from-primary/10 to-transparent relative overflow-hidden">
                      <div className="flex items-start gap-4 relative z-10">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <AlertCircle className="h-6 w-6 text-primary-glow flex-shrink-0 mt-1" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold mb-2">Want to Request a Feature?</h4>
                          <p className="text-sm text-muted-foreground">
                            We're always listening to our community. Share your ideas and help shape the future of NexusAI!
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
