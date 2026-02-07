import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TypingIndicatorProps {
  variant?: "dots" | "sparkle" | "wave";
  text?: string;
}

export function TypingIndicator({ variant = "sparkle", text = "NexusAI is thinking" }: TypingIndicatorProps) {
  if (variant === "dots") {
    return (
      <div className="flex items-center gap-2 p-4 glass-panel rounded-xl">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-glow"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="flex items-center gap-3 p-4 glass-panel rounded-xl">
        <div className="flex items-end gap-0.5 h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary-glow rounded-full"
              animate={{ height: [8, 24, 8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    );
  }

  // Default: sparkle variant
  return (
    <motion.div 
      className="flex items-center gap-3 p-4 glass-panel rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-5 w-5 text-primary-glow" />
      </motion.div>
      <span className="text-sm">{text}</span>
      <motion.span
        className="text-primary-glow"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ...
      </motion.span>
    </motion.div>
  );
}
