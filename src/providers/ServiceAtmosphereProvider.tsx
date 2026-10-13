
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, usePathname } from "@/lib/router";
import type { DepartmentId } from "@/types";

type AtmosphereContext = {
  service: DepartmentId | null;
  setService: (next: DepartmentId | null) => void;
};

const ServiceAtmosphereContext = createContext<AtmosphereContext | null>(null);

function parseDepartment(value: string | null): DepartmentId | null {
  if (value === "psychologist" || value === "dietitian") return value;
  return null;
}

function serviceFromPath(pathname: string): DepartmentId | null {
  if (pathname.includes("/randevu/psychologist")) return "psychologist";
  if (pathname.includes("/randevu/dietitian")) return "dietitian";
  return null;
}

function serviceFromSearch(search: string): DepartmentId | null {
  return parseDepartment(new URLSearchParams(search).get("department"));
}

export function ServiceAtmosphereProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { search } = useLocation();
  const [picked, setPicked] = useState<DepartmentId | null>(null);
  const routeService = serviceFromPath(pathname);
  const queryService = serviceFromSearch(search);
  const service = picked ?? queryService ?? routeService;

  useEffect(() => {
    const root = document.documentElement;
    if (service) {
      root.setAttribute("data-service", service);
    } else {
      root.removeAttribute("data-service");
    }
  }, [service]);

  const setService = useCallback((next: DepartmentId | null) => {
    setPicked(next);
  }, []);

  const value = useMemo(
    () => ({ service, setService }),
    [service, setService],
  );

  return (
    <ServiceAtmosphereContext.Provider value={value}>
      {children}
    </ServiceAtmosphereContext.Provider>
  );
}

export function useServiceAtmosphere() {
  const ctx = useContext(ServiceAtmosphereContext);
  if (!ctx) {
    throw new Error("useServiceAtmosphere ServiceAtmosphereProvider içinde kullanılmalı");
  }
  return ctx;
}
