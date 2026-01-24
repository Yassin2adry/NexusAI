import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Cpu, Sparkles, Eye, EyeOff, Gift, Users, Rocket, ArrowRight, Check, User, Mail, Lock, Loader2, CheckCircle, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${260 + Math.random() * 80} 100% ${50 + Math.random() * 30}% / ${0.2 + Math.random() * 0.5})`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
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
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(hsl(320 100% 60% / 0.08) 1px, transparent 1px),
          linear-gradient(90deg, hsl(320 100% 60% / 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
      animate={{
        backgroundPosition: ['0px 0px', '60px 60px'],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Success animation overlay
function SuccessAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 150 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 10 }}
        >
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-primary-glow"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2 + i * 0.5, opacity: 0 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "easeOut" 
              }}
            />
          ))}
          
          <motion.div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-glow via-accent to-primary flex items-center justify-center relative"
            animate={{
              boxShadow: [
                "0 0 40px hsl(270 100% 65% / 0.6)",
                "0 0 80px hsl(270 100% 65% / 0.8)",
                "0 0 40px hsl(270 100% 65% / 0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", damping: 8 }}
            >
              <Sparkles className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-glow via-accent to-primary-glow bg-clip-text text-transparent bg-[length:200%_auto]"
            animate={{ backgroundPosition: ["0%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Welcome to NexusAI!
          </motion.h2>
          <p className="text-muted-foreground text-lg">Your account has been created successfully</p>
        </motion.div>

        {/* Celebration particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: `hsl(${Math.random() * 60 + 260} 100% 60%)`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: (Math.random() - 0.5) * 500,
              y: (Math.random() - 0.5) * 500,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{ 
              duration: 2,
              delay: 0.2 + i * 0.03,
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

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  
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
            ? "0 0 30px hsl(270 100% 65% / 0.4), 0 0 60px hsl(320 100% 60% / 0.2)"
            : error
            ? "0 0 20px hsl(0 84% 60% / 0.4)"
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

// Password strength component
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  if (!password) return null;

  return (
    <motion.div 
      className="mt-3 space-y-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className="h-1.5 flex-1 rounded-full bg-border overflow-hidden"
          >
            <motion.div
              className={`h-full ${strength >= level ? colors[strength - 1] : "bg-transparent"}`}
              initial={{ width: 0 }}
              animate={{ width: strength >= level ? "100%" : "0%" }}
              transition={{ duration: 0.3, delay: level * 0.1 }}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className={`font-medium ${strength >= 3 ? "text-green-400" : strength >= 2 ? "text-yellow-400" : "text-destructive"}`}>
          {labels[strength - 1] || "Too weak"}
        </span>
        <div className="flex gap-2 text-muted-foreground">
          {[
            { check: password.length >= 8, label: "8+ chars" },
            { check: /[A-Z]/.test(password), label: "A-Z" },
            { check: /[0-9]/.test(password), label: "0-9" },
          ].map((req, i) => (
            <motion.span
              key={i}
              className={`flex items-center gap-1 ${req.check ? "text-green-400" : ""}`}
              animate={{ scale: req.check ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {req.check && <Check className="h-3 w-3" />}
              {req.label}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || undefined;

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
    
    const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password, fullName, referralCode);
      setShowSuccess(true);
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
        setErrors({ email: "Email already registered" });
      }
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate("/roblox-link");
  };

  const benefits = [
    { icon: Gift, text: "100 free credits daily", gradient: "from-purple-500 to-pink-500" },
    { icon: Rocket, text: "10+ AI-powered tools", gradient: "from-blue-500 to-cyan-500" },
    { icon: Users, text: "Join 10,000+ creators", gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <>
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={handleSuccessComplete} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background overflow-hidden relative">
        {/* Premium animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/30 via-background to-background" />
          <AnimatedGrid />
          <FloatingParticles />
          
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(320 100% 50% / 0.15), transparent 60%)",
              filter: "blur(80px)",
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(270 100% 50% / 0.12), transparent 60%)",
              filter: "blur(80px)",
            }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left side - Form */}
          <motion.div 
            className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <Link to="/" className="flex items-center justify-center gap-2 mb-6 lg:hidden">
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
                  className="relative bg-card/60 backdrop-blur-2xl border-2 border-border/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  {/* Animated border gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(320 100% 60% / 0.5), hsl(270 100% 65% / 0.5), transparent)",
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
                      background: "linear-gradient(135deg, hsl(320 100% 60% / 0.3), hsl(270 100% 65% / 0.2))",
                    }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="relative z-10">
                    <motion.div 
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/20 mb-4 relative"
                        animate={{ 
                          boxShadow: [
                            "0 0 30px hsl(320 100% 60% / 0.4)",
                            "0 0 50px hsl(320 100% 60% / 0.6)",
                            "0 0 30px hsl(320 100% 60% / 0.4)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <User className="h-8 w-8 text-primary-glow" />
                      </motion.div>
                      <motion.h2 
                        className="text-2xl font-bold mb-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Create Account
                      </motion.h2>
                      <motion.p 
                        className="text-muted-foreground text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        Start building with AI today
                      </motion.p>
                      <AnimatePresence>
                        {referralCode && (
                          <motion.span 
                            className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/20 text-sm text-primary-glow font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            ✨ Referral code: {referralCode}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <FloatingInput
                          id="name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          icon={User}
                          error={errors.fullName}
                          focused={focusedField === "name"}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </motion.div>

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
                        transition={{ delay: 0.55 }}
                      >
                        <FloatingInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create Password"
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
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                          }
                        />
                        <AnimatePresence>
                          {password && <PasswordStrength password={password} />}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <FloatingInput
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          icon={Shield}
                          error={errors.confirmPassword}
                          focused={focusedField === "confirmPassword"}
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField(null)}
                          rightElement={
                            password && confirmPassword && password === confirmPassword ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-500"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </motion.div>
                            ) : null
                          }
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="pt-2"
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
                          data-magnetic="0.3"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto]"
                            animate={{ backgroundPosition: loading ? ["0%", "200%"] : "0%" }}
                            transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              <>
                                Create Account
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
                      className="mt-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <p className="text-muted-foreground text-sm">
                        Already have an account?{" "}
                        <Link 
                          to="/login" 
                          className="text-primary-glow font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          Sign in
                          <motion.span className="inline-block" whileHover={{ x: 3 }}>→</motion.span>
                        </Link>
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </Card3D>
            </div>
          </motion.div>

          {/* Right side - Branding */}
          <motion.div 
            className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24"
            initial={{ opacity: 0, x: 80 }}
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
                    className="absolute inset-0 bg-accent/50 blur-2xl rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Cpu className="h-14 w-14 text-primary-glow relative z-10" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5 text-accent" />
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
                Start your
                <motion.span 
                  className="block bg-gradient-to-r from-accent via-primary-glow to-accent bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  AI Journey.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join thousands of creators using AI to build amazing Roblox experiences.
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {benefits.map((item, i) => (
                  <motion.div 
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border/30 backdrop-blur-sm group"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: -10, borderColor: "hsl(320 100% 60% / 0.5)" }}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} p-0.5`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary-glow" />
                      </div>
                    </motion.div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}