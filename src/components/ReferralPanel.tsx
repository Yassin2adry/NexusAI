import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Users, Gift, TrendingUp } from "lucide-react";

interface Referral {
  id: string;
  referred_id: string;
  signup_bonus_awarded: boolean;
  task_bonus_awarded: boolean;
  created_at: string;
}

export function ReferralPanel() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    try {
      // Get user's referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user?.id)
        .single();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
      }

      // Get referrals
      const { data: referralData, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReferrals(referralData || []);

      // Calculate total earned
      const earned = (referralData || []).reduce((total, ref) => {
        let amount = 0;
        if (ref.signup_bonus_awarded) amount += 50;
        if (ref.task_bonus_awarded) amount += 25;
        return total + amount;
      }, 0);
      setTotalEarned(earned);
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  if (loading) {
    return (
      <Card className="p-6 glass-panel">
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-muted-foreground">Loading referral data...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 glass-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gift className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Invite Friends & Earn Credits</h3>
            <p className="text-sm text-muted-foreground">
              Get 50 credits when they sign up + 25 credits when they complete their first task
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly className="font-mono" />
              <Button onClick={copyReferralCode} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Share Your Link</label>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/signup?ref=${referralCode}`}
                readOnly
                className="text-sm"
              />
              <Button onClick={copyReferralLink} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 glass-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <p className="text-2xl font-bold">{referrals.length}</p>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEarned}</p>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Gift className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {referrals.filter((r) => r.signup_bonus_awarded).length}
              </p>
              <p className="text-sm text-muted-foreground">Signups</p>
            </div>
          </div>
        </Card>
      </div>

      {referrals.length > 0 && (
        <Card className="p-6 glass-panel">
          <h4 className="font-semibold mb-4">Referral History</h4>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-4 w-4 text-primary-glow" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Friend Joined</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {referral.signup_bonus_awarded && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                      +50 credits
                    </span>
                  )}
                  {referral.task_bonus_awarded && (
                    <span className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-500">
                      +25 credits
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
