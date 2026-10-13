import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/types";
import type { HTMLAttributes } from "react";

const availabilityMap: Record<
  AvailabilityStatus,
  { label: string; symbol: string; className: string }
> = {
  available: {
    label: "Müsait",
    symbol: "●",
    className: "border-transparent bg-emerald-600 text-white",
  },
  limited: {
    label: "Sınırlı",
    symbol: "◐",
    className: "border-transparent bg-amber-600 text-white",
  },
  full: {
    label: "Dolu",
    symbol: "■",
    className: "border-transparent bg-sky-600 text-white",
  },
  leave: {
    label: "İzinli",
    symbol: "○",
    className: "border-transparent bg-slate-600 text-white",
  },
};

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export function AvailabilityBadge({
  status,
  className,
}: {
  status: AvailabilityStatus;
  className?: string;
}) {
  const meta = availabilityMap[status];
  return (
    <Badge
      className={cn("gap-1", meta.className, className)}
      title={meta.label}
    >
      <span aria-hidden className="text-[9px] leading-none text-white/90">
        {meta.symbol}
      </span>
      <span>{meta.label}</span>
    </Badge>
  );
}

export function availabilityLabel(status: AvailabilityStatus): string {
  return availabilityMap[status].label;
}
