import { Link } from "@/components/ui/AppLink";
import { usePathname } from "@/lib/router";
import { useEffect, useId, useRef, useState } from "react";
import { Lock, Menu, Moon, Sun, X } from "lucide-react";
import { AtakumLogo } from "@/components/brand/AtakumLogo";
import { useAccessibility } from "@/providers/AccessibilityProvider";
import { APP_ROUTES, NAV_LINKS, municipality } from "@/data/municipality";
import { cn } from "@/lib/utils";

const iconBtn =
  "ui-press ui-press-muted inline-flex h-10 w-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-navy)] transition-colors duration-150 ease-out hover:bg-[var(--accent-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2 motion-reduce:transition-none";

const headerCta =
  "ui-press ui-press-accent inline-flex h-11 min-h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-[14px] leading-none font-semibold tracking-[0.01em] whitespace-nowrap text-white shadow-[0_1px_2px_rgb(15_23_42/0.06),0_3px_10px_-4px_rgb(74_107_93/0.28)] transition-[color,background-color,box-shadow] duration-150 ease-out hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] motion-reduce:transition-none";

const navLinkBase =
  "inline-flex min-h-10 items-center rounded-lg px-3 text-[15px] transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2 motion-reduce:transition-none";

function scrollToHash(id: string) {
  const node = document.getElementById(id);
  if (!node) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function isActivePath(pathname: string, href: string, hash: string) {
  const [pathPart, id] = href.split("#");
  const path = pathPart || "/";
  if (id) return pathname === path && hash === `#${id}`;
  if (path === "/") return pathname === "/" && !hash;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const { fontScale, cycleFont, appearance, toggleAppearance } =
    useAccessibility();

  const closeMenu = () => setOpen(false);
  const [hash, setHash] = useState("");
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  const doctorActive =
    pathname === APP_ROUTES.doctor || pathname.startsWith(`${APP_ROUTES.doctor}/`);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    const scrollFromUrl = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      window.setTimeout(() => scrollToHash(id), 60);
    };
    scrollFromUrl();
    window.addEventListener("hashchange", scrollFromUrl);
    return () => window.removeEventListener("hashchange", scrollFromUrl);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = NAV_LINKS.map((link) => link.href.split("#")[1]).filter(
      (id): id is string => Boolean(id),
    );
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id) setHash(`#${id}`);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = menuPanelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        menuBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables?.length) return;
      const list = [...focusables];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuBtnRef.current?.contains(target)) return;
      if (menuPanelRef.current?.contains(target)) return;
      closeMenu();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer, { passive: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  const utilityControls = (
    <>
      <button
        type="button"
        onClick={cycleFont}
        className={iconBtn}
        title="Metin boyutunu değiştir"
        aria-label={
          fontScale === "normal"
            ? "Metin boyutunu büyüt"
            : fontScale === "large"
              ? "Metin boyutunu daha büyüt"
              : "Metin boyutunu varsayılana döndür"
        }
      >
        <span
          className={cn(
            "leading-none font-semibold text-[var(--color-navy)]",
            fontScale === "xlarge"
              ? "text-[18px]"
              : fontScale === "large"
                ? "text-[17px]"
                : "text-[16px]",
          )}
          aria-hidden
        >
          A
        </span>
      </button>
      <button
        type="button"
        onClick={toggleAppearance}
        className={iconBtn}
        title={appearance === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
        aria-label={
          appearance === "dark" ? "Açık temaya geç" : "Koyu temaya geç"
        }
      >
        {appearance === "dark" ? (
          <Sun className="h-4 w-4" strokeWidth={1.9} aria-hidden />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
        )}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md pt-safe">
      <div className="shell-pad-x mx-auto flex h-16 max-w-[85rem] min-w-0 items-center justify-between gap-4 lg:h-[72px]">
        <Link
          href={APP_ROUTES.home}
          className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2"
          onClick={closeMenu}
          aria-label={`${municipality.shortName} ana sayfa`}
        >
          <span className="shrink-0">
            <AtakumLogo size={44} priority />
          </span>
          <span className="min-w-0 max-w-[11rem] sm:max-w-none">
            <span className="block truncate text-[14px] leading-snug font-semibold tracking-tight text-[var(--color-navy)] sm:text-[15px] lg:text-[16px]">
              T.C. Atakum Belediyesi
            </span>
            <span className="mt-1 block truncate text-[12px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[13px]">
              Sağlık Portalı
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Ana menü"
        >
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href, hash);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  const id = link.href.split("#")[1];
                  if (id) {
                    setHash(`#${id}`);
                    window.setTimeout(() => scrollToHash(id), 80);
                  }
                }}
                className={cn(
                  navLinkBase,
                  active
                    ? "bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
                    : "font-medium text-[var(--color-navy)] hover:bg-[var(--accent-soft)]/70",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1 md:flex">{utilityControls}</div>

          <Link
            href={APP_ROUTES.doctor}
            aria-label="Uzman girişi"
            onClick={closeMenu}
            className={cn(
              "hidden min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2 xl:inline-flex",
              doctorActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--accent-soft)]/60 hover:text-[var(--color-navy)]",
            )}
          >
            <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            Uzman
          </Link>

          <Link
            href={APP_ROUTES.booking}
            aria-label="Randevu al"
            onClick={closeMenu}
            className={cn(headerCta, "hidden sm:inline-flex")}
          >
            Randevu Al
          </Link>

          <button
            ref={menuBtnRef}
            type="button"
            className={cn(iconBtn, "lg:hidden")}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.9} aria-hidden />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.9} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-40 bg-[#0F172A]/30 lg:hidden"
            onClick={closeMenu}
          />
          <div
            ref={menuPanelRef}
            id={menuId}
            className="animate-panel-enter absolute inset-x-3 top-[calc(100%-1px)] z-50 max-h-[min(24rem,75dvh)] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_12px_40px_rgba(15,23,42,0.14)] sm:inset-x-auto sm:right-4 sm:left-auto sm:w-[min(20rem,calc(100vw-1.5rem))] lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobil menü">
              {NAV_LINKS.map((link) => {
                const active = isActivePath(pathname, link.href, hash);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      closeMenu();
                      const id = link.href.split("#")[1];
                      if (id) {
                        setHash(`#${id}`);
                        window.setTimeout(() => scrollToHash(id), 80);
                      }
                    }}
                    className={cn(
                      "inline-flex h-11 min-h-11 items-center rounded-xl px-3.5 text-[15px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35",
                      active
                        ? "bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
                        : "font-medium text-[var(--color-navy)] hover:bg-[var(--accent-soft)]/70",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href={APP_ROUTES.booking}
                aria-label="Randevu al"
                onClick={closeMenu}
                className={cn(headerCta, "mt-2 w-full")}
              >
                Randevu Al
              </Link>

              <Link
                href={APP_ROUTES.doctor}
                aria-label="Uzman girişi"
                onClick={closeMenu}
                className={cn(
                  "mt-2 inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35",
                  doctorActive
                    ? "border-[var(--color-primary)]/35 bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--color-navy)]",
                )}
              >
                <Lock className="h-3.5 w-3.5 opacity-70" aria-hidden />
                Uzman Girişi
              </Link>

              <div className="mt-3 flex items-center justify-center gap-2 border-t border-[var(--color-border)] pt-3 md:hidden">
                {utilityControls}
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
