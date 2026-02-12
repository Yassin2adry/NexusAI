import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { DailyLoginBonus } from "@/components/DailyLoginBonus";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

// Lazy load pages
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
const Community = lazy(() => import("./pages/Community"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const MusicLounge = lazy(() => import("./pages/MusicLounge"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const StatusPage = lazy(() => import("./pages/StatusPage"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Simple loading spinner
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-primary-glow border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

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
        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
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
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/music" element={<MusicLounge />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/notifications" element={<Notifications />} />
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
