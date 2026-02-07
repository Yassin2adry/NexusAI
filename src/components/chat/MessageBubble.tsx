import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Pin, Quote, MoreHorizontal, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { StreamingMessage } from "./StreamingMessage";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  isNew?: boolean;
  onEdit?: (id: string) => void;
  onPin?: (id: string) => void;
  onQuote?: (content: string) => void;
}

export function MessageBubble({
  id,
  role,
  content,
  timestamp,
  isStreaming = false,
  isNew = false,
  onEdit,
  onPin,
  onQuote,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === "user";

  return (
    <motion.div
      className={cn("flex group", isUser ? "justify-end" : "justify-start")}
      initial={isNew ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 0.84, 0.33, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative max-w-[85%] sm:max-w-[75%]">
        {/* Message bubble */}
        <motion.div
          className={cn(
            "relative p-4 rounded-2xl",
            isUser
              ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/20"
              : "glass-panel-elevated border border-border/40"
          )}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.15 }}
        >
          {/* Spotlight effect for assistant messages */}
          {!isUser && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(300px circle at ${isHovered ? '50%' : '0%'} 50%, hsl(var(--primary-glow) / 0.08), transparent 60%)`,
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Content */}
          <div className="relative z-10">
            {!isUser && isStreaming ? (
              <StreamingMessage content={content} isStreaming={isStreaming} speed="normal" />
            ) : !isUser ? (
              <MarkdownMessage content={content} />
            ) : (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
            )}
          </div>

          {/* Timestamp */}
          {timestamp && (
            <motion.span 
              className={cn(
                "block text-[10px] mt-2",
                isUser ? "text-primary-foreground/60" : "text-muted-foreground"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
            >
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.span>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className={cn(
            "absolute top-2 flex items-center gap-1",
            isUser ? "-left-12" : "-right-12"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {/* Quick copy button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 glass-panel hover:bg-primary/10"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 glass-panel hover:bg-primary/10"
              >
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isUser ? "start" : "end"} className="glass-panel-solid">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy message
              </DropdownMenuItem>
              {onPin && (
                <DropdownMenuItem onClick={() => onPin(id)}>
                  <Pin className="h-4 w-4 mr-2" />
                  Pin message
                </DropdownMenuItem>
              )}
              {onQuote && (
                <DropdownMenuItem onClick={() => onQuote(content)}>
                  <Quote className="h-4 w-4 mr-2" />
                  Quote reply
                </DropdownMenuItem>
              )}
              {isUser && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit message
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.div>
  );
}
