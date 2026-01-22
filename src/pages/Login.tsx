import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Sparkles, Eye, EyeOff, Zap, Shield, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ForgotPassword } from "@/components/ForgotPassword";
import { z } from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

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
    } catch (error: any) {
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24">
          <div className="max-w-lg">
            <Link to="/" className="flex items-center gap-3 mb-12 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full group-hover:bg-primary/70 transition-colors" />
                <Cpu className="h-12 w-12 text-primary-glow relative z-10" />
                <Sparkles className="h-5 w-5 text-primary-glow absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-4xl font-black bg-gradient-to-r from-foreground via-primary-glow to-foreground bg-clip-text text-transparent">
                NexusAI
              </span>
            </Link>
            
            <h1 className="text-5xl xl:text-6xl font-black leading-tight mb-6">
              Welcome back,
              <span className="block bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                Creator.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Continue building incredible Roblox experiences with the power of AI. Your projects are waiting.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <h3 className="font-semibold">100 Daily Credits</h3>
                  <p className="text-sm text-muted-foreground">Free credits every 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">Your data stays protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
              <Cpu className="h-10 w-10 text-primary-glow" />
              <span className="text-3xl font-black bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                NexusAI
              </span>
            </Link>

            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Sign In</h2>
                <p className="text-muted-foreground">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`h-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs text-primary-glow hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`h-12 pr-12 bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.password ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity group" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-primary-glow hover:underline font-semibold"
                  >
                    Create one free
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPassword open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </div>
  );
}