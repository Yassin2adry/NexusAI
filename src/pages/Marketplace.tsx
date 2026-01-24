import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Code, 
  Layout, 
  Sparkles, 
  Download, 
  Star,
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const marketplaceItems = [
  {
    id: 1,
    name: "Advanced Inventory System",
    type: "script",
    description: "Complete inventory management with UI, drag-drop, and persistence",
    creator: "DevMaster",
    price: 25,
    rating: 4.8,
    downloads: 342,
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Modern Shop UI Pack",
    type: "ui",
    description: "Sleek shop interface with animations and sound effects",
    creator: "UIProDesigns",
    price: 15,
    rating: 4.9,
    downloads: 521,
    icon: Layout,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Combat System Module",
    type: "module",
    description: "Full combat framework with weapons, damage, and effects",
    creator: "CombatKing",
    price: 30,
    rating: 4.7,
    downloads: 289,
    icon: Package,
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: 4,
    name: "Particle Effects Pack",
    type: "effects",
    description: "50+ premium particle effects for abilities and attacks",
    creator: "FXMaster",
    price: 20,
    rating: 5.0,
    downloads: 412,
    icon: Sparkles,
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: 5,
    name: "Quest System Framework",
    type: "script",
    description: "Complete quest system with objectives, rewards, and tracking",
    creator: "QuestPro",
    price: 35,
    rating: 4.6,
    downloads: 198,
    icon: Code,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 6,
    name: "Mobile UI Kit",
    type: "ui",
    description: "Touch-optimized UI components for mobile games",
    creator: "MobileGuru",
    price: 18,
    rating: 4.8,
    downloads: 445,
    icon: Layout,
    gradient: "from-indigo-500 to-violet-500",
  },
];

const MarketplaceCard = ({ item, index }: { item: typeof marketplaceItems[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const ItemIcon = item.icon;

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
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="p-6 glass-panel h-full relative overflow-hidden border-border/50 group">
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 50%)`,
            }}
          />

          {/* Gradient blob */}
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} blur-3xl pointer-events-none`}
            animate={{
              opacity: isHovered ? 0.3 : 0.1,
              scale: isHovered ? 1.3 : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ItemIcon className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Badge variant="secondary" className="capitalize bg-muted/50 backdrop-blur-sm">
                  {item.type}
                </Badge>
              </motion.div>
            </div>

            {/* Title */}
            <motion.h3 
              className="text-xl font-bold mb-2 transition-colors"
              animate={{ color: isHovered ? "hsl(var(--primary-glow))" : "hsl(var(--foreground))" }}
            >
              {item.name}
            </motion.h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {item.description}
            </p>

            {/* Creator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>by</span>
              <span className="font-medium text-foreground">{item.creator}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <motion.div 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{item.rating}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-1 text-muted-foreground"
                whileHover={{ scale: 1.1 }}
              >
                <Download className="h-4 w-4" />
                <span>{item.downloads}</span>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="font-semibold">{item.price} credits</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="gap-2 group/btn relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: isHovered ? ["100%", "-100%"] : "-100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <Download className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Get</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient}`}
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

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any; value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-6 glass-panel text-center group hover:border-primary/50 transition-colors">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
        </motion.div>
        <motion.div 
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
        </motion.div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </Card>
    </motion.div>
  );
};

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFocused, setIsFocused] = useState(false);

  const filteredItems = marketplaceItems.filter(item => 
    (selectedCategory === "all" || item.type === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <motion.div 
              className="mb-12 text-center"
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
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Package className="h-4 w-4 text-primary-glow" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Community Assets</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  Marketplace
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Browse and download AI-generated assets from the community
              </motion.p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 glass-panel mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <motion.div 
                    className="flex-1 relative"
                    animate={{
                      boxShadow: isFocused 
                        ? "0 0 20px hsl(var(--primary) / 0.3)" 
                        : "0 0 0px transparent",
                    }}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary-glow"
                    />
                  </motion.div>
                  
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full h-12">
                      {["all", "script", "ui", "module", "effects"].map((tab) => (
                        <TabsTrigger 
                          key={tab} 
                          value={tab}
                          className="capitalize data-[state=active]:bg-primary/20 transition-all"
                        >
                          {tab === "all" ? "All" : tab === "ui" ? "UI Packs" : `${tab}s`}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </Card>
            </motion.div>

            {/* Marketplace Items */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map((item, index) => (
                  <MarketplaceCard key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-12 glass-panel text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  </motion.div>
                  <p className="text-muted-foreground text-lg">No assets found matching your search</p>
                </Card>
              </motion.div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <StatCard icon={TrendingUp} value="1,247" label="Total Assets" delay={0.4} />
              <StatCard icon={Download} value="15,342" label="Downloads" delay={0.5} />
              <StatCard icon={Clock} value="24/7" label="Updated Daily" delay={0.6} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
