import { motion } from "framer-motion";
import { FadeIn } from "@/shared/components/animations/FadeIn";
import { useAuditStore } from "../store/audit.store";
import { AuditForm } from "../components/AuditForm";
import { ResultsView } from "../../results/components/ResultsView";
import { TOOL_OPTIONS, USE_CASE_OPTIONS } from "../types/audit.types";

export function AuditPage() {
  const result = useAuditStore((s) => s.result);
  const tools = useAuditStore((s) => s.tools);
  const teamSize = useAuditStore((s) => s.teamSize);
  const useCase = useAuditStore((s) => s.useCase);

  const monthlySpend = tools.reduce((sum, t) => sum + (Number.isFinite(t.monthlySpend) ? t.monthlySpend : 0), 0);
  const selectedTools = tools
    .map((tool) => TOOL_OPTIONS.find((opt) => opt.value === tool.toolId)?.label ?? tool.toolId)
    .slice(0, 3);
  const useCaseLabel = USE_CASE_OPTIONS.find((opt) => opt.value === useCase)?.label ?? useCase;

  return (
    <div className="relative min-h-screen bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(16,185,129,0.06),transparent_48%)]" />
        <div className="absolute left-[70%] top-[18%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.03] blur-[140px]" />
        <div className="absolute right-[72%] top-[55%] h-[380px] w-[380px] rounded-full bg-emerald-500/[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 px-6 py-28 sm:py-32">
        {result ? (
          <div className="mx-auto max-w-6xl">
            <ResultsView />
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_1.35fr] lg:gap-14">
            <FadeIn direction="left">
              <aside className="lg:sticky lg:top-28 self-start space-y-10">
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[10px] font-bold tracking-[0.26em] uppercase text-emerald-400/55 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    AI Spend Intelligence
                  </div>
                  <h1 className="mt-7 text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                    Build your
                    <span className="ml-2 bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">
                      command audit
                    </span>
                  </h1>
                  <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/35 sm:text-lg">
                    Enter plans, seats, and spend once. Get defensible recommendations, confidence signals, and clear savings actions.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/[0.06] bg-black/45 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/22">Current stack spend</p>
                    <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-emerald-300">${monthlySpend.toLocaleString()}</p>
                    <p className="mt-1 text-[11px] text-white/22">estimated monthly total</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-black/45 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/22">Context</p>
                    <p className="mt-2 text-lg font-semibold text-white/78">{teamSize} seats · {useCaseLabel}</p>
                    <p className="mt-1 text-[11px] text-white/22">team size + primary mode</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.45 }}
                  className="rounded-2xl border border-emerald-500/14 bg-emerald-500/[0.04] p-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-400/62">Tools in scope</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {selectedTools.join(" · ")}
                    {tools.length > 3 ? ` + ${tools.length - 3} more` : ""}
                  </p>
                </motion.div>
              </aside>
            </FadeIn>

            <FadeIn direction="right">
              <section className="relative overflow-hidden rounded-[2rem] border border-emerald-500/16 bg-black/50 p-6 shadow-[0_35px_80px_-40px_rgba(16,185,129,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.08),transparent_45%)]" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-120px_100px_-120px_rgba(16,185,129,0.22)]" />
                <div className="relative z-10">
                  <AuditForm />
                </div>
              </section>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
}
