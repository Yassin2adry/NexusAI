import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CreditsBadge } from "@/components/CreditsBadge";

export const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    ...(user ? [{ name: "Chat", path: "/chat" }] : []),
    { name: "Tools", path: "/tools" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Studio Sync", path: "/studio-sync" },
    ...(user ? [{ name: "Projects", path: "/projects" }] : []),
    { name: "AI Lab", path: "/ai-lab" },
    { name: "Learn", path: "/learn" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <Cpu className="h-7 w-7 text-primary-glow group-hover:animate-glow-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              NexusAI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  location.pathname === link.path 
                    ? "text-primary-glow" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-glow to-transparent" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user && <CreditsBadge />}
            <ThemeSwitcher />
            {user ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="hover-glow">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 text-sm rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "text-primary-glow bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 mt-4 px-4">
              <div className="mb-2">
                <ThemeSwitcher />
              </div>
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full gap-2 hover:bg-primary/10">
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full gap-2 hover:bg-destructive/10" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full hover:bg-primary/10">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full hover-glow">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
