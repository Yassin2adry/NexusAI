import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Sparkles, Eye, EyeOff, Zap, Shield, ArrowRight, Lock, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ForgotPassword } from "@/components/ForgotPassword";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${270 + Math.random() * 60} 100% ${60 + Math.random() * 20}% / ${0.3 + Math.random() * 0.4})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated grid background
function AnimatedGrid() {
  return (
    <motion.div 
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(hsl(270 100% 65% / 0.1) 1px, transparent 1px),
          linear-gradient(90deg, hsl(270 100% 65% / 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
      animate={{
        backgroundPosition: ['0px 0px', '50px 50px'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Success animation overlay
function SuccessAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px hsl(142 76% 46% / 0.5)",
                "0 0 60px hsl(142 76% 46% / 0.8)",
                "0 0 30px hsl(142 76% 46% / 0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", damping: 10 }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
            animate={{ 
              textShadow: [
                "0 0 20px hsl(142 76% 46% / 0.5)",
                "0 0 40px hsl(142 76% 46% / 0.8)",
                "0 0 20px hsl(142 76% 46% / 0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Welcome Back!
          </motion.h2>
          <p className="text-muted-foreground">Signing you in...</p>
        </motion.div>

        {/* Success particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-green-400"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ 
              duration: 1.5,
              delay: 0.3 + i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// 3D Card component
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 200 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating input component
function FloatingInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  focused,
  onFocus,
  onBlur,
  rightElement,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ElementType;
  error?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  rightElement?: React.ReactNode;
}) {
  const hasValue = value.length > 0;
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: focused
            ? "0 0 30px hsl(270 100% 65% / 0.4), 0 0 60px hsl(270 100% 65% / 0.2)"
            : error
            ? "0 0 20px hsl(0 84% 60% / 0.3)"
            : "0 0 0px transparent",
        }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative">
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
          animate={{
            color: focused ? "hsl(270 100% 65%)" : error ? "hsl(0 84% 60%)" : "hsl(270 10% 55%)",
            scale: focused ? 1.1 : 1,
          }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`h-14 pl-12 ${rightElement ? 'pr-12' : 'pr-4'} bg-background/50 border-2 rounded-xl text-base transition-all duration-300 ${
            focused
              ? "border-primary ring-4 ring-primary/20"
              : error
              ? "border-destructive ring-4 ring-destructive/20 animate-shake"
              : "border-border/50 hover:border-primary/50"
          }`}
          placeholder=""
        />
        
        {/* Floating label */}
        <motion.label
          htmlFor={id}
          className="absolute left-12 pointer-events-none origin-left"
          animate={{
            y: hasValue || focused ? -28 : 0,
            scale: hasValue || focused ? 0.85 : 1,
            x: hasValue || focused ? -8 : 0,
            color: focused 
              ? "hsl(270 100% 65%)" 
              : error 
              ? "hsl(0 84% 60%)" 
              : "hsl(270 10% 55%)",
          }}
          transition={{ duration: 0.2 }}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <span className={`${hasValue || focused ? 'bg-card px-2' : ''}`}>
            {placeholder}
          </span>
        </motion.label>
        
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2 text-sm text-destructive flex items-center gap-1"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              ⚠️
            </motion.span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !showSuccess) {
      checkRobloxLink();
    }
  }, [user, navigate, showSuccess]);

  const checkRobloxLink = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("roblox_username")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data?.roblox_username) {
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Error checking Roblox link:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password);
      setShowSuccess(true);
    } catch (error: any) {
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
        setErrors({ password: "Invalid credentials" });
      }
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate("/chat");
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={handleSuccessComplete} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background overflow-hidden relative">
        {/* Premium animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
          <AnimatedGrid />
          <FloatingParticles />
          
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(270 100% 50% / 0.15), transparent 60%)",
              filter: "blur(80px)",
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(320 100% 50% / 0.12), transparent 60%)",
              filter: "blur(80px)",
            }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left side - Branding */}
          <motion.div 
            className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="max-w-lg">
              <Link to="/" className="flex items-center gap-3 mb-12 group" data-magnetic="0.5">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-primary/50 blur-2xl rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Cpu className="h-14 w-14 text-primary-glow relative z-10" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5 text-primary-glow" />
                  </motion.div>
                </motion.div>
                <span className="text-4xl font-black bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                  NexusAI
                </span>
              </Link>
              
              <motion.h1 
                className="text-5xl xl:text-6xl font-black leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Welcome back,
                <motion.span 
                  className="block bg-gradient-to-r from-primary-glow via-accent to-primary-glow bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  Creator.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Continue building incredible Roblox experiences with the power of AI. Your projects are waiting.
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {[
                  { icon: Zap, title: "100 Daily Credits", desc: "Free credits every 24 hours", color: "primary" },
                  { icon: Shield, title: "Secure & Private", desc: "Your data stays protected", color: "accent" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border/30 backdrop-blur-sm group"
                    whileHover={{ scale: 1.02, x: 10, borderColor: "hsl(270 100% 65% / 0.5)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-${item.color}/20 flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-6 w-6 text-primary-glow" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div 
            className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="h-10 w-10 text-primary-glow" />
                </motion.div>
                <span className="text-3xl font-black bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                  NexusAI
                </span>
              </Link>

              <Card3D>
                <motion.div 
                  className="relative bg-card/60 backdrop-blur-2xl border-2 border-border/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  {/* Animated border gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(270 100% 65% / 0.5), hsl(320 100% 60% / 0.5), transparent)",
                      backgroundSize: "300% 100%",
                      padding: "2px",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "xor",
                      WebkitMaskComposite: "xor",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-1 rounded-3xl opacity-50 blur-xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, hsl(270 100% 65% / 0.3), hsl(320 100% 60% / 0.2))",
                    }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="relative z-10">
                    <motion.div 
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 mb-4 relative"
                        animate={{ 
                          boxShadow: [
                            "0 0 30px hsl(270 100% 65% / 0.4)",
                            "0 0 50px hsl(270 100% 65% / 0.6)",
                            "0 0 30px hsl(270 100% 65% / 0.4)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="h-10 w-10 text-primary-glow" />
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-primary-glow/30"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      <motion.h2 
                        className="text-3xl font-bold mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Sign In
                      </motion.h2>
                      <motion.p 
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        Enter your credentials to continue
                      </motion.p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FloatingInput
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          icon={Mail}
                          error={errors.email}
                          focused={focusedField === "email"}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex justify-end mb-2">
                          <motion.button
                            type="button"
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-xs text-primary-glow hover:underline font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Forgot password?
                          </motion.button>
                        </div>
                        <FloatingInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          icon={Lock}
                          error={errors.password}
                          focused={focusedField === "password"}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                          rightElement={
                            <motion.button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <AnimatePresence mode="wait">
                                {showPassword ? (
                                  <motion.div
                                    key="hide"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                  >
                                    <EyeOff className="h-5 w-5" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="show"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                  >
                                    <Eye className="h-5 w-5" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          }
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
                          data-magnetic="0.3"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-primary bg-[length:200%_auto]"
                            animate={{ backgroundPosition: loading ? ["0%", "200%"] : "0%" }}
                            transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              <>
                                Sign In
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <ArrowRight className="h-5 w-5" />
                                </motion.span>
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </form>

                    <motion.div 
                      className="mt-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-muted-foreground">
                        Don't have an account?{" "}
                        <Link 
                          to="/signup" 
                          className="text-primary-glow font-semibold hover:underline inline-flex items-center gap-1 group"
                        >
                          Create one
                          <motion.span
                            className="inline-block"
                            whileHover={{ x: 3 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </Card3D>
            </div>
          </motion.div>
        </div>

        <ForgotPassword open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
      </div>
    </>
  );
}