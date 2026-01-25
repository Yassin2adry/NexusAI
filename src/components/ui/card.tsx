import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover3D?: boolean;
  glowOnHover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover3D = true, glowOnHover = true, children, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3D || !cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set((e.clientX - centerX) / rect.width);
      mouseY.set((e.clientY - centerY) / rect.height);
    };
    
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    };

    return (
      <motion.div
        ref={cardRef}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow-sm relative overflow-hidden transition-all duration-300",
          glowOnHover && "hover:border-primary-glow/50 hover:shadow-[0_0_30px_hsl(var(--primary-glow)/0.15)]",
          className
        )}
        style={{
          rotateX: hover3D ? rotateX : 0,
          rotateY: hover3D ? rotateY : 0,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...(props as any)}
      >
        {/* Gradient spotlight effect */}
        {isHovered && glowOnHover && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, hsl(var(--primary-glow) / 0.1), transparent 40%)`,
            }}
          />
        )}
        
        {/* Shimmer border effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              background: [
                "linear-gradient(90deg, transparent, hsl(var(--primary-glow) / 0.3), transparent)",
                "linear-gradient(90deg, transparent, hsl(var(--primary-glow) / 0.3), transparent)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        <div ref={ref} className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
