/**
 * Geliştirme yardımcılarının görünürlüğü.
 * Üretim derlemesinde kapalıdır. Geliştirmede kapatmak için: VITE_DEMO_MODE=false
 */
export const isDemoMode = import.meta.env.DEV
  ? import.meta.env.VITE_DEMO_MODE !== "false"
  : false;

export const DEMO_CITIZEN = {
  fullName: "Ayşe Yılmaz",
  phoneDisplay: "0532 123 45 67",
  phoneRaw: "05321234567",
  email: "ayse.yilmaz@example.com",
} as const;

export const DEMO_SMS_CODE = "123456";
export const DEMO_DOCTOR_PIN = "1234";
export const DEMO_DOCTOR_EMAIL = "demo.psikolog@atakum.bel.tr";
export const DEMO_DOCTOR_PASSWORD = "123456";
export const DEMO_DIETITIAN_EMAIL = "demo.diyetisyen@atakum.bel.tr";
