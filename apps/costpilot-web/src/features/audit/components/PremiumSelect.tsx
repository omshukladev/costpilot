import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
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
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    placement: "top" | "bottom";
    ready: boolean;
  } | null>(null);

  const selectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);
    return index >= 0 ? index : 0;
  }, [options, value]);

  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
    setIsMounted(true);
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

  const updateMenuPosition = () => {
    const triggerEl = triggerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 10;
    const availableWidth = window.innerWidth - viewportPadding * 2;
    const width = Math.min(Math.max(triggerRect.width, 248), Math.min(availableWidth, 416));
    const left = Math.min(
      Math.max(triggerRect.left, viewportPadding),
      Math.max(viewportPadding, window.innerWidth - width - viewportPadding)
    );

    const measuredHeight = menuEl.offsetHeight || 280;
    const spaceBelow = window.innerHeight - triggerRect.bottom - gap - viewportPadding;
    const spaceAbove = triggerRect.top - gap - viewportPadding;
    const shouldOpenTop = spaceBelow < measuredHeight && spaceAbove > spaceBelow;
    const placement: "top" | "bottom" = shouldOpenTop ? "top" : "bottom";
    const maxHeight = Math.max(160, Math.min(320, placement === "top" ? spaceAbove : spaceBelow));
    const top =
      placement === "top"
        ? Math.max(viewportPadding, triggerRect.top - maxHeight - gap)
        : Math.min(window.innerHeight - viewportPadding - maxHeight, triggerRect.bottom + gap);

    setMenuStyle({
      top,
      left,
      width,
      maxHeight,
      placement,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }

    setMenuStyle((current) =>
      current
        ? { ...current, ready: false }
        : {
            top: 0,
            left: 0,
            width: 0,
            maxHeight: 0,
            placement: "bottom",
            ready: false,
          }
    );

    const frame = window.requestAnimationFrame(() => {
      updateMenuPosition();
    });

    const handleResize = () => updateMenuPosition();
    const handleScroll = () => updateMenuPosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options.length, selectedIndex]);

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
    <div className="relative overflow-visible">
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

      {isMounted &&
        createPortal(
          <AnimatePresence initial={false} onExitComplete={() => setIsMounted(false)}>
            {open && (
              <motion.div
              ref={menuRef}
              role="listbox"
              aria-labelledby={triggerId}
              initial={{ opacity: 0, y: 6, scale: 0.985 }}
              animate={{ opacity: menuStyle?.ready ? 1 : 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onKeyDown={handleMenuKeyDown}
              style={{
                position: "fixed",
                top: menuStyle?.top ?? 0,
                left: menuStyle?.left ?? 0,
                width: menuStyle?.width ?? triggerRef.current?.getBoundingClientRect().width ?? "auto",
                maxHeight: menuStyle?.maxHeight ?? 320,
                zIndex: 100,
                visibility: menuStyle?.ready ? "visible" : "hidden",
              }}
              className={[
                "overflow-hidden rounded-2xl border border-white/[0.1] bg-black/90 p-2 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.92)] backdrop-blur-2xl",
                menuClassName,
              ].join(" ")}
            >
              <div style={{ maxHeight: "inherit" }} className="overflow-auto pr-0.5">
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
                        "flex h-11 w-full items-center justify-between gap-4 rounded-xl px-3 text-left transition-all duration-150 outline-none",
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
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
