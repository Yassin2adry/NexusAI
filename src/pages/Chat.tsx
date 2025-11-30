import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, Trash2, Edit2, MessageSquare, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setChatSessions(data || []);
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
      setMessages((data || []) as Message[]);
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

    if (!confirm("Are you sure you want to delete this chat?")) return;

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

  const sendMessage = async () => {
    if (!inputMessage.trim() || !id) return;

    setSending(true);
    const userMessage = inputMessage;
    setInputMessage("");

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: "temp-user",
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
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      const data = await response.json();

      // Reload messages to get the actual saved messages
      await loadMessages(id);
      await loadChatSessions();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== "temp-user"));
    } finally {
      setSending(false);
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

      <div className="container mx-auto px-4 pt-20 pb-4 h-screen flex flex-col">
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border flex flex-col">
            <div className="p-4">
              <Button onClick={createNewChat} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/chat/${session.id}`)}
                  className={`group p-3 rounded cursor-pointer hover:bg-muted transition-colors ${
                    id === session.id ? "bg-muted" : ""
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
                        className="h-8 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm truncate">{session.title}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {id ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && !sending && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center max-w-2xl">
                        <h3 className="text-lg font-semibold mb-2">Start Your Game Development Journey</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          I can help you with game design, Luau scripting, UI creation, and more!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { title: "🎮 Design a Game", prompt: "Help me design a multiplayer obby game with unique mechanics" },
                            { title: "💻 Write Scripts", prompt: "Create a Luau script for a working inventory system" },
                            { title: "🎨 Create UI", prompt: "Design a modern main menu for my game" },
                            { title: "🛠️ Get Tips", prompt: "What are the best practices for Roblox game optimization?" },
                          ].map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => setInputMessage(suggestion.prompt)}
                              className="p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all"
                            >
                              <p className="font-medium text-sm mb-1">{suggestion.title}</p>
                              <p className="text-xs text-muted-foreground">{suggestion.prompt}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-4 rounded-lg flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="resize-none bg-background border-border"
                      rows={3}
                      disabled={sending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || sending}
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a chat or create a new one to begin
                  </p>
                  <Button onClick={createNewChat} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
