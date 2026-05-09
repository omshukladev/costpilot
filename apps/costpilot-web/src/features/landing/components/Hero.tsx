import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FloatingElement } from "../../../shared/components/animations/FloatingElement";
import { Spotlight } from "../../../shared/components/animations/Spotlight";
import { ShootingStars } from "../../../shared/components/animations/ShootingStars";
import { useRef } from "react";

const floatingBadges = [
  { text: "Detected -$240/mo", x: "10%", y: "20%", delay: 0 },
  { text: "3 overlapping seats", x: "80%", y: "30%", delay: 2 },
  { text: "Found +$4,320/yr", x: "75%", y: "75%", delay: 4 },
  { text: "Zero friction flow", x: "5%", y: "70%", delay: 1 },
];

export function Hero() {
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Magnetic effect for CTA
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Limit range
    if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32 pb-20 bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements - Minimalist */}
      <ShootingStars />
      <div className="noise-overlay opacity-[0.015]" />

      {/* Atmospheric Lighting - More Restrained */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[1000px] bg-emerald-500/[0.04] blur-[120px] rounded-full" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
      </div>

      <Spotlight className="opacity-15" />

      {/* Floating badges - More subtle and integrated */}
      {floatingBadges.map((badge) => (
        <FloatingElement
          key={badge.text}
          amplitude={15}
          speed={0.0005}
          delay={badge.delay}
          className="pointer-events-none absolute hidden lg:block"
          style={{ left: badge.x, top: badge.y } as React.CSSProperties}
        >
          <div className="rounded-full border border-white/[0.03] bg-white/[0.01] px-4 py-2 text-[10px] font-medium tracking-tight text-white/20 backdrop-blur-sm">
            {badge.text}
          </div>
        </FloatingElement>
      ))}

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400/50 backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Built for startup founders & engineering leads
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-balance text-6xl font-bold tracking-tighter sm:text-8xl lg:text-9xl leading-[0.85]"
        >
          Audit Your <br />
          <span className="relative bg-gradient-to-b from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent italic pr-2">
            AI Tool Spend
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-12 max-w-xl text-lg leading-relaxed text-white/30 sm:text-xl font-medium tracking-tight"
        >
          Get a defensible breakdown, savings report, and next actions <br className="hidden md:block" /> for your seat-based AI tools in under a minute.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <div 
            ref={ctaRef}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <motion.div
              style={{ x: mouseXSpring, y: mouseYSpring }}
            >
              <Link
                to="/#audit-starter"
                className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-12 text-sm font-bold text-black transition-all hover:bg-emerald-400 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/30" />
                </div>
                <span className="relative z-10">Start free audit</span>
              </Link>
            </motion.div>
          </div>
          
          <Link
            to="/#live-demo"
            className="inline-flex h-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-12 text-sm font-bold text-white/60 transition-all hover:bg-white/[0.05] hover:text-white hover:border-white/20 backdrop-blur-sm"
          >
            See sample report
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]"
        >
          No login required · Results in 60s
        </motion.p>
      </div>
    </section>
  );
}
