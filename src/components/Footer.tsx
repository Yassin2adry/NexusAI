import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export const Footer = () => {
  const { user } = useAuth();

  const links = {
    product: [
      { name: "Pricing", path: "/pricing" },
      { name: "Documentation", path: "/docs" },
      ...(user ? [{ name: "AI Chat", path: "/chat" }] : []),
      { name: "Tools", path: "/tools" },
      { name: "Marketplace", path: "/marketplace" },
    ],
    company: [
      { name: "About", path: "/about" },
      { name: "Blog", path: "/blog" },
      { name: "Contact", path: "/contact" },
      { name: "Learn", path: "/learn" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Cpu className="h-5 w-5 text-primary-glow transition-transform group-hover:rotate-90 duration-base" />
              <span className="font-bold text-lg">Nexus<span className="text-primary-glow">AI</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">AI-powered Roblox game creation. Build complete games in minutes.</p>
            <div className="flex items-center gap-1.5">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="p-2 rounded-lg bg-secondary hover:bg-accent hover:text-primary-glow transition-all duration-fast"
                  aria-label={social.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-xs uppercase tracking-wider text-primary-glow">
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} NexusAI. Made with
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
            by <span className="font-medium text-primary-glow">Yassin Kadry</span>
          </p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
