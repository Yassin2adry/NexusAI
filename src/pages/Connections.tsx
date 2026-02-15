import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Link2, UserPlus, UserCheck, UserX, Shield, Search, Send, MessageSquare,
  Globe, Lock, Bell, Settings, Check, X, Clock, Circle, Gamepad2,
  Github, Chrome, Apple, Eye, EyeOff, Unlink, ExternalLink, Copy,
  Users, Sparkles, Zap, Heart, Star, MoreVertical, Trash2, Ban, Volume2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ── Linked Accounts Tab ──
const LinkedAccountsTab = ({ user }: { user: any }) => {
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [robloxProfile, setRobloxProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    loadLinkedAccounts();
    loadRobloxProfile();
  }, [user]);

  const loadLinkedAccounts = async () => {
    const { data } = await supabase
      .from("linked_accounts")
      .select("*")
      .order("linked_at", { ascending: false });
    setLinkedAccounts(data || []);
    setLoading(false);
  };

  const loadRobloxProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("roblox_username, roblox_user_id, roblox_avatar_url")
      .eq("id", user.id)
      .single();
    setRobloxProfile(data);
  };

  const providers = [
    { id: "roblox", name: "Roblox", icon: Gamepad2, color: "text-red-400", desc: "Game platform identity" },
    { id: "google", name: "Google", icon: Chrome, color: "text-blue-400", desc: "Google account" },
    { id: "apple", name: "Apple", icon: Apple, color: "text-gray-300", desc: "Apple ID" },
    { id: "discord", name: "Discord", icon: MessageSquare, color: "text-indigo-400", desc: "Discord account" },
    { id: "github", name: "GitHub", icon: Github, color: "text-gray-400", desc: "Developer profile" },
  ];

  const isRobloxLinked = robloxProfile?.roblox_username;
  const getLinkedAccount = (provider: string) => linkedAccounts.find(a => a.provider === provider);

  const handleUnlink = async (provider: string) => {
    if (provider === "roblox") {
      toast.error("Roblox account cannot be unlinked — it's your primary identity");
      return;
    }
    await supabase.from("linked_accounts").delete().eq("user_id", user.id).eq("provider", provider);
    toast.success(`${provider} unlinked`);
    loadLinkedAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link2 className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground">Manage your linked external accounts</p>
        </div>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => {
          const linked = provider.id === "roblox" ? isRobloxLinked : getLinkedAccount(provider.id);
          const Icon = provider.icon;

          return (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: providers.indexOf(provider) * 0.05 }}
            >
              <Card className="p-4 flex items-center gap-4 group hover:border-primary/30 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${provider.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{provider.name}</span>
                    {linked && (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                        <Check className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {provider.id === "roblox" && isRobloxLinked
                      ? `Connected as ${robloxProfile.roblox_username}`
                      : linked
                        ? `Connected as ${(linked as any).provider_username || "User"}`
                        : provider.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {provider.id === "roblox" && isRobloxLinked && robloxProfile.roblox_avatar_url && (
                    <img src={robloxProfile.roblox_avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  {linked ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlink(provider.id)}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={provider.id === "roblox"}
                    >
                      <Unlink className="w-4 h-4 mr-1" /> Unlink
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (provider.id === "roblox") {
                          window.location.href = "/roblox-link";
                        } else {
                          toast.info(`${provider.name} OAuth coming soon`);
                        }
                      }}
                    >
                      <Link2 className="w-4 h-4 mr-1" /> Connect
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Friends Tab ──
const FriendsTab = ({ user }: { user: any }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "blocked">("all");

  useEffect(() => {
    if (!user) return;
    loadFriends();
    
    const channel = supabase
      .channel("friendships-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, () => {
        loadFriends();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadFriends = async () => {
    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const accepted = (data || []).filter(f => f.status === "accepted");
    const pending = (data || []).filter(f => f.status === "pending" && f.addressee_id === user.id);
    
    // Load profiles for friends
    const friendIds = accepted.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id);
    const pendingIds = pending.map(f => f.requester_id);
    const allIds = [...new Set([...friendIds, ...pendingIds])];

    if (allIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, roblox_username, roblox_avatar_url, full_name")
        .in("id", allIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      setFriends(accepted.map(f => ({
        ...f,
        profile: profileMap.get(f.requester_id === user.id ? f.addressee_id : f.requester_id),
        friendId: f.requester_id === user.id ? f.addressee_id : f.requester_id,
      })));

      setPendingRequests(pending.map(f => ({
        ...f,
        profile: profileMap.get(f.requester_id),
      })));
    } else {
      setFriends([]);
      setPendingRequests([]);
    }
  };

  const acceptRequest = async (id: string) => {
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", id);
    toast.success("Friend request accepted!");
    loadFriends();
  };

  const declineRequest = async (id: string) => {
    await supabase.from("friendships").delete().eq("id", id);
    toast.success("Friend request declined");
    loadFriends();
  };

  const removeFriend = async (id: string) => {
    await supabase.from("friendships").delete().eq("id", id);
    toast.success("Friend removed");
    loadFriends();
  };

  const filteredFriends = friends.filter(f =>
    !searchQuery || f.profile?.roblox_username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Friends</h2>
          <p className="text-sm text-muted-foreground">{friends.length} friends · {pendingRequests.length} pending</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "blocked"] as const).map(t => (
          <Button key={t} variant={tab === t ? "default" : "ghost"} size="sm" onClick={() => setTab(t)}>
            {t === "all" ? `All (${friends.length})` : t === "pending" ? `Pending (${pendingRequests.length})` : "Blocked"}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[500px]">
        <AnimatePresence mode="popLayout">
          {tab === "pending" && pendingRequests.map((req) => (
            <motion.div key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Card className="p-3 mb-2 flex items-center gap-3 border-warning/20">
                <img
                  src={req.profile?.roblox_avatar_url || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{req.profile?.roblox_username || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">Wants to be friends</p>
                </div>
                <Button size="sm" onClick={() => acceptRequest(req.id)} className="h-8">
                  <Check className="w-3 h-3 mr-1" /> Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => declineRequest(req.id)} className="h-8 text-destructive">
                  <X className="w-3 h-3" />
                </Button>
              </Card>
            </motion.div>
          ))}

          {tab === "all" && filteredFriends.map((friend) => (
            <motion.div key={friend.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Card className="p-3 mb-2 flex items-center gap-3 group hover:border-primary/20 transition-all">
                <div className="relative">
                  <img
                    src={friend.profile?.roblox_avatar_url || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{friend.profile?.roblox_username || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("DM coming soon")}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Voice call coming soon")}>
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeFriend(friend.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {tab === "all" && filteredFriends.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No friends yet</p>
              <p className="text-sm">Join a room to meet other developers!</p>
            </div>
          )}

          {tab === "blocked" && (
            <div className="text-center py-12 text-muted-foreground">
              <Ban className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No blocked users</p>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};

// ── DMs Tab ──
const DMsTab = ({ user }: { user: any }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConvo) return;
    loadMessages(activeConvo.id);

    const channel = supabase
      .channel(`dm-${activeConvo.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "dm_messages",
        filter: `conversation_id=eq.${activeConvo.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    const { data } = await supabase
      .from("dm_conversations")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (data && data.length > 0) {
      const otherIds = data.map(c => c.user1_id === user.id ? c.user2_id : c.user1_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, roblox_username, roblox_avatar_url")
        .in("id", otherIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));
      setConversations(data.map(c => ({
        ...c,
        otherUser: profileMap.get(c.user1_id === user.id ? c.user2_id : c.user1_id),
      })));
    } else {
      setConversations([]);
    }
  };

  const loadMessages = async (convoId: string) => {
    const { data } = await supabase
      .from("dm_messages")
      .select("*")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true })
      .limit(100);
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvo) return;
    const msg = newMessage.trim();
    setNewMessage("");

    await supabase.from("dm_messages").insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      content: msg,
    });
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Conversation List */}
      <div className="w-72 border-r border-border pr-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Messages</h3>
        </div>
        <ScrollArea className="flex-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map(convo => (
              <button
                key={convo.id}
                onClick={() => setActiveConvo(convo)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 text-left transition-all mb-1 ${
                  activeConvo?.id === convo.id ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary"
                }`}
              >
                <img
                  src={convo.otherUser?.roblox_avatar_url || "/placeholder.svg"}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {convo.otherUser?.roblox_username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">Click to open</p>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConvo ? (
          <>
            <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
              <img
                src={activeConvo.otherUser?.roblox_avatar_url || "/placeholder.svg"}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-foreground">
                {activeConvo.otherUser?.roblox_username || "User"}
              </span>
            </div>
            <ScrollArea className="flex-1 pr-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex mb-3 ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender_id === user.id
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="flex gap-2 pt-3 border-t border-border">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              />
              <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-lg">Select a conversation</p>
              <p className="text-sm">Choose a friend to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Presence Tab ──
const PresenceTab = ({ user }: { user: any }) => {
  const [status, setStatus] = useState<"online" | "idle" | "busy" | "offline">("online");

  const statusOptions = [
    { value: "online", label: "Online", color: "bg-green-500", icon: Circle },
    { value: "idle", label: "Idle", color: "bg-yellow-500", icon: Clock },
    { value: "busy", label: "Do Not Disturb", color: "bg-red-500", icon: Ban },
    { value: "offline", label: "Invisible", color: "bg-gray-500", icon: EyeOff },
  ] as const;

  const updatePresence = async (newStatus: typeof status) => {
    setStatus(newStatus);
    await supabase.from("user_presence").upsert({
      user_id: user.id,
      status: newStatus,
      last_seen: new Date().toISOString(),
    }, { onConflict: "user_id" });
    toast.success(`Status set to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Eye className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Presence & Status</h2>
          <p className="text-sm text-muted-foreground">Control how others see you</p>
        </div>
      </div>

      <div className="grid gap-3">
        {statusOptions.map(opt => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => updatePresence(opt.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                status === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${opt.color}`} />
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{opt.label}</span>
              {status === opt.value && <Check className="w-4 h-4 text-primary ml-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Connections Page ──
const Connections = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Connections</h1>
              <p className="text-muted-foreground">Manage accounts, friends, and messages</p>
            </div>
          </div>
        </motion.div>

        {!user ? (
          <Card className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Sign in required</h3>
            <p className="text-muted-foreground mb-4">Log in to manage your connections</p>
            <Button onClick={() => window.location.href = "/login"}>Sign In</Button>
          </Card>
        ) : (
          <Tabs defaultValue="accounts" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="accounts" className="gap-2"><Link2 className="w-4 h-4" /> Accounts</TabsTrigger>
              <TabsTrigger value="friends" className="gap-2"><Users className="w-4 h-4" /> Friends</TabsTrigger>
              <TabsTrigger value="dms" className="gap-2"><MessageSquare className="w-4 h-4" /> Messages</TabsTrigger>
              <TabsTrigger value="presence" className="gap-2"><Eye className="w-4 h-4" /> Presence</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts"><LinkedAccountsTab user={user} /></TabsContent>
            <TabsContent value="friends"><FriendsTab user={user} /></TabsContent>
            <TabsContent value="dms"><DMsTab user={user} /></TabsContent>
            <TabsContent value="presence"><PresenceTab user={user} /></TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Connections;
