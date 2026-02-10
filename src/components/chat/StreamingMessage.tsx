import { useState, useEffect, useRef } from "react";
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
  const animFrameRef = useRef<number>(0);
  const indexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const contentRef = useRef(content);
  
  const speedConfig = {
    slow: 20,   // ms per character
    normal: 12,
    fast: 5,
    instant: 0,
  };
  
  const interval = speedConfig[speed];

  useEffect(() => {
    if (content !== contentRef.current) {
      if (!content.startsWith(contentRef.current)) {
        indexRef.current = 0;
        setDisplayedContent("");
        setIsComplete(false);
      }
      contentRef.current = content;
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

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= interval) {
        lastTimeRef.current = timestamp;

        if (indexRef.current < content.length) {
          // Advance by 1 char, but skip ahead on spaces for word boundaries
          let nextIdx = indexRef.current + 1;
          // If we land on a space, include the whole next word for smoother feel
          if (content[nextIdx - 1] === ' ' && speed !== 'slow') {
            const nextSpace = content.indexOf(' ', nextIdx);
            if (nextSpace !== -1 && nextSpace - nextIdx < 8) {
              nextIdx = nextSpace;
            }
          }
          
          nextIdx = Math.min(nextIdx, content.length);
          indexRef.current = nextIdx;
          setDisplayedContent(content.slice(0, nextIdx));
        } else {
          if (!isComplete) {
            setIsComplete(true);
            onComplete?.();
          }
          return; // stop animating
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [content, interval, isComplete, isStreaming, onComplete, speed]);

  return (
    <div className="relative">
      <MarkdownMessage content={displayedContent || " "} />
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-primary-glow ml-0.5 align-text-bottom rounded-full"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
