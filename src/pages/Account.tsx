import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Gamepad2, Zap, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Account() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          {/* Credits Card */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <p className="text-2xl font-bold">{credits}</p>
                </div>
              </div>
              <Button variant="outline">Buy More</Button>
            </div>
          </Card>

          {/* Profile Settings */}
          <Card className="p-6 border-border">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted border-border"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robloxUsername">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Roblox Username
                  </div>
                </Label>
                <div className="flex items-center gap-2">
                  {profile?.roblox_avatar_url && (
                    <img
                      src={profile.roblox_avatar_url}
                      alt="Roblox Avatar"
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                  )}
                  <Input
                    id="robloxUsername"
                    type="text"
                    value={profile?.roblox_username || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, roblox_username: e.target.value} : null)}
                    className="bg-background border-border flex-1"
                    minLength={3}
                    maxLength={20}
                  />
                </div>
                {profile?.roblox_user_id && (
                  <p className="text-xs text-muted-foreground">
                    User ID: {profile.roblox_user_id} (Verified ✓)
                  </p>
                )}
              </div>

              <Button onClick={saveProfile} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
