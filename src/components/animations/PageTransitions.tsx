import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionWrapperProps {
  children: ReactNode;
  variant?: "fade" | "slide" | "scale" | "slideUp";
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 0.84, 0.33, 1] as const } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const } },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 0.84, 0.33, 1] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
  },
  slideUp: {
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: [0.16, 0.84, 0.33, 1] as const } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: "blur(10px)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } 
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.16, 0.84, 0.33, 1] as const } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const } },
  },
};

export function PageTransitionWrapper({ children, variant = "slideUp" }: PageTransitionWrapperProps) {
  const location = useLocation();
  const selectedVariant = variants[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={selectedVariant}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered children animation
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.4, ease: [0.16, 0.84, 0.33, 1] }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Reveal on scroll
interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function RevealOnScroll({ 
  children, 
  className, 
  direction = "up", 
  delay = 0 
}: RevealOnScrollProps) {
  const directionMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.16, 0.84, 0.33, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}
