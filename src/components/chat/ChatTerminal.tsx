import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, CheckCircle2, XCircle, Zap, ChevronDown, ChevronUp,
  Terminal as TerminalIcon, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TerminalLog {
  id: string;
  type: "info" | "thinking" | "success" | "error" | "warning" | "step";
  message: string;
  timestamp: Date;
  step?: number;
  totalSteps?: number;
}

interface ChatTerminalProps {
  isProcessing: boolean;
  taskType?: string;
  creditCost?: number;
  logs?: TerminalLog[];
  progress?: number;
  className?: string;
}

const thinkingMessages = [
  "Analyzing your request...",
  "Searching knowledge base...",
  "Generating response...",
  "Optimizing output...",
  "Finalizing...",
];

export function ChatTerminal({ 
  isProcessing, 
  creditCost = 1,
  logs: externalLogs,
  className,
}: ChatTerminalProps) {
  const [internalLogs, setInternalLogs] = useState<TerminalLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const msgIdx = useRef(0);
  
  const logs = externalLogs || internalLogs;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!externalLogs && isProcessing) {
      msgIdx.current = 0;
      setInternalLogs([]);
      const iv = setInterval(() => {
        if (msgIdx.current < thinkingMessages.length) {
          setInternalLogs(prev => [...prev, {
            id: `t-${Date.now()}-${msgIdx.current}`,
            type: "thinking",
            message: thinkingMessages[msgIdx.current],
            timestamp: new Date(),
            step: msgIdx.current + 1,
            totalSteps: thinkingMessages.length,
          }]);
          msgIdx.current++;
        }
      }, 800);
      return () => clearInterval(iv);
    }
  }, [isProcessing, externalLogs]);

  const getIcon = (type: TerminalLog["type"]) => {
    switch (type) {
      case "thinking": return <Loader2 className="h-3 w-3 text-primary-glow animate-spin" />;
      case "success": return <CheckCircle2 className="h-3 w-3 text-success" />;
      case "error": return <XCircle className="h-3 w-3 text-destructive" />;
      case "warning": return <AlertCircle className="h-3 w-3 text-warning" />;
      case "step": return <Clock className="h-3 w-3 text-info" />;
      default: return <div className="w-3 h-3 rounded-full bg-primary/30" />;
    }
  };

  return (
    <motion.div
      className={cn("rounded-xl bg-card/80 border border-border/50 overflow-hidden", className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-primary-glow"
            animate={isProcessing ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <TerminalIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">AI Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Zap className="h-2.5 w-2.5 text-primary-glow" />
            <span>{creditCost}c</span>
          </div>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
      </button>

      {/* Progress shimmer */}
      {isProcessing && (
        <div className="h-0.5 bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary-glow/60 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Logs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 max-h-32 overflow-y-auto space-y-1 font-mono">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  className="flex items-center gap-2 text-[11px]"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {getIcon(log.type)}
                  <span className="text-muted-foreground">{log.message}</span>
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
