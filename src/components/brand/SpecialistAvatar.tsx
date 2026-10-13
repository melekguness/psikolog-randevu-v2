import { Image } from "@/components/ui/Image";
import { Brain, Salad } from "lucide-react";
import {
  isRemotePortraitUrl,
  resolveSpecialistIdByName,
  resolveSpecialistName,
  resolveSpecialistPhotoSrc,
  specialistInitials,
} from "@/lib/specialistAvatars";
import { cn } from "@/lib/utils";
import type { DepartmentId } from "@/types";

const SIZE = {
  xs: { box: "h-7 w-7", type: "text-[9px]", mark: 12, px: 28 },
  sm: { box: "h-10 w-10", type: "text-[11px]", mark: 14, px: 40 },
  md: { box: "h-14 w-14", type: "text-sm", mark: 16, px: 56 },
  lg: { box: "h-[4.5rem] w-[4.5rem]", type: "text-lg", mark: 18, px: 72 },
  xl: { box: "h-28 w-28", type: "text-2xl", mark: 18, px: 112 },
} as const;

export function SpecialistAvatar({
  specialistId,
  fullName,
  photoUrl,
  department,
  size = "md",
  className,
  title,
  showDeptMark = false,
}: {
  specialistId?: string;
  fullName?: string;
  photoUrl?: string;
  department: DepartmentId;
  size?: keyof typeof SIZE;
  className?: string;
  title?: string;
  showDeptMark?: boolean;
}) {
  const psych = department === "psychologist";
  const token = SIZE[size];
  const resolvedId = specialistId ?? resolveSpecialistIdByName(fullName);
  const name = resolveSpecialistName(resolvedId, fullName);
  const src = resolveSpecialistPhotoSrc(resolvedId, photoUrl);
  const remote = isRemotePortraitUrl(src);
  const initials =
    specialistInitials(name) || (psych ? "P" : "D");
  const label =
    title ??
    (name
      ? `${name} doktor illüstrasyonu`
      : "Doktor illüstrasyonu");

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 ring-white",
          psych ? "bg-[#1E293B]" : "bg-[#4A6B5D]",
          token.box,
        )}
        aria-label={label}
        role="img"
      >
        {src && remote ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={`${token.px}px`}
            className="rounded-full object-cover"
          />
        ) : src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={`${token.px}px`}
            className="rounded-full object-cover object-top"
          />
        ) : (
          <span
            className={cn(
              "relative z-10 font-semibold tracking-wide text-white",
              token.type,
            )}
          >
            {initials}
          </span>
        )}
      </span>
      {showDeptMark ? (
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 inline-flex items-center justify-center rounded-full p-1.5 text-white shadow-md ring-2 ring-white",
            psych ? "bg-[#1E293B]" : "bg-[#4A6B5D]",
          )}
          aria-hidden
        >
          {psych ? (
            <Brain className="h-3.5 w-3.5" strokeWidth={2.25} />
          ) : (
            <Salad className="h-3.5 w-3.5" strokeWidth={2.25} />
          )}
        </span>
      ) : null}
    </span>
  );
}
