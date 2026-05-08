import { nanoid } from "nanoid";
import type { AuditInput } from "@costpilot/shared";
import { runAudit } from "./audit-engine";
import { generateSummary } from "./summary";
import { insertAudit } from "../db/queries";

export async function create(c: any) {
  try {
    const input = c.req.valid("json") as AuditInput;
    const result = runAudit(input);

    const id = nanoid();
    const publicId = nanoid(12);

    const summary = await generateSummary(
      c.env.GEMINI_API_KEY,
      input,
      result.recommendations,
      result.totalMonthlySavings,
      result.totalYearlySavings
    );

    await insertAudit(c.env.costpilot_db, {
      id,
      publicId,
      input,
      recommendations: result.recommendations,
      monthlySavings: result.totalMonthlySavings,
      yearlySavings: result.totalYearlySavings,
      summary,
      createdAt: result.createdAt,
    });

    return c.json({
      id,
      publicId,
      input,
      recommendations: result.recommendations,
      totalMonthlySavings: result.totalMonthlySavings,
      totalYearlySavings: result.totalYearlySavings,
      summary,
      createdAt: result.createdAt,
    });
  } catch (err) {
    console.error("Audit error:", err);
    return c.json({ error: "Failed to process audit" }, 500);
  }
}
