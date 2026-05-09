"use client";

import { useEffect, useRef } from "react";

export function Spotlight({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  // Use refs for mouse and current position to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if mobile (simplistic check)
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    let animationFrameId: number;
    
    const animate = () => {
      // Lerp (Linear Interpolation) for smooth follow
      const ease = 0.05;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (spotlightRef.current) {
        // Use transform instead of left/top for performance
        spotlightRef.current.style.transform = `translate(${currentPos.current.x - 400}px, ${currentPos.current.y - 400}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`pointer-events-none absolute inset-0 overflow-hidden hidden md:block ${className || ""}`}
    >
      <div
        ref={spotlightRef}
        className="absolute h-[800px] w-[800px] rounded-full opacity-[0.04] blur-[100px] will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 30%, transparent 65%)",
        }}
      />
    </div>
  );
}
