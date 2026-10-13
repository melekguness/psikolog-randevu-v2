export const SAGE = "#4A6B5D";
export const SLATE = "#1E293B";
export const NAVY = "#0F172A";
export const GOLD = "#B08D57";

/**
 * Horizontal inset matching Header / main / Footer.
 * Prefer `.shell-pad-x` in CSS when safe-area must survive breakpoints.
 */
export const shellPadXClass = "shell-pad-x";

/** Major landing sections — shared vertical rhythm (tighter, content-led). */
export const homeSectionClass =
  "w-full min-w-0 max-w-full scroll-mt-28 overflow-x-clip overflow-y-visible py-12 font-sans md:py-16";

export const homeSectionInnerClass = "mx-auto w-full min-w-0 max-w-7xl";

export const homeEyebrowClass =
  "inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium tracking-[0.12em] text-[var(--accent)] uppercase";

export const homeHeadingClass =
  "mt-3 break-words font-sans text-2xl font-semibold tracking-tight text-[var(--color-navy)] sm:text-3xl md:text-[2rem] md:leading-tight";

export const homeLeadClass =
  "mt-3 max-w-2xl text-[15px] leading-7 tracking-normal text-[var(--color-text-secondary)] [overflow-wrap:break-word] [word-spacing:0.04em] sm:text-base sm:leading-8";

export const homeCardClass =
  "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all duration-200 ease-out hover:shadow-md";

export const homeIconWellClass =
  "inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]";

export const homeInteractiveClass =
  "transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none";

export const homePrimaryBtnClass =
  "inline-flex h-12 min-h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:bg-[var(--accent-hover)] hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] motion-reduce:transform-none";

export const homeGhostBtnClass =
  "inline-flex h-12 min-h-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-semibold text-[var(--color-navy)] shadow-sm transition-all duration-200 ease-out hover:border-[var(--color-border)] hover:bg-[var(--surface-muted)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] motion-reduce:transform-none";

export const homeSlateBtnClass =
  "inline-flex h-12 min-h-12 items-center justify-center rounded-xl bg-[var(--color-navy)] px-5 text-sm font-semibold text-[var(--color-surface)] shadow-sm transition-all duration-200 ease-out hover:opacity-90 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] motion-reduce:transform-none";

/** Full-bleed plane inside the constrained main column (clip ancestors required). */
export const homeBleedClass =
  "pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[100vw] max-w-[100vw] -translate-x-1/2";

/** Legal / secondary pages inside the main column. */
export const pageContentClass =
  "mx-auto min-w-0 max-w-3xl overflow-x-clip py-10 md:py-14";

/** Readable prose width */
export const textMeasureClass = "mx-auto max-w-[42rem]";
