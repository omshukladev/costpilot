import { apiClient } from "@/shared/services/api";

export async function submitLead(data: {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}) {
  const { data: result } = await apiClient.post("/lead", data);
  return result;
}
