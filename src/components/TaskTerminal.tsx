import { useEffect, useState, useRef } from "react";
import { Loader2, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TerminalMessage {
  id: string;
  type: "thinking" | "success" | "error" | "info";
  message: string;
  timestamp: Date;
}

interface TaskTerminalProps {
  isProcessing: boolean;
  taskType?: string;
  creditCost?: number;
}

export function TaskTerminal({ isProcessing, taskType = "chat_message", creditCost = 1 }: TaskTerminalProps) {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isProcessing) {
      const thinkingMessages = [
        "Initializing AI processing...",
        "Analyzing your request...",
        "Generating response...",
        "Optimizing output...",
      ];

      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex < thinkingMessages.length) {
          setMessages((prev) => [
            ...prev,
            {
              id: `thinking-${Date.now()}-${messageIndex}`,
              type: "thinking",
              message: thinkingMessages[messageIndex],
              timestamp: new Date(),
            },
          ]);
          messageIndex++;
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const addMessage = (type: TerminalMessage["type"], message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type,
        message,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="glass-panel p-4 max-h-48 overflow-y-auto">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
            <span className="text-sm font-medium">AI Terminal</span>
          </div>
          {creditCost > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary-glow" />
              <span>{creditCost} credits</span>
            </div>
          )}
        </div>

        {messages.length === 0 && !isProcessing && (
          <p className="text-xs text-muted-foreground italic">Awaiting task...</p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2 text-xs animate-fade-in">
            {msg.type === "thinking" && (
              <Loader2 className="h-3 w-3 text-primary-glow animate-spin mt-0.5 flex-shrink-0" />
            )}
            {msg.type === "success" && (
              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            {msg.type === "error" && (
              <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
            )}
            {msg.type === "info" && (
              <div className="w-3 h-3 rounded-full bg-primary/20 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`${
                msg.type === "error" ? "text-destructive" :
                msg.type === "success" ? "text-green-500" :
                "text-foreground/80"
              }`}>
                {msg.message}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-primary-glow">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>NexusAI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
}
