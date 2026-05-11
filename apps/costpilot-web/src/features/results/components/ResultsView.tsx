import { AnimatePresence, motion } from "framer-motion";
import {
  Share2,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ArrowDown,
  ArrowRight,
  Zap,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Gauge,
} from "lucide-react";
import { useState } from "react";
import { AnimatedCounter } from "@/shared/components/animations/AnimatedCounter";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useAuditStore } from "../../audit/store/audit.store";
import { LeadCapture } from "./LeadCapture";
import { BenchmarkSection } from "./BenchmarkSection";
import { buildBenchmarkProfile } from "../utils/benchmark";
import type { Recommendation, RecommendationType } from "@costpilot/shared";

const typeConfig: Record<RecommendationType, { icon: typeof CheckCircle; label: string; color: string }> = {
  downgrade: { icon: ArrowDown, label: "Downgrade", color: "text-emerald-300" },
  "alternative-tool": { icon: RefreshCw, label: "Alternative", color: "text-amber-300" },
  "credit-optimization": { icon: Zap, label: "Credit", color: "text-violet-300" },
  "plan-mismatch": { icon: Lightbulb, label: "Plan fix", color: "text-sky-300" },
  "already-optimal": { icon: CheckCircle, label: "Optimal", color: "text-white/40" },
  consolidation: { icon: ArrowDown, label: "Consolidate", color: "text-emerald-300" },
};

function barWidth(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(6, Math.round((value / max) * 100));
}

function deriveRiskLevel(savings: number, spend: number) {
  if (spend <= 0) return "low";
  const ratio = savings / spend;
  if (ratio >= 0.35) return "high";
  if (ratio >= 0.15) return "medium";
  return "low";
}

function recommendationsByPriority(recommendations: Recommendation[]) {
  const actionable = recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings);
  const primary = actionable[0];
  const secondary = actionable.slice(1);
  const informational = recommendations.filter((r) => r.monthlySavings <= 0);
  return { actionable, primary, secondary, informational };
}

function reasoningBullets(reasoning: string) {
  return reasoning
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function ResultsView() {
  const result = useAuditStore((s) => s.result);
  const reset = useAuditStore((s) => s.reset);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);

  if (!result) return null;

  const hasSavings = result.totalMonthlySavings > 0;
  const toolsAnalyzed = result.input.tools.length;
  const currentMonthlySpend = result.input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const optimizedMonthlySpend = Math.max(0, currentMonthlySpend - result.totalMonthlySavings);
  const { actionable, primary, secondary, informational } = recommendationsByPriority(result.recommendations);
  const optimizationScore = hasSavings
    ? Math.max(42, Math.round((optimizedMonthlySpend / Math.max(currentMonthlySpend, 1)) * 100))
    : 96;
  const confidence = Math.min(98, hasSavings ? 78 + actionable.length * 4 : 94);
  const risk = deriveRiskLevel(result.totalMonthlySavings, currentMonthlySpend);
  const riskTone =
    risk === "high"
      ? "text-red-300 border-red-500/25 bg-red-500/10"
      : risk === "medium"
        ? "text-amber-300 border-amber-500/25 bg-amber-500/10"
        : "text-emerald-300 border-emerald-500/25 bg-emerald-500/10";
  const sectionDelay = hasSavings ? 0.08 : 0.05;
  const sectionDuration = hasSavings ? 0.56 : 0.46;
  const childDelay = hasSavings ? 0.14 : 0.1;

  const assistantOverlapTools = result.input.tools.filter((tool) =>
    ["cursor", "copilot", "claude", "chatgpt", "gemini", "windsurf"].includes(tool.toolId)
  );
  const assistantSpend = assistantOverlapTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const overlapExposure = hasSavings
    ? Math.min(
        currentMonthlySpend * 0.78,
        Math.max(result.totalMonthlySavings, Math.round(assistantSpend * 0.35))
      )
    : Math.round(currentMonthlySpend * 0.08);
  const overlapRatio = currentMonthlySpend > 0 ? Math.round((overlapExposure / currentMonthlySpend) * 100) : 0;
  const spendMixMax = Math.max(currentMonthlySpend, 1);
  const currentSpendPct = 100;
  const optimizedSpendPct = Math.max(8, Math.round((optimizedMonthlySpend / spendMixMax) * 100));
  const overlapPct = Math.max(6, Math.min(78, overlapRatio));
  const benchmarkProfile = buildBenchmarkProfile({
    teamSize: result.input.teamSize,
    toolCount: toolsAnalyzed,
    totalMonthlySpend: currentMonthlySpend,
    totalMonthlySavings: result.totalMonthlySavings,
    overlapExposure,
    assistantSpend,
    recommendations: result.recommendations,
    useCase: result.input.useCase,
  });

  const spendMix = [...result.input.tools]
    .sort((a, b) => b.monthlySpend - a.monthlySpend)
    .slice(0, 5);

  const handleShare = () => {
    const url = `${window.location.origin}/report/${result.publicId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative space-y-12"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: hasSavings ? 1 : 0.7, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute left-1/2 top-0 h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-3xl"
          animate={
            hasSavings
              ? { opacity: [0.18, 0.3, 0.18], scale: [0.96, 1, 0.96], y: [0, 6, 0] }
              : { opacity: [0.1, 0.16, 0.1], scale: [0.98, 1, 0.98], y: [0, 3, 0] }
          }
          transition={{ duration: hasSavings ? 16 : 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.24em] uppercase text-white/26 transition-colors hover:text-emerald-300/75"
      >
        <ArrowLeft size={12} />
        New audit
      </button>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: sectionDuration, delay: sectionDelay, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.6rem] border border-emerald-500/10 bg-black/50 p-7 shadow-[0_26px_80px_-42px_rgba(16,185,129,0.28)] backdrop-blur-xl sm:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(16,185,129,0.08),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-90px_90px_-90px_rgba(16,185,129,0.14)]" />

        <div className="relative z-10 grid gap-10 xl:grid-cols-[1.25fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: sectionDuration, delay: childDelay, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/22 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/75">
              <Sparkles size={12} />
              Intelligence unlocked
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: childDelay + 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl"
            >
              {hasSavings ? "Optimization opportunity detected" : "Your stack is already efficient"}
            </motion.h2>

            {hasSavings ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: childDelay + 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Potential monthly savings</p>
                <div className="mt-2 inline-flex items-end gap-3 leading-none">
                  <p className="text-7xl font-bold tracking-[-0.05em] text-emerald-300 sm:text-8xl">
                    $<AnimatedCounter end={result.totalMonthlySavings} duration={1.8} />
                  </p>
                  <span className="pb-2 text-2xl font-semibold tracking-tight text-emerald-300/45">/mo</span>
                </div>
                <p className="mt-3 text-base font-medium text-white/44">
                  {formatCurrency(result.totalYearlySavings)} annual impact from {actionable.length} actionable recommendations
                </p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: childDelay + 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/42"
              >
                No material waste detected. Keep your configuration and monitor for vendor pricing shifts.
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: childDelay + 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-xl space-y-3"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Before vs after</p>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/38">
                  <span>Current spend</span>
                  <span>{formatCurrency(currentMonthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentSpendPct}%` }}
                    transition={{ duration: 0.8, delay: childDelay + 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-white/45"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/38">
                  <span>Optimized spend</span>
                  <span>{formatCurrency(optimizedMonthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${optimizedSpendPct}%` }}
                    transition={{ duration: 0.9, delay: childDelay + 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              { label: "Optimization score", kind: "score" as const, value: optimizationScore, hint: "efficiency after adjustments" },
              { label: "Confidence", kind: "percent" as const, value: confidence, hint: "based on spend evidence" },
              { label: "Tools analyzed", kind: "count" as const, value: toolsAnalyzed, hint: "active subscriptions + APIs" },
              { label: "Risk level", kind: "text" as const, value: risk, hint: "waste ratio severity" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: childDelay + (item.label === "Optimization score" ? 0.08 : item.label === "Confidence" ? 0.16 : item.label === "Tools analyzed" ? 0.24 : 0.32), ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="rounded-2xl border border-white/[0.08] bg-black/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-26px_rgba(16,185,129,0.32)]"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/28">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold capitalize tracking-tight text-white/86">
                  {item.kind === "score" || item.kind === "percent" ? (
                    <AnimatedCounter end={item.value} suffix="%" duration={item.kind === "score" ? 1.3 : 1.15} />
                  ) : item.kind === "count" ? (
                    <AnimatedCounter end={item.value} duration={1.1} />
                  ) : (
                    item.value
                  )}
                </p>
                <p className="mt-1 text-[11px] text-white/28">{item.hint}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {primary && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay + 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2, scale: 1.005 }}
          className="rounded-[2rem] border border-emerald-400/22 bg-black/60 p-7 shadow-[0_28px_80px_-36px_rgba(16,185,129,0.45)] backdrop-blur-lg sm:p-9 transition-shadow hover:shadow-[0_32px_90px_-38px_rgba(16,185,129,0.55)]"
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-300/58">Primary recommendation</p>
          <div className="mt-5 flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <h3 className="text-3xl font-semibold capitalize tracking-[-0.02em] text-white sm:text-4xl">
                {primary.toolId.replace("-", " ")}
              </h3>
              <p className="text-xl text-emerald-200/95 sm:text-2xl">{primary.recommendedAction}</p>
              <div className="space-y-2">
                {reasoningBullets(primary.reasoning).map((point) => (
                  <div key={point} className="flex items-start gap-2 text-sm text-white/56">
                    <ArrowRight size={13} className="mt-0.5 text-emerald-300/70" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/[0.1] px-6 py-5 text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">Impact</p>
              <p className="mt-1 text-5xl font-bold tracking-[-0.04em] text-emerald-300">
                {formatCurrency(primary.monthlySavings)}
              </p>
              <p className="text-[11px] text-emerald-300/55">monthly savings</p>
              <p className="mt-1 text-[11px] text-emerald-300/50">
                {formatCurrency(primary.yearlySavings)} annually
              </p>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: sectionDuration, delay: sectionDelay + 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="rounded-2xl border border-white/[0.08] bg-black/42 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.3)]"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Transformation flow</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.01] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Current stack</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white/88">
                {formatCurrency(currentMonthlySpend)}
              </p>
              <p className="text-[11px] text-white/38">monthly spend</p>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-amber-300/70">Overlap exposure</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-200">
                <AnimatedCounter end={overlapExposure} duration={1.2} />
              </p>
              <p className="text-[11px] text-amber-200/70">{overlapRatio}% of monthly spend</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/[0.08]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overlapPct}%` }}
                  transition={{ duration: 0.75, delay: sectionDelay + 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-amber-300/80"
                />
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">Optimized stack</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-200">
                {formatCurrency(optimizedMonthlySpend)}
              </p>
              <p className="text-[11px] text-emerald-200/70">projected monthly spend</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="rounded-2xl border border-white/[0.08] bg-black/42 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.3)]"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Risk + confidence</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.01] px-4 py-3">
              <div className="flex items-center gap-2 text-white/56">
                <Gauge size={14} />
                <span className="text-[11px] uppercase tracking-[0.14em]">Confidence</span>
              </div>
              <span className="text-lg font-semibold text-white/86">
                <AnimatedCounter end={confidence} suffix="%" duration={1.15} />
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${riskTone}`}>
              <AlertTriangle size={12} />
              Risk: {risk}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {secondary.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: sectionDuration, delay: sectionDelay + 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-400/45">Secondary opportunities</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {secondary.map((rec, i) => {
              const config = typeConfig[rec.type] || typeConfig["already-optimal"];
              const Icon = config.icon;
              return (
                <motion.article
                  key={`${rec.toolId}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionDelay + 0.38 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="rounded-2xl border border-white/[0.08] bg-black/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/25 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.28)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold capitalize text-white/86">{rec.toolId.replace("-", " ")}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] ${config.color}`}>
                      <Icon size={12} />
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/58">{rec.recommendedAction}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/36">{rec.reasoning}</p>
                  <p className="mt-3 text-sm font-semibold text-emerald-300">{formatCurrency(rec.monthlySavings)}/mo</p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: sectionDuration, delay: sectionDelay + 0.44, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-5 xl:grid-cols-[1.25fr_1fr]"
      >
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="rounded-2xl border border-white/[0.08] bg-black/42 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.28)]"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Spend allocation</p>
          <div className="mt-4 space-y-3">
            {spendMix.map((tool, index) => (
              <div key={`${tool.toolId}-${tool.plan}`}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="capitalize text-white/58">{tool.toolId.replace("-", " ")}</span>
                  <span className="text-white/42">{formatCurrency(tool.monthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth(tool.monthlySpend, spendMixMax)}%` }}
                    transition={{ duration: 0.82, delay: sectionDelay + 0.54 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="rounded-2xl border border-white/[0.08] bg-black/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.28)]"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">AI briefing</p>
          <div className="mt-4 space-y-3 text-sm">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: sectionDelay + 0.58 }}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Key finding</p>
              <p className="mt-1 text-white/72">{primary?.recommendedAction || "No immediate high-impact changes required."}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: sectionDelay + 0.66 }}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Waste detected</p>
              <p className="mt-1 text-white/66">{formatCurrency(result.totalMonthlySavings)} monthly recoverable spend</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: sectionDelay + 0.74 }}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Optimization path</p>
              <ul className="mt-1 space-y-1 text-white/58">
                <li>• Prioritize highest-impact recommendation first</li>
                <li>• Consolidate overlapping assistant usage</li>
                <li>• Re-run audit after plan changes</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: sectionDelay + 0.82 }}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Model note</p>
              <p className="mt-1 text-white/52">{result.summary}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: sectionDelay + 0.9 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/44"
            >
              <ShieldCheck size={12} />
              Risk {risk}
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      <AnimatePresence mode="wait">
        {showBenchmark && (
          <motion.div
            key="benchmark-section"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <BenchmarkSection profile={benchmarkProfile} />
          </motion.div>
        )}
      </AnimatePresence>

      {informational.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: sectionDuration, delay: sectionDelay + 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-black/42 p-6"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Informational insights</p>
          <div className="mt-4 space-y-2">
            {informational.map((rec, i) => (
              <motion.div
                key={`${rec.toolId}-insight-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: sectionDelay + 0.64 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -1, scale: 1.005 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.01] px-4 py-3 transition-shadow hover:border-white/[0.12] hover:shadow-[0_16px_30px_-24px_rgba(255,255,255,0.16)]"
              >
                <p className="text-sm capitalize text-white/74">{rec.toolId.replace("-", " ")}</p>
                <p className="mt-1 text-xs text-white/42">{rec.reasoning}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: sectionDuration, delay: sectionDelay + 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="rounded-2xl border border-white/[0.08] bg-black/46 p-6 text-center transition-shadow hover:border-emerald-500/20 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.25)]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Share public report</p>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            animate={
              copied
                ? { boxShadow: "0 0 0 1px rgba(16,185,129,0.22), 0 18px 36px -26px rgba(16,185,129,0.34)" }
                : { boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 36px -28px rgba(0,0,0,0.38)" }
            }
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.02] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/58 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.08] hover:text-emerald-200"
            >
              <Share2 size={14} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? "Copied" : "Copy public link"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setShowBenchmark((value) => !value)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className={`mt-3 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
              showBenchmark
                ? "border-emerald-400/26 bg-emerald-500/[0.12] text-emerald-200"
                : "border-white/[0.12] bg-white/[0.02] text-white/58 hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] hover:text-emerald-200"
            }`}
          >
            <BarChart3 size={14} />
            {showBenchmark ? "Hide benchmark" : "Run benchmark"}
          </motion.button>
          <p className="mt-3 text-[11px] text-white/28">Public links always strip identifying details.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sectionDelay + 0.8, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          {!showLeadCapture ? (
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              className="flex h-full items-center justify-center rounded-2xl border border-emerald-500/18 bg-emerald-500/[0.05] p-6 transition-shadow hover:border-emerald-500/26 hover:shadow-[0_18px_35px_-28px_rgba(16,185,129,0.28)]"
            >
              <button
                onClick={() => setShowLeadCapture(true)}
                className="rounded-full border border-emerald-500/35 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200 transition-all hover:bg-emerald-500/[0.15]"
              >
                {hasSavings ? "Activate savings watchlist" : "Notify me on pricing changes"}
              </button>
            </motion.div>
          ) : (
            <LeadCapture auditId={result.id} hasSavings={hasSavings} />
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
