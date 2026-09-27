/** Inline top-view plate illustration used when a dish photo cannot load. */
export default function PlateFallback({ accent, label }: { accent: string; label: string }) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id={`plate-${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fbf8f2" />
          <stop offset="100%" stopColor="#d9d2c5" />
        </radialGradient>
        <radialGradient id={`food-${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.75" />
          <stop offset="100%" stopColor={accent} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#plate-${id})`} />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#c9c0b0" strokeWidth="1.5" />
      <path
        d="M70 88c6-22 44-30 62-12 16 16 10 42-12 50-24 9-58-6-50-38Z"
        fill={`url(#food-${id})`}
      />
      <circle cx="92" cy="92" r="6" fill="#ffffff" opacity="0.35" />
      <circle cx="120" cy="112" r="4" fill="#ffffff" opacity="0.25" />
      <path d="M62 120c10 8 22 10 30 6" stroke="#6f8f3c" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="136" cy="80" r="5" fill="#6f8f3c" />
      <circle cx="144" cy="92" r="3.5" fill="#6f8f3c" />
    </svg>
  );
}
