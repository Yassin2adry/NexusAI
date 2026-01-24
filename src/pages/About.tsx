import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Sparkles, Zap, Users, Award, Heart, Target, Lightbulb, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";
import { Card } from "@/components/ui/card";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "We continuously push the boundaries of AI technology to provide the most advanced and intuitive game development tools for the Roblox platform.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Community",
    description: "Our thriving community of creators shares ideas, provides feedback, and helps shape the future of AI-powered game development.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Quality",
    description: "Every feature we build is designed with quality and user experience in mind, ensuring reliable and professional results.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Creativity",
    description: "We empower creators to focus on their vision while our AI handles the technical complexity of game development.",
    gradient: "from-green-500 to-emerald-500",
  },
];

const ValueCard = ({ value, index }: { value: typeof values[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = value.icon;

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
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="p-6 glass-panel h-full relative overflow-hidden border-border/50">
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 50%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Gradient blob */}
          <motion.div
            className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${value.gradient} blur-3xl pointer-events-none`}
            animate={{
              opacity: isHovered ? 0.3 : 0.1,
              scale: isHovered ? 1.3 : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10">
            <motion.div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.gradient} mb-4`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>

            <motion.h3 
              className="text-2xl font-bold mb-3 transition-colors"
              animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
            >
              {value.title}
            </motion.h3>

            <p className="text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </div>

          {/* Bottom accent */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${value.gradient}`}
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

const About = () => {
  const missionRef = useRef(null);
  const storyRef = useRef(null);
  const isMissionInView = useInView(missionRef, { once: true });
  const isStoryInView = useInView(storyRef, { once: true });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navigation />
        
        <div className="container mx-auto px-4 py-24 relative">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField particleCount={30} />
            <FloatingOrbs />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header */}
            <motion.div 
              className="text-center mb-16"
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
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Our Story</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  About NexusAI
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Revolutionizing Roblox game development with AI
              </motion.p>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              ref={missionRef}
              initial={{ opacity: 0, y: 50 }}
              animate={isMissionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-panel mb-8 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Target className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>

                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    NexusAI is dedicated to democratizing game development on Roblox. We believe that everyone should have the power to bring their game ideas to life, regardless of their coding experience.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    By leveraging cutting-edge artificial intelligence, we provide creators with tools that transform simple prompts into fully functional Roblox games, complete with scripts, UI components, and assets.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {values.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </div>

            {/* Story Section */}
            <motion.div
              ref={storyRef}
              initial={{ opacity: 0, y: 50 }}
              animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-panel relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Globe className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold">Our Story</h2>
                  </div>

                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Founded by passionate game developers and AI researchers, NexusAI was born from the vision of making game creation accessible to everyone. We recognized the steep learning curve in traditional game development and set out to change that.
                    </p>
                    <p>
                      Through months of research and development, we created a platform that understands natural language and translates it into working Roblox games. Our AI has been trained on thousands of successful Roblox games, learning the patterns and best practices that make games engaging and fun.
                    </p>
                    <p>
                      Today, NexusAI serves creators worldwide, helping them turn their imagination into reality. We're just getting started on our mission to revolutionize game development.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
