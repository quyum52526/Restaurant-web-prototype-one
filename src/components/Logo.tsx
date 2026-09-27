import Image from "next/image";
import Link from "next/link";
import { RESTAURANT } from "@/data/restaurant";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${RESTAURANT.name} home`}>
      <Image
        src={RESTAURANT.logo}
        alt=""
        width={40}
        height={40}
        priority
        className="h-10 w-10 rounded-full ring-1 ring-gold/60 transition group-hover:ring-2 group-hover:ring-gold"
      />
      <span className="leading-none">
        <span className="block font-serif text-xl tracking-wide">{RESTAURANT.name}</span>
        <span className="block text-[10px] uppercase tracking-[0.3em] text-cream/50">
          {RESTAURANT.tagline}
        </span>
      </span>
    </Link>
  );
}
