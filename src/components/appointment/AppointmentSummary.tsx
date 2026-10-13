import { formatTurkishDateMedium } from "@/lib/utils";
import { obscureTrMobile } from "@/lib/phone";
import { DEPARTMENT_LABELS, type DepartmentId, type TimeSlot } from "@/types";

export function AppointmentSummary({
  department,
  specialistName,
  slot,
  fullName,
  phone,
  email,
  onEdit,
}: {
  department: DepartmentId | null;
  specialistName?: string;
  slot: TimeSlot | null;
  fullName?: string;
  phone?: string;
  email?: string;
  onEdit?: (step: "service" | "schedule" | "personal") => void;
}) {
  if (!department && !slot) {
    return (
      <aside className="rounded-[16px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5 text-sm text-[var(--color-text-muted)]">
        Seçimleriniz burada özetlenecek.
      </aside>
    );
  }

  return (
    <aside
      className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)] lg:sticky lg:top-24"
      aria-label="Randevu özeti"
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Randevu özeti
      </p>
      <dl className="mt-4 space-y-4 text-sm">
        {department ? (
          <div>
            <dt className="text-slate-500">Hizmet</dt>
            <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">
              {DEPARTMENT_LABELS[department]}
            </dd>
          </div>
        ) : null}
        {specialistName ? (
          <div>
            <dt className="text-slate-500">Uzman</dt>
            <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">{specialistName}</dd>
          </div>
        ) : null}
        {slot ? (
          <>
            <div>
              <dt className="text-slate-500">Tarih</dt>
              <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">
                {formatTurkishDateMedium(slot.date)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Saat</dt>
              <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">
                {slot.startTime} – {slot.endTime}
              </dd>
            </div>
          </>
        ) : null}
        {fullName ? (
          <div>
            <dt className="text-slate-500">Ad Soyad</dt>
            <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">{fullName}</dd>
          </div>
        ) : null}
        {phone ? (
          <div>
            <dt className="text-slate-500">Telefon</dt>
            <dd className="mt-1.5 font-semibold leading-snug text-[#162536]">
              {obscureTrMobile(phone)}
            </dd>
          </div>
        ) : null}
        {email ? (
          <div>
            <dt className="text-slate-500">E-posta</dt>
            <dd className="mt-1.5 break-all font-semibold leading-snug text-[#162536]">
              {email}
            </dd>
          </div>
        ) : null}
      </dl>
      {onEdit ? (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onEdit("schedule")}
            className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35"
          >
            Saati değiştir
          </button>
          <button
            type="button"
            onClick={() => onEdit("personal")}
            className="text-sm font-semibold text-slate-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35"
          >
            Bilgileri düzenle
          </button>
        </div>
      ) : null}
    </aside>
  );
}
