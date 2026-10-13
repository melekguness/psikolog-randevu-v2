/**
 * Idempotent demo appointments for citizen lookup (Randevularım).
 * Phone matches frontend DEMO_CITIZEN.phoneRaw — only used by the SQLite demo API.
 */
import { db, nextAppointmentCode } from "./db.js";

/** Same as src/data/demoCredentials.ts DEMO_CITIZEN.phoneRaw */
export const DEMO_CITIZEN_PHONE = "05321234567";

const DEMO_IDS = ["demo_citizen_psych_1", "demo_citizen_diet_1"] as const;

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Next calendar day that is Mon–Fri, at least `minOffset` days from today. */
function nextWeekdayISO(minOffset: number): string {
  let offset = minOffset;
  for (let i = 0; i < 14; i++) {
    const date = addDaysISO(todayISO(), offset);
    const jsDay = new Date(`${date}T12:00:00`).getDay();
    if (jsDay !== 0 && jsDay !== 6) return date;
    offset += 1;
  }
  return addDaysISO(todayISO(), minOffset);
}

function slotId(
  department: string,
  specialistId: string,
  date: string,
  startTime: string,
): string {
  return `${department}_${specialistId}_${date}_${startTime.replace(":", "")}`;
}

export function seedDemoCitizenAppointments(): void {
  const existing = db
    .prepare(
      `SELECT COUNT(*) AS c FROM appointments WHERE id IN (${DEMO_IDS.map(() => "?").join(",")})`,
    )
    .get(...DEMO_IDS) as { c: number };

  if (existing.c >= DEMO_IDS.length) {
    return;
  }

  const psychDate = nextWeekdayISO(5);
  const dietDate = nextWeekdayISO(8);
  const createdAt = new Date().toISOString();

  const rows: Array<{
    id: string;
    department: string;
    specialistId: string;
    specialistName: string;
    date: string;
    startTime: string;
    endTime: string;
  }> = [
    {
      id: DEMO_IDS[0],
      department: "psychologist",
      specialistId: "ps_mehmet_akgun",
      specialistName: "Uzm. Psk. Tuna Arslan",
      date: psychDate,
      startTime: "16:00",
      endTime: "16:50",
    },
    {
      id: DEMO_IDS[1],
      department: "dietitian",
      specialistId: "dt_ayse_yilmaz",
      specialistName: "Dyt. Aysu Yar",
      date: dietDate,
      startTime: "16:30",
      endTime: "17:15",
    },
  ];

  const insert = db.prepare(
    `INSERT OR IGNORE INTO appointments (
      id, code, phone, department, specialist_id, specialist_name,
      date, start_time, end_time, slot_id, full_name, email, status,
      sms_verified, consent_accepted, kvkk_accepted, assessment_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 1, 1, 1, ?, ?)`,
  );

  let inserted = 0;
  for (const row of rows) {
    const already = db
      .prepare(`SELECT id FROM appointments WHERE id = ?`)
      .get(row.id);
    if (already) continue;

    const clash = db
      .prepare(
        `SELECT id FROM appointments
         WHERE specialist_id = ? AND date = ? AND start_time = ? AND status != 'cancelled'`,
      )
      .get(row.specialistId, row.date, row.startTime);
    if (clash) {
      console.info(
        `[demo-seed] Slot çakışması, atlandı: ${row.specialistId} ${row.date} ${row.startTime}`,
      );
      continue;
    }

    try {
      insert.run(
        row.id,
        nextAppointmentCode(row.date),
        DEMO_CITIZEN_PHONE,
        row.department,
        row.specialistId,
        row.specialistName,
        row.date,
        row.startTime,
        row.endTime,
        slotId(row.department, row.specialistId, row.date, row.startTime),
        "Ayşe Yılmaz",
        "ayse.yilmaz@example.com",
        JSON.stringify({}),
        createdAt,
      );
      inserted += 1;
    } catch (err) {
      console.warn(`[demo-seed] Kayıt atlandı (${row.id}):`, err);
    }
  }

  if (inserted > 0) {
    console.info(
      `[demo-seed] ${inserted} örnek randevu eklendi (${DEMO_CITIZEN_PHONE}).`,
    );
  }
}
