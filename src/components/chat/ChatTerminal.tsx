import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Terminal as TerminalIcon,
  Clock,
  AlertCircle
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
  "Initializing AI processing pipeline...",
  "Analyzing request context...",
  "Generating optimal response strategy...",
  "Processing language patterns...",
  "Optimizing output quality...",
  "Finalizing response..."
];

export function ChatTerminal({ 
  isProcessing, 
  taskType = "chat_message", 
  creditCost = 1,
  logs: externalLogs,
  progress = 0,
  className
}: ChatTerminalProps) {
  const [internalLogs, setInternalLogs] = useState<TerminalLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const messageIndexRef = useRef(0);
  
  const logs = externalLogs || internalLogs;

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Auto-generate thinking logs when processing
  useEffect(() => {
    if (!externalLogs && isProcessing) {
      messageIndexRef.current = 0;
      setInternalLogs([]);
      
      const interval = setInterval(() => {
        if (messageIndexRef.current < thinkingMessages.length) {
          setInternalLogs((prev) => [
            ...prev,
            {
              id: `thinking-${Date.now()}-${messageIndexRef.current}`,
              type: "thinking",
              message: thinkingMessages[messageIndexRef.current],
              timestamp: new Date(),
              step: messageIndexRef.current + 1,
              totalSteps: thinkingMessages.length
            },
          ]);
          messageIndexRef.current++;
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isProcessing, externalLogs]);

  const getIcon = (type: TerminalLog["type"]) => {
    switch (type) {
      case "thinking":
        return <Loader2 className="h-3.5 w-3.5 text-primary-glow animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case "error":
        return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />;
      case "step":
        return <Clock className="h-3.5 w-3.5 text-blue-400" />;
      default:
        return <div className="w-3.5 h-3.5 rounded-full bg-primary/30" />;
    }
  };

  const getTextColor = (type: TerminalLog["type"]) => {
    switch (type) {
      case "error": return "text-destructive";
      case "success": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "thinking": return "text-primary-glow";
      default: return "text-foreground/80";
    }
  };

  return (
    <motion.div
      className={cn("glass-panel rounded-xl overflow-hidden", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-primary-glow"
              animate={isProcessing ? { 
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <TerminalIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">AI Terminal</span>
          </div>
          
          {isProcessing && (
            <motion.span 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Processing...
            </motion.span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {creditCost > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary-glow" />
              <span>{creditCost} credit{creditCost > 1 ? 's' : ''}</span>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {isProcessing && progress > 0 && (
        <div className="h-1 bg-muted/50">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      
      {isProcessing && progress === 0 && (
        <div className="h-1 bg-muted/50 overflow-hidden">
          <motion.div
            className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary-glow to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Logs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-48 overflow-y-auto space-y-2 terminal-text">
              {logs.length === 0 && !isProcessing && (
                <p className="text-xs text-muted-foreground italic">Awaiting task...</p>
              )}

              {logs.map((log, index) => (
                <motion.div 
                  key={log.id} 
                  className="flex items-start gap-2 text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="flex-shrink-0 mt-0.5">{getIcon(log.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("break-words", getTextColor(log.type))}>
                      {log.step && log.totalSteps && (
                        <span className="text-muted-foreground mr-2">
                          [{log.step}/{log.totalSteps}]
                        </span>
                      )}
                      {log.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isProcessing && logs.length > 0 && (
                <motion.div 
                  className="flex items-center gap-2 text-xs text-primary-glow pt-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Processing...</span>
                </motion.div>
              )}

              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
