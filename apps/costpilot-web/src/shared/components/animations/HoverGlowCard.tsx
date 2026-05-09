"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HoverGlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverGlowCard({ children, className }: HoverGlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const ease = 0.1;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentPos.current.x - 250}px, ${currentPos.current.y - 250}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-500 ${className || ""}`}
      style={{
        boxShadow: hovering 
          ? "0 20px 40px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)" 
          : "0 10px 20px -10px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      {/* Dynamic Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Border Shimmer */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
