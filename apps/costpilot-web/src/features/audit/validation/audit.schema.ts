import { z } from "zod";

export const toolEntrySchema = z.object({
  toolId: z.enum([
    "cursor",
    "copilot",
    "claude",
    "chatgpt",
    "anthropic-api",
    "openai-api",
    "gemini",
    "windsurf",
  ]),
  plan: z.string().min(1, "Plan is required"),
  monthlySpend: z.number().min(0, "Must be 0 or more"),
  seats: z.number().min(1, "Must be at least 1"),
});

export const auditSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
  teamSize: z.number().min(1, "Must be at least 1"),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

export type AuditFormValues = z.infer<typeof auditSchema>;
