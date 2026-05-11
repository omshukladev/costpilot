import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useReport } from "../hooks/useReport";
import { EmbedWidget } from "../components/EmbedWidget";

export function WidgetPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const { data, isLoading, isError } = useReport(publicId || "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            className="h-full rounded-full bg-emerald-500/35"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6">
        <p className="text-4xl font-bold tracking-tighter text-white/24">Widget not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/34 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft size={14} />
          Back to CostPilot
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.07),transparent_46%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <Link
              to={`/report/${data.publicId}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/28 transition-colors hover:text-emerald-300/80"
            >
              <ArrowLeft size={12} />
              Full report
            </Link>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
              Public widget
            </span>
          </div>

          <EmbedWidget report={data} />

          <p className="px-1 text-[11px] text-white/28">
            This widget is public-safe and can be embedded or shared directly.
          </p>
        </div>
      </div>
    </div>
  );
}
