import Image from "next/image";
import Link from "next/link";
import { RESTAURANT } from "@/data/restaurant";

type LogoProps = {
  /** Tailwind height classes for the illustration; width follows the artwork's aspect ratio. */
  imageClassName?: string;
};

export default function Logo({ imageClassName = "h-12 md:h-14" }: LogoProps) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${RESTAURANT.name} home`}>
      <Image
        src={RESTAURANT.logo}
        alt=""
        width={112}
        height={112}
        priority
        className={`${imageClassName} w-auto object-contain drop-shadow transition group-hover:scale-105`}
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
