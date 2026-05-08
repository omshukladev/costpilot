export type ToolId =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type CursorPlan = "hobby" | "pro" | "business" | "enterprise";
export type CopilotPlan = "individual" | "business" | "enterprise";
export type ClaudePlan = "free" | "pro" | "max" | "team" | "enterprise" | "api-direct";
export type ChatGPTPlan = "plus" | "team" | "enterprise" | "api-direct";
export type AnthropicApiPlan = "api-direct";
export type OpenAIApiPlan = "api-direct";
export type GeminiPlan = "pro" | "ultra" | "api";
export type WindsurfPlan = "free" | "pro" | "teams" | "enterprise";

export type AnyPlan =
  | CursorPlan
  | CopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | AnthropicApiPlan
  | OpenAIApiPlan
  | GeminiPlan
  | WindsurfPlan;

export interface ToolEntry {
  toolId: ToolId;
  plan: AnyPlan;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export type RecommendationType =
  | "downgrade"
  | "consolidation"
  | "alternative-tool"
  | "credit-optimization"
  | "already-optimal"
  | "plan-mismatch";

export interface Recommendation {
  type: RecommendationType;
  toolId: ToolId;
  currentPlan: AnyPlan;
  currentSpend: number;
  recommendedAction: string;
  reasoning: string;
  monthlySavings: number;
  yearlySavings: number;
}

export interface AuditResult {
  id: string;
  publicId: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  summary: string;
  createdAt: string;
}

export interface LeadInput {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}

export interface Lead {
  id: string;
  email: string;
  companyName: string | null;
  role: string | null;
  teamSize: number | null;
  auditId: string;
  createdAt: string;
}

export interface PublicReport {
  publicId: string;
  tools: ToolEntry[];
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  summary: string;
  createdAt: string;
}
