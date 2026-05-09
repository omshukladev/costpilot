import { useMutation } from "@tanstack/react-query";
import type { AuditInput } from "@costpilot/shared";
import { submitAudit } from "../api/audit.api";
import { useAuditStore } from "../store/audit.store";

export function useAudit() {
  const setResult = useAuditStore((s) => s.setResult);
  const setIsSubmitting = useAuditStore((s) => s.setIsSubmitting);

  return useMutation({
    mutationFn: (input: AuditInput) => {
      setIsSubmitting(true);
      return submitAudit(input);
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });
}
