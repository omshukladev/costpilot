import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { AnyPlan, ToolId } from "@costpilot/shared";
import { TOOL_OPTIONS, PLANS_BY_TOOL, isManualSpendPlan } from "../types/audit.types";
import type { FormToolEntry } from "../types/audit.types";
import { PremiumSelect } from "./PremiumSelect";

interface ToolRowProps {
  index: number;
  tool: FormToolEntry;
  canRemove: boolean;
  onUpdate: (index: number, data: Partial<FormToolEntry>) => void;
  onRemove: (index: number) => void;
}

function normalizeIntegerDraft(value: string): string {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return digitsOnly.replace(/^0+(?=\d)/, "");
}

function normalizeCurrencyDraft(value: string): string {
  const sanitized = value.replace(/[^\d.]/g, "");
  if (!sanitized) return "";

  const parts = sanitized.split(".");
  const whole = (parts[0] || "").replace(/^0+(?=\d)/, "");

  if (parts.length === 1) {
    return whole;
  }

  const fraction = parts.slice(1).join("").slice(0, 2);
  return `${whole || "0"}.${fraction}`;
}

export function ToolRow({ index, tool, canRemove, onUpdate, onRemove }: ToolRowProps) {
  const plans = PLANS_BY_TOOL[tool.toolId] || [];
  const monthlySpendIsManual = isManualSpendPlan(tool.toolId, tool.plan);
  const toolLabel = TOOL_OPTIONS.find((opt) => opt.value === tool.toolId)?.label ?? tool.toolId;
  const planLabel = plans.find((plan) => plan.value === tool.plan)?.label ?? tool.plan;
  const spendModeLabel = monthlySpendIsManual ? "Manual pricing" : "System pricing";
  const [seatsDraft, setSeatsDraft] = useState(String(tool.seats));
  const [monthlySpendDraft, setMonthlySpendDraft] = useState(String(tool.monthlySpend));

  useEffect(() => {
    setSeatsDraft(String(tool.seats));
  }, [tool.seats]);

  useEffect(() => {
    setMonthlySpendDraft(String(tool.monthlySpend));
  }, [tool.monthlySpend]);

  const inputClasses =
    "h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all duration-300 hover:border-emerald-500/22 hover:bg-white/[0.05] focus:border-emerald-400/45 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/25";
  const labelClasses = "mb-2 block text-[10px] font-bold tracking-[0.18em] uppercase text-white/26";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[1.9rem] border border-white/[0.07] bg-black/36 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-emerald-500/24 hover:shadow-[0_24px_50px_-35px_rgba(16,185,129,0.58)] sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_34%)] opacity-80" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pr-1 sm:pr-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400/50">Tool module {index + 1}</p>
            <h4 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-white/90">{toolLabel}</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
              {spendModeLabel}
            </div>
            {canRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/24 transition-all duration-200 hover:scale-[1.03] hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white/50"
                aria-label={`Remove tool module ${index + 1}`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PremiumSelect
            label="Tool"
            value={tool.toolId}
            options={TOOL_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
              meta: opt.value === tool.toolId ? "selected" : undefined,
            }))}
            onChange={(nextToolId) => onUpdate(index, { toolId: nextToolId as ToolId })}
          />

          <PremiumSelect
            label="Plan"
            value={tool.plan}
            options={plans.map((plan) => ({
              value: plan.value,
              label: plan.label,
              meta: plan.value === tool.plan ? "active" : undefined,
            }))}
            onChange={(nextPlan) => onUpdate(index, { plan: nextPlan as AnyPlan })}
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Monthly spend</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/20">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={monthlySpendDraft}
                onChange={(e) => {
                  const nextValue = normalizeCurrencyDraft(e.target.value);
                  setMonthlySpendDraft(nextValue);

                  if (!monthlySpendIsManual || nextValue === "") return;
                  onUpdate(index, { monthlySpend: Number(nextValue) });
                }}
                onBlur={() => {
                  if (!monthlySpendIsManual) return;
                  if (monthlySpendDraft === "") return;

                  const normalized = Number(monthlySpendDraft);
                  if (Number.isNaN(normalized)) {
                    setMonthlySpendDraft(String(tool.monthlySpend));
                    return;
                  }

                  const nextAmount = Math.max(0, normalized);
                  setMonthlySpendDraft(String(nextAmount));
                  onUpdate(index, { monthlySpend: nextAmount });
                }}
                onFocus={(e) => e.currentTarget.select()}
                onClick={(e) => e.currentTarget.select()}
                disabled={!monthlySpendIsManual}
                className={`${inputClasses} pl-7 ${monthlySpendIsManual ? "" : "cursor-not-allowed opacity-80"}`}
                placeholder="0"
              />
            </div>
            <p className="mt-1 text-[10px] text-white/35">
              {monthlySpendIsManual ? "Editable for custom/API usage plans" : "Auto-calculated from plan price × seats"}
            </p>
          </div>

          <div>
            <label className={labelClasses}>Seats</label>
            <input
              type="text"
              inputMode="numeric"
              value={seatsDraft}
              onChange={(e) => {
                const nextValue = normalizeIntegerDraft(e.target.value);
                setSeatsDraft(nextValue);
                if (nextValue === "") return;
                onUpdate(index, { seats: Math.max(1, Number(nextValue)) });
              }}
              onBlur={() => {
                if (seatsDraft === "") return;
                const normalizedSeats = Math.max(1, Number(seatsDraft));
                setSeatsDraft(String(normalizedSeats));
                onUpdate(index, { seats: normalizedSeats });
              }}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className={inputClasses}
              placeholder="1"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/58">
              {tool.seats} {tool.seats === 1 ? "seat" : "seats"} · {planLabel}
            </p>
            <p className="mt-1 truncate text-sm text-white/42">
              Estimated spend:
              <span className="ml-2 text-white/78">${tool.monthlySpend.toFixed(2).replace(/\.00$/, "")}/mo</span>
            </p>
          </div>
          <div className="rounded-full border border-white/[0.08] bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
            {monthlySpendIsManual ? "manual spend" : "locked pricing"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
