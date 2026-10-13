import { isValidTrMobile, unmaskPhone } from "@/lib/phone";
import type { DepartmentId } from "@/types";

export type BookingFieldErrors = {
  fullName?: string;
  phone?: string;
  email?: string;
  department?: string;
  slot?: string;
  sms?: string;
  notice?: string;
};

export function validateFullName(name: string): string | undefined {
  if (!name.trim()) {
    return "Ad soyad giriniz.";
  }
  if (name.trim().length < 3) {
    return "Ad soyad en az 3 karakter olmalıdır.";
  }
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) {
    return "Telefon numarası giriniz.";
  }
  if (!isValidTrMobile(phone)) {
    return "Geçerli bir cep telefonu giriniz (05XX XXX XX XX).";
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return "Geçerli bir e-posta adresi giriniz.";
  }
  return undefined;
}

export function validateSmsCode(code: string): string | undefined {
  const trimmed = code.trim();
  if (!trimmed) return "SMS kodunu giriniz.";
  if (!/^\d{6}$/.test(trimmed)) return "Doğrulama kodu 6 haneli olmalıdır.";
  return undefined;
}

export type BookingFormInput = {
  fullName: string;
  phone: string;
  email: string;
  department: DepartmentId | null;
  slotId: string | null;
  smsVerified: boolean;
  noticeAccepted: boolean;
};

export function validateBookingForm(input: BookingFormInput): BookingFieldErrors {
  const errors: BookingFieldErrors = {};

  if (!input.department) {
    errors.department = "Psikolog veya diyetisyen seçiniz.";
  } else if (!input.slotId) {
    errors.slot = "Müsait bir randevu saati seçiniz.";
  }

  const nameError = validateFullName(input.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validatePhone(input.phone);
  if (phoneError) errors.phone = phoneError;

  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;

  if (!input.smsVerified) {
    errors.sms = "Telefon numaranızı SMS kodu ile doğrulayınız.";
  }
  if (!input.noticeAccepted) {
    errors.notice = "KVKK Aydınlatma Metni’ni okuduğunuzu onaylayınız.";
  }

  return errors;
}

export function hasBookingErrors(errors: BookingFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const BOOKING_ERROR_ORDER: (keyof BookingFieldErrors)[] = [
  "department",
  "slot",
  "fullName",
  "phone",
  "email",
  "sms",
  "notice",
];

export function listBookingErrors(errors: BookingFieldErrors): string[] {
  return BOOKING_ERROR_ORDER.flatMap((key) => {
    const message = errors[key];
    return message ? [message] : [];
  });
}

export function toCitizenPhone(phone: string): string {
  return unmaskPhone(phone);
}
