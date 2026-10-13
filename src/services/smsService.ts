import { api } from "@/lib/api";

export type SendCodeResult = {
  ok: boolean;
  message: string;
  demoCode?: string;
  retryAfterSec?: number;
};

export type VerifyCodeResult = {
  ok: boolean;
  message: string;
};

/** SMS doğrulama istemcisi — /api/auth/* uçlarına bağlanır. */
export const smsService = {
  sendCode(phone: string) {
    return api<SendCodeResult>("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },
  verifyCode(phone: string, code: string) {
    return api<VerifyCodeResult>("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    });
  },
};
