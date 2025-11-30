import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  credit_reward: number;
  earned_at?: string;
}

export function AchievementsPanel() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadAchievements = async () => {
      try {
        // Load all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from("achievements")
          .select("*")
          .order("credit_reward", { ascending: true });

        if (achievementsError) throw achievementsError;

        // Load user's earned achievements
        const { data: userAchievements, error: userError } = await supabase
          .from("user_achievements")
          .select("achievement_id, earned_at")
          .eq("user_id", user.id);

        if (userError) throw userError;

        // Merge data
        const earnedMap = new Map(
          userAchievements?.map((ua) => [ua.achievement_id, ua.earned_at]) || []
        );

        const mergedAchievements = allAchievements?.map((ach) => ({
          ...ach,
          earned_at: earnedMap.get(ach.id),
        })) || [];

        setAchievements(mergedAchievements);

        // Check for new achievements
        checkNewAchievements();
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkNewAchievements = async () => {
      try {
        const { data, error } = await supabase.rpc("check_achievements", {
          p_user_id: user.id,
        });

        if (error) throw error;

        if (data && data.length > 0) {
          data.forEach((achievement: Achievement) => {
            toast.success(
              `Achievement Unlocked: ${achievement.name}! +${achievement.credit_reward} credits`,
              { duration: 5000 }
            );
          });
          // Reload achievements to show newly earned ones
          loadAchievements();
        }
      } catch (error) {
        console.error("Error checking achievements:", error);
      }
    };

    loadAchievements();

    // Subscribe to user_achievements changes
    const channel = supabase
      .channel("achievements-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_achievements",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Award;
    return IconComponent;
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading achievements...</div>;
  }

  const earnedCount = achievements.filter((a) => a.earned_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Award className="h-8 w-8 text-primary" />
          Achievements
        </h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {earnedCount} / {achievements.length}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => {
          const Icon = getIcon(achievement.icon);
          const isEarned = !!achievement.earned_at;

          return (
            <Card
              key={achievement.id}
              className={`p-6 ${
                isEarned
                  ? "glass-panel border-primary/50"
                  : "bg-background/50 border-border/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isEarned ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  {isEarned ? (
                    <Icon className="h-8 w-8 text-primary" />
                  ) : (
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{achievement.name}</h3>
                    <Badge
                      variant={isEarned ? "default" : "outline"}
                      className="ml-2"
                    >
                      +{achievement.credit_reward}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {isEarned && achievement.earned_at && (
                    <p className="text-xs text-primary">
                      Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
