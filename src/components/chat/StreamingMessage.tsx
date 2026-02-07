import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MarkdownMessage } from "@/components/MarkdownMessage";

interface StreamingMessageProps {
  content: string;
  isStreaming?: boolean;
  speed?: "slow" | "normal" | "fast" | "instant";
  onComplete?: () => void;
}

export function StreamingMessage({ 
  content, 
  isStreaming = false, 
  speed = "normal",
  onComplete 
}: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const contentRef = useRef(content);
  
  // Speed configurations (characters per interval)
  const speedConfig = {
    slow: { chars: 1, interval: 30 },
    normal: { chars: 2, interval: 15 },
    fast: { chars: 5, interval: 10 },
    instant: { chars: content.length, interval: 0 },
  };
  
  const config = speedConfig[speed];

  useEffect(() => {
    // Reset if content changes significantly
    if (content !== contentRef.current) {
      if (content.startsWith(contentRef.current)) {
        // Content is being appended (streaming)
        contentRef.current = content;
      } else {
        // Content is completely new
        contentRef.current = content;
        indexRef.current = 0;
        setDisplayedContent("");
        setIsComplete(false);
      }
    }
  }, [content]);

  useEffect(() => {
    if (isComplete && !isStreaming) return;
    if (speed === "instant") {
      setDisplayedContent(content);
      setIsComplete(true);
      onComplete?.();
      return;
    }
    
    const interval = setInterval(() => {
      if (indexRef.current < content.length) {
        const nextIndex = Math.min(indexRef.current + config.chars, content.length);
        
        // Try to break at word boundaries for smoother reading
        let breakPoint = nextIndex;
        if (nextIndex < content.length) {
          const remaining = content.slice(indexRef.current, nextIndex + 10);
          const spaceIndex = remaining.indexOf(' ');
          if (spaceIndex !== -1 && spaceIndex < 10) {
            breakPoint = indexRef.current + spaceIndex + 1;
          }
        }
        
        setDisplayedContent(content.slice(0, breakPoint));
        indexRef.current = breakPoint;
      } else {
        clearInterval(interval);
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      }
    }, config.interval);
    
    return () => clearInterval(interval);
  }, [content, config, isComplete, isStreaming, onComplete, speed]);

  return (
    <div className="relative">
      <MarkdownMessage content={displayedContent} />
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-primary-glow ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
