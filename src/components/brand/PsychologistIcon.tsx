import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/utils";

type PsychologistIconProps = {
  className?: string;
  size?: number;
  title?: string;
};

export function PsychologistIcon({
  className,
  size = 36,
  title = "Psikolog",
}: PsychologistIconProps) {
  return (
    <Image
      src="/brand/psychologist-icon.png"
      alt={title}
      width={size}
      height={size}
      unoptimized
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
