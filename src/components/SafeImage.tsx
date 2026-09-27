"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { UtensilsCrossed } from "lucide-react";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  /** Rendered instead of the image if it fails to load. */
  fallback?: ReactNode;
};

/**
 * next/image wrapper that never shows a broken-image icon. It swaps to the
 * fallback on load errors, including errors that happen before hydration
 * (when React's onError has not been attached yet).
 */
export default function SafeImage({ fallback, alt, className, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <>
        {fallback ?? (
          <div
            role="img"
            aria-label={alt}
            className="absolute inset-0 grid place-items-center bg-gradient-to-br from-panel via-[#1d1813] to-[#2a2118] text-gold/40"
          >
            <UtensilsCrossed className="h-1/4 max-h-16 w-1/4 max-w-16" strokeWidth={1.2} />
          </div>
        )}
      </>
    );
  }

  return (
    <Image
      ref={imgRef}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
