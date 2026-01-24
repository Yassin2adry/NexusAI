import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Cpu, Sparkles, Eye, EyeOff, Gift, Users, Rocket, ArrowRight, Check, User, Mail, Lock, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField, GridOverlay } from "@/components/animations/ParticleField";

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

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || undefined;

  useEffect(() => {
    if (user) {
      checkRobloxLink();
    }
  }, [user, navigate]);

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

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
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
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Gift, text: "100 free credits daily", gradient: "from-purple-500 to-pink-500" },
    { icon: Rocket, text: "10+ AI-powered tools", gradient: "from-blue-500 to-cyan-500" },
    { icon: Users, text: "Join 10,000+ creators", gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
        <ParticleField particleCount={30} />
        <GridOverlay />
        
        <motion.div 
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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

            <motion.div 
              className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-accent/5 overflow-hidden"
              initial={{ opacity: 0, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ transformPerspective: 1000 }}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)",
                  backgroundSize: "200% 100%",
                  opacity: 0.5,
                }}
                animate={{
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10">
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 mb-4"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px hsl(var(--accent) / 0.3)",
                        "0 0 40px hsl(var(--accent) / 0.5)",
                        "0 0 20px hsl(var(--accent) / 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <User className="h-8 w-8 text-primary-glow" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                  <p className="text-muted-foreground">
                    Start building with AI today
                  </p>
                  <AnimatePresence>
                    {referralCode && (
                      <motion.span 
                        className="block mt-2 text-sm text-primary-glow font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        ✨ Referral code applied: {referralCode}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <motion.div
                      animate={{
                        boxShadow: focusedField === "name" 
                          ? "0 0 20px hsl(var(--primary) / 0.3)" 
                          : "0 0 0px transparent",
                      }}
                      className="rounded-lg"
                    >
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.fullName ? "border-destructive animate-shake" : ""
                        }`}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.fullName && (
                        <motion.p 
                          className="text-xs text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.fullName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <motion.div
                      animate={{
                        boxShadow: focusedField === "email" 
                          ? "0 0 20px hsl(var(--primary) / 0.3)" 
                          : "0 0 0px transparent",
                      }}
                      className="rounded-lg"
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.email ? "border-destructive animate-shake" : ""
                        }`}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p 
                          className="text-xs text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Password
                    </Label>
                    <motion.div 
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "password" 
                          ? "0 0 20px hsl(var(--primary) / 0.3)" 
                          : "0 0 0px transparent",
                      }}
                    >
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 pr-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.password ? "border-destructive animate-shake" : ""
                        }`}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    </motion.div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p 
                          className="text-xs text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    
                    {/* Password strength indicator */}
                    <AnimatePresence>
                      {password && (
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <motion.div
                                key={level}
                                className="h-1 flex-1 rounded-full bg-border overflow-hidden"
                              >
                                <motion.div
                                  className={`h-full ${
                                    passwordStrength() >= level
                                      ? level <= 2 ? "bg-destructive" : level === 3 ? "bg-yellow-500" : "bg-green-500"
                                      : "bg-transparent"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: passwordStrength() >= level ? "100%" : "0%" }}
                                  transition={{ duration: 0.3, delay: level * 0.1 }}
                                />
                              </motion.div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {passwordStrength() <= 2 ? "Weak" : passwordStrength() === 3 ? "Good" : "Strong"} password
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Confirm Password
                    </Label>
                    <motion.div
                      animate={{
                        boxShadow: focusedField === "confirmPassword" 
                          ? "0 0 20px hsl(var(--primary) / 0.3)" 
                          : "0 0 0px transparent",
                      }}
                      className="rounded-lg"
                    >
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.confirmPassword ? "border-destructive animate-shake" : ""
                        }`}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p 
                          className="text-xs text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all group relative overflow-hidden mt-6" 
                      disabled={loading}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                      {loading ? (
                        <span className="flex items-center gap-2 relative z-10">
                          <motion.div 
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 relative z-10">
                          Create Account
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.span>
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div 
                  className="mt-6 pt-6 border-t border-border/50 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="text-primary-glow hover:underline font-semibold"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.p 
              className="text-center text-xs text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground transition-colors">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Right side - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-lg">
            <Link to="/" className="flex items-center gap-3 mb-12 group">
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-accent/50 blur-xl rounded-full group-hover:bg-accent/70 transition-colors" />
                <Cpu className="h-12 w-12 text-primary-glow relative z-10" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-primary-glow absolute -top-1 -right-1" />
                </motion.div>
              </motion.div>
              <span className="text-4xl font-black bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                NexusAI
              </span>
            </Link>
            
            <motion.h1 
              className="text-5xl xl:text-6xl font-black leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Build games
              <motion.span 
                className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                10x faster.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of Roblox creators using AI to build incredible experiences. Generate scripts, UI, animations, and more.
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${benefit.gradient} p-0.5 flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary-glow" />
                    </div>
                  </motion.div>
                  <span className="font-medium flex-1">{benefit.text}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Creator credit */}
            <motion.div 
              className="mt-12 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground">
                Created by{" "}
                <span className="font-bold text-primary-glow">Yassin Kadry (Jaelisxynkz)</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
