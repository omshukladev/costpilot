import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { AnyPlan, ToolId } from "@costpilot/shared";
import { TOOL_OPTIONS, PLANS_BY_TOOL, isManualSpendPlan } from "../types/audit.types";
import type { FormToolEntry } from "../types/audit.types";

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
  const [seatsInput, setSeatsInput] = useState(String(tool.seats));
  const [monthlySpendInput, setMonthlySpendInput] = useState(String(tool.monthlySpend));

  useEffect(() => {
    setSeatsInput(String(tool.seats));
  }, [tool.seats]);

  useEffect(() => {
    setMonthlySpendInput(String(tool.monthlySpend));
  }, [tool.monthlySpend]);

  const inputClasses =
    "h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all duration-300 hover:border-emerald-500/22 hover:bg-white/[0.05] focus:border-emerald-400/45 focus:ring-2 focus:ring-emerald-500/25";
  const labelClasses = "mb-2 block text-[10px] font-bold tracking-[0.18em] uppercase text-white/26";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-white/[0.07] bg-black/35 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-emerald-500/24 hover:shadow-[0_20px_40px_-30px_rgba(16,185,129,0.55)]"
    >
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/24 transition-all hover:border-red-500/28 hover:bg-red-500/8 hover:text-red-400"
        >
          <X size={12} />
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClasses}>Tool</label>
          <select
            value={tool.toolId}
            onChange={(e) => onUpdate(index, { toolId: e.target.value as ToolId })}
            className={inputClasses}
          >
            {TOOL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-black text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Plan</label>
          <select
            value={tool.plan}
            onChange={(e) => onUpdate(index, { plan: e.target.value as AnyPlan })}
            className={inputClasses}
          >
            {plans.map((p) => (
              <option key={String(p.value)} value={p.value} className="bg-black text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Monthly spend</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/20">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={monthlySpendInput}
              onChange={(e) => {
                const nextValue = normalizeCurrencyDraft(e.target.value);
                setMonthlySpendInput(nextValue);

                if (!monthlySpendIsManual || nextValue === "") return;
                onUpdate(index, { monthlySpend: Number(nextValue) });
              }}
              onBlur={() => {
                if (!monthlySpendIsManual) return;

                if (monthlySpendInput === "") return;

                const normalized = Number(monthlySpendInput);
                if (Number.isNaN(normalized)) {
                  setMonthlySpendInput(String(tool.monthlySpend));
                  return;
                }

                const nextAmount = Math.max(0, normalized);
                setMonthlySpendInput(String(nextAmount));
                onUpdate(index, { monthlySpend: nextAmount });
              }}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              disabled={!monthlySpendIsManual}
              className={`${inputClasses} pl-7`}
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-[10px] text-white/35">
            {monthlySpendIsManual
              ? "Editable for custom/API usage plans"
              : "Auto-calculated from plan price × seats"}
          </p>
        </div>

        <div>
          <label className={labelClasses}>Seats</label>
          <input
            type="text"
            inputMode="numeric"
            value={seatsInput}
            onChange={(e) => {
              const nextValue = normalizeIntegerDraft(e.target.value);
              setSeatsInput(nextValue);

              if (nextValue === "") return;
              onUpdate(index, { seats: Math.max(1, Number(nextValue)) });
            }}
            onBlur={() => {
              if (seatsInput === "") return;

              const normalizedSeats = Math.max(1, Number(seatsInput));
              setSeatsInput(String(normalizedSeats));
              onUpdate(index, { seats: normalizedSeats });
            }}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
            className={inputClasses}
            placeholder="1"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] px-3 py-2">
        <div className="h-1 w-1 rounded-full bg-emerald-400/65" />
        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-emerald-300/55">
          {tool.seats} {tool.seats === 1 ? "seat" : "seats"} · {PLANS_BY_TOOL[tool.toolId]?.find((p) => p.value === tool.plan)?.label || tool.plan}
        </span>
      </div>
    </motion.div>
  );
}
