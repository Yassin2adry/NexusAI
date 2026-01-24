import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, Rocket, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const plans = [
  {
    name: "Starter",
    price: "$19",
    credits: "500 credits/mo",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "500 generation credits",
      "Basic game types",
      "Script generation",
      "UI components",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    credits: "1,500 credits/mo",
    icon: Rocket,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "1,500 generation credits",
      "All game types",
      "Advanced scripts",
      "Custom UI & assets",
      "Priority support",
      "Plugin access",
      "Version history",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    credits: "10,000 credits/mo",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    features: [
      "10,000 generation credits",
      "Unlimited game types",
      "Premium AI models",
      "White-label option",
      "Dedicated support",
      "API access",
      "Team collaboration",
    ],
  },
];

const PricingCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = plan.icon;

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
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <motion.div
        ref={cardRef}
        className={`relative ${plan.popular ? "md:-mt-8 md:mb-8" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Popular badge */}
        {plan.popular && (
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={`px-4 py-1.5 bg-gradient-to-r ${plan.gradient} text-white rounded-full text-sm font-medium shadow-lg`}>
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Most Popular
              </motion.span>
            </div>
          </motion.div>
        )}

        <Card className={`p-8 glass-panel h-full relative overflow-hidden border-border/50 ${plan.popular ? "border-primary/50" : ""}`}>
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.1), transparent 50%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Gradient blob */}
          <motion.div
            className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${plan.gradient} blur-3xl pointer-events-none`}
            animate={{
              opacity: isHovered ? 0.3 : 0.1,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>

            {/* Plan name */}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <motion.span 
                className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {plan.price}
              </motion.span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{plan.credits}</p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <motion.li 
                  key={j} 
                  className="flex items-start gap-3 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + j * 0.1 }}
                >
                  <motion.div 
                    className={`bg-gradient-to-br ${plan.gradient} rounded-full p-1 mt-0.5 flex-shrink-0`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                className={`w-full h-12 text-base font-semibold group relative overflow-hidden ${
                  plan.popular 
                    ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90` 
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: isHovered ? ["100%", "-100%"] : "-100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Bottom gradient line */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered || plan.popular ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default function Pricing() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

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
          
          <div className="relative z-10">
            {/* Header */}
            <motion.div 
              ref={headerRef}
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Simple, Transparent Pricing</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  Choose Your Plan
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                Start building incredible games today with flexible pricing options
              </motion.p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
              {plans.map((plan, i) => (
                <PricingCard key={plan.name} plan={plan} index={i} />
              ))}
            </div>

            {/* Footer note */}
            <motion.div 
              className="mt-16 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-glow" />
                All plans include one-click export and plugin access
                <Sparkles className="h-4 w-4 text-primary-glow" />
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
