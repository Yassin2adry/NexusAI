import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hash, Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Users, Plus, Lock,
  Globe, Search, Send, Smile, Settings, Crown, Shield, Volume2, VolumeX,
  MessageSquare, Radio, Play, Youtube, Music, Gamepad2, Trophy, Star,
  Copy, Check, ArrowRight, Headphones, ScreenShare, Image as ImageIcon,
  Sparkles, Zap, Heart, ThumbsUp, Flame, PartyPopper, Eye, EyeOff, Clock
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Room {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  max_participants: number;
  created_by: string;
  created_at: string;
}

interface RoomMember {
  id: string;
  user_id: string;
  role: string;
  is_muted: boolean;
  is_banned: boolean;
  profile?: {
    roblox_username: string | null;
    roblox_avatar_url: string | null;
    full_name: string | null;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  message_type: string;
  created_at: string;
  profile?: {
    roblox_username: string | null;
    roblox_avatar_url: string | null;
  };
}

// ── Voice / Video Room Panel ──
const VoiceRoom = ({ room, onLeave }: { room: Room; onLeave: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadMembers();
    const channel = supabase
      .channel(`room-members-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_members', filter: `room_id=eq.${room.id}` }, () => loadMembers())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [room.id]);

  const loadMembers = async () => {
    const { data } = await supabase
      .from('room_members')
      .select('*, profile:profiles(roblox_username, roblox_avatar_url, full_name)')
      .eq('room_id', room.id)
      .eq('is_banned', false);
    if (data) setMembers(data as any);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Radio className="h-5 w-5 text-green-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold">{room.name}</h3>
            <p className="text-xs text-muted-foreground">{members.length} connected</p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400/30">LIVE</Badge>
      </div>

      {/* Members grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`relative rounded-xl border p-4 flex flex-col items-center gap-2 transition-all ${
                member.is_muted ? 'border-border/30 opacity-60' : 'border-primary/30 shadow-glow'
              }`}
            >
              {/* Speaking indicator ring */}
              {!member.is_muted && (
                <div className="absolute inset-0 rounded-xl border-2 border-green-400/50 animate-pulse pointer-events-none" />
              )}
              <div className="relative">
                {member.profile?.roblox_avatar_url ? (
                  <img src={member.profile.roblox_avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                {member.role === 'host' && (
                  <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
                )}
                {member.role === 'moderator' && (
                  <Shield className="absolute -top-1 -right-1 h-4 w-4 text-blue-400" />
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {member.profile?.roblox_username || 'User'}
              </span>
              {member.is_muted && <MicOff className="h-3 w-3 text-red-400" />}
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Controls bar */}
      <div className="p-4 border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={() => { setIsMuted(!isMuted); toast(isMuted ? "Unmuted" : "Muted"); }}
            className="rounded-full h-12 w-12"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            variant={isDeafened ? "destructive" : "outline"}
            size="icon"
            onClick={() => { setIsDeafened(!isDeafened); toast(isDeafened ? "Undeafened" : "Deafened"); }}
            className="rounded-full h-12 w-12"
          >
            {isDeafened ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Button
            variant={isCameraOn ? "default" : "outline"}
            size="icon"
            onClick={() => { setIsCameraOn(!isCameraOn); toast(isCameraOn ? "Camera off" : "Camera on"); }}
            className="rounded-full h-12 w-12"
          >
            {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="icon"
            onClick={() => { setIsScreenSharing(!isScreenSharing); toast(isScreenSharing ? "Stopped sharing" : "Screen sharing"); }}
            className="rounded-full h-12 w-12"
          >
            {isScreenSharing ? <Monitor className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={onLeave}
            className="rounded-full h-12 w-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Room Chat ──
const RoomChat = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const emojis = ["👍", "❤️", "🔥", "😂", "🎮", "💯", "🚀", "⭐", "🎉", "💪", "👀", "🤔"];

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel(`room-chat-${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${roomId}` }, (payload) => {
        loadMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    if (data) {
      // Fetch profiles for messages
      const userIds = [...new Set(data.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, roblox_username, roblox_avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      setMessages(data.map(m => ({
        ...m,
        profile: profileMap.get(m.user_id) as any
      })));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const msg = newMessage.trim();
    setNewMessage("");
    
    await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: user.id,
      content: msg,
      message_type: 'text'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const isOwn = msg.user_id === user?.id;
            const showAvatar = i === 0 || messages[i - 1].user_id !== msg.user_id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {showAvatar ? (
                  msg.profile?.roblox_avatar_url ? (
                    <img src={msg.profile.roblox_avatar_url} alt="" className="w-8 h-8 rounded-full border border-border flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Users className="h-3 w-3" />
                    </div>
                  )
                ) : <div className="w-8" />}
                <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                  {showAvatar && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {msg.profile?.roblox_username || 'User'}
                    </span>
                  )}
                  <div className={`rounded-2xl px-4 py-2 text-sm ${
                    isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-2"
          >
            <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-muted/50 border border-border/40">
              {emojis.map(e => (
                <button key={e} onClick={() => { setNewMessage(prev => prev + e); setShowEmojis(false); }} className="text-lg hover:scale-125 transition-transform p-1">
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-border/40">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmojis(!showEmojis)}>
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// ── YouTube Watch Party ──
const YouTubeWatchParty = ({ roomId }: { roomId: string }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match?.[1] || null;
  };

  const loadVideo = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setCurrentVideo(id);
      setIsPlaying(true);
      toast.success("Video loaded for watch party!");
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold">Watch Party</h3>
        </div>
        <div className="flex gap-2 mt-3">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="flex-1"
          />
          <Button onClick={loadVideo} size="sm">
            <Play className="h-4 w-4 mr-1" /> Load
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black/50">
        {currentVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Watch Party"
          />
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <Youtube className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No video playing</p>
            <p className="text-sm mt-1">Paste a YouTube link to start a watch party</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Create Room Modal ──
const CreateRoomModal = ({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  const createRoom = async () => {
    if (!name.trim() || !user) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.from('rooms').insert({
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic,
        max_participants: maxParticipants,
        created_by: user.id,
      }).select().single();

      if (error) throw error;

      // Auto-join as host
      await supabase.from('room_members').insert({
        room_id: data.id,
        user_id: user.id,
        role: 'host',
      });

      toast.success("Room created!");
      onCreated();
      onClose();
      setName("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="p-6 glass-panel border-primary/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary-glow" />
            Create Room
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Room Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My awesome room" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this room about?" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsPublic(true)}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  isPublic ? 'border-primary bg-primary/10 text-primary-glow' : 'border-border/40 text-muted-foreground hover:border-border'
                }`}
              >
                <Globe className="h-4 w-4 mx-auto mb-1" />
                Public
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  !isPublic ? 'border-primary bg-primary/10 text-primary-glow' : 'border-border/40 text-muted-foreground hover:border-border'
                }`}
              >
                <Lock className="h-4 w-4 mx-auto mb-1" />
                Private (Code)
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Participants: {maxParticipants}</label>
              <input
                type="range"
                min={2}
                max={50}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button onClick={createRoom} disabled={!name.trim() || creating} className="flex-1">
                {creating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// ── Main Community Page ──
export default function Community() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
    const channel = supabase
      .channel('rooms-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => loadRooms())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    if (data) setRooms(data);
    // Fake online count for now
    setOnlineCount(Math.floor(Math.random() * 50) + 5);
  };

  const joinRoom = async (room: Room) => {
    if (!user) { toast.error("Please sign in first"); return; }
    
    // Check if already member
    const { data: existing } = await supabase
      .from('room_members')
      .select('id')
      .eq('room_id', room.id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (!existing) {
      await supabase.from('room_members').insert({
        room_id: room.id,
        user_id: user.id,
        role: 'member',
      });
    }
    
    setActiveRoom(room);
    toast.success(`Joined ${room.name}`);
  };

  const leaveRoom = async () => {
    if (activeRoom && user) {
      await supabase.from('room_members')
        .delete()
        .eq('room_id', activeRoom.id)
        .eq('user_id', user.id);
    }
    setActiveRoom(null);
    toast("Left room");
  };

  const copyRoomId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Room code copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const joinByCode = async () => {
    if (!joinCode.trim()) return;
    const { data } = await supabase.from('rooms').select('*').eq('id', joinCode.trim()).maybeSingle();
    if (data) {
      joinRoom(data);
      setJoinCode("");
    } else {
      toast.error("Room not found");
    }
  };

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar – Room list */}
          <div className="w-80 border-r border-border/40 bg-card/30 flex flex-col">
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-glow" />
                  Community
                </h2>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">{onlineCount} online</span>
                </div>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2 mb-3">
                <Button size="sm" onClick={() => setShowCreateModal(true)} className="flex-1 gap-1">
                  <Plus className="h-3 w-3" /> Create
                </Button>
              </div>

              {/* Join by code */}
              <div className="flex gap-1.5">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter room code..."
                  className="text-xs"
                />
                <Button size="sm" variant="outline" onClick={joinByCode} disabled={!joinCode.trim()}>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredRooms.map((room) => (
                  <motion.button
                    key={room.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinRoom(room)}
                    className={`w-full text-left p-3 rounded-lg transition-all group ${
                      activeRoom?.id === room.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {room.is_public ? (
                          <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium truncate">{room.name}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyRoomId(room.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedId === room.id ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {room.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1 pl-6">{room.description}</p>
                    )}
                  </motion.button>
                ))}

                {filteredRooms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No rooms found</p>
                    <Button size="sm" variant="link" onClick={() => setShowCreateModal(true)}>
                      Create one
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {activeRoom ? (
              <>
                {/* Room tabs */}
                <div className="border-b border-border/40 px-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent h-12">
                      <TabsTrigger value="chat" className="gap-1.5 data-[state=active]:bg-muted">
                        <MessageSquare className="h-4 w-4" /> Chat
                      </TabsTrigger>
                      <TabsTrigger value="voice" className="gap-1.5 data-[state=active]:bg-muted">
                        <Headphones className="h-4 w-4" /> Voice
                      </TabsTrigger>
                      <TabsTrigger value="youtube" className="gap-1.5 data-[state=active]:bg-muted">
                        <Youtube className="h-4 w-4" /> Watch Party
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex-1 overflow-hidden">
                  {activeTab === "chat" && <RoomChat roomId={activeRoom.id} />}
                  {activeTab === "voice" && <VoiceRoom room={activeRoom} onLeave={leaveRoom} />}
                  {activeTab === "youtube" && <YouTubeWatchParty roomId={activeRoom.id} />}
                </div>
              </>
            ) : (
              /* No room selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-primary-glow" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to Community</h2>
                  <p className="text-muted-foreground mb-6">
                    Join or create rooms to chat, voice call, stream, and watch YouTube together — just like Discord!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                      <Plus className="h-4 w-4" /> Create Room
                    </Button>
                    {rooms.length > 0 && (
                      <Button variant="outline" onClick={() => joinRoom(rooms[0])} className="gap-2">
                        <ArrowRight className="h-4 w-4" /> Join First Room
                      </Button>
                    )}
                  </div>

                  {/* Feature cards */}
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[
                      { icon: Mic, label: "Voice Chat", desc: "Talk with friends" },
                      { icon: Monitor, label: "Screen Share", desc: "Share your screen" },
                      { icon: Youtube, label: "Watch Party", desc: "Watch together" },
                    ].map((f, i) => (
                      <Card key={i} className="p-4 text-center glass-panel hover-lift transition-all cursor-default">
                        <f.icon className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                        <p className="text-xs font-medium">{f.label}</p>
                        <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateRoomModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={loadRooms} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
