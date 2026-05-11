import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedCounter } from "@/shared/components/animations/AnimatedCounter";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { PublicReport } from "@costpilot/shared";

function pickPrimaryRecommendation(report: PublicReport) {
  return [...report.recommendations]
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .find((rec) => rec.monthlySavings > 0);
}

export function EmbedWidget({ report }: { report: PublicReport }) {
  const currentSpend = report.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const primaryRecommendation = pickPrimaryRecommendation(report);
  const hasSavings = report.totalMonthlySavings > 0;
  const optimizationScore = hasSavings
    ? Math.max(42, Math.round(((currentSpend - report.totalMonthlySavings) / Math.max(currentSpend, 1)) * 100))
    : 96;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[1.75rem] border border-emerald-500/14 bg-black/70 p-5 shadow-[0_26px_70px_-34px_rgba(16,185,129,0.38)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.12),transparent_45%)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/18 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
              <Sparkles size={12} />
              CostPilot widget
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              {hasSavings ? "Savings unlocked" : "Stack is efficient"}
            </p>
            <p className="mt-1 text-sm text-white/42">
              Public-safe preview for {report.tools.length} tool{report.tools.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
            Report {report.publicId.slice(0, 8)}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/18 bg-emerald-500/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">Monthly savings</p>
            <div className="mt-2 text-3xl font-bold tracking-[-0.04em] text-emerald-300">
              $
              {hasSavings ? <AnimatedCounter end={report.totalMonthlySavings} duration={1.2} /> : <span>0</span>}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/28">Optimization score</p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">{optimizationScore}%</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/28">Confidence</p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">94%</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-black/45 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-400/60">Top recommendation</p>
          <p className="mt-2 text-base font-semibold text-white/90">
            {primaryRecommendation?.recommendedAction || "No major action required"}
          </p>
          <p className="mt-1 text-sm text-white/45">
            {primaryRecommendation ? primaryRecommendation.reasoning : report.summary}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[11px] text-white/38">{formatCurrency(report.totalYearlySavings)} annualized</p>
            <Link
              to={`/report/${report.publicId}`}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/22 bg-emerald-500/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 transition-all hover:bg-emerald-500/[0.14]"
            >
              View full report
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
          <ShieldCheck size={12} className="text-emerald-300/70" />
          Public-safe share preview
        </div>
      </div>
    </motion.div>
  );
}
