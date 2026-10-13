import { Suspense } from "react";
import { QuickBookingPageClient } from "@/components/appointment/QuickBookingPageClient";
import { Skeleton } from "@/components/ui/Skeleton";

function BookingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" role="status">
      <p className="sr-only">Randevu formu yükleniyor</p>
      <div className="mx-auto max-w-[700px] space-y-3 text-center">
        <Skeleton className="mx-auto h-6 w-36 rounded-full" />
        <Skeleton className="mx-auto h-10 w-56 rounded-lg" />
        <Skeleton className="mx-auto h-4 w-72 max-w-full rounded-md" />
      </div>
      <div className="space-y-5 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[120px] rounded-2xl" />
          <Skeleton className="h-[120px] rounded-2xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}

/** Dedicated online appointment wizard. */
export function BookingPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] overflow-x-clip py-8 font-sans md:py-10">
      <Suspense fallback={<BookingSkeleton />}>
        <QuickBookingPageClient />
      </Suspense>
    </div>
  );
}
