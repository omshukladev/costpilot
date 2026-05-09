import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { AnimatedCounter } from "../../../shared/components/animations/AnimatedCounter";
import { HoverGlowCard } from "../../../shared/components/animations/HoverGlowCard";
import { AnimatedBorder } from "../../../shared/components/animations/AnimatedBorder";
import { motion } from "framer-motion";

const demoFindings = [
  { 
    tool: "Cursor Business", 
    issue: "Downgrade to Pro", 
    saving: "$1,920/yr",
    detail: "12 users qualify for individual Pro plans."
  },
  { 
    tool: "Claude Team", 
    issue: "Inactive seats", 
    saving: "$1,440/yr",
    detail: "Seats haven't been accessed in 45+ days."
  },
  { 
    tool: "OpenAI API", 
    issue: "Credits check", 
    saving: "$960/yr",
    detail: "Apply for startup credits via Credex."
  },
];

export function LiveDemo() {
  return (
    <section id="live-demo" className="relative bg-black px-6 py-48 overflow-hidden">
      {/* Restrained Accent */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] bg-emerald-500/[0.01] blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-24 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="relative order-2 lg:order-1">
            {/* Overlapping Mockup Strategy */}
            <FadeIn direction="up">
              <div className="relative">
                {/* Secondary Background Layer for depth */}
                <div className="absolute -left-12 -top-12 h-full w-full rounded-[3rem] border border-white/[0.03] bg-white/[0.01] backdrop-blur-3xl hidden xl:block" />
                
                <div className="relative z-10 rounded-[2.5rem] border border-white/[0.05] bg-[#050505] p-1 shadow-2xl overflow-hidden">
                  <div className="relative rounded-[2.3rem] bg-black overflow-hidden">
                    {/* Header of the mockup */}
                    <div className="border-b border-white/[0.05] bg-white/[0.02] p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="px-3 py-1 rounded bg-white/[0.05] border border-white/[0.05] text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
                          Defensible Report
                        </div>
                        <div className="flex gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                        </div>
                      </div>
                      
                      <div className="text-center py-6">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Estimated Savings</p>
                        <p className="text-7xl font-bold tracking-tighter text-emerald-400">
                          $<AnimatedCounter end={4320} duration={2.5} />
                          <span className="text-2xl text-emerald-500/20 ml-2">/yr</span>
                        </p>
                      </div>
                    </div>

                    {/* Content of the mockup */}
                    <div className="p-8 space-y-3">
                      {demoFindings.map((item, idx) => (
                        <motion.div
                          key={item.tool}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group flex items-center justify-between rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 transition-all hover:bg-white/[0.03] hover:border-white/10"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white/90">{item.tool}</p>
                              <div className="h-1 w-1 rounded-full bg-emerald-500/30" />
                              <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{item.issue}</span>
                            </div>
                            <p className="text-[11px] text-white/10 mt-1 font-medium">{item.detail}</p>
                          </div>
                          <span className="text-sm font-bold text-emerald-400/80 tracking-tight">{item.saving}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer of the mockup */}
                    <div className="border-t border-white/[0.05] bg-emerald-500/[0.02] p-6 text-center">
                      <p className="text-[9px] font-bold text-emerald-500/20 uppercase tracking-[0.4em]">
                        Verified CP Engine v1.4
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating "Card Detail" for asymmetry */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="absolute -right-8 top-1/2 h-32 w-48 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] backdrop-blur-xl p-5 shadow-2xl hidden 2xl:block"
                >
                  <div className="h-1.5 w-8 rounded bg-emerald-500/20 mb-3" />
                  <p className="text-[10px] font-bold text-emerald-400/40 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-xl font-bold text-emerald-50 tracking-tighter">High (98%)</p>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          <FadeIn direction="right" className="order-1 lg:order-2">
            <div className="max-w-md lg:ml-auto">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">Transparency</p>
              <h2 className="mt-8 text-6xl font-bold tracking-tighter text-white sm:text-7xl leading-[0.85]">
                Reports that <br />
                <span className="text-white/10 italic">Finance trusts.</span>
              </h2>
              <p className="mt-10 text-lg text-white/30 leading-relaxed tracking-tight font-medium">
                Every recommendation includes a specific reason and estimated impact. 
                No inflated claims—just hard data for your AI stack.
              </p>
              
              <div className="mt-12 space-y-10">
                {[
                  { title: "No Hallucinations", desc: "Tied to actual vendor pricing tiers." },
                  { title: "Executive Ready", desc: "Ready for CFO or Finance lead review." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-6 group">
                    <div className="h-px w-8 bg-emerald-500/20 mt-3 group-hover:w-12 transition-all group-hover:bg-emerald-500/40" />
                    <div>
                      <h4 className="text-sm font-bold text-white/80">{item.title}</h4>
                      <p className="text-sm text-white/20 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
