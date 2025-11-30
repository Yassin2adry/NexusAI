import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Zap } from "lucide-react";

export default function Signup() {
  return (
    <div className="min-h-screen bg-background bg-circuit">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="glass border-primary/20 p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Zap className="h-10 w-10 text-primary glow-primary" />
                <span className="text-3xl font-bold text-gradient-primary">NexusAI</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Start Building Today</h1>
              <p className="text-muted-foreground">Create your account and get started</p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </div>

              <Button className="w-full bg-gradient-cyber glow-primary">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
