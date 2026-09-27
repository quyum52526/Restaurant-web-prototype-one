import { Star } from "lucide-react";

export default function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-gold-light text-gold-light" : "text-cream/20"}
        />
      ))}
    </div>
  );
}
