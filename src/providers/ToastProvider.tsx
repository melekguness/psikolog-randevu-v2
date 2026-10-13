import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  kind: ToastKind;
};

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3000;
const EXIT_MS = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null);
  const [visible, setVisible] = useState(false);
  const autoTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current != null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (exitTimerRef.current != null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const clearToasts = useCallback(() => {
    clearTimers();
    setVisible(false);
    setItem(null);
  }, [clearTimers]);

  const dismiss = useCallback(() => {
    clearTimers();
    setVisible(false);
    exitTimerRef.current = window.setTimeout(() => {
      setItem(null);
      exitTimerRef.current = null;
    }, EXIT_MS);
  }, [clearTimers]);

  const toast = useCallback(
    (message: string, kind: ToastKind = "info") => {
      clearTimers();
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      // Replace any lingering toast — never stack.
      setItem({ id, message, kind });
      setVisible(false);
      window.requestAnimationFrame(() => {
        setVisible(true);
      });
      autoTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        exitTimerRef.current = window.setTimeout(() => {
          setItem(null);
          exitTimerRef.current = null;
        }, EXIT_MS);
        autoTimerRef.current = null;
      }, AUTO_DISMISS_MS);
    },
    [clearTimers],
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  const value = useMemo(
    () => ({ toast, clearToasts }),
    [toast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] no-print sm:inset-x-auto sm:right-6 sm:justify-end sm:px-0"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {item ? (
          <div
            key={item.id}
            role={item.kind === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex w-full max-w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg",
              "transition-all duration-200 ease-out motion-reduce:transition-none",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0",
              item.kind === "error" &&
                "border-[#C43D3D]/35 bg-[#FDF6F6] text-[#C43D3D]",
              item.kind === "success" &&
                "border-[#198B68]/30 bg-[#E8F7F1] text-[#198B68]",
              item.kind === "info" &&
                "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-navy)]",
            )}
          >
            <p className="min-w-0 flex-1 leading-snug">{item.message}</p>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              aria-label="Bildirimi kapat"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ToastProvider içinde kullanılmalı");
  return ctx;
}
