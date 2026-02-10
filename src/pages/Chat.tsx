import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
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
import { Plus, Send, Menu, Zap, StopCircle, Bot, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  const [lastAiMessageId, setLastAiMessageId] = useState<string | null>(null);

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
      setLastAiMessageId(null);
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
          return { ...session, lastMessage: lastMsg?.content || "" };
        })
      );
      setChatSessions(sessionsWithLastMessage);
    } catch (error) {
      toast.error("Failed to load chat sessions");
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
    }
  };

  const createNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user?.id, title: "New Chat" })
        .select()
        .single();
      if (error) throw error;
      toast.success("New chat created!");
      navigate(`/chat/${data.id}`);
      loadChatSessions();
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase.from("chat_sessions").delete().eq("id", chatId);
      if (error) throw error;
      toast.success("Chat deleted");
      setDeletingChatId(null);
      if (id === chatId) navigate("/chat");
      loadChatSessions();
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase.from("chat_sessions").update({ title: newTitle }).eq("id", chatId);
      if (error) throw error;
      toast.success("Chat renamed");
      loadChatSessions();
    } catch (error) {
      toast.error("Failed to rename chat");
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
          body: JSON.stringify({ chatSessionId: chatId, firstMessage: message }),
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
          toast.error(`Insufficient credits. ${(error as any).required || 1} credits required.`);
        } else {
          toast.error("AI couldn't process this request. Please try again.");
        }
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsgId));
        setSending(false);
        return;
      }

      const result = await response.json();
      if (result.creditsUsed) {
        toast.success(`${result.creditsUsed} credit${result.creditsUsed > 1 ? 's' : ''} used`);
      }

      await loadMessages(id);
      
      // Mark the last AI message for streaming animation
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant') {
          setLastAiMessageId(lastMsg.id);
        }
        return prev;
      });

      await loadChatSessions();
      if (wasFirstMessage) {
        generateChatTitle(id, userMessage);
      }
      inputRef.current?.focus();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.info("Generation stopped");
      } else {
        toast.error("Network error. Please check your connection.");
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsgId));
      }
    } finally {
      setSending(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  const creditCost = aiMode === "advanced" || aiMode === "expert" ? 2 : 1;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="h-7 w-7 text-primary-foreground" />
              </motion.div>
              <motion.div
                className="absolute -inset-3 rounded-2xl border border-primary-glow/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Loading NexusAI...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 flex-shrink-0">
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
            className="h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-card/60 backdrop-blur-md"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-glow" />
              </div>
              <h1 className="text-sm font-semibold truncate">
                {chatSessions.find((s) => s.id === id)?.title || "NexusAI Chat"}
              </h1>
            </div>

            <AiModeSelector selectedMode={aiMode} onModeChange={setAiMode} />
          </motion.div>

          {id ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto relative">
                {/* Subtle background */}
                <div className="absolute inset-0 dots-pattern opacity-20 pointer-events-none" />

                <div className="max-w-3xl mx-auto p-4 space-y-6 relative z-10">
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
                      isNew={index === messages.length - 1 || index === messages.length - 2}
                      isStreaming={message.id === lastAiMessageId && message.role === 'assistant'}
                      onQuote={(content) => setInputMessage(`> ${content}\n\n`)}
                    />
                  ))}

                  <AnimatePresence>
                    {sending && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-primary-glow" />
                        </div>
                        <div className="flex-1">
                          <ChatTerminal isProcessing={sending} creditCost={creditCost} />
                          <div className="mt-3">
                            <TypingIndicator variant="sparkle" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border/50 bg-card/40 backdrop-blur-sm p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask NexusAI anything about Roblox development..."
                        className="w-full resize-none rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all min-h-[48px] max-h-[160px]"
                        rows={1}
                        disabled={sending}
                        style={{ height: 'auto', minHeight: '48px' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 160) + 'px';
                        }}
                      />
                    </div>

                    {sending ? (
                      <Button
                        onClick={stopGeneration}
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-xl border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 flex-shrink-0"
                      >
                        <StopCircle className="h-5 w-5 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        size="icon"
                        className="h-12 w-12 rounded-xl flex-shrink-0 shadow-glow disabled:shadow-none disabled:opacity-40"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[11px] text-muted-foreground">
                      Enter to send · Shift+Enter for new line
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Zap className="h-3 w-3 text-primary-glow" />
                      <span>{creditCost} credit{creditCost > 1 ? "s" : ""}/msg</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/15 to-primary-glow/15 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(var(--primary-glow) / 0.15)",
                      "0 0 40px hsl(var(--primary-glow) / 0.25)",
                      "0 0 20px hsl(var(--primary-glow) / 0.15)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="h-10 w-10 text-primary-glow" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Select a chat or create a new one to start building with NexusAI
                </p>
                <Button onClick={createNewChat} className="gap-2 shadow-glow">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat and all its messages.
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
