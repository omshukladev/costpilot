import { useEffect, useRef } from "react";

interface AmbientGradientProps {
  className?: string;
}

export function AmbientGradient({ className }: AmbientGradientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: number | null = null;

    const animate = (now: number) => {
      if (!start) start = now;
      const t = (now - start) * 0.0003;
      const x = Math.sin(t) * 30 + 50;
      const y = Math.cos(t * 0.7) * 30 + 50;
      el.style.backgroundPosition = `${x}% ${y}%`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className || ""}`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, #4ade80 0%, #84cc16 30%, transparent 70%)",
        backgroundSize: "200% 200%",
        filter: "blur(100px)",
      }}
    />
  );
}
