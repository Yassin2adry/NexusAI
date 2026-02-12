import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CreditsBadge } from "@/components/CreditsBadge";
import { motion, AnimatePresence } from "framer-motion";

export const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    ...(user ? [{ name: "Chat", path: "/chat" }] : []),
    { name: "Community", path: "/community" },
    { name: "Tools", path: "/tools" },
    { name: "Marketplace", path: "/marketplace" },
    ...(user ? [{ name: "Projects", path: "/projects" }] : []),
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Music", path: "/music" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Cpu className="h-5 w-5 text-primary-glow transition-transform duration-base group-hover:rotate-90" />
            <span className="text-lg font-bold">
              Nexus<span className="text-primary-glow">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-fast rounded-lg ${
                  location.pathname === link.path
                    ? "text-primary-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-px left-2 right-2 h-0.5 bg-primary-glow rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user && <CreditsBadge />}
            <ThemeSwitcher />
            {user ? (
              <div className="flex items-center gap-1">
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" /> Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/signup"><Button size="sm" className="shadow-glow">Get Started</Button></Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/40 py-3"
            >
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? "text-primary-glow bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/40 px-4">
                <ThemeSwitcher />
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full gap-2"><User className="h-4 w-4" /> Account</Button>
                    </Link>
                    <Button variant="ghost" className="w-full gap-2" onClick={signOut}><LogOut className="h-4 w-4" /> Sign Out</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full">Login</Button></Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Get Started</Button></Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
