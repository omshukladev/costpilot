import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface PremiumSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  meta?: string;
}

interface PremiumSelectProps<T extends string> {
  label: string;
  value: T;
  options: PremiumSelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
}

export function PremiumSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  triggerClassName = "",
  menuClassName = "",
}: PremiumSelectProps<T>) {
  const triggerId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);
    return index >= 0 ? index : 0;
  }, [options, value]);

  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const commitSelection = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(selectedIndex);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(0, current - 1));
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(options.length - 1, current + 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(0, current - 1));
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) commitSelection(option.value);
    }
  };

  return (
    <div className="relative">
      <span className="mb-2 block text-[10px] font-bold tracking-[0.18em] uppercase text-white/26">{label}</span>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        className={[
          "flex h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-left text-sm text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all duration-300 hover:border-emerald-500/24 hover:bg-white/[0.05] focus:border-emerald-400/45 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        ].join(" ")}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white/88">{selectedOption?.label || placeholder}</div>
        </div>
        <ChevronDown
          size={15}
          className={`shrink-0 text-white/28 transition-transform duration-300 ${open ? "rotate-180 text-emerald-300/80" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="listbox"
            aria-labelledby={triggerId}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={handleMenuKeyDown}
            className={[
              "absolute left-0 right-0 top-[calc(100%+0.55rem)] z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/85 p-2 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl",
              menuClassName,
            ].join(" ")}
          >
            <div className="max-h-72 overflow-auto pr-0.5">
              {options.map((option, index) => {
                const selected = option.value === value;
                const active = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commitSelection(option.value)}
                    className={[
                      "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition-all duration-200 outline-none",
                      selected ? "bg-emerald-500/[0.12] text-emerald-100" : "text-white/76 hover:bg-white/[0.05] hover:text-white/92",
                      active ? "ring-1 ring-emerald-400/28" : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{option.label}</div>
                      {option.description && <div className="mt-0.5 text-[11px] leading-relaxed text-white/32">{option.description}</div>}
                    </div>
                    {option.meta && <div className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/28">{option.meta}</div>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
