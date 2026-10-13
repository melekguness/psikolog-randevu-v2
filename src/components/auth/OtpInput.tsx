
import { cn } from "@/lib/utils";

type OtpInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  autoFocus?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
};

export function OtpInput({
  id,
  value,
  onChange,
  length = 6,
  invalid,
  autoFocus,
  ...a11y
}: OtpInputProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      enterKeyHint="done"
      maxLength={length}
      value={value}
      autoFocus={autoFocus}
      aria-invalid={a11y["aria-invalid"] ?? Boolean(invalid)}
      aria-label={a11y["aria-label"] ?? "SMS doğrulama kodu"}
      aria-describedby={a11y["aria-describedby"]}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
      placeholder={"•".repeat(length)}
      className={cn(
        "h-12 w-full rounded-xl border bg-[var(--color-surface)]/80 px-4 text-center font-mono text-2xl font-bold tracking-[0.55em] text-[var(--atakum-ink)] shadow-sm backdrop-blur-md transition-all duration-200 placeholder:tracking-[0.55em] placeholder:text-[var(--atakum-muted)]/50 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        invalid
          ? "border-rose-400"
          : "border-slate-200",
      )}
    />
  );
}
