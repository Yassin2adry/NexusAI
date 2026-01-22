import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { DailyLoginBonus } from "@/components/DailyLoginBonus";
import { CustomCursor } from "@/components/animations/CustomCursor";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RobloxLink from "./pages/RobloxLink";
import Account from "./pages/Account";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Tools from "./pages/Tools";
import ScriptGenerator from "./pages/tools/ScriptGenerator";
import UIBuilder from "./pages/tools/UIBuilder";
import MapCreator from "./pages/tools/MapCreator";
import BugFixer from "./pages/tools/BugFixer";
import OptimizationTool from "./pages/tools/OptimizationTool";
import AnimationMaker from "./pages/tools/AnimationMaker";
import DialogueWriter from "./pages/tools/DialogueWriter";
import ModuleMaker from "./pages/tools/ModuleMaker";
import BuildAssistant from "./pages/tools/BuildAssistant";
import ObbyGenerator from "./pages/tools/ObbyGenerator";
import MarketplaceNew from "./pages/MarketplaceNew";
import StudioSync from "./pages/StudioSync";
import Projects from "./pages/Projects";
import AILab from "./pages/AILab";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CustomCursor />
      <BrowserRouter>
        <AuthProvider>
          <DailyLoginBonus />
          <Routes>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
