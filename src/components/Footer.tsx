import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Footer = () => {
  const { user } = useAuth();
  
  return (
    <footer className="border-t border-border/50 glass-panel mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary-glow" />
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                NexusAI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered Roblox game creation platform. Build complete games in minutes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary-glow transition-colors" />
              </a>
              <a href="#" className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary-glow transition-colors" />
              </a>
              <a href="#" className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-primary-glow transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                    AI Chat
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NexusAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
