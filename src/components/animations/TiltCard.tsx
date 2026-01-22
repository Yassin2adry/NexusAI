import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}

export function TiltCard({
  children,
  className = "",
  glowOnHover = true,
  maxTilt = 15,
  scale = 1.02,
  perspective = 1000,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovering ? scale : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 30 },
        }}
        className="relative"
      >
        {children}
        
        {/* Glow effect on hover */}
        {glowOnHover && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, hsl(270 100% 65% / 0.15), transparent 50%)`,
            }}
            animate={{
              opacity: isHovering ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 40%, hsl(270 100% 65% / 0.1) 45%, hsl(270 100% 65% / 0.2) 50%, hsl(270 100% 65% / 0.1) 55%, transparent 60%)",
            }}
            animate={{
              x: isHovering ? ["100%", "-100%"] : "-100%",
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function FloatingCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
        rotateZ: [-0.5, 0.5, -0.5],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
