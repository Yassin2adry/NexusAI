import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  className = "",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setIsComplete(false);
    
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (indexRef.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      setIsTyping(false);
      onComplete?.();
    }
  }, [displayedText, isTyping, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          className="inline-block w-0.5 h-[1.1em] bg-primary-glow ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </span>
  );
}

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function StreamingText({ text, speed = 20, className = "" }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        // Add multiple characters per tick for faster streaming
        const charsToAdd = Math.min(3, text.length - index);
        setDisplayedText(text.slice(0, index + charsToAdd));
        index += charsToAdd;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-2 h-4 bg-primary-glow/80 ml-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

interface AnimatedWordsProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function AnimatedWords({ 
  text, 
  delay = 0, 
  staggerDelay = 0.1,
  className = "" 
}: AnimatedWordsProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

interface AnimatedLettersProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function AnimatedLetters({
  text,
  delay = 0,
  staggerDelay = 0.03,
  className = "",
}: AnimatedLettersProps) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
