import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AiModeSelector } from "@/components/AiModeSelector";
import {
  ChatSidebar,
  ChatSuggestions,
  MessageBubble,
  TypingIndicator,
  ChatTerminal,
} from "@/components/chat";
import { Plus, Send, Menu, Loader2, Zap, RefreshCcw, StopCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingOrbs } from "@/components/animations/ParticleField";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [aiMode, setAiMode] = useState<string>("balanced");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    } catch (error) {
      console.error("Error checking Roblox link:", error);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadChatSessions = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to create new chat");
      console.error("Error creating chat:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", chatId);

      if (error) throw error;

      toast.success("Chat deleted");
      setDeletingChatId(null);
      
      if (id === chatId) {
        navigate("/chat");
      }
      
      loadChatSessions();
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error("Error deleting chat:", error);
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ title: newTitle })
        .eq("id", chatId);

      if (error) throw error;

      toast.success("Chat renamed");
      loadChatSessions();
    } catch (error) {
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

      loadChatSessions();
    } catch (error) {
      console.error("Error generating title:", error);
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setSending(false);
      setStreamingMessageId(null);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !id || sending) return;

    abortControllerRef.current = new AbortController();
    setSending(true);
    const userMessage = inputMessage;
    const wasFirstMessage = isFirstMessage;
    setInputMessage("");
    setIsFirstMessage(false);

    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempUserMsg: Message = {
      id: tempUserMsgId,
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
            aiMode: aiMode,
          }),
          signal: abortControllerRef.current.signal,
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
        
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsgId));
        setSending(false);
        return;
      }

      const result = await response.json();

      if (result.creditsUsed) {
        toast.success(`Task completed! ${result.creditsUsed} credits used.`);
      }

      await loadMessages(id);
      await loadChatSessions();

      if (wasFirstMessage) {
        generateChatTitle(id, userMessage);
      }

      inputRef.current?.focus();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast.info("Generation stopped");
      } else {
        console.error("Error sending message:", error);
        toast.error("Network error. Please check your connection and try again.");
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsgId));
      }
    } finally {
      setSending(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  const creditCost = aiMode === "advanced" || aiMode === "expert" ? 2 : 1;

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Navigation />
        <FloatingOrbs />
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-primary-glow/30"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ 
                    scale: [1, 2, 2.5],
                    opacity: [0.5, 0.2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  style={{ width: 60, height: 60 }}
                />
              ))}
              
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center glow-box"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(var(--primary-glow) / 0.4)",
                    "0 0 40px hsl(var(--primary-glow) / 0.6)",
                    "0 0 20px hsl(var(--primary-glow) / 0.4)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-background/20"
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
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
        <div className="hidden md:block w-72">
          <ChatSidebar
            sessions={chatSessions}
            currentSessionId={id}
            onCreateNew={createNewChat}
            onSelectSession={(sessionId) => navigate(`/chat/${sessionId}`)}
            onDeleteSession={(sessionId) => setDeletingChatId(sessionId)}
            onRenameSession={updateChatTitle}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <ChatSidebar
              sessions={chatSessions}
              currentSessionId={id}
              onCreateNew={createNewChat}
              onSelectSession={(sessionId) => {
                navigate(`/chat/${sessionId}`);
                setMobileMenuOpen(false);
              }}
              onDeleteSession={(sessionId) => setDeletingChatId(sessionId)}
              onRenameSession={updateChatTitle}
            />
          </SheetContent>
        </Sheet>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <motion.div 
            className="h-14 border-b border-border/50 flex items-center px-4 gap-3 glass-panel"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-semibold truncate gradient-text-premium flex-1">
              {chatSessions.find((s) => s.id === id)?.title || "NexusAI Chat"}
            </h1>
            
            <AiModeSelector selectedMode={aiMode} onModeChange={setAiMode} />
          </motion.div>

          {id ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-background to-background relative">
                {/* Background pattern */}
                <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {messages.length === 0 && !sending && (
                    <ChatSuggestions onSelect={setInputMessage} />
                  )}
                </AnimatePresence>
                
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    id={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.created_at}
                    isNew={index === messages.length - 1}
                    isStreaming={message.id === streamingMessageId}
                    onQuote={(content) => setInputMessage(`> ${content}\n\n`)}
                  />
                ))}
                
                <AnimatePresence>
                  {sending && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <TypingIndicator variant="sparkle" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <motion.div 
                className="p-4 border-t border-border/50 glass-panel space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {/* Terminal (only when processing) */}
                <AnimatePresence>
                  {sending && (
                    <ChatTerminal 
                      isProcessing={sending} 
                      creditCost={creditCost}
                    />
                  )}
                </AnimatePresence>
                
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
                      className="resize-none bg-background/50 border-border/50 focus:border-primary-glow transition-all min-h-[60px] input-glow"
                      rows={3}
                      disabled={sending}
                    />
                    
                    {sending ? (
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={stopGeneration}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0 h-[28px] w-[60px] hover:bg-destructive/10 hover:border-destructive/50"
                        >
                          <StopCircle className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0 h-[28px] w-[60px] opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        size="icon"
                        className="flex-shrink-0 h-[60px] w-[60px] hover-glow"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Credit cost indicator */}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary-glow" />
                      <span>{creditCost} credit{creditCost > 1 ? 's' : ''} per message</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="flex-1 flex items-center justify-center text-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div>
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(var(--primary-glow) / 0.2)",
                      "0 0 40px hsl(var(--primary-glow) / 0.3)",
                      "0 0 20px hsl(var(--primary-glow) / 0.2)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Menu className="h-10 w-10 text-primary-glow" />
                </motion.div>
                <h2 className="text-2xl font-semibold mb-3 gradient-text">Start a Conversation</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Select a chat from the sidebar or create a new one to begin chatting with NexusAI
                </p>
                <Button onClick={createNewChat} className="gap-2 hover-glow">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <AlertDialogContent className="glass-panel-solid">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingChatId && deleteChat(deletingChatId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
