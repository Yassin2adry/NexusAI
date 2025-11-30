import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { DailyLoginBonus } from "@/components/DailyLoginBonus";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
