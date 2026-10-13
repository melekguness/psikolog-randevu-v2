import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/AppLink";
import { useRouter } from "@/lib/router";
import { Check, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { IncomingSmsBanner } from "@/components/auth/IncomingSmsBanner";
import {
  AuthAlert,
  AuthBackButton,
  AuthShell,
  AuthStepRail,
} from "@/components/auth/AuthShell";
import { OtpInput } from "@/components/auth/OtpInput";
import { DietitianIcon } from "@/components/brand/DietitianIcon";
import { PsychologistIcon } from "@/components/brand/PsychologistIcon";
import { SpecialistAvatar } from "@/components/brand/SpecialistAvatar";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import {
  DEMO_DIETITIAN_EMAIL,
  DEMO_DOCTOR_EMAIL,
  DEMO_DOCTOR_PASSWORD,
  DEMO_DOCTOR_PIN,
  isDemoMode,
} from "@/data/demoCredentials";
import { DemoAssistPanel } from "@/components/ui/DemoAssistPanel";
import { useDietitians } from "@/hooks/useDietitians";
import { usePsychologists } from "@/hooks/usePsychologists";
import { APP_ROUTES } from "@/data/municipality";
import type { DepartmentId } from "@/types";
import { cn } from "@/lib/utils";
import { SkeletonLines } from "@/components/ui/Skeleton";

type DoctorOption = {
  id: string;
  fullName: string;
  department: DepartmentId;
  title: string;
  photoUrl: string;
};

type StaffStep = 1 | 2 | 3;
type LoginMode = "email" | "pin";

const UNITS: { id: DepartmentId; label: string; hint: string }[] = [
  {
    id: "dietitian",
    label: "Diyetisyen",
    hint: "Beslenme danışmanlığı birimi",
  },
  {
    id: "psychologist",
    label: "Psikolog",
    hint: "Psikolojik destek birimi",
  },
];

const STEP_LABELS = ["Birim", "Uzman", "Doğrulama"];

export function DoctorLoginForm() {
  const router = useRouter();
  const { ready, doctor, loginDoctor, loginDoctorByEmail } = useAuth();
  const { toast } = useToast();
  const diet = useDietitians();
  const psych = usePsychologists();
  const [mode, setMode] = useState<LoginMode>("email");
  const [step, setStep] = useState<StaffStep>(1);
  const [department, setDepartment] = useState<DepartmentId | null>(null);
  const [selected, setSelected] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsVisible, setSmsVisible] = useState(false);

  const options = useMemo<DoctorOption[]>(() => {
    const d = (diet.data ?? []).map((s) => ({
      id: s.id,
      fullName: s.fullName,
      department: "dietitian" as const,
      title: s.title,
      photoUrl: s.photoUrl,
    }));
    const p = (psych.data ?? []).map((s) => ({
      id: s.id,
      fullName: s.fullName,
      department: "psychologist" as const,
      title: s.title,
      photoUrl: s.photoUrl,
    }));
    return [...d, ...p];
  }, [diet.data, psych.data]);

  const filtered = department
    ? options.filter((o) => o.department === department)
    : [];
  const selectedDoctor = options.find((o) => o.id === selected);
  const listLoading = diet.isLoading || psych.isLoading;

  useEffect(() => {
    if (doctor) router.replace(APP_ROUTES.doctorPanel);
  }, [doctor, router]);

  const sendStaffCode = () => {
    setSendingSms(true);
    setSmsVisible(false);
    setError(null);
    window.setTimeout(() => {
      setSendingSms(false);
      if (isDemoMode) setSmsVisible(true);
      toast("Güvenlik kodu kayıtlı telefon numaranıza iletildi.", "success");
    }, 850);
  };

  if (!ready || doctor) {
    return <SkeletonLines count={4} />;
  }

  const submitEmail = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Kurumsal e-posta ve şifre giriniz.");
      return;
    }
    setLoading(true);
    const res = await loginDoctorByEmail({ email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    toast("Oturum başarıyla açıldı.", "success");
    router.push(APP_ROUTES.doctorPanel);
  };

  const submitPin = () => {
    setError(null);
    const opt = options.find((o) => o.id === selected);
    if (!opt) {
      setError("Lütfen bir uzman seçiniz.");
      return;
    }
    if (!pin.trim()) {
      setError("Güvenlik kodunu giriniz.");
      return;
    }
    setLoading(true);
    const res = loginDoctor({
      specialistId: opt.id,
      department: opt.department,
      fullName: opt.fullName,
      title: opt.title,
      photoUrl: opt.photoUrl,
      pin,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    toast("Oturum başarıyla açıldı.", "success");
    router.push(APP_ROUTES.doctorPanel);
  };

  return (
    <AuthShell
      eyebrow="Personel erişimi"
      title="Uzman paneli girişi"
      subtitle="Randevu ve müsaitlik yönetimi için kurumsal oturum açma ekranı."
      footer={
        <p className="text-center text-xs leading-relaxed text-[var(--atakum-muted)]">
          Vatandaş randevusu için{" "}
          <Link
            href={APP_ROUTES.booking}
            className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
          >
            randevu formunu
          </Link>{" "}
          kullanınız.
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1.5">
        <button
          type="button"
          className={
            mode === "email"
              ? "rounded-md bg-[var(--surface)] px-3 py-2.5 text-sm font-semibold leading-snug shadow-sm"
              : "rounded-md px-3 py-2.5 text-sm font-medium leading-snug text-[var(--atakum-muted)]"
          }
          onClick={() => {
            setMode("email");
            setError(null);
          }}
        >
          Kurumsal e-posta
        </button>
        <button
          type="button"
          className={
            mode === "pin"
              ? "rounded-md bg-[var(--surface)] px-3 py-2.5 text-sm font-semibold leading-snug shadow-sm"
              : "rounded-md px-3 py-2.5 text-sm font-medium leading-snug text-[var(--atakum-muted)]"
          }
          onClick={() => {
            setMode("pin");
            setError(null);
          }}
        >
          Güvenlik kodu
        </button>
      </div>

      {mode === "email" ? (
        <section className="space-y-4 animate-step-panel">
          {isDemoMode ? (
            <DemoAssistPanel
              hint="Yalnızca geliştirme ortamında görünür."
              fillLabel="Örnek psikolog hesabını doldur"
              onFill={() => {
                setEmail(DEMO_DOCTOR_EMAIL);
                setPassword(DEMO_DOCTOR_PASSWORD);
                setError(null);
                toast("Örnek hesap bilgileri dolduruldu.", "success");
              }}
            >
              <button
                type="button"
                className="text-[11px] font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                onClick={() => {
                  setEmail(DEMO_DIETITIAN_EMAIL);
                  setPassword(DEMO_DOCTOR_PASSWORD);
                  setError(null);
                  toast("Örnek hesap bilgileri dolduruldu.", "success");
                }}
              >
                Örnek diyetisyen hesabını doldur
              </button>
            </DemoAssistPanel>
          ) : null}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitEmail();
            }}
          >
            <div className="space-y-2.5">
              <Label htmlFor="doctor-email">Kurumsal e-posta</Label>
              <Input
                id="doctor-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="doctor-password">Şifre</Label>
              <Input
                id="doctor-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <AuthAlert>{error}</AuthAlert> : null}
            <Button
              type="submit"
              className="min-h-[52px] w-full text-base"
              loading={loading}
            >
              <Lock className="h-4 w-4 shrink-0" aria-hidden />
              Giriş yap
            </Button>
          </form>
        </section>
      ) : (
        <>
          <AuthStepRail steps={STEP_LABELS} current={step} />

          {step === 1 ? (
            <section
              className="space-y-3 animate-step-panel"
              aria-labelledby="unit-heading"
            >
              <h2
                id="unit-heading"
                className="text-sm font-bold leading-snug text-[var(--atakum-ink)]"
              >
                Birim seçiniz
              </h2>
              <ul className="space-y-2.5">
                {UNITS.map((unit) => (
                  <li key={unit.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDepartment(unit.id);
                        setSelected("");
                        setPin("");
                        setSmsVisible(false);
                        setError(null);
                        setStep(2);
                      }}
                      className="group ui-lift flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                    >
                      <span
                        className={
                          unit.id === "dietitian"
                            ? "relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 p-1.5"
                            : "relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-2"
                        }
                      >
                        {unit.id === "dietitian" ? (
                          <DietitianIcon size={48} title="Diyetisyen" />
                        ) : (
                          <PsychologistIcon size={36} title="Psikolog" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 space-y-1.5">
                        <span className="block text-sm font-bold leading-snug text-[var(--atakum-ink)]">
                          {unit.label}
                        </span>
                        <span className="block text-xs leading-relaxed text-[var(--atakum-muted)]">
                          {unit.hint}
                        </span>
                      </span>
                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-[var(--atakum-muted)] transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {step === 2 ? (
            <section
              className="space-y-3 animate-step-panel"
              aria-labelledby="name-heading"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="name-heading"
                  className="text-sm font-bold text-[var(--atakum-ink)]"
                >
                  Uzman seçiniz
                </h2>
                <AuthBackButton
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                >
                  Birime geri dön
                </AuthBackButton>
              </div>
              {listLoading ? (
                <SkeletonLines count={4} />
              ) : (
                <ul className="max-h-[320px] divide-y divide-[var(--border)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[var(--border)]">
                  {filtered.map((doc) => {
                    const active = selected === doc.id;
                    return (
                      <li key={doc.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(doc.id);
                            setError(null);
                            setSmsVisible(false);
                            setPin("");
                            setStep(3);
                          }}
                          className={cn(
                            "flex min-h-[56px] w-full items-center gap-3 px-3.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]",
                            active
                              ? "bg-[var(--accent-soft)]"
                              : "bg-[var(--surface)] hover:bg-[var(--hover)]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                              active
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[var(--border)]",
                            )}
                            aria-hidden
                          >
                            {active ? <Check className="h-3 w-3" /> : null}
                          </span>
                          <SpecialistAvatar
                            specialistId={doc.id}
                            department={doc.department}
                            size="sm"
                            title={`${doc.fullName} uzman simgesi`}
                          />
                          <span className="min-w-0 space-y-1 overflow-hidden">
                            <span className="block truncate text-sm font-bold leading-snug text-[var(--atakum-ink)]">
                              {doc.fullName}
                            </span>
                            <span className="block truncate text-xs leading-relaxed text-[var(--atakum-muted)]">
                              {doc.title}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ) : null}

          {step === 3 ? (
            <section
              className="space-y-4 animate-step-panel"
              aria-labelledby="pin-heading"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="pin-heading"
                  className="text-sm font-bold text-[var(--atakum-ink)]"
                >
                  Güvenlik kodu
                </h2>
                <AuthBackButton
                  onClick={() => {
                    setStep(2);
                    setError(null);
                  }}
                >
                  Listeye geri dön
                </AuthBackButton>
              </div>

              {selectedDoctor ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 backdrop-blur-md">
                  <SpecialistAvatar
                    specialistId={selectedDoctor.id}
                    department={selectedDoctor.department}
                    size="md"
                    title={`${selectedDoctor.fullName} uzman simgesi`}
                  />
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-sm font-bold leading-snug text-[var(--atakum-ink)]">
                      {selectedDoctor.fullName}
                    </p>
                    <p className="text-xs leading-relaxed text-[var(--atakum-muted)]">
                      {selectedDoctor.title}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--atakum-muted)]">
                      {selectedDoctor.department === "dietitian"
                        ? "Diyetisyen"
                        : "Psikolog"}
                    </p>
                  </div>
                </div>
              ) : null}

              <Button
                type="button"
                variant="secondary"
                className="min-h-[48px] w-full"
                loading={sendingSms}
                onClick={sendStaffCode}
              >
                Güvenlik kodunu SMS ile gönder
              </Button>

              {isDemoMode ? (
                <DemoAssistPanel
                  hint="Yalnızca geliştirme ortamında görünür."
                  fillLabel="Örnek güvenlik kodunu doldur"
                  onFill={() => {
                    setPin(DEMO_DOCTOR_PIN);
                    setError(null);
                    toast("Örnek güvenlik kodu dolduruldu.", "success");
                  }}
                />
              ) : null}

              {isDemoMode && smsVisible ? (
                <IncomingSmsBanner
                  phoneLabel={selectedDoctor?.fullName ?? "Kurumsal hat"}
                  code={DEMO_DOCTOR_PIN}
                  onUseCode={() => {
                    setPin(DEMO_DOCTOR_PIN);
                    toast("Güvenlik kodu forma aktarıldı.", "success");
                  }}
                />
              ) : null}

              <div className="space-y-2.5">
                <Label htmlFor="doctor-pin">Güvenlik kodu</Label>
                <OtpInput
                  id="doctor-pin"
                  value={pin}
                  onChange={setPin}
                  length={4}
                  autoFocus
                />
                <p className="text-xs leading-relaxed text-[var(--atakum-muted)]">
                  Size iletilen 4 haneli güvenlik kodunu giriniz.
                </p>
              </div>

              {error ? <AuthAlert>{error}</AuthAlert> : null}

              <Button
                type="button"
                className="min-h-[52px] w-full text-base"
                loading={loading}
                onClick={submitPin}
              >
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                Giriş yap
              </Button>
            </section>
          ) : null}
        </>
      )}
    </AuthShell>
  );
}
