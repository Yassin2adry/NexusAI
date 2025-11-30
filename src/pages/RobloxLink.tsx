import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function RobloxLink() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [robloxUsername, setRobloxUsername] = useState("");
  const [saving, setSaving] = useState(false);

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

    if (!robloxUsername.trim()) {
      toast.error("Please enter your Roblox username");
      return;
    }

    if (robloxUsername.length < 3 || robloxUsername.length > 20) {
      toast.error("Roblox username must be between 3 and 20 characters");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ roblox_username: robloxUsername.trim() })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Roblox account linked successfully!");
      navigate("/chat");
    } catch (error: any) {
      toast.error("Failed to link Roblox account");
      console.error("Error linking Roblox account:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Gamepad2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Link Roblox Account</h1>
              <p className="text-sm text-muted-foreground">
                Connect your Roblox account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robloxUsername">Roblox Username</Label>
                <Input
                  id="robloxUsername"
                  type="text"
                  placeholder="Enter your Roblox username"
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your exact Roblox username (case-sensitive)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Linking..." : "Link Account"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
