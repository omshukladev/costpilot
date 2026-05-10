import type { ToolId, UseCase, AnyPlan } from "@costpilot/shared";

export interface FormToolEntry {
  toolId: ToolId;
  plan: AnyPlan;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: FormToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

const PLAN_UNIT_PRICE: Partial<Record<ToolId, Partial<Record<AnyPlan, number>>>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
  },
  copilot: {
    individual: 10,
    business: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
  },
  chatgpt: {
    plus: 20,
    team: 30,
  },
  gemini: {
    pro: 19.99,
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 35,
  },
};

export function getPlanUnitPrice(toolId: ToolId, plan: AnyPlan): number | null {
  const value = PLAN_UNIT_PRICE[toolId]?.[plan];
  return typeof value === "number" ? value : null;
}

export function isManualSpendPlan(toolId: ToolId, plan: AnyPlan): boolean {
  return getPlanUnitPrice(toolId, plan) === null;
}

export const PLANS_BY_TOOL: Record<ToolId, { value: AnyPlan; label: string }[]> = {
  cursor: [
    { value: "hobby", label: "Hobby — Free" },
    { value: "pro", label: "Pro — $20/user/mo" },
    { value: "business", label: "Business — $40/user/mo" },
    { value: "enterprise", label: "Enterprise — Custom" },
  ],
  copilot: [
    { value: "individual", label: "Individual — $10/user/mo" },
    { value: "business", label: "Business — $39/user/mo" },
    { value: "enterprise", label: "Enterprise — Custom" },
  ],
  claude: [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro — $20/user/mo" },
    { value: "max", label: "Max — $100/user/mo" },
    { value: "team", label: "Team — $30/user/mo" },
    { value: "enterprise", label: "Enterprise — Custom" },
    { value: "api-direct", label: "API Direct — Usage-based" },
  ],
  chatgpt: [
    { value: "plus", label: "Plus — $20/user/mo" },
    { value: "team", label: "Team — $30/user/mo" },
    { value: "enterprise", label: "Enterprise — Custom" },
    { value: "api-direct", label: "API Direct — Usage-based" },
  ],
  "anthropic-api": [
    { value: "api-direct", label: "API Direct — Usage-based" },
  ],
  "openai-api": [
    { value: "api-direct", label: "API Direct — Usage-based" },
  ],
  gemini: [
    { value: "pro", label: "Pro — $19.99/user/mo" },
    { value: "ultra", label: "Ultra — Custom" },
    { value: "api", label: "API — Usage-based" },
  ],
  windsurf: [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro — $15/user/mo" },
    { value: "teams", label: "Teams — $35/user/mo" },
    { value: "enterprise", label: "Enterprise — Custom" },
  ],
};

export const TOOL_OPTIONS: { value: ToolId; label: string }[] = [
  { value: "cursor", label: "Cursor" },
  { value: "copilot", label: "GitHub Copilot" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "anthropic-api", label: "Anthropic API" },
  { value: "openai-api", label: "OpenAI API" },
  { value: "gemini", label: "Gemini" },
  { value: "windsurf", label: "Windsurf" },
];

export const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / Multiple" },
];
