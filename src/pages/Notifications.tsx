import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell, BellOff, Check, CheckCheck, Trash2, MessageSquare, Trophy, Zap,
  Users, Star, Gift, AlertTriangle, Info, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All marked as read");
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const typeIcons: Record<string, any> = {
    achievement: Trophy,
    credits: Zap,
    social: Users,
    system: Info,
    warning: AlertTriangle,
    message: MessageSquare,
    reward: Gift,
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="h-7 w-7 text-primary-glow" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2">{unreadCount}</Badge>
                )}
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "unread", "achievement", "credits", "social", "system"].map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize text-xs"
              >
                {f}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-muted/30 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <Card className="p-12 text-center glass-panel">
                <BellOff className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">No notifications</p>
              </Card>
            ) : (
              <AnimatePresence>
                {filtered.map((n, i) => {
                  const Icon = typeIcons[n.type] || Bell;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card
                        className={`p-4 flex items-start gap-3 transition-all group ${
                          n.read ? 'opacity-60' : 'border-primary/20'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <Icon className="h-4 w-4 text-primary-glow" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(n.id)}>
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteNotification(n.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
