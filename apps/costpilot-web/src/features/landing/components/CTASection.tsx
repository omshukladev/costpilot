import { Link } from "react-router-dom";
import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null);
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
      className="relative bg-black px-6 py-48 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[3rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-12 text-center backdrop-blur-md sm:p-24 shadow-2xl">
            {/* Extremely Subtle Inner Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,222,128,0.03),transparent_70%)]" />
            
            <div className="relative z-10">
              <p className="mb-6 text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">Final Call</p>
              <h2 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl leading-[0.9]">
                Ready to stop <br />
                <span className="text-white/10 italic">paying AI tax?</span>
              </h2>
              <p className="mx-auto mt-10 max-w-lg text-lg text-white/30 font-medium tracking-tight">
                Get a defensible audit in under 60 seconds. No login required. 
                Keep your results private or share them with your team.
              </p>
              <div className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div 
                  ref={ctaRef}
                  onMouseLeave={handleMouseLeave}
                  className="relative"
                >
                  <motion.div style={{ x: mouseXSpring, y: mouseYSpring }}>
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
                  View sample report
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
