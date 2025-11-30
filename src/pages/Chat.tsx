import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { TaskTerminal } from "@/components/TaskTerminal";
import { Plus, Send, Trash2, Edit2, MessageSquare, Loader2, Menu, X, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  lastMessage?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function Chat() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkRobloxLink();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  useEffect(() => {
    if (id && user) {
      loadMessages(id);
      setMobileMenuOpen(false);
    }
  }, [id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkRobloxLink = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("roblox_username")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (!data?.roblox_username) {
        navigate("/roblox-link");
      }
    } catch (error: any) {
      console.error("Error checking Roblox link:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatSessions = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Load last message for each session
      const sessionsWithLastMessage = await Promise.all(
        (sessions || []).map(async (session) => {
          const { data: lastMsg } = await supabase
            .from("chat_messages")
            .select("content")
            .eq("chat_session_id", session.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...session,
            lastMessage: lastMsg?.content || "",
          };
        })
      );

      setChatSessions(sessionsWithLastMessage);
    } catch (error: any) {
      toast.error("Failed to load chat sessions");
      console.error("Error loading chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_session_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      const msgs = (data || []) as Message[];
      setMessages(msgs);
      setIsFirstMessage(msgs.length === 0);
    } catch (error: any) {
      toast.error("Failed to load messages");
      console.error("Error loading messages:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user?.id,
          title: "New Chat",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("New chat created!");
      navigate(`/chat/${data.id}`);
      loadChatSessions();
    } catch (error: any) {
      toast.error("Failed to create new chat");
      console.error("Error creating chat:", error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", chatId);

      if (error) throw error;

      toast.success("Chat deleted");
      
      if (id === chatId) {
        navigate("/chat");
      }
      
      loadChatSessions();
    } catch (error: any) {
      toast.error("Failed to delete chat");
      console.error("Error deleting chat:", error);
    }
  };

  const updateChatTitle = async (chatId: string) => {
    if (!newTitle.trim()) {
      setEditingTitle(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ title: newTitle.trim() })
        .eq("id", chatId);

      if (error) throw error;

      toast.success("Chat renamed");
      setEditingTitle(null);
      loadChatSessions();
    } catch (error: any) {
      toast.error("Failed to rename chat");
      console.error("Error renaming chat:", error);
    }
  };

  const generateChatTitle = async (chatId: string, message: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-chat-title`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            chatSessionId: chatId,
            firstMessage: message,
          }),
        }
      );

      // Reload chat sessions to get the new title
      loadChatSessions();
    } catch (error) {
      console.error("Error generating title:", error);
      // Non-critical error, don't show toast
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !id || sending) return;

    setSending(true);
    const userMessage = inputMessage;
    const wasFirstMessage = isFirstMessage;
    setInputMessage("");
    setIsFirstMessage(false);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            chatSessionId: id,
            message: userMessage,
            taskType: "chat_message",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          const errorData = error as { required?: number };
          toast.error(`Insufficient credits. ${errorData.required || 1} credits required.`);
        } else {
          toast.error("AI couldn't process this request. Please try again.");
        }
        
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        setSending(false);
        return;
      }

      const result = await response.json();

      // Show success notification with credits used
      if (result.creditsUsed) {
        toast.success(`Task completed! ${result.creditsUsed} credits used.`);
      }

      // Reload messages to get the actual saved messages
      await loadMessages(id);
      await loadChatSessions();

      // Generate title if this was the first message
      if (wasFirstMessage) {
        generateChatTitle(id, userMessage);
      }

      // Focus input for next message
      inputRef.current?.focus();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Network error. Please check your connection and try again.");
      
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  };

  const ChatSidebar = () => (
    <div className="h-full border-r border-border/50 flex flex-col glass-panel">
      <div className="p-4 border-b border-border/50">
        <Button onClick={createNewChat} className="w-full gap-2 hover-glow" size="sm">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {chatSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => navigate(`/chat/${session.id}`)}
            className={`group p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-all ${
              id === session.id ? "bg-primary/20 border border-primary-glow/30" : ""
            }`}
          >
            {editingTitle === session.id ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => updateChatTitle(session.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateChatTitle(session.id);
                    if (e.key === "Escape") setEditingTitle(null);
                  }}
                  autoFocus
                  className="h-7 text-sm"
                />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{session.title}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTitle(session.id);
                        setNewTitle(session.title);
                      }}
                      className="p-1 hover:bg-background rounded"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => deleteChat(session.id, e)}
                      className="p-1 hover:bg-destructive/20 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </div>
                {session.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate pl-6">
                    {session.lastMessage}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1 pl-6">
                  {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                </p>
              </>
            )}
          </div>
        ))}

        {chatSessions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No chats yet. Create one to start!
          </p>
        )}
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64">
          <ChatSidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <ChatSidebar />
          </SheetContent>
        </Sheet>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="h-14 border-b border-border/50 flex items-center px-4 gap-3 glass-panel">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              {chatSessions.find((s) => s.id === id)?.title || "NexusAI Chat"}
            </h1>
          </div>

          {id ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-background to-background">
                {messages.length === 0 && !sending && (
                  <div className="flex items-center justify-center h-full animate-fade-in">
                    <div className="text-center max-w-2xl px-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <MessageSquare className="h-8 w-8 text-primary-glow" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Start Your Game Development Journey</h3>
                      <p className="text-sm text-muted-foreground mb-8">
                        I can help you with game design, Luau scripting, UI creation, and more!
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { title: "🎮 Design a Game", prompt: "Help me design a multiplayer obby game with unique mechanics" },
                          { title: "💻 Write Scripts", prompt: "Create a Luau script for a working inventory system" },
                          { title: "🎨 Create UI", prompt: "Design a modern main menu for my game" },
                          { title: "🛠️ Get Tips", prompt: "What are the best practices for Roblox game optimization?" },
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setInputMessage(suggestion.prompt)}
                            className="p-4 text-left rounded-xl glass-panel hover-glow transition-all hover:scale-105"
                          >
                            <p className="font-medium text-sm mb-1">{suggestion.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.prompt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex animate-fade-in ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-xl ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg"
                          : "glass-panel"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <MarkdownMessage content={message.content} />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {sending && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-glow" />
                      <span className="text-sm">NexusAI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50 glass-panel space-y-3">
                {/* Terminal */}
                {sending && <TaskTerminal isProcessing={sending} creditCost={1} />}
                
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="resize-none bg-background/50 border-border/50 focus:border-primary-glow transition-all min-h-[60px]"
                      rows={3}
                      disabled={sending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || sending}
                      size="icon"
                      className="flex-shrink-0 h-[60px] w-[60px] hover-glow"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Credit cost indicator */}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary-glow" />
                      <span>1 credit per message</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4 animate-fade-in">
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                  <MessageSquare className="h-10 w-10 text-primary-glow" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Start a Conversation</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Select a chat from the sidebar or create a new one to begin chatting with NexusAI
                </p>
                <Button onClick={createNewChat} className="gap-2 hover-glow">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
