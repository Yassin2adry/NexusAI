import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface LoginBonusResult {
  credits_awarded: number;
  new_streak: number;
  is_streak_broken: boolean;
}

export function DailyLoginBonus() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [bonusData, setBonusData] = useState<LoginBonusResult | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkDailyBonus = async () => {
      try {
        const { data, error } = await supabase.rpc("handle_daily_login", {
          p_user_id: user.id,
        });

        if (error) throw error;

        if (data && data.length > 0 && data[0].credits_awarded > 0) {
          setBonusData(data[0]);
          setOpen(true);
        }
      } catch (error) {
        console.error("Error checking daily bonus:", error);
      }
    };

    checkDailyBonus();
  }, [user]);

  if (!bonusData) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-panel border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center gradient-text flex items-center justify-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            Daily Login Bonus!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Welcome back to NexusAI!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-4 animate-pulse">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <p className="text-4xl font-bold mb-2">+{bonusData.credits_awarded} Credits</p>
            <p className="text-muted-foreground">
              {bonusData.is_streak_broken
                ? "Your streak was reset, but you're back on track!"
                : "Keep up the streak!"}
            </p>
          </div>

          <div className="glass-panel p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-2xl font-bold">{bonusData.new_streak} Day Streak</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Login daily to increase your streak bonus!
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Base reward: 5 credits</p>
            <p>Streak bonus: +{bonusData.credits_awarded - 5} credits</p>
          </div>
        </div>

        <Button onClick={() => setOpen(false)} className="w-full">
          Awesome!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
