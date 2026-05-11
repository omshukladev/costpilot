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
      className="pointer-events-none fixed z-[100] h-[520px] w-[520px] rounded-full opacity-[0.075] mix-blend-screen transition-opacity duration-1000"
      style={{
        background:
          "radial-gradient(circle at center, rgba(74,222,128,0.95), rgba(74,222,128,0.42) 28%, rgba(132,204,22,0.18) 46%, transparent 72%)",
        filter: "blur(96px)",
      }}
    />
  );
}
