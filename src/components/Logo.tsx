import Link from "next/link";
import { RESTAURANT } from "@/data/restaurant";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${RESTAURANT.name} home`}>
      <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 font-serif text-lg italic text-gold transition group-hover:bg-gold group-hover:text-ink">
        A
      </span>
      <span className="leading-none">
        <span className="block font-serif text-xl tracking-wide">{RESTAURANT.name}</span>
        <span className="block text-[10px] uppercase tracking-[0.3em] text-cream/50">
          {RESTAURANT.tagline}
        </span>
      </span>
    </Link>
  );
}
