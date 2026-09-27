import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GALLERY } from "@/data/restaurant";
import Reveal from "../Reveal";
import SafeImage from "../SafeImage";

const STATS = [
  { value: "12", label: "Partner farms" },
  { value: "45", label: "Day dry-age" },
  { value: "300", label: "Wine labels" },
];

export default function StoryTeaser() {
  return (
    <section className="container-lux grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
      <Reveal className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <SafeImage src={GALLERY[0]} alt="Candle-lit dining room" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="glass absolute -bottom-8 right-4 max-w-[220px] rounded-2xl p-5 md:right-8">
          <p className="font-display text-4xl text-gold">Est. 2014</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/60">One hearth, one vision</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="eyebrow">Our Story</p>
        <h2 className="mt-5 text-balance font-display text-4xl leading-tight md:text-6xl">
          Where <em className="text-gold-light">fire</em> meets the finest of the field and sea.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-cream/65">
          Ai Restaurant began with a single wood-fired hearth and a simple belief: honest ingredients,
          treated with patience, need very little else. Every plate we send out is cooked over
          live oak, seasoned by smoke, and built around what our farmers and fishermen bring
          through the door that morning.
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-line py-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl text-cream">{s.value}</dd>
              <p className="mt-1 text-xs uppercase tracking-wider text-cream/50">{s.label}</p>
            </div>
          ))}
        </dl>
        <Link href="/about" className="btn-ghost mt-10">
          Discover our philosophy <ArrowRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}
