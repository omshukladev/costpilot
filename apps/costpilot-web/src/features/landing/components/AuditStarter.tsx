import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { AnimatedCounter } from "../../../shared/components/animations/AnimatedCounter";
import { HoverGlowCard } from "../../../shared/components/animations/HoverGlowCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuditStore } from "../../audit/store/audit.store";
import type { FormToolEntry } from "../../audit/types/audit.types";

const sampleTools: FormToolEntry[] = [
  { toolId: "cursor", plan: "business", monthlySpend: 40, seats: 1 },
  { toolId: "claude", plan: "team", monthlySpend: 30, seats: 1 },
  { toolId: "chatgpt", plan: "team", monthlySpend: 25, seats: 1 },
];

export function AuditStarter() {
  const navigate = useNavigate();
  const loadFromLanding = useAuditStore((s) => s.loadFromLanding);

  const handleContinueToAudit = () => {
    // Load sample data into the audit form
    loadFromLanding(sampleTools, 12, "coding");
    // Navigate to audit page
    navigate("/audit");
  };

  return (
    <section id="audit-starter" className="relative bg-black px-6 py-40 overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-emerald-500/[0.02] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-24 lg:grid-cols-[1fr_1.2fr]">
          <FadeIn direction="left">
            <div className="lg:sticky lg:top-40">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">The Engine</p>
              <h2 className="mt-6 text-5xl font-bold tracking-tighter text-white leading-[0.95] sm:text-6xl">
                Enter spend once. <br />
                <span className="text-white/20">Keep optimizing forever.</span>
              </h2>
              <p className="mt-8 max-w-md text-lg text-white/40 leading-relaxed tracking-tight">
                Capture tools, plans, and seats in a unified flow. CostPilot surfaces where to downgrade,
                consolidate, and apply credits instantly.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[
                  { label: "Precision", value: "Per-seat logic" },
                  { label: "Annual Save", value: "$4.3k avg", isCounter: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.03] bg-white/[0.01] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.03]"
                  >
                    <p className="text-[10px] font-bold tracking-wider uppercase text-white/20">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white/80 tracking-tight">
                      {stat.isCounter ? (
                        <>
                          $<AnimatedCounter end={4320} duration={1.4} />
                        </>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" className="lg:pt-12">
            <div className="relative">
              {/* Decorative element for asymmetry */}
              <div className="absolute -left-8 -top-8 h-24 w-24 border-l border-t border-emerald-500/10 rounded-tl-3xl hidden xl:block" />
              
              <HoverGlowCard className="lg:translate-x-12">
                <div
                  className="rounded-3xl p-8 transition-all relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
                        <p className="text-[11px] font-bold tracking-widest uppercase text-white/30">Audit Input Preview</p>
                      </div>
                      <div className="flex gap-1.5 opacity-20">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                    
                    <div className="mt-10 space-y-4">
                      {sampleTools.map((tool, idx) => (
                        <motion.div
                          key={tool.toolId}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="flex items-center justify-between rounded-2xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.05]"
                        >
                          <div>
                            <p className="text-sm font-bold text-white/90 capitalize">{tool.toolId}</p>
                            <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider mt-0.5">{tool.plan}</p>
                          </div>
                          <p className="text-xs font-bold text-emerald-400/80 tracking-tight">${tool.monthlySpend}/mo</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/[0.05]">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {[
                          { label: "Team size", value: "12 members" },
                          { label: "Use-case", value: "R&D + Dev" },
                        ].map((field) => (
                          <div key={field.label}>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-white/10">{field.label}</p>
                            <p className="mt-1 text-sm font-bold text-white/60 tracking-tight">{field.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      onClick={handleContinueToAudit}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="group mt-10 relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-[13px] font-bold text-black transition-all hover:bg-emerald-400"
                    >
                      Continue to full audit flow
                    </motion.button>
                  </div>
                </div>
              </HoverGlowCard>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
