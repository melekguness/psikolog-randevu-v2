
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "ui-press inline-flex max-w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-semibold shadow-sm transition-[color,background-color,box-shadow,filter] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-0 px-4 hover:shadow-md motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary: "ui-press-accent bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        secondary:
          "ui-press-muted bg-[var(--surface)] text-[var(--atakum-ink)] border border-[var(--border)]",
        outline:
          "ui-press-muted border border-[var(--accent)] text-[var(--accent)] bg-transparent",
        ghost:
          "ui-press-muted rounded-xl text-[var(--atakum-ink)] shadow-none hover:bg-[var(--surface-muted)] hover:shadow-none",
        danger: "ui-press-accent bg-[var(--color-error)] text-white hover:bg-red-800",
        soft: "ui-press-muted bg-[var(--surface)] text-[var(--atakum-ink)] border border-[var(--border)]",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-11 px-4 text-sm",
        lg: "h-12 px-8",
        icon: "h-11 w-11 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span>Lütfen bekleyiniz</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
