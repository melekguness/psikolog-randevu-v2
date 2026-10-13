
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "font-sans text-sm font-semibold leading-snug text-[var(--atakum-ink)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
