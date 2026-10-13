
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/utils";

interface AtakumLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}
export function AtakumLogo({
  className,
  size = 44,
  priority = false,
}: AtakumLogoProps) {
  return (
    <Image
      src="/brand/atakum-logo.svg"
      alt="Atakum Belediyesi logosu"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
