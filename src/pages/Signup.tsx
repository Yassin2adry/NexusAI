import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Signup() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 border-border">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Cpu className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold">NexusAI</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Create Account</h1>
              <p className="text-sm text-muted-foreground">Start building games with AI</p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background border-border"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>

              <Button className="w-full">Create Account</Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
