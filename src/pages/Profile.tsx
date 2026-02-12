import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Trophy, Zap, Flame, Calendar, Star, Gamepad2, Code, MessageSquare,
  ExternalLink, Clock, Target, Award, TrendingUp, Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { credits } = useCredits();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, achievements: 0, messages: 0 });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const targetId = userId || currentUser?.id;

  useEffect(() => {
    if (targetId) loadProfile();
  }, [targetId]);

  const loadProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId!)
        .single();
      setProfile(profileData);

      const [projectsRes, tasksRes, achievementsRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', targetId!),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', targetId!),
        supabase.from('user_achievements').select('*, achievement:achievements(*)').eq('user_id', targetId!),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        tasks: tasksRes.count || 0,
        achievements: achievementsRes.data?.length || 0,
        messages: 0,
      });
      setAchievements(achievementsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="w-10 h-10 border-2 border-primary-glow border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isOwnProfile = targetId === currentUser?.id;
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Profile header */}
          <Card className="glass-panel overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.2),transparent_60%)]" />
            </div>
            <div className="px-6 pb-6 -mt-12 relative z-10">
              <div className="flex items-end gap-4">
                {profile?.roblox_avatar_url ? (
                  <img src={profile.roblox_avatar_url} alt="" className="w-24 h-24 rounded-2xl border-4 border-background shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-background bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 mb-1">
                  <h1 className="text-2xl font-bold">{profile?.roblox_username || profile?.full_name || 'User'}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Member since {memberSince}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" className="mb-1">Edit Profile</Button>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {[
                  { icon: Code, label: "Projects", value: stats.projects },
                  { icon: Target, label: "Tasks", value: stats.tasks },
                  { icon: Trophy, label: "Badges", value: stats.achievements },
                  { icon: Flame, label: "Streak", value: profile?.login_streak || 0 },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-muted/30">
                    <s.icon className="h-4 w-4 text-primary-glow mx-auto mb-1" />
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="achievements">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="achievements" className="flex-1 gap-1"><Trophy className="h-4 w-4" /> Achievements</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 gap-1"><TrendingUp className="h-4 w-4" /> Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              {achievements.length === 0 ? (
                <Card className="p-8 text-center glass-panel">
                  <Trophy className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">No achievements yet</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="p-4 glass-panel flex items-center gap-3">
                        <span className="text-2xl">{a.achievement?.icon || '🏆'}</span>
                        <div>
                          <p className="font-medium text-sm">{a.achievement?.name}</p>
                          <p className="text-xs text-muted-foreground">{a.achievement?.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">+{a.achievement?.credit_reward || 0}</Badge>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card className="p-8 text-center glass-panel">
                <TrendingUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Activity feed coming soon</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
