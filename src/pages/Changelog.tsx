import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bug, Zap, Shield, Rocket, Gift } from "lucide-react";
import { motion } from "framer-motion";

const entries = [
  {
    version: "2.5.0",
    date: "Feb 12, 2026",
    type: "feature" as const,
    title: "Community Hub Launch",
    items: [
      "Discord-style rooms with voice, video & screen sharing",
      "YouTube Watch Party — watch together in real-time",
      "Music Lounge — shared music player with queue",
      "Room codes for private rooms",
      "Emoji reactions in room chat",
    ],
  },
  {
    version: "2.4.0",
    date: "Feb 10, 2026",
    type: "feature" as const,
    title: "Leaderboard & Profiles",
    items: [
      "Global leaderboard with streaks, credits, activity",
      "Public user profiles with Roblox avatar",
      "Achievement showcase on profiles",
      "System status page with real-time monitoring",
    ],
  },
  {
    version: "2.3.0",
    date: "Feb 5, 2026",
    type: "improvement" as const,
    title: "AI Chat Overhaul",
    items: [
      "Real-time streaming with character-by-character typing",
      "Multi-agent AI system with 6 specialized agents",
      "Chat terminal with live generation logs",
      "Message actions: copy, pin, regenerate",
    ],
  },
  {
    version: "2.2.0",
    date: "Jan 28, 2026",
    type: "improvement" as const,
    title: "UI/UX Redesign",
    items: [
      "7-theme engine with instant switching",
      "Glassmorphic design system",
      "60fps animations across all components",
      "Mobile-responsive navigation",
    ],
  },
  {
    version: "2.1.0",
    date: "Jan 20, 2026",
    type: "security" as const,
    title: "Security & Performance",
    items: [
      "Rate limiting on all API endpoints",
      "Enhanced RLS policies",
      "Lazy loading for all pages",
      "Code splitting reducing bundle by 40%",
    ],
  },
];

const typeConfig = {
  feature: { icon: Sparkles, color: "text-primary-glow", bg: "bg-primary/10" },
  improvement: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  bugfix: { icon: Bug, color: "text-red-400", bg: "bg-red-500/10" },
  security: { icon: Shield, color: "text-green-400", bg: "bg-green-500/10" },
};

export default function Changelog() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Rocket className="h-4 w-4 text-primary-glow" />
              <span className="text-xs font-medium text-primary-glow">What's New</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Changelog</h1>
            <p className="text-muted-foreground">All the latest updates and improvements</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border/40" />

            <div className="space-y-8">
              {entries.map((entry, i) => {
                const config = typeConfig[entry.type];
                return (
                  <motion.div
                    key={entry.version}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-14"
                  >
                    <div className={`absolute left-4 top-1 w-5 h-5 rounded-full ${config.bg} flex items-center justify-center border-2 border-background`}>
                      <config.icon className={`h-3 w-3 ${config.color}`} />
                    </div>

                    <Card className="p-5 glass-panel">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">{entry.version}</Badge>
                        <span className="text-xs text-muted-foreground">{entry.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{entry.title}</h3>
                      <ul className="space-y-1.5">
                        {entry.items.map((item, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary-glow mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
