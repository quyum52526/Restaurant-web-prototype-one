import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, Recycle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SafeImage from "@/components/SafeImage";
import SectionHeading from "@/components/SectionHeading";
import { CHEFS, GALLERY, PHILOSOPHY } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Meet the chefs behind Ai Restaurant and the live-fire philosophy that shapes every plate.",
};

const PHILOSOPHY_ICONS = [Flame, Leaf, Recycle];

const MILESTONES = [
  { year: "2014", text: "A 40-seat room opens around a single oak-fired hearth." },
  { year: "2017", text: "Our dry-aging room is built; the 45-day ribeye is born." },
  { year: "2020", text: "Partnerships with twelve local farms and two day-boats." },
  { year: "2024", text: "The chef's counter opens — front-row seats to the fire." },
];

const GALLERY_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={<>Cooked over <em className="text-gold-light">fire</em>, served with care</>}
        intro="Ai Restaurant is a kitchen built around one hearth and a few simple rules: source close, cook with patience, waste nothing."
      />

      {/* Philosophy */}
      <section className="container-lux py-24">
        <SectionHeading
          eyebrow="Kitchen Philosophy"
          title="Three rules we never break"
          intro="They shape everything from the wood we burn to the way we plan tomorrow's menu."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PHILOSOPHY.map((p, i) => {
            const Icon = PHILOSOPHY_ICONS[i];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="glass h-full rounded-3xl p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                    <Icon size={22} />
                  </span>
                  <p className="mt-8 font-serif text-sm text-gold">0{i + 1}</p>
                  <h3 className="mt-1 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/60">{p.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Chefs */}
      <section className="border-y border-line bg-panel/40 py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="The Team" title={<>The hands behind the <em className="text-gold-light">hearth</em></>} />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {CHEFS.map((chef, i) => (
              <Reveal key={chef.name} delay={i * 0.08}>
                <article className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                    <SafeImage
                      src={chef.image}
                      alt={`${chef.name}, ${chef.role}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">{chef.role}</p>
                      <h3 className="mt-1 font-serif text-3xl">{chef.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-cream/60">{chef.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-lux grid gap-14 py-24 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="Milestones"
          title="A decade of slow cooking"
          intro="We have grown carefully, adding only what makes the food better."
        />
        <ol className="relative border-l border-line pl-8">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.06}>
              <li className="relative pb-10 last:pb-0">
                <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-ink" />
                <p className="font-serif text-3xl text-gold">{m.year}</p>
                <p className="mt-2 text-cream/70">{m.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Gallery */}
      <section className="border-t border-line py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Inside Ai Restaurant" title={<>The room, the <em className="text-gold-light">fire</em>, the plates</>} />
          <div className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {GALLERY.map((src, i) => (
              <Reveal key={src} delay={i * 0.05} className={GALLERY_LAYOUT[i]}>
                <div className="group relative h-full overflow-hidden rounded-3xl">
                  <SafeImage
                    src={src}
                    alt={`Ai Restaurant restaurant photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="max-w-lg font-serif text-3xl">Come and see the fire for yourself.</p>
            <Link href="/reservations" className="btn-gold">
              Reserve a table <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
