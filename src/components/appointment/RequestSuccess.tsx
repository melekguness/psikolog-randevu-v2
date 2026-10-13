import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@/components/ui/AppLink";
import { CheckCircle2, Copy, Download } from "lucide-react";
import { SpecialistAvatar } from "@/components/brand/SpecialistAvatar";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/data/municipality";
import {
  downloadAppointmentCardPng,
  printAppointmentCard,
} from "@/lib/appointmentCardExport";
import { useToast } from "@/providers/ToastProvider";
import { formatTurkishDate, cn } from "@/lib/utils";
import { obscureTrMobile } from "@/lib/phone";
import { DEPARTMENT_LABELS, type DepartmentId } from "@/types";

export function RequestSuccess({
  appointmentId,
  department,
  specialistName,
  date,
  startTime,
  endTime,
  phone,
  fullName,
  email,
}: {
  appointmentId: string;
  department: DepartmentId;
  specialistName: string;
  date: string;
  startTime: string;
  endTime: string;
  phone: string;
  fullName?: string;
  email?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    panel.focus({ preventScroll: true });
  }, []);

  const card = {
    appointmentId,
    department,
    specialistName,
    date,
    startTime,
    endTime,
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(appointmentId);
      toast("Randevu kodu kopyalandı.", "success");
    } catch {
      toast("Kod kopyalanamadı.", "error");
    }
  };

  const savePng = () => {
    setSaving(true);
    const saved = downloadAppointmentCardPng(card);
    setSaving(false);
    setMenuOpen(false);
    if (!saved) {
      toast("Görsel kaydedilemedi. Yazdır seçeneğini deneyin.", "error");
      return;
    }
    toast("Randevu özeti kaydedildi.", "success");
  };

  const savePrint = () => {
    setMenuOpen(false);
    printAppointmentCard();
  };

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className="scroll-mt-28 space-y-6 text-center animate-panel-enter focus:outline-none"
      aria-live="polite"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)]">
        <CheckCircle2 className="h-9 w-9" aria-hidden />
      </div>
      <div className="space-y-2.5">
        <h2 className="font-sans text-2xl font-bold leading-snug text-[var(--color-navy)] md:text-[28px]">
          Randevunuz alındı
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
          Randevu bilgileriniz başarıyla kaydedildi. İletişim için{" "}
          <span className="font-semibold text-[var(--color-navy)]">
            {obscureTrMobile(phone)}
          </span>{" "}
          numarası kaydedildi.
        </p>
      </div>

      <article
        id="randevu-onay-karti"
        aria-label="Randevu onay kartı"
        className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left shadow-[0_4px_16px_rgba(15,23,42,0.05)]"
      >
        <div
          className={cn(
            "px-6 py-5 text-white",
            department === "psychologist"
              ? "bg-gradient-to-r from-[#162536] to-[#1E293B]"
              : "bg-gradient-to-r from-[#234E38] to-[#4A6B5D]",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
            Randevu onay kartı
          </p>
          <p className="mt-2.5 font-sans text-xl font-bold leading-snug">
            {DEPARTMENT_LABELS[department]} görüşmesi
          </p>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Randevu kodu
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="break-all font-mono text-xl font-bold text-[var(--accent)] sm:text-2xl">
                {appointmentId}
              </p>
              <button
                type="button"
                onClick={() => void copyCode()}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 text-sm font-semibold text-[var(--color-navy)] transition-colors hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35"
                aria-label="Randevu kodunu kopyala"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Kopyala
              </button>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-[var(--color-background)] p-4">
              <SpecialistAvatar
                department={department}
                fullName={specialistName}
                size="sm"
                title={`${specialistName} avatarı`}
              />
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uzman
                </dt>
                <dd className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-navy)]">
                  {specialistName}
                </dd>
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-background)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tarih
              </dt>
              <dd className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-navy)]">
                {formatTurkishDate(date)}
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--color-background)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Saat
              </dt>
              <dd className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-navy)]">
                {startTime} – {endTime}
              </dd>
            </div>
            {fullName ? (
              <div className="rounded-xl bg-[var(--color-background)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ad Soyad
                </dt>
                <dd className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-navy)]">
                  {fullName}
                </dd>
              </div>
            ) : null}
            <div className="rounded-xl bg-[var(--color-background)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Telefon
              </dt>
              <dd className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-navy)]">
                {obscureTrMobile(phone)}
              </dd>
            </div>
            {email ? (
              <div className="rounded-xl bg-[var(--color-background)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  E-posta
                </dt>
                <dd className="mt-1.5 break-all text-base font-semibold leading-snug text-[var(--color-navy)]">
                  {email}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </article>

      <div className="relative mx-auto grid max-w-md gap-3 no-print">
        <div className="relative">
          <Button
            type="button"
            className="h-12 w-full"
            loading={saving}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Randevu özetini kaydet"
          >
            <Download className="h-4 w-4" aria-hidden />
            Randevu özetini kaydet
          </Button>
          {menuOpen ? (
            <div
              role="menu"
              className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
            >
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-3 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-background)] focus:outline-none focus-visible:bg-[var(--color-background)]"
                onClick={savePng}
              >
                Görsel olarak indir (PNG)
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-3 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-background)] focus:outline-none focus-visible:bg-[var(--color-background)]"
                onClick={savePrint}
              >
                PDF olarak indir / Yazdır
              </button>
            </div>
          ) : null}
        </div>
        <Button asChild variant="secondary" className="h-12 w-full">
          <Link href={APP_ROUTES.home}>Ana sayfaya dön</Link>
        </Button>
      </div>
    </div>
  );
}
