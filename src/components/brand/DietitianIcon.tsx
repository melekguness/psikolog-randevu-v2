import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/utils";

type DietitianIconProps = {
  className?: string;
  size?: number;
  title?: string;
};

export function DietitianIcon({
  className,
  size = 44,
  title = "Diyetisyen",
}: DietitianIconProps) {
  return (
    <Image
      src="/brand/dietitian-icon.png"
      alt={title}
      width={size}
      height={size}
      unoptimized
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
