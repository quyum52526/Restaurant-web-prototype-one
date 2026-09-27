import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SIGNATURE_CATEGORIES } from "@/data/restaurant";
import Reveal from "../Reveal";
import SafeImage from "../SafeImage";
import SectionHeading from "../SectionHeading";

const LAYOUT = [
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
];

export default function CategoryBento() {
  return (
    <section className="border-y border-line bg-panel/40 py-24 lg:py-32">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Signature Categories"
            title={<>A menu written by the <em className="text-gold-light">seasons</em></>}
          />
          <Link href="/menu" className="btn-ghost self-start md:self-auto">
            Full menu <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid auto-rows-[260px] gap-5 md:grid-cols-2 md:auto-rows-[280px]">
          {SIGNATURE_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.08} className={LAYOUT[i]}>
              <Link
                href={cat.href}
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line p-7"
              >
                <SafeImage
                  src={cat.image}
                  alt={`${cat.title} at Ai Restaurant`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-ink/30 backdrop-blur transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                  <ArrowUpRight size={18} />
                </span>
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">0{i + 1}</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl">{cat.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-cream/70">{cat.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
