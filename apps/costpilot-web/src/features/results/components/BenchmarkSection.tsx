import { motion } from "framer-motion";
import { BadgeCheck, BarChart3, Users2, Radar } from "lucide-react";
import { AnimatedCounter } from "@/shared/components/animations/AnimatedCounter";
import type { BenchmarkProfile } from "../utils/benchmark";

interface BenchmarkSectionProps {
  profile: BenchmarkProfile;
}

function BenchmarkRail({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="uppercase tracking-[0.18em] text-white/30">{label}</span>
        <span className="text-white/60">
          <AnimatedCounter end={value} suffix="%" duration={1.05} />
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.08]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${tone}`}
        />
      </div>
    </div>
  );
}

export function BenchmarkSection({ profile }: BenchmarkSectionProps) {
  const isStrong = profile.tier === "top-tier" || profile.tier === "above-average";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[2rem] border border-emerald-500/18 bg-black/58 p-6 shadow-[0_28px_80px_-40px_rgba(16,185,129,0.38)] backdrop-blur-xl sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/18 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300/80">
            <Radar size={12} />
            Benchmark mode
          </p>
          <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Compared against similar teams
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/44">
            {profile.summary} We bucket your stack by team size, spend, and usage pattern, then compare it with a deterministic reference group.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 ${
            isStrong ? "border-emerald-500/20 bg-emerald-500/[0.08]" : "border-amber-500/20 bg-amber-500/[0.08]"
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/34">Benchmark tier</p>
          <p className={`mt-2 text-xl font-semibold ${isStrong ? "text-emerald-200" : "text-amber-200"}`}>
            {profile.tier.replace("-", " ")}
          </p>
          <p className="mt-1 text-[11px] text-white/36">{profile.referenceLabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-white/44">
              <BarChart3 size={14} />
              <p className="text-[10px] uppercase tracking-[0.18em]">Spend percentile</p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
              <AnimatedCounter end={profile.spendPercentile} suffix="%" duration={1.15} />
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-white/44">
              <Users2 size={14} />
              <p className="text-[10px] uppercase tracking-[0.18em]">Tool count percentile</p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
              <AnimatedCounter end={profile.toolCountPercentile} suffix="%" duration={1.15} />
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">Overlap percentile</p>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
              <AnimatedCounter end={profile.overlapPercentile} suffix="%" duration={1.15} />
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">Savings opportunity</p>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
              <AnimatedCounter end={profile.savingsOpportunityPercentile} suffix="%" duration={1.15} />
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/44 p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Benchmark signals</p>
          <div className="mt-4 space-y-4">
            <BenchmarkRail label="Spend position" value={profile.spendPercentile} tone="bg-gradient-to-r from-amber-400 to-orange-300" />
            <BenchmarkRail label="Tool count" value={profile.toolCountPercentile} tone="bg-gradient-to-r from-sky-400 to-cyan-300" />
            <BenchmarkRail label="Overlap" value={profile.overlapPercentile} tone="bg-gradient-to-r from-violet-400 to-fuchsia-300" />
            <BenchmarkRail label="Seat efficiency" value={profile.seatEfficiencyPercentile} tone="bg-gradient-to-r from-emerald-400 to-lime-300" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Peer group notes</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profile.peerStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/[0.08] bg-black/28 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">{item.label}</p>
                <p className={`mt-2 text-sm font-semibold ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">What this means</p>
          <div className="mt-4 space-y-3">
            {profile.signals.map((signal) => (
              <div key={signal.label} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/28 px-4 py-3">
                <p className="text-sm text-white/54">{signal.label}</p>
                <p className={`text-[11px] uppercase tracking-[0.14em] ${signal.tone}`}>{signal.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/16 bg-emerald-500/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-200/70">
            <BadgeCheck size={12} />
            Deterministic, rule-based benchmark
          </div>
        </div>
      </div>
    </motion.section>
  );
}
