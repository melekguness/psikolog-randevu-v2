import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200",
        className,
      )}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "status" : undefined}
    />
  );
}

export function SkeletonLines({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} role="status" aria-label="Yükleniyor">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          className={i === count - 1 ? "h-11 w-2/3" : "h-11 w-full"}
        />
      ))}
    </div>
  );
}
