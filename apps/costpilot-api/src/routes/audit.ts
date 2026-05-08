import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AuditInput } from "@costpilot/shared";
import type { Env } from "../index";
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

const auditRoute = new Hono<{ Bindings: Env }>();

auditRoute.post("/", zValidator("json", auditInputSchema), async (c) => {
  try {
    const input = c.req.valid("json") as unknown as AuditInput;
    const result = await Audit.create(c.env.costpilot_db, input);
    return c.json(result);
  } catch (err) {
    console.error("Audit error:", err);
    return c.json({ error: "Failed to process audit" }, 500);
  }
});

export { auditRoute };
