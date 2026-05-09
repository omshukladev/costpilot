import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -500, y: -500 });
  const target = useRef({ x: -500, y: -500 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      if (spotRef.current) {
        spotRef.current.style.left = `${pos.current.x - 200}px`;
        spotRef.current.style.top = `${pos.current.y - 200}px`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed z-[100] h-[400px] w-[400px] rounded-full opacity-[0.04] transition-opacity duration-1000"
      style={{
        background:
          "radial-gradient(circle at center, #4ade80, #84cc16 30%, transparent 70%)",
        filter: "blur(80px)",
      }}
    />
  );
}
