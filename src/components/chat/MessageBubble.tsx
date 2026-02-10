import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Pin, Quote, MoreHorizontal, Edit2, Bot, User } from "lucide-react";
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
  const [hovered, setHovered] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === "user";

  return (
    <motion.div
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
      initial={isNew ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser
          ? "bg-primary/20"
          : "bg-gradient-to-br from-primary/20 to-primary-glow/20"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-foreground/70" />
        ) : (
          <Bot className="h-4 w-4 text-primary-glow" />
        )}
      </div>

      {/* Message content */}
      <div className={cn("relative group max-w-[80%] min-w-0", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-card border border-border/60 rounded-tl-md"
          )}
        >
          {!isUser && isStreaming ? (
            <StreamingMessage content={content} isStreaming={isStreaming} speed="normal" />
          ) : !isUser ? (
            <MarkdownMessage content={content} />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <motion.span
            className={cn(
              "block text-[10px] mt-1 px-1",
              isUser ? "text-right text-muted-foreground/60" : "text-muted-foreground/60"
            )}
            animate={{ opacity: hovered ? 0.8 : 0.4 }}
            transition={{ duration: 0.15 }}
          >
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </motion.span>
        )}

        {/* Actions */}
        <motion.div
          className={cn(
            "absolute -top-2 flex items-center gap-0.5 z-10",
            isUser ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1"
          )}
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9 }}
          transition={{ duration: 0.12 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-card border border-border/60 hover:bg-accent"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-card border border-border/60 hover:bg-accent"
              >
                <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isUser ? "start" : "end"} className="bg-card border-border">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5 mr-2" /> Copy
              </DropdownMenuItem>
              {onPin && (
                <DropdownMenuItem onClick={() => onPin(id)}>
                  <Pin className="h-3.5 w-3.5 mr-2" /> Pin
                </DropdownMenuItem>
              )}
              {onQuote && (
                <DropdownMenuItem onClick={() => onQuote(content)}>
                  <Quote className="h-3.5 w-3.5 mr-2" /> Quote
                </DropdownMenuItem>
              )}
              {isUser && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.div>
  );
}
