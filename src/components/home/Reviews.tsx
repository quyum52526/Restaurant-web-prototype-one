"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { REVIEWS } from "@/data/restaurant";
import SectionHeading from "../SectionHeading";
import Stars from "../Stars";

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="border-t border-line py-24 lg:py-32">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Guest Reviews" title={<>Words from our <em className="text-gold-light">table</em></>} />
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews" className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 transition hover:border-gold hover:text-gold">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reviews" className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink transition hover:bg-gold-light">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
          aria-label="Guest reviews"
        >
          {REVIEWS.map((r) => (
            <figure
              key={r.id}
              data-card
              className="glass flex w-[85%] shrink-0 snap-start flex-col justify-between rounded-3xl p-8 sm:w-[60%] lg:w-[calc((100%-40px)/3)]"
            >
              <div>
                <Quote size={28} className="text-gold/60" />
                <blockquote className="mt-5 font-serif text-xl leading-relaxed text-cream/90">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 font-serif text-gold">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-cream/50">{r.role}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
