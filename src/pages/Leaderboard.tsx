import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Flame, Zap, Star, Crown, Medal, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  roblox_username: string | null;
  roblox_avatar_url: string | null;
  credits: number;
  login_streak: number | null;
  total_logins: number | null;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, roblox_username, roblox_avatar_url, login_streak, total_logins')
        .not('roblox_username', 'is', null)
        .order('login_streak', { ascending: false })
        .limit(50);

      if (profiles) {
        const userIds = profiles.map(p => p.id);
        const { data: credits } = await supabase
          .from('credits')
          .select('user_id, amount')
          .in('user_id', userIds);

        const creditMap = new Map(credits?.map(c => [c.user_id, c.amount]) || []);

        setEntries(profiles.map(p => ({
          ...p,
          credits: creditMap.get(p.id) || 0,
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 1) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-6 text-center">#{rank + 1}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 0) return 'bg-yellow-500/5 border-yellow-500/20';
    if (rank === 1) return 'bg-gray-300/5 border-gray-300/20';
    if (rank === 2) return 'bg-amber-600/5 border-amber-600/20';
    return 'border-border/40';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Trophy className="h-4 w-4 text-primary-glow" />
              <span className="text-xs font-medium text-primary-glow">Rankings</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">Top NexusAI builders and creators</p>
          </div>

          <Tabs defaultValue="streak">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="streak" className="flex-1 gap-1"><Flame className="h-4 w-4" /> Streak</TabsTrigger>
              <TabsTrigger value="credits" className="flex-1 gap-1"><Zap className="h-4 w-4" /> Credits</TabsTrigger>
              <TabsTrigger value="logins" className="flex-1 gap-1"><TrendingUp className="h-4 w-4" /> Activity</TabsTrigger>
            </TabsList>

            {["streak", "credits", "logins"].map(tab => {
              const sorted = [...entries].sort((a, b) => {
                if (tab === "streak") return (b.login_streak || 0) - (a.login_streak || 0);
                if (tab === "credits") return b.credits - a.credits;
                return (b.total_logins || 0) - (a.total_logins || 0);
              });

              return (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-lg bg-muted/30 animate-pulse" />
                      ))
                    ) : sorted.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No data yet</p>
                      </div>
                    ) : (
                      sorted.map((entry, i) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Card className={`p-4 flex items-center gap-4 border transition-all hover:shadow-glow ${getRankBg(i)}`}>
                            {getRankIcon(i)}
                            {entry.roblox_avatar_url ? (
                              <img src={entry.roblox_avatar_url} alt="" className="w-10 h-10 rounded-full border border-border" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <Users className="h-4 w-4" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{entry.roblox_username || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-glow">
                                {tab === "streak" && `🔥 ${entry.login_streak || 0} day streak`}
                                {tab === "credits" && `⚡ ${entry.credits.toLocaleString()} credits`}
                                {tab === "logins" && `📊 ${entry.total_logins || 0} logins`}
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
