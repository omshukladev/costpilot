"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingOrbProps {
  className?: string;
}

export function FloatingOrb({ className }: FloatingOrbProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className={className}
      animate={{
        x: (mousePos.x - 0.5) * 30,
        y: (mousePos.y - 0.5) * 30,
      }}
      transition={{ type: "spring", stiffness: 50, damping: 30 }}
      style={{
        width: 500,
        height: 500,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at center, rgba(99,102,241,0.15), rgba(168,85,247,0.08), transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }}
    />
  );
}
