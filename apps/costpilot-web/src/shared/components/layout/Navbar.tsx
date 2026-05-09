import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 100], [0, 10]);

  return (
    <header className="fixed top-0 z-50 w-full pointer-events-none">
      <motion.div 
        style={{ y: navY }}
        className="mx-auto flex h-24 items-center justify-center px-6"
      >
        {/* Floating capsule container */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative flex items-center gap-1 rounded-full border border-white/[0.05] bg-black/60 p-1.5 backdrop-blur-2xl"
          style={{
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* Logo inside nav */}
          <Link
            to="/"
            className="group relative flex items-center gap-2 px-5 py-2 text-sm font-bold transition-all"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-b from-white to-emerald-400 bg-clip-text text-transparent tracking-tighter"
            >
              CostPilot
            </motion.span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[
              { label: "How it works", href: "/#how-it-works", id: "how-it-works" },
              { label: "Sample report", href: "/#live-demo", id: "live-demo" },
              { label: "Start audit", href: "/#audit-starter", id: "audit-starter" },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                onMouseEnter={() => setActiveLink(item.id)}
                onMouseLeave={() => setActiveLink(null)}
                className="relative px-5 py-2 text-[11px] font-bold tracking-widest uppercase text-white/30 transition-colors duration-300 hover:text-white"
              >
                <span className="relative z-10">{item.label}</span>
                <AnimatePresence>
                  {activeLink === item.id && (
                    <motion.div
                      layoutId="nav-pill"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </a>
            ))}
          </div>
        </motion.nav>
      </motion.div>
    </header>
  );
}
