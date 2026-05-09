import { apiClient } from "@/shared/services/api";
import type { AuditResult, AuditInput } from "@costpilot/shared";

export async function submitAudit(input: AuditInput): Promise<AuditResult> {
  const { data } = await apiClient.post<AuditResult>("/audit", input);
  return data;
}
