"use client";

import { useState } from "react";
import { FishMark } from "@/components/layout/fish-mark";

type Props = {
  src: string | null;
  alt: string;
  className?: string;
  /** Size of the silhouette shown when there is no photo or it fails to load. */
  fallbackClassName?: string;
};

/** Species photo that falls back to the fish silhouette instead of a broken-image icon. */
export function SpeciesPhoto({ src, alt, className = "", fallbackClassName = "h-12 w-12" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return <FishMark className={`${fallbackClassName} text-silhouette`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
