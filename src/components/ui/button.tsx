import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90 hover:shadow-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary-glow transition-all",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 hover:text-foreground transition-all",
        link: "text-primary-glow underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  magnetic?: boolean;
  magneticStrength?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = true, magneticStrength = 0.3, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);
    
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!magnetic) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      x.set((e.clientX - centerX) * magneticStrength);
      y.set((e.clientY - centerY) * magneticStrength);
    };
    
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setIsHovered(false);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: rippleX, y: rippleY }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
      
      props.onClick?.(e);
    };
    
    // For asChild, render without motion wrapper
    if (asChild) {
      return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
    
    // Extract only DOM-safe props
    const { onClick, children, disabled, type, form, name, value, ...restProps } = props;
    
    return (
      <motion.div
        className="relative inline-block"
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        data-magnetic
      >
        <motion.button
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative overflow-hidden"
          )}
          ref={ref}
          onClick={handleClick}
          disabled={disabled}
          type={type}
          form={form}
          name={name}
          value={value}
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              background: isHovered 
                ? "linear-gradient(90deg, transparent 0%, hsl(var(--primary-glow) / 0.2) 50%, transparent 100%)"
                : "transparent",
              backgroundSize: "200% 100%",
              backgroundPosition: isHovered ? ["200% 0%", "-200% 0%"] : "0% 0%",
            }}
            transition={{
              backgroundPosition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 0.2 }
            }}
          />
          
          {/* Glow effect */}
          {isHovered && variant === "default" && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-[inherit] blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: "hsl(var(--primary-glow) / 0.4)",
              }}
            />
          )}
          
          {/* Ripple effects */}
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none bg-white/30"
              style={{
                left: ripple.x,
                top: ripple.y,
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
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </motion.button>
      </motion.div>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
