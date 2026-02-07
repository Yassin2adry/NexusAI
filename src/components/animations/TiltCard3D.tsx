import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tiltIntensity?: number;
  glareIntensity?: number;
  spotlightSize?: number;
  disabled?: boolean;
}

export function TiltCard3D({
  children,
  className,
  containerClassName,
  tiltIntensity = 10,
  glareIntensity = 0.15,
  spotlightSize = 300,
  disabled = false,
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

  const spotlightX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  if (disabled) {
    return <div className={cn(containerClassName)}>{children}</div>;
  }

  return (
    <div className={cn("perspective-1000", containerClassName)}>
      <motion.div
        ref={ref}
        className={cn("relative preserve-3d", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ scale: { duration: 0.2 } }}
      >
        {/* Spotlight overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${spotlightX}% ${spotlightY}%, hsl(var(--primary-glow) / ${glareIntensity}), transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ opacity: { duration: 0.3 } }}
        />

        {/* Shimmer border */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary-glow) / 0.3), transparent, hsl(var(--primary-glow) / 0.3))`,
              padding: 1,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-20">{children}</div>
      </motion.div>
    </div>
  );
}
