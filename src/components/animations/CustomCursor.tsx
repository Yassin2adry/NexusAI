import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trailDots, setTrailDots] = useState<TrailDot[]>([]);
  const dotIdRef = useRef(0);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      
      // Add trail dot
      dotIdRef.current += 1;
      setTrailDots(prev => [...prev.slice(-8), { id: dotIdRef.current, x: e.clientX, y: e.clientY }]);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('[data-clickable]') ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Clean up old trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailDots(prev => prev.slice(-6));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail dots */}
      {trailDots.map((dot, index) => (
        <motion.div
          key={dot.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: dot.x - 4,
            y: dot.y - 4,
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              background: `hsl(270 100% 65% / ${0.3 + index * 0.05})`,
              boxShadow: `0 0 ${6 + index}px hsl(270 100% 65% / 0.5)`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Main cursor outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border-2 border-primary-glow"
          animate={{
            width: isHovering ? 48 : isClicking ? 28 : 36,
            height: isHovering ? 48 : isClicking ? 28 : 36,
            borderColor: isHovering ? "hsl(270 100% 75%)" : "hsl(270 100% 65%)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          style={{
            boxShadow: isHovering 
              ? "0 0 20px hsl(270 100% 65% / 0.6), 0 0 40px hsl(270 100% 65% / 0.3)"
              : "0 0 10px hsl(270 100% 65% / 0.4)",
          }}
        />
      </motion.div>
      
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-primary-glow"
          animate={{
            width: isClicking ? 8 : 6,
            height: isClicking ? 8 : 6,
            opacity: isHovering ? 1 : 0.8,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          style={{
            boxShadow: "0 0 10px hsl(270 100% 65% / 0.8)",
          }}
        />
      </motion.div>
      
      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div 
            className="w-8 h-8 rounded-full border-2 border-primary-glow"
            style={{
              boxShadow: "0 0 20px hsl(270 100% 65% / 0.5)",
            }}
          />
        </motion.div>
      )}
    </>
  );
}
