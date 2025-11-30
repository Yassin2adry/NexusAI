import { useEffect, useState } from "react";
import { Terminal, CheckCircle2, Loader2 } from "lucide-react";

interface Message {
  agent: string;
  text: string;
  status: "running" | "complete";
}

const demoMessages: Message[] = [
  { agent: "Game Designer", text: "Analyzing game concept and creating design document...", status: "complete" },
  { agent: "World Builder", text: "Generating map layout and environment structure...", status: "complete" },
  { agent: "Script Engineer", text: "Writing game logic and mechanics scripts...", status: "complete" },
  { agent: "UI Agent", text: "Creating user interface components...", status: "running" },
  { agent: "Asset Agent", text: "Organizing project structure...", status: "running" },
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
    <div className="border border-border rounded-lg bg-card p-4 h-full">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Terminal</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
            {msg.status === "complete" ? (
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <Loader2 className="h-4 w-4 text-primary animate-spin mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-primary font-medium text-xs mb-0.5">[{msg.agent}]</div>
              <div className="text-xs text-foreground/80">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Waiting for generation to start...</p>
          </div>
        )}
      </div>
    </div>
  );
};
