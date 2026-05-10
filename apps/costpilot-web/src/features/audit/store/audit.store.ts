import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ToolId, UseCase, AuditResult } from "@costpilot/shared";
import type { FormToolEntry } from "../types/audit.types";
import { PLANS_BY_TOOL, getPlanUnitPrice } from "../types/audit.types";

function emptyTool(): FormToolEntry {
  return {
    toolId: "cursor",
    plan: "pro",
    monthlySpend: 20,
    seats: 1,
  };
}

interface AuditStore {
  tools: FormToolEntry[];
  teamSize: number;
  useCase: UseCase;
  result: AuditResult | null;
  isSubmitting: boolean;

  addTool: () => void;
  removeTool: (index: number) => void;
  updateTool: (index: number, data: Partial<FormToolEntry>) => void;
  setTeamSize: (size: number) => void;
  setUseCase: (useCase: UseCase) => void;
  setResult: (result: AuditResult) => void;
  setIsSubmitting: (v: boolean) => void;
  reset: () => void;
}

const initialState = {
  tools: [emptyTool()],
  teamSize: 3,
  useCase: "coding" as UseCase,
  result: null,
  isSubmitting: false,
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      ...initialState,

      addTool: () =>
        set((s) => ({ tools: [...s.tools, emptyTool()] })),

      removeTool: (index) =>
        set((s) => ({
          tools: s.tools.length > 1 ? s.tools.filter((_, i) => i !== index) : s.tools,
        })),

      updateTool: (index, data) =>
        set((s) => {
          const tools = [...s.tools];
          const previous = tools[index];
          const updated = { ...previous, ...data };

          if (data.toolId && data.toolId !== previous.toolId) {
            const plans = PLANS_BY_TOOL[data.toolId as ToolId];
            if (plans && plans.length > 0) {
              updated.plan = plans[0].value;
            }
          }

          if (typeof updated.seats !== "number" || Number.isNaN(updated.seats)) {
            updated.seats = 1;
          }
          updated.seats = Math.max(1, Math.trunc(updated.seats));

          if (typeof updated.monthlySpend !== "number" || Number.isNaN(updated.monthlySpend)) {
            updated.monthlySpend = 0;
          }
          updated.monthlySpend = Math.max(0, updated.monthlySpend);

          const unitPrice = getPlanUnitPrice(updated.toolId, updated.plan);
          if (unitPrice !== null) {
            updated.monthlySpend = Number((unitPrice * updated.seats).toFixed(2));
          }

          tools[index] = updated;
          return { tools };
        }),

      setTeamSize: (teamSize) => set({ teamSize }),
      setUseCase: (useCase) => set({ useCase }),
      setResult: (result) => set({ result, isSubmitting: false }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      reset: () => set({ ...initialState, tools: [emptyTool()] }),
    }),
    {
      name: "costpilot-audit-form",
      partialize: (state) => ({
        tools: state.tools,
        teamSize: state.teamSize,
        useCase: state.useCase,
        result: state.result,
      }),
    }
  )
);
