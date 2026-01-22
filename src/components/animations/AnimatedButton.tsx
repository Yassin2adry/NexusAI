import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  glowColor?: string;
  pulseOnHover?: boolean;
}

export function AnimatedButton({
  children,
  className,
  glowColor = "270 100% 65%",
  pulseOnHover = true,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    props.onClick?.(e);
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: pulseOnHover ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:shadow-[0_0_30px_hsl(var(--primary-glow)/0.4)]",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{
            background: isPressed 
              ? `radial-gradient(circle at 50% 50%, hsl(${glowColor} / 0.3), transparent 70%)`
              : `radial-gradient(circle at 50% 50%, hsl(${glowColor} / 0.1), transparent 70%)`,
          }}
        />
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `hsl(${glowColor} / 0.4)`,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              width: 300, 
              height: 300, 
              x: -150, 
              y: -150, 
              opacity: 0 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
      </Button>
      
      {/* Glow behind button */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-[inherit] blur-xl"
        style={{
          background: `hsl(${glowColor} / 0.2)`,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

interface IconButtonAnimatedProps extends ButtonProps {
  children: ReactNode;
  rotateOnHover?: boolean;
  bounceOnHover?: boolean;
}

export function IconButtonAnimated({
  children,
  className,
  rotateOnHover = false,
  bounceOnHover = true,
  ...props
}: IconButtonAnimatedProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: bounceOnHover ? 1.1 : 1,
        rotate: rotateOnHover ? 15 : 0,
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        <motion.span
          className="relative z-10"
          whileHover={{
            y: bounceOnHover ? [0, -2, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            repeat: bounceOnHover ? Infinity : 0,
            repeatType: "loop",
          }}
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}

interface MagneticButtonProps extends ButtonProps {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="inline-block"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
