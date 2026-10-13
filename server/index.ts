import express from "express";
import cors from "cors";
import {
  db,
  initDb,
  isValidTrMobile,
  nextAppointmentCode,
  normalizePhone,
} from "./db.js";
import {
  findSlot,
  getSpecialist,
  getSpecialists,
  getTemplateSlots,
} from "./catalog.js";
import { isPhoneVerified, sendOtp, verifyOtp } from "./sms.js";
import { seedDemoCitizenAppointments } from "./demoSeed.js";
import type { DepartmentId } from "../src/types/index.ts";

initDb();
seedDemoCitizenAppointments();

const app = express();
const PORT = Number(process.env.API_PORT || 3031);

app.use(cors({ origin: true }));
app.use(express.json({ limit: "256kb" }));

function deptOrThrow(v: unknown): DepartmentId {
  if (v === "dietitian" || v === "psychologist") return v;
  throw Object.assign(new Error("Geçersiz birim."), { status: 400 });
}

function rowToAppointment(row: Record<string, unknown>) {
  let assessment = {};
  try {
    assessment = row.assessment_json
      ? JSON.parse(String(row.assessment_json))
      : {};
  } catch {
    assessment = {};
  }
  return {
    id: row.id,
    code: row.code,
    department: row.department,
    specialistId: row.specialist_id,
    specialistName: row.specialist_name,
    slotId: row.slot_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    citizen: {
      fullName: row.full_name,
      phone: row.phone,
      email: row.email || undefined,
    },
    status: row.status,
    smsVerified: Boolean(row.sms_verified),
    createdAt: row.created_at,
    consentAccepted: Boolean(row.consent_accepted),
    kvkkAccepted: Boolean(row.kvkk_accepted),
    assessment,
  };
}

function bookedSlotIds(department?: DepartmentId): Set<string> {
  const rows = department
    ? (db
        .prepare(
          `SELECT slot_id FROM appointments WHERE status != 'cancelled' AND department = ?`,
        )
        .all(department) as { slot_id: string }[])
    : (db
        .prepare(
          `SELECT slot_id FROM appointments WHERE status != 'cancelled'`,
        )
        .all() as { slot_id: string }[]);
  return new Set(rows.map((r) => r.slot_id));
}

function blockedSlotIds(department?: DepartmentId): Set<string> {
  const rows = department
    ? (db
        .prepare(`SELECT slot_id FROM blocked_slots WHERE department = ?`)
        .all(department) as { slot_id: string }[])
    : (db.prepare(`SELECT slot_id FROM blocked_slots`).all() as {
        slot_id: string;
      }[]);
  return new Set(rows.map((r) => r.slot_id));
}

function enrichSlots(
  department: DepartmentId,
  filter?: { specialistId?: string; date?: string },
) {
  const booked = bookedSlotIds(department);
  const blocked = blockedSlotIds(department);
  return getTemplateSlots(department)
    .filter((s) => {
      if (filter?.specialistId && s.specialistId !== filter.specialistId)
        return false;
      if (filter?.date && s.date !== filter.date) return false;
      return true;
    })
    .map((s) => ({
      ...s,
      isBooked: booked.has(s.id) || s.isBooked,
      isClosed: blocked.has(s.id),
    }));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "atakum-health-api" });
});

app.get("/api/specialists/:department", (req, res) => {
  try {
    const department = deptOrThrow(req.params.department);
    res.json(getSpecialists(department));
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.get("/api/slots", (req, res) => {
  try {
    const department = deptOrThrow(req.query.department);
    const specialistId =
      typeof req.query.specialistId === "string"
        ? req.query.specialistId
        : undefined;
    const date =
      typeof req.query.date === "string" ? req.query.date : undefined;
    const openOnly = req.query.openOnly === "1" || req.query.openOnly === "true";
    let slots = enrichSlots(department, { specialistId, date });
    if (openOnly) {
      slots = slots.filter((s) => !s.isBooked && !s.isClosed);
    }
    res.json(slots);
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.get("/api/availability/dates", (req, res) => {
  try {
    const department = deptOrThrow(req.query.department);
    const specialistId =
      typeof req.query.specialistId === "string"
        ? req.query.specialistId
        : undefined;
    const scheduleAll = req.query.schedule === "1";
    const slots = enrichSlots(department, { specialistId });
    const dates = new Set(
      slots
        .filter((s) => (scheduleAll ? true : !s.isBooked && !s.isClosed))
        .map((s) => s.date),
    );
    res.json([...dates].sort());
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.post("/api/auth/send-code", (req, res) => {
  const phone = String(req.body?.phone ?? "");
  if (!isValidTrMobile(phone)) {
    res.status(400).json({ message: "Geçerli bir cep telefonu giriniz." });
    return;
  }
  const result = sendOtp(phone);
  res.status(result.ok ? 200 : 429).json(result);
});

app.post("/api/auth/verify-code", (req, res) => {
  const phone = String(req.body?.phone ?? "");
  const code = String(req.body?.code ?? "");
  if (!isValidTrMobile(phone)) {
    res.status(400).json({ message: "Geçerli bir cep telefonu giriniz." });
    return;
  }
  const result = verifyOtp(phone, code);
  res.status(result.ok ? 200 : 400).json(result);
});

app.get("/api/appointments", (req, res) => {
  try {
    const department =
      typeof req.query.department === "string"
        ? deptOrThrow(req.query.department)
        : undefined;
    const date =
      typeof req.query.date === "string" ? req.query.date : undefined;
    const phone =
      typeof req.query.phone === "string"
        ? normalizePhone(req.query.phone)
        : undefined;
    const specialistId =
      typeof req.query.specialistId === "string"
        ? req.query.specialistId
        : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    let sql = `SELECT * FROM appointments WHERE 1=1`;
    const params: string[] = [];
    if (department) {
      sql += ` AND department = ?`;
      params.push(department);
    }
    if (specialistId) {
      sql += ` AND specialist_id = ?`;
      params.push(specialistId);
    }
    if (date) {
      sql += ` AND date = ?`;
      params.push(date);
    }
    if (phone) {
      if (!isPhoneVerified(phone)) {
        res.status(403).json({
          message: "Randevuları görmek için telefonunuzu SMS ile doğrulayın.",
        });
        return;
      }
      sql += ` AND phone = ?`;
      params.push(phone);
    }
    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY date ASC, start_time ASC`;
    const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
    res.json(rows.map(rowToAppointment));
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.post("/api/appointments", (req, res) => {
  try {
    const body = req.body ?? {};
    const department = deptOrThrow(body.department);
    const slotId = String(body.slotId ?? "");
    const fullName = String(body.citizen?.fullName ?? "").trim();
    const phone = normalizePhone(String(body.citizen?.phone ?? ""));
    const email = body.citizen?.email
      ? String(body.citizen.email).trim()
      : undefined;

    if (fullName.length < 3) {
      res.status(400).json({ message: "Ad soyad giriniz." });
      return;
    }
    if (!isValidTrMobile(phone)) {
      res.status(400).json({ message: "Geçerli bir cep telefonu giriniz." });
      return;
    }
    if (!isPhoneVerified(phone)) {
      res.status(403).json({
        message: "Randevu oluşturmadan önce telefonunuzu SMS ile doğrulayın.",
      });
      return;
    }

    const slot = findSlot(department, slotId);
    if (!slot) {
      res.status(400).json({ message: "Seçilen saat geçersiz." });
      return;
    }

    const specialist = getSpecialist(department, slot.specialistId);
    if (!specialist) {
      res.status(400).json({ message: "Uzman bulunamadı." });
      return;
    }

    if (blockedSlotIds(department).has(slot.id)) {
      res.status(409).json({ message: "Bu saat personel tarafından kapatılmış." });
      return;
    }

    const existing = db
      .prepare(
        `SELECT id FROM appointments
         WHERE specialist_id = ? AND date = ? AND start_time = ? AND status != 'cancelled'`,
      )
      .get(slot.specialistId, slot.date, slot.startTime);
    if (existing) {
      res.status(409).json({
        message: "Bu saat dolu. Lütfen başka bir saat seçin.",
      });
      return;
    }

    const id = `${department === "dietitian" ? "DT" : "PS"}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const code = nextAppointmentCode(slot.date);
    const createdAt = new Date().toISOString();
    const assessment = body.assessment ?? {};
    const specialistName =
      String(body.specialistName || specialist.fullName || "").trim() ||
      String(specialist.fullName);

    try {
      db.prepare(
        `INSERT INTO appointments (
          id, code, phone, department, specialist_id, specialist_name,
          date, start_time, end_time, slot_id, full_name, email, status,
          sms_verified, consent_accepted, kvkk_accepted, assessment_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 1, ?, ?, ?, ?)`,
      ).run(
        id,
        code,
        phone,
        department,
        slot.specialistId,
        specialistName,
        slot.date,
        slot.startTime,
        slot.endTime,
        slot.id,
        fullName,
        email ?? null,
        body.consentAccepted === false ? 0 : 1,
        body.kvkkAccepted === false ? 0 : 1,
        JSON.stringify(assessment),
        createdAt,
      );
    } catch (err) {
      const msg = String((err as Error).message || err);
      if (msg.includes("UNIQUE") || msg.includes("unique")) {
        res.status(409).json({
          message: "Bu saat dolu. Lütfen başka bir saat seçin.",
        });
        return;
      }
      throw err;
    }

    console.info(`[sms] Randevu ${code} oluşturuldu`);

    const row = db
      .prepare(`SELECT * FROM appointments WHERE id = ?`)
      .get(id) as Record<string, unknown>;
    res.status(201).json(rowToAppointment(row));
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.patch("/api/appointments/:id", (req, res) => {
  try {
    const id = req.params.id;
    const status = String(req.body?.status ?? "");
    const allowed = ["pending", "confirmed", "completed", "cancelled", "no_show"];
    if (!allowed.includes(status)) {
      res.status(400).json({ message: "Geçersiz durum." });
      return;
    }
    const existing = db
      .prepare(`SELECT * FROM appointments WHERE id = ?`)
      .get(id) as Record<string, unknown> | undefined;
    if (!existing) {
      res.status(404).json({ message: "Randevu bulunamadı." });
      return;
    }
    const claimSpecialist = req.body?.specialistId
      ? String(req.body.specialistId)
      : "";
    if (claimSpecialist && String(existing.specialist_id) !== claimSpecialist) {
      res.status(403).json({
        message: "Bu randevu başka bir uzmana aittir.",
      });
      return;
    }
    db.prepare(`UPDATE appointments SET status = ? WHERE id = ?`).run(
      status,
      id,
    );
    const row = db
      .prepare(`SELECT * FROM appointments WHERE id = ?`)
      .get(id) as Record<string, unknown>;
    res.json(rowToAppointment(row));
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.delete("/api/appointments/:id", (req, res) => {
  try {
    const id = req.params.id;
    const phone = normalizePhone(String(req.query.phone ?? req.body?.phone ?? ""));
    const row = db
      .prepare(`SELECT * FROM appointments WHERE id = ?`)
      .get(id) as Record<string, unknown> | undefined;
    if (!row) {
      res.status(404).json({ message: "Randevu bulunamadı." });
      return;
    }
    if (phone && String(row.phone) !== phone) {
      res.status(403).json({ message: "Telefon eşleşmiyor." });
      return;
    }
    const status = String(row.status ?? "");
    if (status !== "pending" && status !== "confirmed") {
      res.status(409).json({
        message:
          status === "cancelled"
            ? "Bu randevu zaten iptal edilmiş."
            : "Bu randevu iptal edilemez.",
      });
      return;
    }
    db.prepare(
      `UPDATE appointments SET status = 'cancelled' WHERE id = ?`,
    ).run(id);
    res.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

app.post("/api/slots/block", (req, res) => {
  try {
    const department = deptOrThrow(req.body?.department);
    const slotId = String(req.body?.slotId ?? "");
    const closed = Boolean(req.body?.closed);
    const slot = findSlot(department, slotId);
    if (!slot) {
      res.status(404).json({ message: "Saat bulunamadı." });
      return;
    }
    if (bookedSlotIds(department).has(slot.id)) {
      res.status(409).json({ message: "Dolu saat kapatılamaz." });
      return;
    }
    if (closed) {
      db.prepare(
        `INSERT INTO blocked_slots (id, specialist_id, department, date, start_time, slot_id, reason, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slot_id) DO NOTHING`,
      ).run(
        `blk_${slot.id}`,
        slot.specialistId,
        department,
        slot.date,
        slot.startTime,
        slot.id,
        req.body?.reason ? String(req.body.reason) : null,
        new Date().toISOString(),
      );
    } else {
      db.prepare(`DELETE FROM blocked_slots WHERE slot_id = ?`).run(slot.id);
    }
    const enriched = enrichSlots(department, {
      specialistId: slot.specialistId,
      date: slot.date,
    }).find((s) => s.id === slot.id);
    res.json(enriched);
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ message: err.message });
  }
});

/** Demo doctor login — maps email to a single specialist. Not production auth. */
app.post("/api/doctor/login", (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  const accounts: {
    email: string;
    password: string;
    specialistId: string;
    department: DepartmentId;
  }[] = [
    {
      email: "demo.psikolog@atakum.bel.tr",
      password: "123456",
      specialistId: "ps_mehmet_akgun",
      department: "psychologist",
    },
    {
      email: "demo.diyetisyen@atakum.bel.tr",
      password: "123456",
      specialistId: "dt_ayse_yilmaz",
      department: "dietitian",
    },
  ];

  const match = accounts.find(
    (a) => a.email === email && a.password === password,
  );
  if (!match) {
    res.status(401).json({ message: "Giriş bilgileri hatalı." });
    return;
  }
  const specialist = getSpecialist(match.department, match.specialistId);
  if (!specialist) {
    res.status(500).json({ message: "Uzman kaydı bulunamadı." });
    return;
  }
  res.json({
    ok: true,
    role: "doctor",
    specialistId: match.specialistId,
    department: match.department,
    fullName: String(specialist.fullName),
    title: String(specialist.title ?? ""),
    photoUrl: String(specialist.photoUrl ?? ""),
  });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  },
);

app.listen(PORT, "127.0.0.1", () => {
  console.info(`[api] http://127.0.0.1:${PORT}`);
});
