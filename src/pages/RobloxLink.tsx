import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2, Cpu, Sparkles, CheckCircle2, ArrowRight, Shield, Zap, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const robloxSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export default function RobloxLink() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [robloxUsername, setRobloxUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      checkRobloxLink();
    }
  }, [user]);

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
    setError("");
    
    const result = robloxSchema.safeParse({ username: robloxUsername.trim() });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-roblox", {
        body: { username: robloxUsername.trim() },
      });

      if (error) throw error;

      if (data.error) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setStep(2);
      toast.success(`Roblox account verified: ${data.robloxUser.username}!`);
      
      // Short delay for animation
      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (error: any) {
      console.error("Error linking Roblox account:", error);
      setError(error.message || "Failed to verify Roblox account. Please check your username.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <Cpu className="h-8 w-8 text-primary-glow" />
            <span className="text-2xl font-black bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              NexusAI
            </span>
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6">
                    <Gamepad2 className="h-10 w-10 text-primary-glow" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black mb-3">
                    Link Your Roblox Account
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Connect your Roblox account to unlock all features
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <Shield className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Secure</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <Zap className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Instant</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <Users className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>

                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="robloxUsername" className="text-sm font-medium">
                        Roblox Username
                      </Label>
                      <Input
                        id="robloxUsername"
                        type="text"
                        placeholder="Enter your Roblox username"
                        value={robloxUsername}
                        onChange={(e) => {
                          setRobloxUsername(e.target.value);
                          setError("");
                        }}
                        required
                        className={`h-14 text-lg bg-background/50 border-border/50 focus:border-primary-glow focus:ring-2 focus:ring-primary/20 transition-all ${
                          error ? "border-destructive" : ""
                        }`}
                      />
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Enter your exact Roblox username (case-sensitive)
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity group" 
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Link Account
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  We'll verify your Roblox account exists and link it to your NexusAI account
                </p>
              </>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h1 className="text-3xl font-black mb-3">Account Linked!</h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Your Roblox account has been verified successfully
                </p>
                <p className="text-sm text-primary-glow">
                  Redirecting to your dashboard...
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            Created by{" "}
            <span className="font-semibold text-primary-glow">Yassin Kadry (Jaelisxynkz)</span>
          </p>
        </footer>
      </div>
    </div>
  );
}