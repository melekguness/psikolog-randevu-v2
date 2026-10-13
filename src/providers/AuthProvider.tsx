import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DepartmentId } from "@/types";
import {
  type DoctorSession,
  DOCTOR_DEMO_PIN,
  readDoctorSession,
  writeDoctorSession,
} from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { useIsClient } from "@/lib/useIsClient";

interface AuthContextValue {
  ready: boolean;
  doctor: DoctorSession | null;
  loginDoctor: (input: {
    specialistId: string;
    department: DepartmentId;
    fullName: string;
    title: string;
    photoUrl: string;
    pin: string;
  }) => { ok: true } | { ok: false; message: string };
  loginDoctorByEmail: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; message: string }>;
  logoutDoctor: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const ready = useIsClient();
  const [doctor, setDoctor] = useState<DoctorSession | null | undefined>(
    undefined,
  );

  const session =
    !ready ? null : doctor === undefined ? readDoctorSession() : doctor;

  const loginDoctor = useCallback(
    (input: {
      specialistId: string;
      department: DepartmentId;
      fullName: string;
      title: string;
      photoUrl: string;
      pin: string;
    }) => {
      if (input.pin.trim() !== DOCTOR_DEMO_PIN) {
        return { ok: false as const, message: "Güvenlik kodu hatalı." };
      }
      const next: DoctorSession = {
        role: "doctor",
        specialistId: input.specialistId,
        department: input.department,
        fullName: input.fullName,
        title: input.title,
        photoUrl: input.photoUrl,
      };
      writeDoctorSession(next);
      setDoctor(next);
      return { ok: true as const };
    },
    [],
  );

  const loginDoctorByEmail = useCallback(
    async (input: { email: string; password: string }) => {
      try {
        const res = await api<{
          role: "doctor";
          specialistId: string;
          department: DepartmentId;
          fullName: string;
          title?: string;
          photoUrl?: string;
        }>("/api/doctor/login", {
          method: "POST",
          body: JSON.stringify(input),
        });
        const next: DoctorSession = {
          role: "doctor",
          specialistId: res.specialistId,
          department: res.department,
          fullName: res.fullName,
          title: res.title,
          photoUrl: res.photoUrl,
        };
        writeDoctorSession(next);
        setDoctor(next);
        return { ok: true as const };
      } catch (e) {
        return {
          ok: false as const,
          message:
            e instanceof ApiError ? e.message : "Giriş yapılamadı.",
        };
      }
    },
    [],
  );

  const logoutDoctor = useCallback(() => {
    writeDoctorSession(null);
    setDoctor(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      doctor: session,
      loginDoctor,
      loginDoctorByEmail,
      logoutDoctor,
    }),
    [ready, session, loginDoctor, loginDoctorByEmail, logoutDoctor],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider içinde kullanılmalı");
  return ctx;
}
