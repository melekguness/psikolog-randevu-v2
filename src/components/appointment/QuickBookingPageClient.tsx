import { useSearchParams } from "@/lib/router";
import { QuickBookingForm } from "@/components/appointment/QuickBookingForm";
import type { DepartmentId } from "@/types";

function parseDepartment(value: string | null): DepartmentId | null {
  if (value === "dietitian" || value === "psychologist") return value;
  return null;
}

export function QuickBookingPageClient() {
  const [searchParams] = useSearchParams();
  const department = parseDepartment(searchParams.get("department"));

  return (
    <QuickBookingForm
      key={department ?? "none"}
      initialDepartment={department}
    />
  );
}
