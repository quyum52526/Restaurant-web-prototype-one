"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Flame,
  Leaf,
  Menu,
  Ruler,
  ShoppingBag,
  Snowflake,
  Star,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

type Garnish = "leaf" | "berry" | "citrus";

type Drink = {
  id: string;
  name: [string, string];
  subtitle: string;
  tag: string;
  price: string;
  rating: string;
  background: string;
  accent: string;
  liquid: [string, string];
  garnish: Garnish;
  specs: { label: string; value: string }[];
};

// Demo content: names, prices and specs are placeholders for the prototype.
const DRINKS: Drink[] = [
  {
    id: "matcha",
    name: ["Matcha", "Zen"],
    subtitle:
      "Stone-ground ceremonial matcha whisked with oat milk and a hint of wildflower honey.",
    tag: "Ceremonial Grade",
    price: "6.50",
    rating: "4.9",
    background: "#1f3d2b",
    accent: "#b8d98a",
    liquid: ["#b5d67f", "#4f7d2f"],
    garnish: "leaf",
    specs: [
      { label: "Calories", value: "120 kcal" },
      { label: "Caffeine", value: "70 mg" },
      { label: "Size", value: "16 oz" },
      { label: "Serve", value: "Iced" },
    ],
  },
  {
    id: "acai",
    name: ["Acai", "Berry"],
    subtitle:
      "Amazonian acai blended with blueberries, banana and a splash of coconut water.",
    tag: "Antioxidant Boost",
    price: "7.25",
    rating: "4.8",
    background: "#3b1535",
    accent: "#f0a6de",
    liquid: ["#b04aa0", "#4a0f45"],
    garnish: "berry",
    specs: [
      { label: "Calories", value: "180 kcal" },
      { label: "Caffeine", value: "0 mg" },
      { label: "Size", value: "16 oz" },
      { label: "Serve", value: "Frozen" },
    ],
  },
  {
    id: "yuzu",
    name: ["Yuzu", "Citrus"],
    subtitle:
      "Bright Japanese yuzu shaken with sparkling water, lemongrass and raw cane sugar.",
    tag: "Seasonal Special",
    price: "6.90",
    rating: "4.7",
    background: "#8a5a0b",
    accent: "#ffd66b",
    liquid: ["#ffe07a", "#f0961c"],
    garnish: "citrus",
    specs: [
      { label: "Calories", value: "95 kcal" },
      { label: "Caffeine", value: "0 mg" },
      { label: "Size", value: "14 oz" },
      { label: "Serve", value: "Sparkling" },
    ],
  },
];

const SPEC_ICONS = [Flame, Coffee, Ruler, Snowflake];
const NAV_LINKS = ["Menu", "Our Story", "Locations", "Contact"];

export default function Home() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const direction = useRef<1 | -1>(1);
  const parallaxSetters = useRef<
    { x: gsap.QuickToFunc; y: gsap.QuickToFunc; depth: number }[]
  >([]);

  const drink = DRINKS[active];

  const { contextSafe } = useGSAP(
    () => {
      // Continuous idle float on the product and its shadow.
      gsap.to(floatRef.current, {
        y: -18,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".product-shadow", {
        scaleX: 0.8,
        opacity: 0.25,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Pointer parallax: each layer drifts according to its data-depth.
      parallaxSetters.current = gsap.utils
        .toArray<HTMLElement>(".parallax")
        .map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
          depth: Number(el.dataset.depth ?? 0),
        }));
    },
    { scope: containerRef },
  );

  // Enter animation for the active variant (also runs as the intro on mount).
  useGSAP(
    () => {
      const dir = direction.current;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      tl.fromTo(
        productRef.current,
        { scale: 0.55, rotate: dir * 30, opacity: 0, xPercent: dir * 40 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          xPercent: 0,
          duration: 1,
          ease: "back.out(1.4)",
        },
      )
        .fromTo(
          ".bg-word",
          { xPercent: dir * 15, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1.1 },
          0,
        )
        .fromTo(
          ".title-char",
          { yPercent: 110, rotate: dir * 8 },
          { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.035 },
          0.1,
        )
        .fromTo(
          ".subtitle-word",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.02 },
          0.25,
        )
        .fromTo(
          ".fade-item",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          0.3,
        )
        .fromTo(
          ".floater",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.35,
        );
    },
    { scope: containerRef, dependencies: [active] },
  );

  const goTo = contextSafe((next: number, dir: 1 | -1) => {
    if (isAnimating.current || next === active) return;
    isAnimating.current = true;
    direction.current = dir;
    const target = DRINKS[next];

    // Smooth color tween on the root container (background + accent var).
    gsap.to(containerRef.current, {
      backgroundColor: target.background,
      "--accent": target.accent,
      duration: 1.1,
      ease: "power2.inOut",
    });

    gsap
      .timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => setActive(next),
      })
      .to(productRef.current, {
        scale: 0.6,
        rotate: dir * -30,
        opacity: 0,
        xPercent: dir * -40,
        duration: 0.55,
      })
      .to(
        ".title-char",
        { yPercent: -110, duration: 0.4, stagger: 0.02 },
        0,
      )
      .to(
        ".subtitle-word",
        { yPercent: -100, opacity: 0, duration: 0.35, stagger: 0.008 },
        0,
      )
      .to(".fade-item", { y: -16, opacity: 0, duration: 0.3, stagger: 0.03 }, 0)
      .to(".floater", { scale: 0, opacity: 0, duration: 0.3 }, 0)
      .to(".bg-word", { xPercent: dir * -15, opacity: 0, duration: 0.5 }, 0);
  });

  const next = useCallback(
    () => goTo((active + 1) % DRINKS.length, 1),
    [active, goTo],
  );
  const prev = useCallback(
    () => goTo((active - 1 + DRINKS.length) % DRINKS.length, -1),
    [active, goTo],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    parallaxSetters.current.forEach(({ x, y, depth }) => {
      x(nx * depth);
      y(ny * depth);
    });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden text-white"
      style={
        {
          backgroundColor: DRINKS[0].background,
          "--accent": DRINKS[0].accent,
        } as CSSProperties
      }
    >
      {/* Ambient glow + giant background word */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-20 blur-[120px]" />
        <div
          className="parallax absolute inset-0 flex items-center justify-center"
          data-depth="-30"
        >
          <span
            key={drink.id}
            className="bg-word select-none whitespace-nowrap text-[28vw] font-black uppercase leading-none tracking-tighter text-transparent md:text-[20vw]"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}
          >
            {drink.name[0]}
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-5 md:px-12 md:py-7">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-black">
            <Leaf size={18} />
          </span>
          Sip Studio
        </a>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="transition-colors hover:text-white">
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
          >
            <ShoppingBag size={18} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-black">
              2
            </span>
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Stage */}
      <main className="relative z-10 grid flex-1 grid-cols-1 items-center gap-6 px-5 md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-12">
        {/* Copy */}
        <section className="order-2 text-center md:order-1 md:text-left">
          <span className="fade-item inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {drink.tag}
          </span>
          <h1
            key={drink.id}
            aria-label={drink.name.join(" ")}
            className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl"
          >
            {drink.name.map((word, wi) => (
              <span key={wi} aria-hidden className="block overflow-hidden pb-1">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className={`title-char inline-block ${wi === 1 ? "text-accent" : ""}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p
            key={`${drink.id}-sub`}
            className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/70 md:mx-0 md:text-base"
          >
            {drink.subtitle.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="subtitle-word inline-block">{word}&nbsp;</span>
              </span>
            ))}
          </p>
          <div className="fade-item mt-7 flex items-center justify-center gap-5 md:justify-start">
            <p className="text-4xl font-bold">
              <span className="align-top text-lg text-accent">$</span>
              {drink.price}
            </p>
            <button
              type="button"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              Order Now
            </button>
          </div>
        </section>

        {/* Product */}
        <section className="relative order-1 flex justify-center md:order-2">
          <div className="parallax relative" data-depth="24">
            <Floaters garnish={drink.garnish} />
            <div ref={floatRef} className="relative">
              <div ref={productRef} className="will-change-transform">
                <DrinkIllustration drink={drink} />
              </div>
            </div>
            <div className="product-shadow mx-auto -mt-2 h-5 w-40 rounded-[50%] bg-black/40 blur-md" />
          </div>
        </section>

        {/* Specs */}
        <section className="order-3 flex flex-col items-center gap-6 pb-4 md:items-end">
          <div className="fade-item flex items-center gap-2 text-sm text-white/80">
            <Star size={16} className="fill-accent text-accent" />
            <span className="font-semibold text-white">{drink.rating}</span>
            <span>/ 5 rating</span>
          </div>
          <ul className="grid w-full max-w-sm grid-cols-2 gap-3 md:w-auto md:grid-cols-1">
            {drink.specs.map((spec, i) => {
              const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <li
                  key={spec.label}
                  className="fade-item flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm md:min-w-[200px]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                    <Icon size={16} />
                  </span>
                  <div className="text-left">
                    <p className="text-[11px] uppercase tracking-widest text-white/50">
                      {spec.label}
                    </p>
                    <p className="text-sm font-semibold">{spec.value}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* Pagination + arrows */}
      <footer className="relative z-20 flex items-center justify-between gap-4 px-5 py-6 md:px-12 md:py-8">
        <p className="w-16 font-mono text-sm text-white/60">
          <span className="text-lg font-bold text-white">
            {String(active + 1).padStart(2, "0")}
          </span>{" "}
          / {String(DRINKS.length).padStart(2, "0")}
        </p>

        <div className="flex items-center gap-3" role="tablist" aria-label="Choose a drink">
          {DRINKS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={d.name.join(" ")}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-accent" : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous drink"
            onClick={prev}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next drink"
            onClick={next}
            className="grid h-11 w-11 place-items-center rounded-full bg-accent text-black transition-transform hover:scale-105"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

/** Decorative ingredients orbiting the product, one set per garnish type. */
function Floaters({ garnish }: { garnish: Garnish }) {
  const spots = [
    "-left-10 top-8 md:-left-20",
    "-right-8 top-24 md:-right-16",
    "-left-4 bottom-16 md:-left-12",
    "-right-10 bottom-6 md:-right-20",
  ];
  return (
    <>
      {spots.map((pos, i) => (
        <div
          key={`${garnish}-${i}`}
          className={`floater pointer-events-none absolute ${pos}`}
          style={{ rotate: `${i * 67}deg` }}
        >
          <GarnishShape garnish={garnish} size={i % 2 === 0 ? 42 : 30} />
        </div>
      ))}
    </>
  );
}

function GarnishShape({ garnish, size }: { garnish: Garnish; size: number }) {
  if (garnish === "leaf") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
        <path d="M6 34C6 16 18 6 34 6c0 18-10 28-28 28Z" fill="#8fc25a" />
        <path d="M8 32 30 10" stroke="#3e6b22" strokeWidth="1.5" />
      </svg>
    );
  }
  if (garnish === "berry") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="22" r="14" fill="#5b1f78" />
        <circle cx="15" cy="17" r="4" fill="#ffffff" opacity="0.25" />
        <path d="M16 8l4 4 4-4" stroke="#6fae4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="17" fill="#f7b92a" />
      <circle cx="20" cy="20" r="14" fill="#ffe58a" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="20"
          y1="20"
          x2={20 + 14 * Math.cos((i * Math.PI) / 4)}
          y2={20 + 14 * Math.sin((i * Math.PI) / 4)}
          stroke="#f7b92a"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/** Self-contained inline SVG drink so the hero never depends on remote assets. */
function DrinkIllustration({ drink }: { drink: Drink }) {
  const id = drink.id;
  const cup = "M58 120 L242 120 L220 392 Q218 410 200 410 L100 410 Q82 410 80 392 Z";
  return (
    <svg
      viewBox="0 0 300 440"
      className="h-[42vh] w-auto max-w-full drop-shadow-2xl md:h-[58vh]"
      role="img"
      aria-label={`${drink.name.join(" ")} drink`}
    >
      <defs>
        <linearGradient id={`liquid-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={drink.liquid[0]} />
          <stop offset="100%" stopColor={drink.liquid[1]} />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
        <clipPath id={`cup-${id}`}>
          <path d={cup} />
        </clipPath>
      </defs>

      {/* Straw */}
      <rect x="170" y="10" width="16" height="260" rx="8" fill={drink.accent} transform="rotate(14 178 140)" />
      <rect x="174" y="10" width="4" height="260" rx="2" fill="#ffffff" opacity="0.4" transform="rotate(14 178 140)" />

      {/* Liquid, ice and bubbles clipped to the cup */}
      <g clipPath={`url(#cup-${id})`}>
        <path
          d="M40 170 Q90 150 150 170 T260 168 L260 420 L40 420 Z"
          fill={`url(#liquid-${id})`}
        />
        <path d="M40 170 Q90 150 150 170 T260 168" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" fill="none" />
        <rect x="92" y="150" width="54" height="54" rx="10" fill="#ffffff" opacity="0.3" transform="rotate(-12 119 177)" />
        <rect x="150" y="190" width="48" height="48" rx="10" fill="#ffffff" opacity="0.25" transform="rotate(18 174 214)" />
        <rect x="110" y="232" width="42" height="42" rx="9" fill="#ffffff" opacity="0.2" transform="rotate(8 131 253)" />
        {[
          [120, 330, 5],
          [170, 300, 4],
          [150, 360, 6],
          [190, 350, 3],
          [105, 280, 3],
          [200, 270, 4],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.35" />
        ))}
      </g>

      {/* Glass */}
      <path d={cup} fill={`url(#glass-${id})`} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" />
      <ellipse cx="150" cy="120" rx="92" ry="12" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="3" />
      <path d="M80 140 L98 380" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="8" strokeLinecap="round" />

      {/* Rim garnish */}
      <g transform="translate(206 92)">
        <GarnishShape garnish={drink.garnish} size={64} />
      </g>
    </svg>
  );
}
