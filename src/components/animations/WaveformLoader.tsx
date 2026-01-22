import { motion } from "framer-motion";

interface WaveformLoaderProps {
  bars?: number;
  className?: string;
  color?: string;
}

export function WaveformLoader({ 
  bars = 5, 
  className = "",
  color = "hsl(270 100% 65%)" 
}: WaveformLoaderProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: color }}
          animate={{
            height: [8, 24, 8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ThinkingDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-glow"
          animate={{
            y: [0, -6, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: "0 0 10px hsl(270 100% 65% / 0.5)",
          }}
        />
      ))}
    </div>
  );
}

export function PulsingOrb({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full border border-primary-glow/30"
          animate={{
            scale: [1, 1.5 + ring * 0.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: ring * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Core */}
      <motion.div
        className="absolute inset-2 rounded-full bg-primary-glow"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: "0 0 20px hsl(270 100% 65% / 0.6), 0 0 40px hsl(270 100% 65% / 0.3)",
        }}
      />
    </div>
  );
}

export function AIThinkingState({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PulsingOrb size={32} />
      <div className="flex flex-col gap-1">
        <motion.div
          className="h-2 bg-primary-glow/30 rounded-full"
          animate={{ width: [60, 100, 60] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-2 bg-primary-glow/20 rounded-full"
          animate={{ width: [80, 40, 80] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function TerminalLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`font-mono text-sm ${className}`}>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.span
          className="text-primary-glow"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {">"} 
        </motion.span>
        <span className="text-muted-foreground">Processing</span>
        <motion.span
          className="text-primary-glow"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.div>
      
      {/* Scrolling log lines */}
      <div className="mt-2 space-y-1 opacity-50">
        {["Analyzing request...", "Generating response...", "Optimizing output..."].map((line, i) => (
          <motion.div
            key={i}
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.3 }}
          >
            [{String(i + 1).padStart(2, "0")}] {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="hsl(270 100% 65% / 0.2)"
          strokeWidth="3"
        />
        <motion.path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="hsl(270 100% 65%)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 0.75, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 0 6px hsl(270 100% 65%))",
          }}
        />
      </svg>
    </motion.div>
  );
}
