import type { ImgHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Reserved prop; not used by the native img implementation. */
  unoptimized?: boolean;
};

/** Image wrapper around a standard img element. */
export function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  style,
  sizes: _sizes,
  unoptimized: _unoptimized,
  ...props
}: ImageProps) {
  const mergedStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : { width, height, ...style };

  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      style={mergedStyle}
      {...props}
    />
  );
}
