import { apiClient } from "@/shared/services/api";
import type { PublicReport } from "@costpilot/shared";

export async function fetchReport(publicId: string): Promise<PublicReport> {
  const { data } = await apiClient.get<PublicReport>(`/report/${publicId}`);
  return data;
}
