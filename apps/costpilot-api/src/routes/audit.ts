import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as Audit from "../controllers/audit";

const auditInputSchema = z.object({
  tools: z
    .array(
      z.object({
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
        plan: z.string().min(1),
        monthlySpend: z.number().min(0),
        seats: z.number().min(1),
      })
    )
    .min(1),
  teamSize: z.number().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

const auditRoute = new Hono();

auditRoute.post("/", zValidator("json", auditInputSchema), Audit.create);

export { auditRoute };
