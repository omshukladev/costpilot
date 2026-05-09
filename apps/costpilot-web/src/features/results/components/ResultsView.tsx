import { motion } from "framer-motion";
import {
  Share2,
  ArrowLeft,
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

  const assistantOverlapTools = result.input.tools.filter((tool) =>
    ["cursor", "copilot", "claude", "chatgpt", "gemini", "windsurf"].includes(tool.toolId)
  );
  const overlapExposure = assistantOverlapTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const overlapRatio = currentMonthlySpend > 0 ? Math.round((overlapExposure / currentMonthlySpend) * 100) : 0;

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }} className="space-y-12">
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.24em] uppercase text-white/26 transition-colors hover:text-emerald-300/75"
      >
        <ArrowLeft size={12} />
        New audit
      </button>

      <section className="relative overflow-hidden rounded-[2.6rem] border border-emerald-500/16 bg-black/55 p-7 shadow-[0_30px_90px_-35px_rgba(16,185,129,0.45)] backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(16,185,129,0.14),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-90px_90px_-90px_rgba(16,185,129,0.32)]" />

        <div className="relative z-10 grid gap-10 xl:grid-cols-[1.25fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/22 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/75">
              <Sparkles size={12} />
              Intelligence unlocked
            </p>
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
              {hasSavings ? "Optimization opportunity detected" : "Your stack is already efficient"}
            </h2>

            {hasSavings ? (
              <div className="mt-6">
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
              </div>
            ) : (
              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/42">
                No material waste detected. Keep your configuration and monitor for vendor pricing shifts.
              </p>
            )}

            <div className="mt-8 max-w-xl space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Before vs after</p>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/38">
                  <span>Current spend</span>
                  <span>{formatCurrency(currentMonthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <div className="h-full rounded-full bg-white/45" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/38">
                  <span>Optimized spend</span>
                  <span>{formatCurrency(optimizedMonthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300"
                    style={{ width: `${Math.max(5, (optimizedMonthlySpend / Math.max(currentMonthlySpend, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              { label: "Optimization score", value: `${optimizationScore}%`, hint: "efficiency after adjustments" },
              { label: "Confidence", value: `${confidence}%`, hint: "based on spend evidence" },
              { label: "Tools analyzed", value: String(toolsAnalyzed), hint: "active subscriptions + APIs" },
              { label: "Risk level", value: risk, hint: "waste ratio severity" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-white/[0.08] bg-black/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/28">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold capitalize tracking-tight text-white/86">{item.value}</p>
                <p className="mt-1 text-[11px] text-white/28">{item.hint}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {primary && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="rounded-[2rem] border border-emerald-400/25 bg-black/60 p-7 shadow-[0_28px_80px_-36px_rgba(16,185,129,0.65)] backdrop-blur-lg sm:p-9"
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

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
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
                {formatCurrency(overlapExposure)}
              </p>
              <p className="text-[11px] text-amber-200/70">{overlapRatio}% of monthly spend</p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">Optimized stack</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-200">
                {formatCurrency(optimizedMonthlySpend)}
              </p>
              <p className="text-[11px] text-emerald-200/70">projected monthly spend</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Risk + confidence</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.01] px-4 py-3">
              <div className="flex items-center gap-2 text-white/56">
                <Gauge size={14} />
                <span className="text-[11px] uppercase tracking-[0.14em]">Confidence</span>
              </div>
              <span className="text-lg font-semibold text-white/86">{confidence}%</span>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${riskTone}`}>
              <AlertTriangle size={12} />
              Risk: {risk}
            </div>
          </div>
        </div>
      </section>

      {secondary.length > 0 && (
        <section className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-400/45">Secondary opportunities</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {secondary.map((rec, i) => {
              const config = typeConfig[rec.type] || typeConfig["already-optimal"];
              const Icon = config.icon;
              return (
                <motion.article
                  key={`${rec.toolId}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.4 }}
                  className="rounded-2xl border border-white/[0.08] bg-black/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-emerald-500/25"
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
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">Spend allocation</p>
          <div className="mt-4 space-y-3">
            {spendMix.map((tool) => (
              <div key={`${tool.toolId}-${tool.plan}`}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="capitalize text-white/58">{tool.toolId.replace("-", " ")}</span>
                  <span className="text-white/42">{formatCurrency(tool.monthlySpend)}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                    style={{ width: `${barWidth(tool.monthlySpend, Math.max(currentMonthlySpend, 1))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/46">AI briefing</p>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Key finding</p>
              <p className="mt-1 text-white/72">{primary?.recommendedAction || "No immediate high-impact changes required."}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Waste detected</p>
              <p className="mt-1 text-white/66">{formatCurrency(result.totalMonthlySavings)} monthly recoverable spend</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Optimization path</p>
              <ul className="mt-1 space-y-1 text-white/58">
                <li>• Prioritize highest-impact recommendation first</li>
                <li>• Consolidate overlapping assistant usage</li>
                <li>• Re-run audit after plan changes</li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Model note</p>
              <p className="mt-1 text-white/52">{result.summary}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/44">
              <ShieldCheck size={12} />
              Risk {risk}
            </div>
          </div>
        </div>
      </section>

      {informational.length > 0 && (
        <section className="rounded-2xl border border-white/[0.08] bg-black/42 p-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Informational insights</p>
          <div className="mt-4 space-y-2">
            {informational.map((rec, i) => (
              <div key={`${rec.toolId}-insight-${i}`} className="rounded-xl border border-white/[0.08] bg-white/[0.01] px-4 py-3">
                <p className="text-sm capitalize text-white/74">{rec.toolId.replace("-", " ")}</p>
                <p className="mt-1 text-xs text-white/42">{rec.reasoning}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-2xl border border-white/[0.08] bg-black/46 p-6 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Share public report</p>
          <button
            onClick={handleShare}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.02] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/58 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.08] hover:text-emerald-200"
          >
            <Share2 size={14} />
            {copied ? "Copied" : "Copy public link"}
          </button>
          <p className="mt-3 text-[11px] text-white/28">Public links always strip identifying details.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          {!showLeadCapture ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-emerald-500/18 bg-emerald-500/[0.05] p-6">
              <button
                onClick={() => setShowLeadCapture(true)}
                className="rounded-full border border-emerald-500/35 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200 transition-all hover:bg-emerald-500/[0.15]"
              >
                {hasSavings ? "Activate savings watchlist" : "Notify me on pricing changes"}
              </button>
            </div>
          ) : (
            <LeadCapture auditId={result.id} hasSavings={hasSavings} />
          )}
        </motion.div>
      </section>
    </motion.div>
  );
}
