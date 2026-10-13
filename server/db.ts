/**
 * Demo persistence via Node.js built-in SQLite (no native compile step).
 * Requires: node --experimental-sqlite
 */
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "atakum-health.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
`);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      department TEXT NOT NULL,
      specialist_id TEXT NOT NULL,
      specialist_name TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      slot_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      sms_verified INTEGER NOT NULL DEFAULT 1,
      consent_accepted INTEGER NOT NULL DEFAULT 1,
      kvkk_accepted INTEGER NOT NULL DEFAULT 1,
      assessment_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_slot_active
      ON appointments(specialist_id, date, start_time)
      WHERE status != 'cancelled';

    CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_department ON appointments(department);

    CREATE TABLE IF NOT EXISTS blocked_slots (
      id TEXT PRIMARY KEY,
      specialist_id TEXT NOT NULL,
      department TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      slot_id TEXT NOT NULL UNIQUE,
      reason TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_blocked_specialist_date
      ON blocked_slots(specialist_id, date);

    CREATE TABLE IF NOT EXISTS otp_codes (
      phone TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_sent_at INTEGER NOT NULL,
      send_count INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS verified_phones (
      phone TEXT PRIMARY KEY,
      verified_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function nextAppointmentCode(dateISO: string): string {
  const day = dateISO.replaceAll("-", "");
  const prefix = `ATK-${day}-`;
  const row = db
    .prepare(
      `SELECT code FROM appointments WHERE code LIKE ? ORDER BY code DESC LIMIT 1`,
    )
    .get(prefix + "%") as { code: string } | undefined;
  let seq = 1;
  if (row?.code) {
    const part = row.code.split("-").pop();
    const n = Number(part);
    if (Number.isFinite(n)) seq = n + 1;
  }
  return `${prefix}${String(seq).padStart(3, "0")}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("5")) return `0${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return digits;
  if (digits.length === 12 && digits.startsWith("90"))
    return `0${digits.slice(2)}`;
  return digits;
}

export function isValidTrMobile(phone: string): boolean {
  const n = normalizePhone(phone);
  return /^05\d{9}$/.test(n);
}
