import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "rings" | "dots" | "spinner" | "pulse";
  className?: string;
}

export function PremiumLoader({ size = "md", variant = "rings", className }: PremiumLoaderProps) {
  const sizeMap = {
    sm: { container: 40, ring: 40, dot: 6 },
    md: { container: 60, ring: 60, dot: 8 },
    lg: { container: 80, ring: 80, dot: 10 },
  };

  const s = sizeMap[size];

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full bg-primary-glow"
            style={{ width: s.dot, height: s.dot }}
            animate={{
              y: [0, -s.dot * 1.5, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <motion.div
        className={cn("rounded-full border-2 border-primary/20", className)}
        style={{ 
          width: s.container, 
          height: s.container,
          borderTopColor: "hsl(var(--primary-glow))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn("rounded-full bg-primary-glow", className)}
        style={{ width: s.container / 2, height: s.container / 2 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  // Default: rings
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-primary-glow/30"
          style={{ width: s.ring, height: s.ring }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.div
        className="rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
        style={{ width: s.container, height: s.container }}
        animate={{
          boxShadow: [
            "0 0 20px hsl(var(--primary-glow) / 0.4)",
            "0 0 40px hsl(var(--primary-glow) / 0.6)",
            "0 0 20px hsl(var(--primary-glow) / 0.4)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="rounded-full bg-background/20"
          style={{ width: s.container / 2, height: s.container / 2 }}
          animate={{ scale: [1, 0.8, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

// Skeleton with shimmer
interface SkeletonShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SkeletonShimmer({ className, width, height }: SkeletonShimmerProps) {
  return (
    <div
      className={cn("skeleton rounded-lg", className)}
      style={{ width, height }}
    />
  );
}

// Progress bar
interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  variant?: "default" | "gradient" | "glow";
}

export function ProgressBar({ 
  progress, 
  className, 
  showPercentage = false,
  variant = "default" 
}: ProgressBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            variant === "gradient" && "bg-gradient-to-r from-primary to-primary-glow",
            variant === "glow" && "bg-primary-glow shadow-glow-sm",
            variant === "default" && "bg-primary"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      {showPercentage && (
        <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

// Indeterminate progress
export function IndeterminateProgress({ className }: { className?: string }) {
  return (
    <div className={cn("h-1 bg-muted/50 rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary-glow to-transparent"
        animate={{ x: ["-100%", "400%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
