import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    label: "Inventory",
    title: "Add your AI stack",
    desc: "List tools, plans, seats, and monthly spend. Built for speed—capture your entire stack in under 60 seconds.",
  },
  {
    step: "02",
    label: "Analysis",
    title: "Engine runs logic",
    desc: "Cross-referenced against current vendor pricing, credit programs, and seat-utilization benchmarks.",
  },
  {
    step: "03",
    label: "Reporting",
    title: "Get your audit",
    desc: "A professional breakdown of exactly where to cut costs and how to claim hidden credits.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-black px-6 py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="border-l border-white/5 pl-12 mb-40">
          <FadeIn>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">The Process</p>
            <h2 className="mt-10 text-6xl font-bold tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[0.85]">
              From spend <br />
              <span className="text-white/10 italic">to savings.</span>
            </h2>
          </FadeIn>
        </div>

        <div className="space-y-48">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`grid items-center gap-24 lg:grid-cols-2`}
            >
              <div className={`${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                <FadeIn direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-5xl font-bold text-white/[0.03] tracking-tighter">{s.step}</span>
                    <div className="h-px flex-1 bg-white/[0.05]" />
                  </div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-400/40">{s.label}</p>
                  <h3 className="mt-4 text-4xl font-bold tracking-tight text-white leading-tight">{s.title}</h3>
                  <p className="mt-8 text-lg leading-relaxed text-white/30 max-w-sm font-medium tracking-tight">{s.desc}</p>
                </FadeIn>
              </div>
              
              <div className={`${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                <FadeIn direction={i % 2 === 0 ? "right" : "left"}>
                  <div className="relative">
                    {/* Decorative Asymmetry */}
                    <div className={`absolute -inset-4 border border-white/[0.03] rounded-[2.5rem] ${i % 2 === 0 ? "translate-x-4 translate-y-4" : "-translate-x-4 translate-y-4"}`} />
                    <StepVisual step={i} />
                  </div>
                </FadeIn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="relative rounded-[2rem] border border-white/[0.05] bg-white/[0.01] p-10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500/20" />
            <div className="h-2 w-2 rounded-full bg-emerald-500/10" />
          </div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Inventory Setup</p>
        </div>
        <div className="space-y-4">
          {[
            { name: "Cursor Business", detail: "12 seats", price: "$480" },
            { name: "Claude Team", detail: "8 seats", price: "$240" },
            { name: "OpenAI API", detail: "Usage-based", price: "$80" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/[0.03] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]">
              <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                <div className="h-4 w-4 rounded-sm bg-emerald-500/20" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white/80">{item.name}</div>
                <div className="text-[10px] text-white/20 uppercase tracking-wider mt-1">{item.detail}</div>
              </div>
              <div className="text-[11px] font-bold text-emerald-400/60 tabular-nums">
                {item.price}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] text-[9px] font-bold text-white/20 uppercase tracking-widest">
            + Click to add tool
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="relative rounded-[2rem] border border-white/[0.05] bg-[#050505] p-10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <motion.div
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent z-0"
        />
        <div className="relative z-10 space-y-4">
          {[
            { label: "Pricing Tiers", val: "Verified", color: "text-emerald-500/40" },
            { label: "Usage Delta", val: "0.42x", color: "text-emerald-400" },
            { label: "Credit Program", color: "text-emerald-500/20", val: "Scan..." },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-white/[0.03] bg-white/[0.01] p-5 backdrop-blur-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/20">{row.label}</span>
              <span className={`text-xs font-bold ${row.color}`}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-[2rem] border border-white/[0.05] bg-gradient-to-br from-emerald-500/[0.02] to-black p-10 backdrop-blur-xl shadow-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.03] px-3 py-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
          Audit Finalized
        </div>
        <p className="mt-6 text-5xl font-bold tracking-tighter text-white">$4,320</p>
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] mt-2">Annualized Opportunity</p>
      </div>
      <div className="space-y-3">
        <div className="h-px bg-white/[0.05] w-full" />
        <div className="flex justify-between items-center py-2">
          <div className="h-2 w-24 bg-white/5 rounded" />
          <div className="h-4 w-12 bg-emerald-500/10 rounded border border-emerald-500/10" />
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="h-2 w-16 bg-white/5 rounded" />
          <div className="h-4 w-12 bg-white/[0.02] rounded border border-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
