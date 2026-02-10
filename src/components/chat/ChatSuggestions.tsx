import { motion } from "framer-motion";
import { Gamepad2, Palette, Code, Box, Bot } from "lucide-react";

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  { 
    title: "Design a Game", 
    prompt: "Help me design a multiplayer obby game with unique mechanics and progression system", 
    icon: Gamepad2,
    emoji: "🎮",
  },
  { 
    title: "Write Scripts", 
    prompt: "Create a Luau script for a working inventory system with item stacking and persistence", 
    icon: Code,
    emoji: "💻",
  },
  { 
    title: "Create UI", 
    prompt: "Design a modern, animated main menu for my Roblox game with settings and play buttons", 
    icon: Palette,
    emoji: "🎨",
  },
  { 
    title: "Optimization Tips", 
    prompt: "What are the best practices for Roblox game optimization and reducing lag?", 
    icon: Box,
    emoji: "⚡",
  },
];

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-xl w-full">
        <motion.div 
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/15 to-primary-glow/15 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
        >
          <Bot className="h-8 w-8 text-primary-glow" />
        </motion.div>

        <motion.h3 
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          How can I help you today?
        </motion.h3>

        <motion.p 
          className="text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose a starter or type your own question
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => onSelect(item.prompt)}
              className="p-4 text-left rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:bg-accent/30 transition-all group"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1 group-hover:text-primary-glow transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
