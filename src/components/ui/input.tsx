import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  glow?: boolean;
  variant?: "default" | "floating" | "outlined";
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, glow = true, variant = "default", label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    if (variant === "floating" && label) {
      return (
        <div className="relative">
          <input
            type={type}
            className={cn(
              "peer flex h-12 w-full rounded-lg border bg-background/50 px-4 pt-5 pb-2 text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              glow && "input-glow",
              error 
                ? "border-destructive focus:border-destructive focus:ring-destructive/30 error-glow" 
                : "border-border/50 focus:border-primary-glow",
              className,
            )}
            ref={ref}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
              "transition-all duration-200 ease-out",
              "peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary-glow",
              (hasValue || isFocused || props.placeholder) && "top-3 text-xs",
              error && "text-destructive peer-focus:text-destructive",
            )}
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "transition-all duration-200",
          glow && "input-glow",
          error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/30 error-glow animate-shake" 
            : "border-input focus:border-primary-glow",
          className,
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
