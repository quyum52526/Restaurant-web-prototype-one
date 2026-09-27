"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShoppingBag,
  Star,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { DISHES } from "@/data/restaurant";
import PlateFallback from "../PlateFallback";
import SafeImage from "../SafeImage";

gsap.registerPlugin(useGSAP);

type Tab = "overview" | "ingredients";

export default function Hero() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
  const rootRef = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  const dish = DISHES[active];

  const { contextSafe } = useGSAP(
    () => {
      // Continuous idle float for the plate.
      gsap.to(floatRef.current, {
        y: -10,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".plate-ring", { rotate: 360, duration: 60, ease: "none", repeat: -1 });
    },
    { scope: rootRef },
  );

  // Enter animation for the active dish (doubles as the intro on mount).
  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            animating.current = false;
          },
        })
        .fromTo(
          plateRef.current,
          { rotate: -45, scale: 0.6, opacity: 0 },
          { rotate: 0, scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.5)" },
        )
        .fromTo(
          ".hero-char",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, stagger: 0.018 },
          0.05,
        )
        .fromTo(
          ".hero-fade",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          0.2,
        );
    },
    { scope: rootRef, dependencies: [active] },
  );

  // Soft cross-fade whenever the card tab changes.
  useGSAP(
    () => {
      gsap.fromTo(".tab-panel", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
    },
    { scope: rootRef, dependencies: [tab], revertOnUpdate: true },
  );

  const goTo = contextSafe((index: number) => {
    const next = (index + DISHES.length) % DISHES.length;
    if (animating.current || next === active) return;
    animating.current = true;

    gsap.to(rootRef.current, {
      "--accent": DISHES[next].bgAccent,
      duration: 1.2,
      ease: "power2.inOut",
    });

    gsap
      .timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          setTab("overview");
          setActive(next);
        },
      })
      .to(plateRef.current, { rotate: 45, scale: 0.7, opacity: 0, duration: 0.45 })
      .to(".hero-char", { yPercent: -110, duration: 0.35, stagger: 0.008 }, 0)
      .to(".hero-fade", { y: -12, opacity: 0, duration: 0.3, stagger: 0.03 }, 0);
  });

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Keep the active thumbnail visible inside the rail without scrolling the page.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!rail || !thumb) return;
    rail.scrollTo({
      left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0) return; // only while the hero is on screen
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Signature dishes"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-6 pt-28 lg:pt-32"
      style={{ "--accent": DISHES[0].bgAccent } as CSSProperties}
    >
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_65%)] opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#f3ece0_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="container-lux relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.1fr)_1fr] lg:gap-6">
        {/* Copy */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="hero-fade eyebrow">
            {dish.category} · No. {String(active + 1).padStart(2, "0")}
          </p>
          <h1
            key={dish.id}
            aria-label={dish.name}
            className="mt-4 font-serif text-5xl leading-[1.02] sm:text-6xl xl:text-7xl"
          >
            {dish.name.split(" ").map((word, wi) => (
              <span key={wi} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                {word.split("").map((char, ci) => (
                  <span key={ci} className={`hero-char inline-block ${wi === 0 ? "italic text-gold-light" : ""}`}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-fade mx-auto mt-4 max-w-sm text-base text-cream/70 lg:mx-0">{dish.subtitle}</p>
          <div className="hero-fade mt-6 flex items-end justify-center gap-6 lg:justify-start">
            <p className="font-serif text-5xl">
              <span className="mr-1 align-top text-xl text-gold">$</span>
              {dish.price}
            </p>
            <p className="flex items-center gap-1.5 pb-2 text-sm text-cream/60">
              <Timer size={15} className="text-gold" /> {dish.prepTime} min
            </p>
          </div>
          <div className="hero-fade mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/menu" className="btn-gold">
              <ShoppingBag size={16} /> Order Food
            </Link>
            <Link href="/about" className="btn-ghost">
              <ChefHat size={16} /> Chef&apos;s Story
            </Link>
          </div>
        </div>

        {/* Plate */}
        <div className="relative order-1 flex justify-center lg:order-2">
          <div
            className="plate-ring pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(92vw,540px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cream/15"
            aria-hidden
          />
          <div ref={floatRef} className="relative">
            <div
              ref={plateRef}
              className="relative aspect-square w-[min(72vw,440px)] overflow-hidden rounded-full bg-panel shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_10px_rgba(243,236,224,0.06),0_0_0_22px_rgba(243,236,224,0.03)] will-change-transform"
            >
              <SafeImage
                key={dish.id}
                src={dish.image}
                alt={`Top view of ${dish.name}`}
                fill
                priority={active === 0}
                sizes="(max-width: 1024px) 72vw, 440px"
                className="object-cover"
                fallback={<PlateFallback accent={dish.bgAccent} label={`Illustration of ${dish.name}`} />}
              />
            </div>
          </div>
        </div>

        {/* Glass card */}
        <aside className="order-3 mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
          <div className="glass rounded-3xl p-6 shadow-2xl">
            <div className="hero-fade flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold text-ink">
                  <span className="font-serif text-xl font-semibold">{dish.rating.toFixed(1)}</span>
                </span>
                <div>
                  <div className="flex gap-0.5" aria-label={`${dish.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < Math.round(dish.rating) ? "fill-gold text-gold" : "text-cream/25"} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-cream/55">Guest rating</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {dish.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full border border-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div role="tablist" aria-label="Dish details" className="hero-fade mt-6 grid grid-cols-2 rounded-full bg-ink/50 p-1">
              {(["overview", "ingredients"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  id={`tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls="dish-panel"
                  onClick={() => setTab(t)}
                  className={`rounded-full py-2 text-sm capitalize transition ${
                    tab === t ? "bg-cream text-ink" : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div id="dish-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="hero-fade mt-5 min-h-[168px]">
              <div className="tab-panel">
                {tab === "overview" ? (
                  <>
                    <p className="text-sm leading-relaxed text-cream/70">{dish.description}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                      {[
                        { icon: Flame, label: "Calories", value: `${dish.calories}` },
                        { icon: Timer, label: "Prep", value: `${dish.prepTime}m` },
                        { icon: UtensilsCrossed, label: "Course", value: dish.category },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="rounded-2xl bg-ink/40 px-2 py-3">
                          <Icon size={15} className="mx-auto text-gold" />
                          <dd className="mt-1.5 text-sm font-semibold">{value}</dd>
                          <dt className="text-[10px] uppercase tracking-wider text-cream/45">{label}</dt>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ing) => (
                      <li key={ing} className="rounded-full border border-cream/15 bg-ink/40 px-3 py-1.5 text-xs text-cream/80">
                        {ing}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="hero-fade mt-5 flex gap-3 border-t border-line pt-5">
              <ChefHat size={18} className="mt-0.5 shrink-0 text-gold" />
              <p className="text-sm italic leading-relaxed text-cream/65">&ldquo;{dish.chefNote}&rdquo;</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Plate carousel */}
      <div className="container-lux relative mt-10">
        <div className="glass flex items-center gap-2 rounded-full p-2">
          <button type="button" onClick={prev} aria-label="Previous dish" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/20 transition hover:border-gold hover:text-gold">
            <ChevronLeft size={18} />
          </button>
          <div ref={railRef} className="no-scrollbar flex flex-1 snap-x gap-2 overflow-x-auto scroll-smooth" role="tablist" aria-label="Choose a dish">
            {DISHES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                data-index={i}
                aria-selected={i === active}
                aria-label={d.name}
                onClick={() => goTo(i)}
                className={`group flex shrink-0 snap-center items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition ${
                  i === active ? "bg-cream/10 ring-1 ring-gold" : "hover:bg-cream/5"
                }`}
              >
                <span className={`relative h-11 w-11 overflow-hidden rounded-full ring-2 transition ${i === active ? "ring-gold" : "ring-transparent"}`}>
                  <SafeImage
                    src={d.image}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                    fallback={<PlateFallback accent={d.bgAccent} label={d.name} />}
                  />
                </span>
                <span className="text-left">
                  <span className={`block whitespace-nowrap text-xs font-medium ${i === active ? "text-cream" : "text-cream/60"}`}>
                    {d.name}
                  </span>
                  <span className="block text-[11px] text-gold">${d.price}</span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next dish" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink transition hover:bg-gold-light">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
