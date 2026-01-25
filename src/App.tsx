import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { DailyLoginBonus } from "@/components/DailyLoginBonus";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const RobloxLink = lazy(() => import("./pages/RobloxLink"));
const Account = lazy(() => import("./pages/Account"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Docs = lazy(() => import("./pages/Docs"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Tools = lazy(() => import("./pages/Tools"));
const ScriptGenerator = lazy(() => import("./pages/tools/ScriptGenerator"));
const UIBuilder = lazy(() => import("./pages/tools/UIBuilder"));
const MapCreator = lazy(() => import("./pages/tools/MapCreator"));
const BugFixer = lazy(() => import("./pages/tools/BugFixer"));
const OptimizationTool = lazy(() => import("./pages/tools/OptimizationTool"));
const AnimationMaker = lazy(() => import("./pages/tools/AnimationMaker"));
const DialogueWriter = lazy(() => import("./pages/tools/DialogueWriter"));
const ModuleMaker = lazy(() => import("./pages/tools/ModuleMaker"));
const BuildAssistant = lazy(() => import("./pages/tools/BuildAssistant"));
const ObbyGenerator = lazy(() => import("./pages/tools/ObbyGenerator"));
const MarketplaceNew = lazy(() => import("./pages/MarketplaceNew"));
const StudioSync = lazy(() => import("./pages/StudioSync"));
const Projects = lazy(() => import("./pages/Projects"));
const AILab = lazy(() => import("./pages/AILab"));
const Learn = lazy(() => import("./pages/Learn"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Premium loading animation
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-primary-glow/30"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ 
            scale: [1, 2, 2.5],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
          style={{ width: 60, height: 60 }}
        />
      ))}
      
      {/* Center orb */}
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
        animate={{ 
          boxShadow: [
            "0 0 20px hsl(var(--primary-glow) / 0.4)",
            "0 0 40px hsl(var(--primary-glow) / 0.6)",
            "0 0 20px hsl(var(--primary-glow) / 0.4)",
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-8 h-8 rounded-full bg-background/20"
          animate={{ scale: [1, 0.8, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  </div>
);

// Route transition variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: "blur(10px)",
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }
  },
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/roblox-link" element={<RobloxLink />} />
            <Route path="/account" element={<Account />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/script-generator" element={<ScriptGenerator />} />
            <Route path="/tools/ui-builder" element={<UIBuilder />} />
            <Route path="/tools/map-creator" element={<MapCreator />} />
            <Route path="/tools/bug-fixer" element={<BugFixer />} />
            <Route path="/tools/optimization-tool" element={<OptimizationTool />} />
            <Route path="/tools/animation-maker" element={<AnimationMaker />} />
            <Route path="/tools/dialogue-writer" element={<DialogueWriter />} />
            <Route path="/tools/module-maker" element={<ModuleMaker />} />
            <Route path="/tools/build-assistant" element={<BuildAssistant />} />
            <Route path="/tools/obby-generator" element={<ObbyGenerator />} />
            <Route path="/marketplace" element={<MarketplaceNew />} />
            <Route path="/studio-sync" element={<StudioSync />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/ai-lab" element={<AILab />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CustomCursor />
      <BrowserRouter>
        <AuthProvider>
          <DailyLoginBonus />
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
