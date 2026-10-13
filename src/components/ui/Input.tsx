
import { cn } from "@/lib/utils";
import { formControlClass, formControlInvalidClass } from "@/lib/formStyles";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <input
      className={cn(
        formControlClass,
        "flex",
        invalid && formControlInvalidClass,
        className,
      )}
      {...props}
    />
  );
}
