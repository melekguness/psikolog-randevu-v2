import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { DietitianIcon } from "@/components/brand/DietitianIcon";
import { PsychologistIcon } from "@/components/brand/PsychologistIcon";
import {
  AppointmentProgress,
  type AppointmentStepId,
} from "@/components/appointment/AppointmentProgress";
import { AppointmentSummary } from "@/components/appointment/AppointmentSummary";
import { AvailableSlotPicker } from "@/components/appointment/AvailableSlotPicker";
import { KvkkNoticeModal } from "@/components/appointment/KvkkNoticeModal";
import { RequestSuccess } from "@/components/appointment/RequestSuccess";
import { IncomingSmsBanner } from "@/components/auth/IncomingSmsBanner";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DemoAssistPanel } from "@/components/ui/DemoAssistPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { DEMO_CITIZEN, DEMO_SMS_CODE, isDemoMode } from "@/data/demoCredentials";
import { SERVICE_MOTTOS } from "@/data/municipality";
import { ApiError } from "@/lib/api";
import { smsService } from "@/services/smsService";
import { useCreateDietitianAppointment, useDietitians } from "@/hooks/useDietitians";
import { useOpenDates, useOpenSlots } from "@/hooks/useOpenSlots";
import {
  useCreatePsychologistAppointment,
  usePsychologists,
} from "@/hooks/usePsychologists";
import {
  hasBookingErrors,
  toCitizenPhone,
  validateBookingForm,
  validatePhone,
  validateSmsCode,
  type BookingFieldErrors,
} from "@/lib/bookingValidation";
import { maskTrMobile, obscureTrMobile } from "@/lib/phone";
import { cn, formatTurkishDateMedium } from "@/lib/utils";
import { useServiceAtmosphere } from "@/providers/ServiceAtmosphereProvider";
import { useToast } from "@/providers/ToastProvider";
import { DEPARTMENT_LABELS, type DepartmentId, type TimeSlot } from "@/types";

/** Geliştirme yardımcıları — yalnızca DEV derlemesinde görünür. */
const showDevHelpers = import.meta.env.DEV && isDemoMode;

function MobileStickyBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-5 mt-2 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden",
      )}
    >
      {children}
    </div>
  );
}

export function QuickBookingForm({
  initialDepartment = null,
}: {
  initialDepartment?: DepartmentId | null;
}) {
  const formId = useId();
  const { setService } = useServiceAtmosphere();
  const { toast, clearToasts } = useToast();
  const dietitians = useDietitians();
  const psychologists = usePsychologists();
  const createDiet = useCreateDietitianAppointment();
  const createPsych = useCreatePsychologistAppointment();

  const [step, setStep] = useState<AppointmentStepId>(
    initialDepartment ? "schedule" : "service",
  );
  const skipStepScrollRef = useRef(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<DepartmentId | null>(
    initialDepartment,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsVisible, setSmsVisible] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [kvkkNoticeAccepted, setKvkkNoticeAccepted] = useState(false);
  const [verifyingSms, setVerifyingSms] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [errors, setErrors] = useState<BookingFieldErrors>({});
  const [submitted, setSubmitted] = useState<{
    id: string;
    code?: string;
    department: DepartmentId;
    specialistName: string;
    date: string;
    startTime: string;
    endTime: string;
    phone: string;
    fullName: string;
    email?: string;
  } | null>(null);

  const datesQuery = useOpenDates(department);
  const dates = datesQuery.data ?? [];
  const activeDate =
    selectedDate && dates.includes(selectedDate) ? selectedDate : (dates[0] ?? "");
  const slotsQuery = useOpenSlots(department, activeDate);
  const specialists = useMemo(() => {
    if (department === "dietitian") return dietitians.data ?? [];
    if (department === "psychologist") return psychologists.data ?? [];
    return [];
  }, [department, dietitians.data, psychologists.data]);

  const specialistsError =
    department === "dietitian"
      ? dietitians.isError
      : department === "psychologist"
        ? psychologists.isError
        : false;

  const booking = createDiet.isPending || createPsych.isPending;
  const scheduleLoading =
    Boolean(department) &&
    (datesQuery.isLoading ||
      slotsQuery.isLoading ||
      dietitians.isLoading ||
      psychologists.isLoading);

  const specialistName = useMemo(() => {
    if (!slot) return undefined;
    return specialists.find((s) => s.id === slot.specialistId)?.fullName;
  }, [slot, specialists]);

  useEffect(() => {
    setService(department);
    return () => setService(null);
  }, [department, setService]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (skipStepScrollRef.current) {
      skipStepScrollRef.current = false;
      return;
    }
    const target = document.getElementById("randevu-form");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const headerOffset = 88;
    // Already near the top of the viewport — avoid scroll jank / page shake.
    if (rect.top >= headerOffset && rect.top <= window.innerHeight * 0.4) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Instant scroll — smooth scroll + layout change = page shake.
    target.scrollIntoView({
      behavior: "auto",
      block: "nearest",
    });
  }, [step]);

  useEffect(() => {
    if (!submitted) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [submitted]);

  const resetDepartment = (next: DepartmentId) => {
    clearToasts();
    setDepartment(next);
    setSelectedDate("");
    setSlot(null);
    setSmsCode("");
    setSmsSent(false);
    setSmsVisible(false);
    setSmsVerified(false);
    setSendingSms(false);
    setErrors({});
  };

  const sendSms = async () => {
    clearToasts();
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError, sms: undefined }));
      toast(phoneError, "error");
      return;
    }
    setSendingSms(true);
    setSmsVerified(false);
    setSmsCode("");
    try {
      const result = await smsService.sendCode(toCitizenPhone(phone));
      setSmsSent(true);
      setSmsVisible(showDevHelpers);
      setResendIn(result.retryAfterSec ?? 30);
      setErrors((prev) => ({ ...prev, phone: undefined, sms: undefined }));
      if (showDevHelpers && result.demoCode) {
        toast(`Örnek doğrulama kodu: ${result.demoCode}`, "success");
      } else {
        toast(result.message, "success");
      }
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Kod gönderilemedi.";
      setErrors((prev) => ({ ...prev, sms: message }));
      toast(message, "error");
    } finally {
      setSendingSms(false);
    }
  };

  const confirmSms = async (code = smsCode) => {
    if (verifyingSms || smsVerified) return;
    clearToasts();
    const codeError = validateSmsCode(code);
    if (codeError) {
      setErrors((prev) => ({ ...prev, sms: codeError }));
      toast(codeError, "error");
      return;
    }
    setVerifyingSms(true);
    try {
      const result = await smsService.verifyCode(toCitizenPhone(phone), code);
      if (!result.ok) {
        setErrors((prev) => ({ ...prev, sms: result.message }));
        toast(result.message, "error");
        return;
      }
      setSmsVerified(true);
      setSmsVisible(false);
      setErrors((prev) => ({ ...prev, sms: undefined }));
      toast("Telefon doğrulandı.", "success");
      setStep("review");
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Kod doğrulanamadı.";
      setErrors((prev) => ({ ...prev, sms: message }));
      toast(message, "error");
    } finally {
      setVerifyingSms(false);
    }
  };

  const goNextFromService = () => {
    if (!department) {
      setErrors({ department: "Lütfen bir hizmet seçiniz." });
      toast("Lütfen bir hizmet seçiniz.", "error");
      return;
    }
    setErrors({});
    setStep("schedule");
  };

  const goNextFromSchedule = () => {
    if (!slot) {
      setErrors({ slot: "Lütfen bir randevu saati seçiniz." });
      toast("Lütfen bir randevu saati seçiniz.", "error");
      return;
    }
    setErrors({});
    setStep("personal");
  };

  const goNextFromPersonal = () => {
    const phoneError = validatePhone(phone);
    const next: BookingFieldErrors = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      next.fullName = "Ad soyad en az 3 karakter olmalıdır.";
    }
    if (phoneError) next.phone = phoneError;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Geçerli bir e-posta giriniz.";
    }
    setErrors(next);
    if (hasBookingErrors(next)) {
      toast(Object.values(next)[0] ?? "Bilgilerinizi kontrol ediniz.", "error");
      return;
    }
    setStep("verify");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateBookingForm({
      fullName,
      phone,
      email,
      department,
      slotId: slot?.id ?? null,
      smsVerified,
      noticeAccepted: kvkkNoticeAccepted,
    });
    setErrors(nextErrors);
    if (hasBookingErrors(nextErrors) || !department || !slot) {
      if (!smsVerified) setStep("verify");
      else if (!slot) setStep("schedule");
      toast(
        Object.values(nextErrors)[0] ??
          "Eksik veya hatalı bilgileri kontrol ediniz.",
        "error",
      );
      return;
    }

    const citizen = {
      fullName: fullName.trim(),
      phone: toCitizenPhone(phone),
      email: email.trim() || undefined,
    };

    try {
      const booked =
        department === "dietitian"
          ? await createDiet.mutateAsync({
              specialistId: slot.specialistId,
              specialistName:
                specialists.find((s) => s.id === slot.specialistId)?.fullName ??
                "",
              slotId: slot.id,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              citizen,
              smsVerified: true,
              consentAccepted: true,
              assessment: {
                goal: "healthy_eating",
                ageRange: "31-45",
                hasChronicCondition: false,
                previousDietitian: false,
              },
            })
          : await createPsych.mutateAsync({
              specialistId: slot.specialistId,
              specialistName:
                specialists.find((s) => s.id === slot.specialistId)?.fullName ??
                "",
              slotId: slot.id,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              citizen,
              smsVerified: true,
              kvkkAccepted: true,
              assessment: {
                sessionType: "individual",
                preferredTimeOfDay: "any",
                isFirstVisit: true,
                urgency: "routine",
              },
            });

      setSubmitted({
        id: booked.id,
        code: booked.code,
        department,
        specialistName: booked.specialistName,
        date: booked.date,
        startTime: booked.startTime,
        endTime: booked.endTime,
        phone: citizen.phone,
        fullName: citizen.fullName,
        email: citizen.email,
      });
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : "Randevu oluşturulurken bir sorun oluştu.";
      setErrors({
        slot: message,
      });
      toast(message, "error");
      setStep("schedule");
    }
  };

  if (submitted) {
    return (
      <RequestSuccess
        appointmentId={submitted.code ?? submitted.id}
        department={submitted.department}
        specialistName={submitted.specialistName}
        date={submitted.date}
        startTime={submitted.startTime}
        endTime={submitted.endTime}
        phone={submitted.phone}
        fullName={submitted.fullName}
        email={submitted.email}
      />
    );
  }

  return (
    <div id="randevu-form" className="scroll-mt-28">
      <header className="mx-auto max-w-[700px] text-center">
        <p className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[12px] font-semibold tracking-[0.12em] text-[var(--accent)] uppercase">
          Online randevu
        </p>
        <h1 className="mt-4 font-sans text-[32px] font-bold leading-snug tracking-[-0.02em] text-[var(--color-navy)] md:text-[40px]">
          Randevu Al
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
          Size uygun uzmanı ve randevu zamanını birkaç adımda belirleyin.
        </p>
      </header>

      <div className="relative mt-8 overflow-visible rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)] sm:mt-10 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-[20px] bg-gradient-to-r from-[#0F172A] via-[var(--accent)] to-[#0F172A]"
        />

        <div className="space-y-6">
          <AppointmentProgress current={step} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px]">
            <form
              onSubmit={(e) => void submit(e)}
              className="min-w-0 space-y-5 pb-2 sm:pb-0"
              noValidate
            >
              {step === "service" ? (
                <section
                  className="space-y-4"
                  data-field="department"
                  aria-labelledby="step-service"
                >
                  <h2
                    id="step-service"
                    className="text-lg font-semibold text-[var(--color-navy)]"
                  >
                    Hizmet seçimi
                  </h2>
                  <div
                    className="grid gap-4 sm:grid-cols-2"
                    role="group"
                    aria-label="Hizmet birimi"
                  >
                    <DepartmentChoice
                      psychologist
                      selected={department === "psychologist"}
                      onSelect={() => resetDepartment("psychologist")}
                      invalid={Boolean(errors.department)}
                    />
                    <DepartmentChoice
                      selected={department === "dietitian"}
                      onSelect={() => resetDepartment("dietitian")}
                      invalid={Boolean(errors.department)}
                    />
                  </div>
                  {errors.department ? (
                    <p className="text-sm font-medium text-[#C43D3D]" role="alert">
                      {errors.department}
                    </p>
                  ) : null}
                  <Button
                    type="button"
                    className="hidden h-12 w-full sm:inline-flex sm:w-auto"
                    onClick={goNextFromService}
                  >
                    Devam et
                  </Button>
                  <MobileStickyBar>
                    <Button
                      type="button"
                      className="h-12 w-full"
                      onClick={goNextFromService}
                    >
                      Devam et
                    </Button>
                  </MobileStickyBar>
                </section>
              ) : null}

              {step === "schedule" ? (
                <section
                  className="space-y-4"
                  data-field="slot"
                  aria-labelledby="step-schedule"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2
                      id="step-schedule"
                      className="text-lg font-semibold text-[var(--color-navy)]"
                    >
                      Uzman, tarih ve saat
                    </h2>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                      onClick={() => setStep("service")}
                    >
                      Hizmeti değiştir
                    </button>
                  </div>

                  {scheduleLoading ? (
                    <div className="space-y-3" aria-busy="true" role="status">
                      <p className="sr-only">Müsait saatler yükleniyor</p>
                      <Skeleton className="h-11 w-full rounded-xl" />
                      <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                  ) : specialistsError ? (
                    <div
                      className="space-y-3 rounded-2xl border border-[#C43D3D]/30 bg-[#FDF6F6] p-5"
                      role="alert"
                    >
                      <p className="text-sm font-medium text-[#C43D3D]">
                        Uzman listesi yüklenemedi. Lütfen tekrar deneyiniz.
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11"
                        onClick={() => {
                          void dietitians.refetch();
                          void psychologists.refetch();
                        }}
                      >
                        Tekrar dene
                      </Button>
                    </div>
                  ) : datesQuery.isError || slotsQuery.isError ? (
                    <div
                      className="space-y-3 rounded-2xl border border-[#C43D3D]/30 bg-[#FDF6F6] p-5"
                      role="alert"
                    >
                      <p className="text-sm font-medium text-[#C43D3D]">
                        Müsait saatler yüklenemedi. Lütfen tekrar deneyiniz.
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11"
                        onClick={() => {
                          void datesQuery.refetch();
                          void slotsQuery.refetch();
                        }}
                      >
                        Tekrar dene
                      </Button>
                    </div>
                  ) : specialists.length === 0 ? (
                    <div
                      className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-5 text-sm text-[var(--color-text-secondary)]"
                      role="status"
                    >
                      <p className="font-medium text-[var(--color-navy)]">
                        Şu anda bu hizmet için uygun uzman bulunmuyor.
                      </p>
                      <button
                        type="button"
                        className="mt-3 text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                        onClick={() => setStep("service")}
                      >
                        Başka hizmet seç
                      </button>
                    </div>
                  ) : (
                    <AvailableSlotPicker
                      dates={dates}
                      slots={slotsQuery.data ?? []}
                      specialists={specialists}
                      department={department!}
                      selectedDate={activeDate}
                      selectedSlotId={slot?.id ?? null}
                      onSelectDate={(date) => {
                        clearToasts();
                        setSelectedDate(date);
                        setSlot(null);
                        setErrors((prev) => ({ ...prev, slot: undefined }));
                      }}
                      onSelectSlot={(next) => {
                        clearToasts();
                        setSelectedDate(next.date);
                        setSlot(next);
                        setErrors((prev) => ({ ...prev, slot: undefined }));
                      }}
                      loading={false}
                      error={errors.slot}
                    />
                  )}

                  {slot ? (
                    <p
                      className="rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent)]"
                      role="status"
                    >
                      Seçilen: {formatTurkishDateMedium(slot.date)} ·{" "}
                      {slot.startTime} – {slot.endTime}
                    </p>
                  ) : null}

                  <div className="hidden flex-col gap-3 sm:flex sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12"
                      onClick={() => setStep("service")}
                    >
                      Geri
                    </Button>
                    <Button
                      type="button"
                      className="h-12 flex-1"
                      onClick={goNextFromSchedule}
                    >
                      Devam et
                    </Button>
                  </div>
                  <MobileStickyBar>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-12 shrink-0"
                        onClick={() => setStep("service")}
                      >
                        Geri
                      </Button>
                      <Button
                        type="button"
                        className="h-12 flex-1"
                        onClick={goNextFromSchedule}
                      >
                        Devam et
                      </Button>
                    </div>
                  </MobileStickyBar>
                </section>
              ) : null}

              {step === "personal" ? (
                <section className="space-y-4" aria-labelledby="step-personal">
                  <h2
                    id="step-personal"
                    className="text-lg font-semibold text-[var(--color-navy)]"
                  >
                    Kişisel bilgiler
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2.5" data-field="fullName">
                      <Label htmlFor={`${formId}-name`}>
                        Ad Soyad<span className="text-[#C43D3D]"> *</span>
                      </Label>
                      <Input
                        id={`${formId}-name`}
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName)
                            setErrors((p) => ({ ...p, fullName: undefined }));
                        }}
                        aria-invalid={Boolean(errors.fullName)}
                        className="h-12 rounded-xl"
                      />
                      {errors.fullName ? (
                        <p
                          className="text-sm font-medium text-[#C43D3D]"
                          role="alert"
                        >
                          {errors.fullName}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2.5" data-field="phone">
                      <Label htmlFor={`${formId}-phone`}>
                        Telefon<span className="text-[#C43D3D]"> *</span>
                      </Label>
                      <Input
                        id={`${formId}-phone`}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="05XX XXX XX XX"
                        value={phone}
                        onChange={(e) => {
                          setPhone(maskTrMobile(e.target.value));
                          setSmsSent(false);
                          setSmsVerified(false);
                          setSmsCode("");
                          setSmsVisible(false);
                          if (errors.phone)
                            setErrors((p) => ({ ...p, phone: undefined }));
                        }}
                        aria-invalid={Boolean(errors.phone)}
                        className="h-12 rounded-xl"
                      />
                      {errors.phone ? (
                        <p
                          className="text-sm font-medium text-[#C43D3D]"
                          role="alert"
                        >
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2.5" data-field="email">
                    <Label htmlFor={`${formId}-email`}>
                      E-posta (isteğe bağlı)
                    </Label>
                    <Input
                      id={`${formId}-email`}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((p) => ({ ...p, email: undefined }));
                      }}
                      aria-invalid={Boolean(errors.email)}
                      className="h-12 rounded-xl"
                    />
                    {errors.email ? (
                      <p
                        className="text-sm font-medium text-[#C43D3D]"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  {showDevHelpers ? (
                    <DemoAssistPanel
                      fillLabel="Örnek bilgileri doldur"
                      hint="Yalnızca geliştirme ortamı — kod 123456."
                      onFill={() => {
                        setFullName(DEMO_CITIZEN.fullName);
                        setPhone(DEMO_CITIZEN.phoneDisplay);
                        setEmail(DEMO_CITIZEN.email);
                        setErrors({});
                        toast("Örnek bilgiler dolduruldu.", "success");
                      }}
                    />
                  ) : null}

                  <div className="hidden flex-col gap-3 sm:flex sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12"
                      onClick={() => setStep("schedule")}
                    >
                      Geri
                    </Button>
                    <Button
                      type="button"
                      className="h-12 flex-1"
                      onClick={goNextFromPersonal}
                    >
                      Devam et
                    </Button>
                  </div>
                  <MobileStickyBar>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-12 shrink-0"
                        onClick={() => setStep("schedule")}
                      >
                        Geri
                      </Button>
                      <Button
                        type="button"
                        className="h-12 flex-1"
                        onClick={goNextFromPersonal}
                      >
                        Devam et
                      </Button>
                    </div>
                  </MobileStickyBar>
                </section>
              ) : null}

              {step === "verify" ? (
                <section
                  className={cn(
                    "space-y-4 rounded-2xl border p-5 sm:p-6",
                    errors.sms ? "border-[#C43D3D]/40" : "border-[var(--color-border)]",
                  )}
                  data-field="sms"
                  aria-labelledby="step-verify"
                >
                  <h2
                    id="step-verify"
                    className="text-lg font-semibold text-[var(--color-navy)]"
                  >
                    Telefon doğrulama
                  </h2>
                  {!smsVerified ? (
                    <>
                      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {smsSent
                          ? "Telefonunuza doğrulama kodu gönderildi."
                          : "Randevuyu tamamlamak için telefonunuzu SMS ile doğrulayın."}
                      </p>
                      {smsSent ? (
                        <p className="text-sm font-semibold text-[var(--color-navy)]">
                          {obscureTrMobile(phone)}
                        </p>
                      ) : null}
                      {!smsSent ? (
                        <>
                          <Button
                            type="button"
                            className="hidden h-12 w-full sm:inline-flex"
                            loading={sendingSms}
                            onClick={sendSms}
                          >
                            {sendingSms ? "Gönderiliyor..." : "SMS kodu gönder"}
                          </Button>
                          <MobileStickyBar>
                            <Button
                              type="button"
                              className="h-12 w-full"
                              loading={sendingSms}
                              onClick={sendSms}
                            >
                              {sendingSms
                                ? "Gönderiliyor..."
                                : "SMS kodu gönder"}
                            </Button>
                          </MobileStickyBar>
                        </>
                      ) : (
                        <>
                          {showDevHelpers && smsVisible ? (
                            <IncomingSmsBanner
                              phoneLabel={obscureTrMobile(phone)}
                              code={DEMO_SMS_CODE}
                              onUseCode={() => {
                                setSmsCode(DEMO_SMS_CODE);
                                setErrors((p) => ({ ...p, sms: undefined }));
                                confirmSms(DEMO_SMS_CODE);
                              }}
                            />
                          ) : null}
                          <Label htmlFor={`${formId}-sms`}>
                            SMS doğrulama kodu
                          </Label>
                          <OtpInput
                            id={`${formId}-sms`}
                            value={smsCode}
                            onChange={(value) => {
                              setSmsCode(value);
                              if (errors.sms)
                                setErrors((p) => ({ ...p, sms: undefined }));
                              if (
                                value.length === 6 &&
                                !verifyingSms &&
                                !smsVerified
                              ) {
                                confirmSms(value);
                              }
                            }}
                            invalid={Boolean(errors.sms)}
                            aria-label="SMS doğrulama kodu"
                          />
                          <button
                            type="button"
                            disabled={resendIn > 0 || sendingSms}
                            onClick={sendSms}
                            className="text-sm font-semibold text-[var(--accent)] disabled:text-slate-400"
                          >
                            {resendIn > 0
                              ? `Tekrar gönder (${String(resendIn).padStart(2, "0")} sn)`
                              : "Kodu tekrar gönder"}
                          </button>
                          <Button
                            type="button"
                            className="hidden h-12 sm:inline-flex"
                            loading={verifyingSms}
                            onClick={() => confirmSms()}
                          >
                            {verifyingSms ? "Doğrulanıyor..." : "Kodu doğrula"}
                          </Button>
                          <MobileStickyBar>
                            <Button
                              type="button"
                              className="h-12 w-full"
                              loading={verifyingSms}
                              onClick={() => confirmSms()}
                            >
                              {verifyingSms
                                ? "Doğrulanıyor..."
                                : "Kodu doğrula"}
                            </Button>
                          </MobileStickyBar>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#198B68]">
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                      Telefon doğrulandı: {obscureTrMobile(phone)}
                    </p>
                  )}
                  {errors.sms ? (
                    <p
                      className="text-sm font-medium text-[#C43D3D]"
                      role="alert"
                    >
                      {errors.sms}
                    </p>
                  ) : null}
                  <div className="hidden flex-col gap-3 sm:flex sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12"
                      onClick={() => setStep("personal")}
                    >
                      Geri
                    </Button>
                    {smsVerified ? (
                      <Button
                        type="button"
                        className="h-12 flex-1"
                        onClick={() => setStep("review")}
                      >
                        Devam et
                      </Button>
                    ) : null}
                  </div>
                  {smsVerified ? (
                    <MobileStickyBar>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 shrink-0"
                          onClick={() => setStep("personal")}
                        >
                          Geri
                        </Button>
                        <Button
                          type="button"
                          className="h-12 flex-1"
                          onClick={() => setStep("review")}
                        >
                          Devam et
                        </Button>
                      </div>
                    </MobileStickyBar>
                  ) : (
                    <div className="sm:hidden">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 w-full"
                        onClick={() => setStep("personal")}
                      >
                        Geri
                      </Button>
                    </div>
                  )}
                </section>
              ) : null}

              {step === "review" ? (
                <section className="space-y-5" aria-labelledby="step-review">
                  <h2
                    id="step-review"
                    className="text-lg font-semibold text-[var(--color-navy)]"
                  >
                    Randevu özeti ve onay
                  </h2>

                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface-muted)]/80 p-5 text-sm">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Uzman</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {specialistName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Hizmet</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {department ? DEPARTMENT_LABELS[department] : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Tarih</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {slot ? formatTurkishDateMedium(slot.date) : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Saat</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {slot
                            ? `${slot.startTime} – ${slot.endTime}`
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Ad Soyad</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {fullName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-text-muted)]">Telefon</dt>
                        <dd className="font-semibold text-[var(--color-navy)]">
                          {obscureTrMobile(phone)}
                        </dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      className="mt-4 text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                      onClick={() => setStep("schedule")}
                    >
                      Değiştir
                    </button>
                  </div>

                  <div
                    className={cn(
                      "space-y-4 overflow-visible rounded-2xl border p-5",
                      errors.notice
                        ? "border-[#C43D3D]/40"
                        : "border-[var(--color-border)]",
                    )}
                    data-field="notice"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <label
                        htmlFor={`${formId}-kvkk-notice`}
                        className="flex min-h-11 cursor-pointer items-start gap-3 overflow-visible"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-visible">
                          <input
                            id={`${formId}-kvkk-notice`}
                            type="checkbox"
                            className="h-5 w-5 shrink-0 rounded border-slate-300 accent-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2"
                            checked={kvkkNoticeAccepted}
                            onChange={(e) => {
                              setKvkkNoticeAccepted(e.target.checked);
                              if (e.target.checked)
                                setErrors((p) => ({ ...p, notice: undefined }));
                            }}
                            aria-invalid={Boolean(errors.notice)}
                          />
                        </span>
                        <span className="min-w-0 pt-2.5 text-sm font-medium leading-relaxed text-[var(--color-navy)]">
                          KVKK Aydınlatma Metni&apos;ni okudum.
                          <span className="text-[#C43D3D]"> *</span>
                        </span>
                      </label>
                      {errors.notice ? (
                        <p
                          className="pl-14 text-sm font-medium text-[#C43D3D]"
                          role="alert"
                        >
                          {errors.notice}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                      onClick={() => setKvkkOpen(true)}
                    >
                      Aydınlatma Metnini Görüntüle →
                    </button>
                  </div>

                  <div className="hidden flex-col gap-3 sm:flex sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12"
                      onClick={() => setStep("verify")}
                    >
                      Geri
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 flex-1"
                      loading={booking}
                      disabled={booking}
                      aria-label="Randevuyu onayla"
                    >
                      {booking
                        ? "Randevu oluşturuluyor..."
                        : "Randevuyu Onayla"}
                    </Button>
                  </div>
                  <MobileStickyBar>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-12 shrink-0"
                        onClick={() => setStep("verify")}
                      >
                        Geri
                      </Button>
                      <Button
                        type="submit"
                        className="h-12 flex-1"
                        loading={booking}
                        disabled={booking}
                        aria-label="Randevuyu onayla"
                      >
                        {booking
                          ? "Randevu oluşturuluyor..."
                          : "Randevuyu Onayla"}
                      </Button>
                    </div>
                  </MobileStickyBar>
                </section>
              ) : null}

              <KvkkNoticeModal
                open={kvkkOpen}
                onClose={() => setKvkkOpen(false)}
                onAccept={() => {
                  setKvkkNoticeAccepted(true);
                  setErrors((prev) => ({
                    ...prev,
                    notice: undefined,
                  }));
                  setKvkkOpen(false);
                }}
              />
            </form>

            <div className="hidden lg:block">
              {step !== "review" ? (
                <AppointmentSummary
                  department={department}
                  specialistName={specialistName}
                  slot={slot}
                  fullName={fullName || undefined}
                  phone={phone || undefined}
                  email={email || undefined}
                  onEdit={(target) =>
                    setStep(
                      target === "personal"
                        ? "personal"
                        : target === "service"
                          ? "service"
                          : "schedule",
                    )
                  }
                />
              ) : null}
            </div>
          </div>

          {step !== "service" && step !== "review" ? (
            <div className="lg:hidden">
              <AppointmentSummary
                department={department}
                specialistName={specialistName}
                slot={slot}
                fullName={fullName || undefined}
                phone={phone || undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DepartmentChoice({
  psychologist = false,
  selected,
  onSelect,
  invalid,
}: {
  psychologist?: boolean;
  selected: boolean;
  onSelect: () => void;
  invalid?: boolean;
}) {
  const id = psychologist ? "psychologist" : "dietitian";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${DEPARTMENT_LABELS[id]} seç`}
      className={cn(
        "flex min-h-[120px] w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2",
        selected
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--color-navy)] shadow-sm"
          : "border-[var(--color-border)] bg-[var(--surface-muted)] hover:border-[var(--accent)]/40",
        invalid && !selected && "border-[#C43D3D]/50",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl",
          psychologist ? "bg-slate-900" : "bg-[var(--accent)]",
        )}
      >
        {psychologist ? (
          <PsychologistIcon size={28} title="Psikolog" />
        ) : (
          <DietitianIcon size={36} title="Diyetisyen" />
        )}
      </span>
      <span className="min-w-0 flex-1 space-y-1.5 pr-6">
        <span className="flex items-center justify-between gap-2">
          <span className="block text-base font-semibold leading-snug tracking-tight">
            {DEPARTMENT_LABELS[id]}
          </span>
          {selected ? (
            <CheckCircle2
              className="h-5 w-5 shrink-0 text-[var(--accent)]"
              aria-hidden
            />
          ) : null}
        </span>
        <span className="block text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {SERVICE_MOTTOS[id]}
        </span>
      </span>
    </button>
  );
}
