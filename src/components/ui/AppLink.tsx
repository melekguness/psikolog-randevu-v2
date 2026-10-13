import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppLinkProps = Omit<RouterLinkProps, "to"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href?: string;
    to?: RouterLinkProps["to"];
    children?: ReactNode;
    className?: string;
  };

/** App link that accepts `href` or `to`. */
export const Link = forwardRef<HTMLAnchorElement, AppLinkProps>(
  function Link({ href, to, className, children, ...props }, ref) {
    const target = to ?? href ?? "/";
    const isExternal =
      typeof target === "string" &&
      (/^https?:\/\//i.test(target) || target.startsWith("mailto:") || target.startsWith("tel:"));

    if (isExternal && typeof target === "string") {
      return (
        <a
          ref={ref}
          href={target}
          className={cn(className)}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={target} className={cn(className)} {...props}>
        {children}
      </RouterLink>
    );
  },
);
