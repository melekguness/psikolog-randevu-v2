import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { OtpInput } from "@/components/auth/OtpInput";
import { DemoAssistPanel } from "@/components/ui/DemoAssistPanel";
import {
  DEMO_CITIZEN,
  DEMO_SMS_CODE,
  isDemoMode,
} from "@/data/demoCredentials";
import { ApiError } from "@/lib/api";
import {
  toCitizenPhone,
  validatePhone,
  validateSmsCode,
} from "@/lib/bookingValidation";
import { maskTrMobile, obscureTrMobile } from "@/lib/phone";
import { formControlClass } from "@/lib/formStyles";
import { cn, formatTurkishDateMedium } from "@/lib/utils";
import { smsService } from "@/services/smsService";
import { dietitianService } from "@/services/dietitianService";
import { psychologistService } from "@/services/psychologistService";
import {
  DEPARTMENT_LABELS,
  type AppointmentBase,
  type AppointmentStatus,
} from "@/types";
import { useToast } from "@/providers/ToastProvider";

const showDevHelpers = import.meta.env.DEV && isDemoMode;

const STATUS_TR: Record<AppointmentStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  completed: "Tamamlandı",
  cancelled: "İptal edildi",
  no_show: "Gelmedi",
};

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-900",
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-900",
  completed:
    "border-[var(--color-border)] bg-[var(--surface-muted)] text-[var(--color-navy)]",
  cancelled:
    "border-rose-200 bg-rose-50 text-rose-800",
  no_show:
    "border-[var(--color-border)] bg-[var(--surface-muted)] text-[var(--color-text-muted)]",
};

function isCancellable(status: AppointmentStatus): boolean {
  return status === "pending" || status === "confirmed";
}

async function loadCitizenAppointments(
  phoneRaw: string,
): Promise<AppointmentBase[]> {
  const [diet, psych] = await Promise.all([
    dietitianService.listAppointmentsForCitizen(phoneRaw),
    psychologistService.listAppointmentsForCitizen(phoneRaw),
  ]);
  return [...diet, ...psych].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  );
}

/** Hesap olmadan randevu sorgulama: telefon + SMS doğrulaması. */
export function MyAppointmentsPage() {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<AppointmentBase[]>([]);
  const [cancelTarget, setCancelTarget] = useState<AppointmentBase | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);

  const send = async () => {
    const err = validatePhone(phone);
    if (err) {
      toast(err, "error");
      return;
    }
    setBusy(true);
    try {
      const result = await smsService.sendCode(toCitizenPhone(phone));
      setSent(true);
      toast(
        showDevHelpers && result.demoCode
          ? `Örnek doğrulama kodu: ${result.demoCode}`
          : result.message,
        "success",
      );
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Kod gönderilemedi.", "error");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    const err = validateSmsCode(code);
    if (err) {
      toast(err, "error");
      return;
    }
    setBusy(true);
    try {
      const result = await smsService.verifyCode(toCitizenPhone(phone), code);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      const raw = toCitizenPhone(phone);
      const merged = await loadCitizenAppointments(raw);
      setItems(merged);
      setVerified(true);
      toast(
        merged.length > 0
          ? "Randevular yüklendi."
          : "Bu numaraya ait randevu bulunamadı.",
        merged.length > 0 ? "success" : "info",
      );
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Doğrulama başarısız.", "error");
    } finally {
      setBusy(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const raw = toCitizenPhone(phone);
    setCancelling(true);
    try {
      if (cancelTarget.department === "dietitian") {
        await dietitianService.cancelAppointment(cancelTarget.id, raw);
      } else {
        await psychologistService.cancelAppointment(cancelTarget.id, raw);
      }
      const refreshed = await loadCitizenAppointments(raw);
      setItems(refreshed);
      setCancelTarget(null);
      toast("Randevunuz iptal edildi.", "success");
    } catch (e) {
      toast(
        e instanceof ApiError
          ? e.message
          : "Randevu iptal edilemedi. Lütfen daha sonra tekrar deneyin.",
        "error",
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-x-clip py-8 font-sans md:py-10">
      <header className="text-center">
        <p className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[12px] font-semibold tracking-[0.12em] text-[var(--accent)] uppercase">
          Randevu sorgula
        </p>
        <h1 className="mt-4 font-sans text-[32px] font-bold leading-snug tracking-[-0.02em] text-[var(--color-navy)] md:text-[36px]">
          Randevularımı Gör
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Hesap oluşturmadan, telefon numarası ve SMS doğrulaması ile
          randevularınızı görüntüleyin.
        </p>
      </header>

      <div className="mt-8 space-y-5 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)] sm:p-8">
        {!verified ? (
          <>
            {showDevHelpers ? (
              <DemoAssistPanel
                hint="Yalnızca geliştirme ortamı — örnek vatandaş hesabı ve doğrulama kodu."
                fillLabel={
                  sent
                    ? "Örnek doğrulama kodunu doldur"
                    : "Örnek telefonu doldur"
                }
                onFill={() => {
                  if (sent) {
                    setCode(DEMO_SMS_CODE);
                    toast("Örnek doğrulama kodu dolduruldu.", "success");
                    return;
                  }
                  setPhone(DEMO_CITIZEN.phoneDisplay);
                  toast("Örnek telefon numarası dolduruldu.", "success");
                }}
              />
            ) : null}
            <div className="space-y-2.5">
              <Label htmlFor="lookup-phone">Cep telefonu</Label>
              <Input
                id="lookup-phone"
                className={formControlClass}
                value={phone}
                onChange={(e) => setPhone(maskTrMobile(e.target.value))}
                placeholder="05XX XXX XX XX"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            {sent ? (
              <div className="space-y-2.5">
                <Label htmlFor="lookup-otp">SMS doğrulama kodu</Label>
                <OtpInput
                  id="lookup-otp"
                  value={code}
                  onChange={setCode}
                  length={6}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-12 flex-1"
                loading={busy}
                onClick={() => void (sent ? verify() : send())}
              >
                {sent ? "Doğrula ve getir" : "Kod gönder"}
              </Button>
              {sent ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12"
                  loading={busy}
                  onClick={() => void send()}
                >
                  Yeniden gönder
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {obscureTrMobile(toCitizenPhone(phone))} numarasına ait randevular
            </p>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                Bu numaraya ait görüntülenecek randevu kaydı bulunamadı.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((a) => (
                  <li
                    key={a.id}
                    className={cn(
                      "rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold leading-snug text-[var(--color-navy)]">
                        {a.code ?? a.id}
                      </p>
                      <Badge
                        className={cn(
                          STATUS_BADGE[a.status] ??
                            "border-[var(--color-border)] bg-[var(--surface-muted)] text-[var(--color-text-muted)]",
                        )}
                      >
                        {STATUS_TR[a.status] ?? a.status}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {DEPARTMENT_LABELS[a.department]}
                      <span
                        className="mx-1.5 text-[var(--color-text-muted)]"
                        aria-hidden
                      >
                        ·
                      </span>
                      {a.specialistName}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {formatTurkishDateMedium(a.date)}
                      <span
                        className="mx-1.5 text-[var(--color-text-muted)]"
                        aria-hidden
                      >
                        ·
                      </span>
                      {a.startTime}–{a.endTime}
                    </p>
                    {isCancellable(a.status) ? (
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 border-rose-300 px-3 text-xs font-semibold text-rose-800 shadow-none hover:bg-rose-50 hover:shadow-none"
                          disabled={cancelling}
                          onClick={() => setCancelTarget(a)}
                        >
                          İptal et
                        </Button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <Button
              type="button"
              variant="secondary"
              className="h-11"
              onClick={() => {
                setVerified(false);
                setSent(false);
                setCode("");
                setItems([]);
                setCancelTarget(null);
              }}
            >
              Başka numara sorgula
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Randevu iptali"
        description="Bu randevuyu iptal etmek istediğinize emin misiniz?"
        confirmLabel="İptal et"
        cancelLabel="Vazgeç"
        danger
        busy={cancelling}
        onConfirm={() => void confirmCancel()}
        onCancel={() => {
          if (!cancelling) setCancelTarget(null);
        }}
      />
    </div>
  );
}
