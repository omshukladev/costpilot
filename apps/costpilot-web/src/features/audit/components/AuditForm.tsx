import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, ArrowRight } from "lucide-react";
import { ToolRow } from "./ToolRow";
import { USE_CASE_OPTIONS } from "../types/audit.types";
import { useAuditStore } from "../store/audit.store";
import { useAudit } from "../hooks/useAudit";
import type { AuditInput, UseCase } from "@costpilot/shared";

const inputClasses =
  "h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white/90 placeholder:text-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.05] focus:border-emerald-400/45 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/25";
const labelClasses = "mb-2 block text-[10px] font-bold tracking-[0.2em] uppercase text-white/28";

export function AuditForm() {
  const tools = useAuditStore((s) => s.tools);
  const teamSize = useAuditStore((s) => s.teamSize);
  const useCase = useAuditStore((s) => s.useCase);
  const isSubmitting = useAuditStore((s) => s.isSubmitting);
  const addTool = useAuditStore((s) => s.addTool);
  const removeTool = useAuditStore((s) => s.removeTool);
  const updateTool = useAuditStore((s) => s.updateTool);
  const setTeamSize = useAuditStore((s) => s.setTeamSize);
  const setUseCase = useAuditStore((s) => s.setUseCase);

  const auditMutation = useAudit();
  const [teamSizeInput, setTeamSizeInput] = useState(String(teamSize));

  useEffect(() => {
    setTeamSizeInput(String(teamSize));
  }, [teamSize]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const parsedTeamSize = Number(teamSizeInput);
      const safeTeamSize = Number.isFinite(parsedTeamSize) && parsedTeamSize >= 1 ? parsedTeamSize : 1;

      setTeamSize(safeTeamSize);
      auditMutation.mutate({ tools, teamSize: safeTeamSize, useCase } as AuditInput);
    },
    [tools, teamSizeInput, useCase, setTeamSize, auditMutation]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/45">
            Tool matrix
          </label>
          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/16">
            {tools.length} tool{tools.length !== 1 ? "s" : ""} active
          </span>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {tools.map((tool, i) => (
              <ToolRow
                key={`tool-${i}`}
                index={i}
                tool={tool}
                canRemove={tools.length > 1}
                onUpdate={updateTool}
                onRemove={removeTool}
              />
            ))}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={addTool}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] text-[11px] font-bold uppercase tracking-[0.16em] text-white/32 transition-all hover:border-emerald-400/35 hover:bg-emerald-500/[0.05] hover:text-emerald-300/75"
          >
            <Plus size={14} />
            Add another tool
          </motion.button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-6">
        <p className="mb-4 text-[10px] font-bold tracking-[0.26em] uppercase text-emerald-400/42">
          Operating context
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Team size</label>
            <input
              type="text"
              inputMode="numeric"
              value={teamSizeInput}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                const normalized = digitsOnly.replace(/^0+(?=\d)/, "");
                setTeamSizeInput(normalized);

                if (normalized === "") return;
                setTeamSize(Math.max(1, Number(normalized)));
              }}
              onBlur={() => {
                if (teamSizeInput === "") return;

                const normalizedTeamSize = Math.max(1, Number(teamSizeInput));
                setTeamSizeInput(String(normalizedTeamSize));
                setTeamSize(normalizedTeamSize);
              }}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className={inputClasses}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className={labelClasses}>Primary use case</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className={inputClasses}
            >
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-black text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-2">
        <motion.button
          type="submit"
          disabled={isSubmitting || auditMutation.isPending}
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-16 text-sm font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_24px_45px_-12px_rgba(16,185,129,0.42)]"
        >
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-10 bg-white/35" />
          </div>
          {isSubmitting || auditMutation.isPending ? (
            <span className="relative z-10 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Running audit...
            </span>
          ) : (
            <span className="relative z-10 flex items-center gap-2">
              Run intelligence audit
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>
      </div>

      {auditMutation.isError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-400/60"
        >
          Something went wrong. Please try again.
        </motion.p>
      )}

      <p className="text-center text-[10px] font-bold tracking-widest uppercase text-white/10">
        No login required · Results in seconds
      </p>
    </form>
  );
}
