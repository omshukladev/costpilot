import { useQuery } from "@tanstack/react-query";
import { fetchReport } from "../api/report.api";

export function useReport(publicId: string) {
  return useQuery({
    queryKey: ["report", publicId],
    queryFn: () => fetchReport(publicId),
    enabled: !!publicId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
