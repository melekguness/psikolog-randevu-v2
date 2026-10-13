import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOME_FAQ } from "@/data/homeContent";
import {
  homeEyebrowClass,
  homeHeadingClass,
  homeSectionClass,
} from "@/components/home/homeUi";
import { cn } from "@/lib/utils";

export function HomeFAQ() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="sss"
      className={cn(homeSectionClass, "relative")}
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className={cn(homeEyebrowClass, "justify-center")}>
          Bilgilendirme
        </p>
        <h2
          id="faq-heading"
          className={cn(homeHeadingClass, "mt-3")}
        >
          Sıkça Sorulan Sorular
        </h2>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2.5 px-4 sm:px-6 md:mt-10 md:gap-3">
        {HOME_FAQ.map((item) => {
          const panelId = `${baseId}-${item.id}`;
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                "min-w-0 overflow-hidden rounded-xl border bg-[var(--color-surface)] shadow-sm",
                "transition-[border-color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                isOpen
                  ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]/30"
                  : "border-[var(--color-border)] hover:border-[var(--color-border)]",
              )}
            >
              <button
                type="button"
                id={`${panelId}-trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-[1.125rem] md:px-6",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2",
                  "transition-colors duration-200 ease-out motion-reduce:transition-none",
                  !isOpen && "hover:bg-[var(--surface-muted)]/50",
                )}
              >
                <span
                  className={cn(
                    "min-w-0 pt-0.5 font-sans text-[15px] font-semibold leading-snug tracking-tight break-words text-[var(--color-navy)] sm:text-base",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    "transition-colors duration-200 ease-out motion-reduce:transition-none",
                    isOpen
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--surface-muted)] text-[var(--color-text-muted)]",
                  )}
                  aria-hidden
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                    strokeWidth={2}
                  />
                </span>
              </button>

              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={`${panelId}-trigger`}
                  className="border-t border-[var(--accent)]/15"
                >
                  <p className="px-4 pb-5 pt-3 text-sm leading-7 tracking-normal text-[var(--color-text-secondary)] [overflow-wrap:break-word] sm:px-5 sm:pb-5 sm:pt-3.5 sm:text-[15px] sm:leading-8 md:px-6">
                    {item.answer}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
