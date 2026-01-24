import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

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
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const dotIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Magnetic effect for interactive elements
  const magneticRef = useRef<{ element: HTMLElement; strength: number } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    let targetX = e.clientX;
    let targetY = e.clientY;

    // Magnetic pull effect
    if (magneticRef.current) {
      const rect = magneticRef.current.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = 100;
      
      if (distance < maxDistance) {
        const pull = (1 - distance / maxDistance) * magneticRef.current.strength;
        targetX = e.clientX - distanceX * pull * 0.3;
        targetY = e.clientY - distanceY * pull * 0.3;
      }
    }

    cursorX.set(targetX);
    cursorY.set(targetY);
    setIsVisible(true);
    
    // Add trail dots with velocity-based spacing
    const dx = targetX - lastPositionRef.current.x;
    const dy = targetY - lastPositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      dotIdRef.current += 1;
      setTrailDots(prev => [...prev.slice(-12), { 
        id: dotIdRef.current, 
        x: targetX, 
        y: targetY 
      }]);
      lastPositionRef.current = { x: targetX, y: targetY };
    }
  }, [cursorX, cursorY]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('[data-clickable]') ||
        !!target.closest('input') ||
        !!target.closest('textarea') ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isInteractive);

      // Set magnetic reference
      const magneticElement = target.closest('[data-magnetic]') as HTMLElement;
      if (magneticElement) {
        magneticRef.current = {
          element: magneticElement,
          strength: parseFloat(magneticElement.dataset.magnetic || '1')
        };
      } else {
        magneticRef.current = null;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Add click ripple
      rippleIdRef.current += 1;
      setClickRipples(prev => [...prev.slice(-3), {
        id: rippleIdRef.current,
        x: e.clientX,
        y: e.clientY
      }]);
    };
    
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove]);

  // Clean up old trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailDots(prev => prev.slice(-8));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Clean up old ripples
  useEffect(() => {
    const timeout = setTimeout(() => {
      setClickRipples(prev => prev.slice(-2));
    }, 600);
    return () => clearTimeout(timeout);
  }, [clickRipples.length]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail dots with gradient colors */}
      {trailDots.map((dot, index) => {
        const progress = index / trailDots.length;
        const hue = 270 + progress * 50; // Purple to pink gradient
        return (
          <motion.div
            key={dot.id}
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: dot.x - 3,
              y: dot.y - 3,
            }}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: `hsl(${hue} 100% 65%)`,
                boxShadow: `0 0 ${4 + index * 0.5}px hsl(${hue} 100% 65% / 0.6)`,
              }}
            />
          </motion.div>
        );
      })}

      {/* Click ripple effects */}
      <AnimatePresence>
        {clickRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed top-0 left-0 pointer-events-none z-[9996]"
            style={{
              x: ripple.x,
              y: ripple.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div 
              className="w-10 h-10 rounded-full border-2"
              style={{
                borderColor: "hsl(270 100% 65% / 0.6)",
                boxShadow: "0 0 20px hsl(270 100% 65% / 0.4)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Main cursor outer ring with glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 56 : isClicking ? 24 : 40,
            height: isHovering ? 56 : isClicking ? 24 : 40,
            borderWidth: isHovering ? 3 : 2,
            rotate: isHovering ? 45 : 0,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          style={{
            border: `2px solid hsl(270 100% 65% / ${isHovering ? 0.9 : 0.7})`,
            boxShadow: isHovering 
              ? "0 0 30px hsl(270 100% 65% / 0.6), 0 0 60px hsl(320 100% 60% / 0.3), inset 0 0 20px hsl(270 100% 65% / 0.2)"
              : "0 0 15px hsl(270 100% 65% / 0.4)",
            background: isHovering 
              ? "radial-gradient(circle, hsl(270 100% 65% / 0.1), transparent)"
              : "transparent",
          }}
        />
      </motion.div>
      
      {/* Inner dot with morphing effect */}
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
          animate={{
            width: isClicking ? 12 : isHovering ? 8 : 6,
            height: isClicking ? 12 : isHovering ? 8 : 6,
            borderRadius: isHovering ? "30%" : "50%",
            rotate: isHovering ? 45 : 0,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 400 }}
          style={{
            background: "linear-gradient(135deg, hsl(270 100% 65%), hsl(320 100% 60%))",
            boxShadow: `0 0 ${isHovering ? 20 : 12}px hsl(270 100% 65% / 0.8)`,
          }}
        />
      </motion.div>

      {/* Hover text indicator */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 35 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap"
              style={{
                background: "hsl(270 50% 10% / 0.9)",
                border: "1px solid hsl(270 100% 65% / 0.3)",
                color: "hsl(270 100% 85%)",
                transform: "translateX(-50%)",
              }}
            >
              Click
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}