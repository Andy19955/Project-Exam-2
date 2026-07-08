"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const defaultFallbackSrc = "/images/venue-placeholder.svg";

type MediaImageProps = Omit<ImageProps, "src" | "alt" | "fill" | "onError"> & {
  src?: string | null;
  alt: string;
  fill?: boolean;
  fallbackSrc?: string;
};

export default function MediaImage({ src, alt, fallbackSrc = defaultFallbackSrc, fill = false, ...imageProps }: MediaImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = !src || failedSrc === src ? fallbackSrc : src;

  return <Image {...imageProps} src={currentSrc} alt={alt} fill={fill} onError={() => setFailedSrc(src ?? null)} />;
}
