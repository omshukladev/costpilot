import { useEffect, useRef } from "react";

interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingElement({
  children,
  amplitude = 10,
  speed = 0.001,
  delay = 0,
  className,
  style,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start: number | null = null;
    const animate = (now: number) => {
      if (!start) start = now;
      const t = (now - start) * speed + delay;
      const y = Math.sin(t) * amplitude;
      el.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [amplitude, speed, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
