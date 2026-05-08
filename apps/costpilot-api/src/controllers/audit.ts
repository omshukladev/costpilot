import { nanoid } from "nanoid";
import type { AuditInput } from "@costpilot/shared";
import { runAudit } from "./audit-engine";
import { insertAudit } from "../db/queries";

interface AuditResult {
  id: string;
  publicId: string;
  input: AuditInput;
  recommendations: unknown[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  summary: string;
  createdAt: string;
}

export async function create(
  db: D1Database,
  input: AuditInput
): Promise<AuditResult> {
  const result = runAudit(input);

  const id = nanoid();
  const publicId = nanoid(12);

  await insertAudit(db, {
    id,
    publicId,
    input,
    recommendations: result.recommendations,
    monthlySavings: result.totalMonthlySavings,
    yearlySavings: result.totalYearlySavings,
    summary: "",
    createdAt: result.createdAt,
  });

  return {
    id,
    publicId,
    input,
    recommendations: result.recommendations,
    totalMonthlySavings: result.totalMonthlySavings,
    totalYearlySavings: result.totalYearlySavings,
    summary: "",
    createdAt: result.createdAt,
  };
}
