import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  className?: string;
}

export function ParticleField({ particleCount = 50, className = "" }: ParticleFieldProps) {
  const particles = useRef<Particle[]>([]);
  
  // Generate particles only once
  if (particles.current.length === 0) {
    particles.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(270 100% 65% / ${particle.opacity}), transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(270 100% 65% / ${particle.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingOrbs() {
  const orbs = [
    { size: 300, x: "10%", y: "20%", duration: 25, color: "270 100% 65%" },
    { size: 200, x: "80%", y: "60%", duration: 30, color: "320 100% 60%" },
    { size: 150, x: "60%", y: "10%", duration: 20, color: "210 100% 60%" },
    { size: 250, x: "30%", y: "70%", duration: 35, color: "270 80% 50%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, hsl(${orb.color} / 0.15), transparent 70%)`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function GridOverlay() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(hsl(270 100% 65% / 0.03) 1px, transparent 1px),
          linear-gradient(90deg, hsl(270 100% 65% / 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
      }}
    />
  );
}

export function AnimatedGridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${20 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, hsl(270 100% 65% / 0.2), transparent)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Vertical lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${20 + i * 15}%`,
            background: `linear-gradient(180deg, transparent, hsl(270 100% 65% / 0.2), transparent)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}
