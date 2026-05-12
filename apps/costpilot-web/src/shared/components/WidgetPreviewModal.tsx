import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetId: string;
}

export function WidgetPreviewModal({ isOpen, onClose, widgetId }: WidgetPreviewModalProps) {
  const widgetUrl = `https://costpilot-costpilot-web.vercel.app/widget/${widgetId}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>

              {/* Header */}
              <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Sample Savings Widget</h3>
                <p className="text-sm text-white/40 mt-1">See how the embeddable widget looks on your website</p>
              </div>

              {/* Widget Container */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-white/[0.01]">
                <div className="p-6 sm:p-8">
                  {/* Widget Embed */}
                  <motion.iframe
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    src={widgetUrl}
                    className="w-full border border-white/5 rounded-lg bg-black"
                    style={{ minHeight: "500px" }}
                    title="CostPilot Savings Widget"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-white/5 bg-white/[0.02]">
                <p className="text-xs text-white/40">
                  Share this widget on your blog or website
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
