"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  angle: number;
  delay: number;
  duration: number;
  width: number;
  opacity: number;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStar: Star = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Avoid edges
        y: Math.random() * 40 + 10,
        angle: 45, // Consistent angle for cinematic feel
        delay: Math.random() * 1.5,
        duration: 1.5 + Math.random() * 1.5,
        width: 40 + Math.random() * 80,
        opacity: 0.1 + Math.random() * 0.3,
      };
      setStars((prev) => [...prev.slice(-4), newStar]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              opacity: 0, 
              x: `${star.x}%`, 
              y: `${star.y}%`, 
              scaleX: 0 
            }}
            animate={{ 
              opacity: [0, star.opacity, 0], 
              x: `${star.x + 15}%`, 
              y: `${star.y + 15}%`,
              scaleX: [0, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: star.duration, 
              delay: star.delay,
              ease: "easeInOut" 
            }}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
            style={{ 
              width: star.width,
              rotate: `${star.angle}deg`,
              transformOrigin: "left center"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
