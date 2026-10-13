/**
 * SMS doğrulama katmanı (yerel/staj sürümü).
 * İleride Twilio / Netgsm / İleti Merkezi ile değiştirilebilir.
 */
import { db, normalizePhone } from "./db.js";

export const DEMO_OTP_CODE = "123456";
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_SENDS_PER_WINDOW = 5;
const MAX_ATTEMPTS = 5;
const VERIFIED_TTL_MS = 30 * 60 * 1000;

export type SmsSendResult = {
  ok: boolean;
  message: string;
  demoCode?: string;
  retryAfterSec?: number;
};

export type SmsVerifyResult = {
  ok: boolean;
  message: string;
};

export function sendOtp(rawPhone: string): SmsSendResult {
  const phone = normalizePhone(rawPhone);
  const now = Date.now();
  const existing = db
    .prepare(`SELECT * FROM otp_codes WHERE phone = ?`)
    .get(phone) as
    | {
        code: string;
        expires_at: number;
        attempts: number;
        last_sent_at: number;
        send_count: number;
      }
    | undefined;

  if (existing) {
    const since = now - existing.last_sent_at;
    if (since < RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        message: "Lütfen yeni kod istemeden önce kısa süre bekleyin.",
        retryAfterSec: Math.ceil((RESEND_COOLDOWN_MS - since) / 1000),
      };
    }
    if (existing.send_count >= MAX_SENDS_PER_WINDOW && since < OTP_TTL_MS) {
      return {
        ok: false,
        message: "Çok fazla kod isteği. Lütfen daha sonra tekrar deneyin.",
      };
    }
  }

  // Never re-issue the sentinel used after successful verify as a live code.
  const code = DEMO_OTP_CODE;
  const expiresAt = now + OTP_TTL_MS;
  const sendCount =
    existing && now - existing.last_sent_at < OTP_TTL_MS
      ? existing.send_count + 1
      : 1;

  db.prepare(
    `INSERT INTO otp_codes (phone, code, expires_at, attempts, last_sent_at, send_count)
     VALUES (?, ?, ?, 0, ?, ?)
     ON CONFLICT(phone) DO UPDATE SET
       code = excluded.code,
       expires_at = excluded.expires_at,
       attempts = 0,
       last_sent_at = excluded.last_sent_at,
       send_count = excluded.send_count`,
  ).run(phone, code, expiresAt, now, sendCount);

  console.info(`[sms] ${phone} → kod gönderildi`);

  return {
    ok: true,
    message: "Doğrulama kodu gönderildi.",
    demoCode: code,
  };
}

export function verifyOtp(rawPhone: string, code: string): SmsVerifyResult {
  const phone = normalizePhone(rawPhone);
  const now = Date.now();
  const row = db
    .prepare(`SELECT * FROM otp_codes WHERE phone = ?`)
    .get(phone) as
    | {
        code: string;
        expires_at: number;
        attempts: number;
      }
    | undefined;

  if (!row || row.code === "__used__") {
    return { ok: false, message: "Önce doğrulama kodu isteyin." };
  }
  if (row.expires_at < now) {
    return { ok: false, message: "Doğrulama kodunun süresi dolmuş." };
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return {
      ok: false,
      message: "Çok fazla hatalı deneme. Yeni kod isteyin.",
    };
  }

  if (String(code).trim() !== row.code) {
    db.prepare(`UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ?`).run(
      phone,
    );
    return { ok: false, message: "SMS kodu hatalı." };
  }

  // Keep row so resend cooldown / rate-limit still apply after verify.
  db.prepare(
    `UPDATE otp_codes SET code = '__used__', expires_at = 0, attempts = 0 WHERE phone = ?`,
  ).run(phone);
  db.prepare(
    `INSERT INTO verified_phones (phone, verified_at, expires_at)
     VALUES (?, ?, ?)
     ON CONFLICT(phone) DO UPDATE SET
       verified_at = excluded.verified_at,
       expires_at = excluded.expires_at`,
  ).run(phone, now, now + VERIFIED_TTL_MS);

  return { ok: true, message: "Telefon doğrulandı." };
}

export function isPhoneVerified(rawPhone: string): boolean {
  const phone = normalizePhone(rawPhone);
  const now = Date.now();
  const row = db
    .prepare(`SELECT expires_at FROM verified_phones WHERE phone = ?`)
    .get(phone) as { expires_at: number } | undefined;
  return Boolean(row && row.expires_at >= now);
}
