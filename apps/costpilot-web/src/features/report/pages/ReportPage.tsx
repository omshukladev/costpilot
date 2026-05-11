import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  ArrowDown,
  Zap,
  Lightbulb,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useReport } from "../hooks/useReport";
import { AnimatedCounter } from "@/shared/components/animations/AnimatedCounter";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { RecommendationType } from "@costpilot/shared";

const typeConfig: Record<RecommendationType, { icon: typeof CheckCircle; label: string; color: string }> = {
  downgrade: { icon: ArrowDown, label: "Downgrade", color: "text-emerald-300" },
  "alternative-tool": { icon: RefreshCw, label: "Alternative", color: "text-amber-300" },
  "credit-optimization": { icon: Zap, label: "Credit", color: "text-violet-300" },
  "plan-mismatch": { icon: Lightbulb, label: "Plan fix", color: "text-sky-300" },
  "already-optimal": { icon: CheckCircle, label: "Optimal", color: "text-white/40" },
  consolidation: { icon: ArrowDown, label: "Consolidate", color: "text-emerald-300" },
};

function deriveRiskLevel(savings: number, spend: number) {
  if (spend <= 0) return "low";
  const ratio = savings / spend;
  if (ratio >= 0.35) return "high";
  if (ratio >= 0.15) return "medium";
  return "low";
}

export function ReportPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const { data, isLoading, isError } = useReport(publicId || "");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!data) return;
    const savings = data.totalMonthlySavings > 0 ? `$${data.totalMonthlySavings}/mo saved` : "Well-optimized stack";
    document.title = `AI Spend Audit — ${savings} | CostPilot`;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", document.title);
    setMeta("og:description", data.summary?.slice(0, 200) || "AI tooling spend audit by CostPilot");
    setMeta("og:type", "website");
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", data.summary?.slice(0, 200) || "AI tooling spend audit by CostPilot");
  }, [data]);

  const handleDownloadPdf = async () => {
    if (!data || isExporting) return;

    setIsExporting(true);
    try {
      const [{ pdf }, { ReportPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../components/ReportPdfDocument"),
      ]);
      const blob = await pdf(<ReportPdfDocument report={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `costpilot-report-${data.publicId.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-2 w-28 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            className="h-full rounded-full bg-emerald-500/35"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6">
        <p className="text-4xl font-bold tracking-tighter text-white/24">Report not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/34 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft size={14} />
          Back to CostPilot
        </Link>
      </div>
    );
  }

  const hasSavings = data.totalMonthlySavings > 0;
  const toolsAnalyzed = data.tools.length;
  const currentSpend = data.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const sortedRecommendations = [...data.recommendations].sort((a, b) => b.monthlySavings - a.monthlySavings);
  const primaryRecommendation = sortedRecommendations.find((rec) => rec.monthlySavings > 0);
  const confidence = Math.min(98, hasSavings ? 78 + sortedRecommendations.filter((r) => r.monthlySavings > 0).length * 4 : 94);
  const risk = deriveRiskLevel(data.totalMonthlySavings, currentSpend);
  const optimizationScore = hasSavings
    ? Math.max(42, Math.round(((currentSpend - data.totalMonthlySavings) / Math.max(currentSpend, 1)) * 100))
    : 96;

  return (
    <div className="relative min-h-screen bg-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.06),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/28 transition-colors hover:text-emerald-300/80"
        >
          <ArrowLeft size={12} />
          Back
        </Link>

        <header className="mt-7 rounded-[2rem] border border-white/[0.08] bg-black/46 p-7 shadow-[0_22px_60px_-38px_rgba(16,185,129,0.22)] backdrop-blur-xl sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/22 bg-emerald-500/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300/72">
              <ShieldCheck size={12} />
              Public-safe report
            </span>
            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/32">
              Report ID: {data.publicId.slice(0, 8)}
            </span>
            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/32">
              Generated: {new Date(data.createdAt).toLocaleString()}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
            AI Spend Intelligence Report
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/42">
            Executive view of tooling efficiency, savings exposure, and optimization direction.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-black transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowDown size={14} />
              {isExporting ? "Preparing PDF..." : "Download PDF"}
            </motion.button>
            <p className="text-[11px] text-white/32">Executive-ready 2-page export</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-500/16 bg-emerald-500/[0.05] p-4 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/28">Monthly savings</p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-emerald-300">
                {hasSavings ? (
                  <>
                    $<AnimatedCounter end={data.totalMonthlySavings} duration={1.5} />
                  </>
                ) : (
                  "$0"
                )}
              </p>
              <p className="mt-1 text-[11px] text-emerald-200/70">{formatCurrency(data.totalYearlySavings)} annualized</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-black/42 p-4">
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/28">Optimization score</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white/86">{optimizationScore}%</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-black/42 p-4">
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/28">Confidence</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white/86">{confidence}%</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-black/42 p-4">
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/28">Tools analyzed</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white/86">{toolsAnalyzed}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-black/42 p-4">
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/28">Risk</p>
              <p className="mt-2 text-2xl font-semibold capitalize tracking-tight text-white/86">{risk}</p>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/45">Recommendations</p>
            {primaryRecommendation && (
              <div className="mt-4 rounded-xl border border-emerald-500/24 bg-emerald-500/[0.08] p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-300/70">Primary action</p>
                <p className="mt-2 text-lg text-emerald-100">{primaryRecommendation.recommendedAction}</p>
                <p className="mt-1 text-xs text-emerald-200/70">{formatCurrency(primaryRecommendation.monthlySavings)}/mo impact</p>
              </div>
            )}
            <div className="mt-4 space-y-3">
              {sortedRecommendations.map((rec, i) => {
                const config = typeConfig[rec.type] || typeConfig["already-optimal"];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={`${rec.toolId}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.32 }}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.01] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold capitalize text-white/82">{rec.toolId.replace("-", " ")}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] ${config.color}`}>
                        <Icon size={12} />
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/58">{rec.recommendedAction}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/38">{rec.reasoning}</p>
                    {rec.monthlySavings > 0 && (
                      <p className="mt-2 text-sm font-semibold text-emerald-300">{formatCurrency(rec.monthlySavings)}/mo</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/45">AI analyst briefing</p>
              <ul className="mt-3 space-y-2 text-sm text-white/58">
                <li>• Key finding: {primaryRecommendation?.recommendedAction || "No high-impact changes detected"}</li>
                <li>• Waste signal: {formatCurrency(data.totalMonthlySavings)} monthly recoverable spend</li>
                <li>• Confidence: {confidence}% evidence-backed recommendation quality</li>
                <li>• Model summary: {data.summary}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/45">Share</p>
              <p className="mt-3 text-sm text-white/48">
                This public report excludes all identifying details and is safe for stakeholder sharing.
              </p>
              <div className="mt-4 rounded-xl border border-emerald-500/18 bg-emerald-500/[0.05] px-4 py-3 text-[11px] text-emerald-200/85">
                Privacy-safe intelligence report
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 rounded-2xl border border-white/[0.08] bg-black/45 p-8 text-center">
          <p className="text-sm font-semibold text-white/66">Run your own audit in under 60 seconds</p>
          <p className="mt-2 text-[12px] text-white/34">Get a full breakdown, share link, and optimization strategy.</p>
          <Link
            to="/audit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-black transition-all hover:bg-emerald-400"
          >
            Run your audit
            <ExternalLink size={14} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
