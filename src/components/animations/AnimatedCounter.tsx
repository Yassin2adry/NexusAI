import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  showDelta?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className = "",
  prefix = "",
  suffix = "",
  showDelta = false,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [delta, setDelta] = useState<number | null>(null);
  const previousValue = useRef(value);

  useEffect(() => {
    const diff = value - previousValue.current;
    
    if (showDelta && diff !== 0) {
      setDelta(diff);
      setTimeout(() => setDelta(null), 2000);
    }

    const startValue = previousValue.current;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (value - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    previousValue.current = value;
  }, [value, duration, showDelta]);

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <span className="tabular-nums">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>
      
      {/* Delta indicator */}
      <AnimatePresence>
        {delta !== null && (
          <motion.span
            initial={{ opacity: 0, y: 10, x: 5 }}
            animate={{ opacity: 1, y: -20, x: 10 }}
            exit={{ opacity: 0, y: -30 }}
            className={`absolute left-full text-sm font-bold ${
              delta > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {delta > 0 ? "+" : ""}{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

interface RollingNumberProps {
  value: number;
  className?: string;
  digitClassName?: string;
}

export function RollingNumber({ value, className = "", digitClassName = "" }: RollingNumberProps) {
  const digits = value.toString().padStart(3, "0").split("");
  
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {digits.map((digit, index) => (
        <RollingDigit key={index} digit={parseInt(digit)} className={digitClassName} />
      ))}
    </span>
  );
}

function RollingDigit({ digit, className = "" }: { digit: number; className?: string }) {
  return (
    <span className={`relative inline-block h-[1em] w-[0.6em] overflow-hidden ${className}`}>
      <motion.span
        className="absolute inset-0 flex flex-col"
        animate={{ y: `-${digit * 10}%` }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="h-[1em] flex items-center justify-center tabular-nums">
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

interface CreditsBurstProps {
  amount: number;
  type: "earn" | "spend";
  onComplete?: () => void;
}

export function CreditsBurst({ amount, type, onComplete }: CreditsBurstProps) {
  const isEarn = type === "earn";
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      {/* Burst particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${isEarn ? "bg-green-400" : "bg-red-400"}`}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{
            x: Math.cos(i * 30 * Math.PI / 180) * 150,
            y: Math.sin(i * 30 * Math.PI / 180) * 150,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          style={{
            boxShadow: `0 0 10px ${isEarn ? "rgb(74 222 128)" : "rgb(248 113 113)"}`,
          }}
        />
      ))}
      
      {/* Amount display */}
      <motion.div
        className={`text-4xl font-bold ${isEarn ? "text-green-400" : "text-red-400"}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.2, 0.4, 1],
        }}
        style={{
          textShadow: `0 0 20px ${isEarn ? "rgb(74 222 128 / 0.5)" : "rgb(248 113 113 / 0.5)"}`,
        }}
      >
        {isEarn ? "+" : "-"}{amount}
      </motion.div>
    </motion.div>
  );
}
