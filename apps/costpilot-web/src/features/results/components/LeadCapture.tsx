import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { submitLead } from "../api/lead.api";

interface LeadCaptureProps {
  auditId: string;
  hasSavings: boolean;
}

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-white/15 focus:border-emerald-500/30 focus:bg-white/[0.04] focus:outline-none transition-all backdrop-blur-sm";

export function LeadCapture({ auditId, hasSavings }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await submitLead({
        email,
        companyName: companyName || undefined,
        role: role || undefined,
        auditId,
      });
      setSubmitted(true);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-500/[0.06] bg-emerald-500/[0.02] p-8 text-center backdrop-blur-sm"
      >
        <CheckCircle size={24} className="mx-auto mb-4 text-emerald-400/40" />
        <p className="text-sm font-bold text-white/60">Saved</p>
        <p className="mt-2 text-[12px] text-white/20 font-medium">
          {hasSavings
            ? "We'll notify you when new savings opportunities match your stack."
            : "We'll let you know when new optimizations are available."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.02]">
          <Mail size={14} className="text-emerald-400/30" />
        </div>
        <p className="text-sm font-bold text-white/50">
          {hasSavings
            ? "Want help capturing these savings?"
            : "Stay in the loop"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name (optional)"
            className={inputClasses}
          />
        </div>
        <div>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your role (optional)"
            className={inputClasses}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] py-3 text-[11px] font-bold uppercase tracking-widest text-white/30 transition-all hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save my report"
        )}
      </button>

      {error && (
        <p className="text-center text-[11px] text-red-400/40">{error}</p>
      )}

      <p className="text-center text-[10px] text-white/10 font-medium">
        No spam. Just relevant savings alerts.
      </p>
    </motion.form>
  );
}
