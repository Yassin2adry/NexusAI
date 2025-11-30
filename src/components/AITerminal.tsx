import { useEffect, useState } from "react";
import { Terminal, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Message {
  agent: string;
  text: string;
  status: "running" | "complete";
}

const demoMessages: Message[] = [
  { agent: "Game Designer", text: "Analyzing game concept... Creating battle royale design document", status: "complete" },
  { agent: "World Builder", text: "Generating map layout with 100 player spawn points", status: "complete" },
  { agent: "Script Engineer", text: "Writing player movement, combat system, and zone mechanics", status: "complete" },
  { agent: "UI Agent", text: "Designing HUD, inventory, and elimination feed", status: "running" },
  { agent: "Asset Agent", text: "Organizing explorer structure and placeholder assets", status: "running" },
];

export const AITerminal = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < demoMessages.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, demoMessages[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <Card className="glass border-primary/20 p-6 h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <Terminal className="h-6 w-6 text-primary glow-primary" />
        <h3 className="text-xl font-bold">AI Terminal</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-sm max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg glass border border-border/30 animate-slide-in"
          >
            {msg.status === "complete" ? (
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-secondary animate-spin mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="text-primary font-semibold mb-1">[{msg.agent}]</div>
              <div className="text-foreground/80">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>AI agents will appear here when building your game...</p>
          </div>
        )}
      </div>
    </Card>
  );
};
