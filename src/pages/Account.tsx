import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Gamepad2, Zap, Save, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme, themes } from "@/hooks/use-theme";

export default function Account() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credits, setCredits] = useState(0);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    roblox_username: string | null;
    roblox_avatar_url: string | null;
    roblox_user_id: string | null;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadCredits();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, roblox_username, roblox_avatar_url, roblox_user_id")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const { data, error } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setCredits(data?.amount || 0);
    } catch (error: any) {
      console.error("Error loading credits:", error);
    }
  };

  const saveProfile = async () => {
    const fullName = profile?.full_name?.trim() || "";
    const robloxUsername = profile?.roblox_username?.trim() || "";

    if (!fullName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!robloxUsername) {
      toast.error("Roblox username cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-roblox", {
        body: { username: robloxUsername },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Profile updated successfully!");
      await loadProfile();
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
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

      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-lg">Manage your profile and preferences</p>
          </div>

          {/* Credits Card */}
          <Card className="p-8 glass-panel hover-glow transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/10">
                  <Zap className="h-8 w-8 text-primary-glow" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
                    {credits}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="hover-glow">Buy More</Button>
            </div>
          </Card>

          {/* Profile Settings */}
          <Card className="p-8 glass-panel hover-glow transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary-glow" />
              </div>
              <h2 className="text-2xl font-semibold">Profile Information</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/30 border-border/50"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                  className="bg-background/50 border-border/50 focus:border-primary-glow transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robloxUsername">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-primary-glow" />
                    <span className="text-sm font-medium">Roblox Username</span>
                  </div>
                </Label>
                <div className="flex items-center gap-3">
                  {profile?.roblox_avatar_url && (
                    <img
                      src={profile.roblox_avatar_url}
                      alt="Roblox Avatar"
                      className="w-12 h-12 rounded-lg border-2 border-primary-glow"
                    />
                  )}
                  <Input
                    id="robloxUsername"
                    type="text"
                    value={profile?.roblox_username || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, roblox_username: e.target.value} : null)}
                    className="bg-background/50 border-border/50 focus:border-primary-glow transition-colors flex-1"
                    minLength={3}
                    maxLength={20}
                  />
                </div>
                {profile?.roblox_user_id && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-primary-glow">✓</span> Verified • User ID: {profile.roblox_user_id}
                  </p>
                )}
              </div>

              <Button onClick={saveProfile} disabled={saving} className="gap-2 hover-glow">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>

          {/* Theme Settings */}
          <Card className="p-8 glass-panel hover-glow transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="h-6 w-6 text-primary-glow" />
              </div>
              <h2 className="text-2xl font-semibold">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Current Theme</Label>
                <div className="p-4 rounded-xl glass-panel">
                  <p className="font-semibold text-lg text-primary-glow">
                    {themes[theme].name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can change your theme from the navigation bar
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
