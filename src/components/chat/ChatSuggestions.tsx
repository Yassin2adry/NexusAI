import { motion } from "framer-motion";
import { Sparkles, Gamepad2, Palette, Code, Box } from "lucide-react";

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  { 
    title: "🎮 Design a Game", 
    prompt: "Help me design a multiplayer obby game with unique mechanics and progression system", 
    icon: Gamepad2,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  { 
    title: "💻 Write Scripts", 
    prompt: "Create a Luau script for a working inventory system with item stacking and persistence", 
    icon: Code,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  { 
    title: "🎨 Create UI", 
    prompt: "Design a modern, animated main menu for my Roblox game with settings and play buttons", 
    icon: Palette,
    gradient: "from-orange-500/20 to-yellow-500/20",
    iconColor: "text-orange-400"
  },
  { 
    title: "🛠️ Get Tips", 
    prompt: "What are the best practices for Roblox game optimization and reducing lag?", 
    icon: Box,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400"
  },
];

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <motion.div 
      className="flex items-center justify-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center max-w-2xl px-4">
        {/* Icon */}
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-glow/20 mb-6"
          animate={{ 
            boxShadow: [
              "0 0 20px hsl(var(--primary-glow) / 0.2)",
              "0 0 40px hsl(var(--primary-glow) / 0.3)",
              "0 0 20px hsl(var(--primary-glow) / 0.2)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-10 w-10 text-primary-glow" />
        </motion.div>

        {/* Title */}
        <motion.h3 
          className="text-3xl font-bold mb-3 gradient-text-premium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Start Your Game Development Journey
        </motion.h3>

        {/* Description */}
        <motion.p 
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          I can help you with game design, Luau scripting, UI creation, and more!
        </motion.p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              onClick={() => onSelect(suggestion.prompt)}
              className={`relative p-5 text-left rounded-xl glass-panel hover:border-primary-glow/50 transition-all group bg-gradient-to-br ${suggestion.gradient} overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 3) }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover spotlight effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at 50% 50%, hsl(var(--primary-glow) / 0.15), transparent 70%)"
                }}
              />

              <div className="relative z-10 flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-background/50 ${suggestion.iconColor}`}>
                  <suggestion.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base mb-1 group-hover:text-primary-glow transition-colors">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {suggestion.prompt}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
