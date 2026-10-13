export const formControlClass =
  "box-border h-12 min-h-12 w-full min-w-0 max-w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 font-sans text-base text-[var(--color-text)] shadow-none transition-colors duration-200 ease-out placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]/50 focus:outline-none focus:shadow-[0_0_0_3px_rgb(var(--accent-glow)/0.22)] focus-visible:border-[var(--color-primary)]/50 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgb(var(--accent-glow)/0.22)] disabled:cursor-not-allowed disabled:opacity-50";

export const formControlInvalidClass =
  "border-[var(--color-error)] shadow-none focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(196,61,61,0.2)] focus-visible:border-[var(--color-error)] focus-visible:shadow-[0_0_0_3px_rgba(196,61,61,0.2)]";

export const formTextareaClass = `${formControlClass} min-h-[96px] resize-y`;
