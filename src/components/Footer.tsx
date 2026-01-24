import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail, Heart, Sparkles, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a 
      href={href} 
      className="relative p-3 rounded-xl bg-card/50 border border-border/50 group overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-glow transition-colors relative z-10" />
      
      {/* Ripple effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-xl"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.a>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link 
      to={to} 
      className="group flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>{children}</span>
      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  </motion.li>
);

export const Footer = () => {
  const { user } = useAuth();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer ref={ref} className="border-t border-border/50 glass-panel mt-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]"
          animate={{ 
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Brand section */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-primary-glow/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="h-6 w-6 text-primary-glow relative z-10" />
              </motion.div>
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                NexusAI
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered Roblox game creation platform. Build complete games in minutes.
            </p>
            
            <div className="flex items-center gap-2">
              <SocialLink href="#" icon={Github} label="GitHub" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Mail} label="Email" />
            </div>
          </motion.div>

          {/* Product links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-primary-glow">Product</span>
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/docs">Documentation</FooterLink>
              {user && <FooterLink to="/chat">AI Chat</FooterLink>}
              <FooterLink to="/tools">Tools</FooterLink>
              <FooterLink to="/marketplace">Marketplace</FooterLink>
            </ul>
          </motion.div>

          {/* Company links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-primary-glow">Company</span>
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/learn">Learn</FooterLink>
            </ul>
          </motion.div>

          {/* Legal links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <span className="text-primary-glow">Legal</span>
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div 
          className="border-t border-border/50 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {new Date().getFullYear()} NexusAI. Made with 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500 inline" />
              </motion.span>
              by 
              <span className="font-semibold text-primary-glow ml-1">
                Yassin Kadry
              </span>
            </p>

            {/* Status indicator */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
