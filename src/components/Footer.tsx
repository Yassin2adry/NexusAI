import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth";

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
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary-glow" />
              <span className="font-bold text-lg">
                Nexus<span className="text-primary-glow">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered Roblox game creation platform. Build complete games in minutes.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
              Product
            </h3>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
              Company
            </h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
              Legal
            </h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} NexusAI. Made with
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            by <span className="font-medium text-primary-glow">Yassin Kadry</span>
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
