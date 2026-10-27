import { X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  labelledBy?: string;
}

// ဖုန်းတွင် အောက်မှပေါ်သော bottom sheet / desktop (md+) တွင် center modal
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  headerAction,
  children,
  footer,
  labelledBy = "bottom-sheet-title",
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // parent re-render တိုင်း effect ပြန်မ run (focus မခိုး) စေရန် onClose ကို ref ဖြင့်ထား
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Esc ဖြင့်ပိတ် + body scroll lock + ဖွင့်ချိန် focus
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center font-ChivoMono">
      <div
        className="absolute inset-0 bg-black/40 motion-safe:animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="relative w-full md:max-w-lg bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] outline-none motion-safe:animate-sheet-up md:motion-safe:animate-sheet-pop"
      >
        {/* Drag handle (ဖုန်းသာ) */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-start gap-3 px-5 pt-2 md:pt-5 pb-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h2
              id={labelledBy}
              className="text-[15px] font-bold text-[#1A1A1A] leading-snug break-words"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction}
          <button
            onClick={onClose}
            aria-label="ပိတ်မယ်"
            className="shrink-0 -mr-2 w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#007FFF] outline-none transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="border-t border-gray-100 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
