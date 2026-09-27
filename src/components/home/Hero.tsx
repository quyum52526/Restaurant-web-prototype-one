"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Flame,
  Pause,
  Play,
  ShoppingBag,
  Star,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { DISHES, formatPrice, type Dish } from "@/data/restaurant";
import PlateFallback from "../PlateFallback";
import SafeImage from "../SafeImage";

gsap.registerPlugin(useGSAP);

type Tab = "overview" | "ingredients";

const COUNT = DISHES.length;
/** Degrees between neighbouring plates on the 360° orbit. */
const STEP = 360 / COUNT;
const ORBIT_DURATION = 0.7;
/** Time each dish stays centre stage before the orbit auto-advances. */
const AUTOPLAY_MS = 4500;
/** If a tick lands mid-transition, retry shortly instead of skipping a beat. */
const AUTOPLAY_RETRY_MS = 250;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Long names step down a size so every title fits in about three lines and the hero never jumps. */
const titleSize = (name: string) =>
  name.length > 26 ? "text-4xl sm:text-[2.75rem]" : name.length > 20 ? "text-[2.75rem] sm:text-5xl" : "text-5xl sm:text-6xl";

/**
 * Plate sizes are tuned so the active plate and its neighbours never touch.
 * Neighbouring slot centres sit a chord of 2·r·sin(STEP/2) apart (0.618r for
 * 10 plates); the plate box is 0.95r wide, so the radii below add up to
 * 0.95r·(ACTIVE + NEIGHBOUR)/2 ≈ 0.59r, leaving a small visible gap.
 */
const ACTIVE_SCALE = 0.92;
const NEIGHBOUR_SCALE = 0.32;
/**
 * The ring's centre sits this far (× r) below the stage's bottom edge. Smaller
 * plates leave the lower ring empty, so sinking it trims dead space while the
 * neighbours (lowest edge ≈ 0.66r above the centre) stay clear of the fade.
 */
const RING_DROP = 0.38;

/** Where a plate sits relative to the active one decides how it looks. */
function plateState(index: number, active: number) {
  const offset = mod(index - active, COUNT);
  if (offset === 0) return { scale: ACTIVE_SCALE, opacity: 1, zIndex: 3 };
  if (offset === 1 || offset === COUNT - 1) return { scale: NEIGHBOUR_SCALE, opacity: 0.55, zIndex: 2 };
  // Everything further round the ring waits out of sight.
  return { scale: NEIGHBOUR_SCALE * 0.8, opacity: 0, zIndex: 1 };
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const floatTween = useRef<gsap.core.Tween | null>(null);
  const animating = useRef(false);
  /** Cumulative orbit position, so the ring always turns the short way round. */
  const position = useRef(0);

  // Autoplay: runs only while nothing below asks it to hold.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Bumped each time a fresh countdown starts; restarts the progress ring. */
  const [cycle, setCycle] = useState(0);
  const autoplayTimer = useRef<number | null>(null);
  const autoAdvance = useRef<() => void>(() => {});
  const autoplaying = !hovered && !focused && !userPaused && !pageHidden && inView && !reducedMotion;

  const dish = DISHES[active];

  // Size the orbit to the stage: its radius drives every plate position via --r.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const radius = Math.min(stage.clientWidth / 1.9, 380);
      stage.style.setProperty("--r", `${Math.round(radius)}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      // Place every plate upright at its resting state, then play the intro.
      plateRefs.current.forEach((plate, i) => {
        const { scale, opacity } = plateState(i, 0);
        gsap.set(plate, { rotation: -i * STEP, scale, opacity });
      });
      gsap.fromTo(
        plateRefs.current[0],
        { scale: ACTIVE_SCALE * 0.5, opacity: 0 },
        { scale: ACTIVE_SCALE, opacity: 1, duration: 1.1, ease: "back.out(1.2)" },
      );
      gsap.from(".orbit-ring", { scale: 0.85, opacity: 0, duration: 1.2, ease: "power3.out" });
    },
    { scope: rootRef },
  );

  // Text + card enter animation and the active plate's idle float.
  useGSAP(
    () => {
      floatTween.current?.kill();
      floatRefs.current.forEach((el, i) => {
        if (i !== active) gsap.to(el, { y: 0, duration: 0.4, ease: "power2.out" });
      });
      floatTween.current = gsap.to(floatRefs.current[active], {
        y: -10,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-char", { yPercent: 110 }, { yPercent: 0, duration: 0.65, stagger: 0.016 })
        .fromTo(
          ".hero-fade",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.05 },
          0.1,
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

  const goTo = contextSafe((target: number) => {
    const next = mod(target, COUNT);
    // Shortest signed distance round the ring, e.g. 5 → 0 is +1, not -5.
    const delta = mod(next - active + COUNT / 2, COUNT) - COUNT / 2;
    if (animating.current || delta === 0) return;
    animating.current = true;

    position.current += delta;
    const rotation = -position.current * STEP;
    const duration = ORBIT_DURATION + (Math.abs(delta) - 1) * 0.15;

    slotRefs.current.forEach((slot, i) => {
      if (slot) slot.style.zIndex = String(plateState(i, next).zIndex);
    });

    gsap.to(rootRef.current, {
      "--accent": DISHES[next].bgAccent,
      duration: 1.1,
      ease: "power2.inOut",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });

    tl.to(orbitRef.current, { rotation, duration, ease: "power2.inOut" }, 0);

    plateRefs.current.forEach((plate, i) => {
      const { scale, opacity } = plateState(i, next);
      const incoming = i === next;
      // Counter-rotate so every plate stays upright while the ring turns.
      tl.to(plate, { rotation: -i * STEP - rotation, duration, ease: "power2.inOut" }, 0).to(
        plate,
        {
          scale,
          opacity,
          duration: incoming ? duration + 0.15 : duration,
          ease: incoming ? "back.out(1.1)" : "power2.inOut",
        },
        incoming ? 0.1 : 0,
      );
    });

    tl.to(".hero-char", { yPercent: -110, duration: 0.3, stagger: 0.006, ease: "power2.in" }, 0)
      .to(".hero-fade", { y: -12, opacity: 0, duration: 0.25, stagger: 0.025, ease: "power2.in" }, 0)
      .call(
        () => {
          setTab("overview");
          setActive(next);
        },
        [],
        0.32,
      );
  });

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  // The timer outlives renders, so it always calls the latest `next`.
  autoAdvance.current = next;

  // One countdown per dish. Because it restarts whenever `active` changes,
  // manual navigation (arrows, thumbnails, plates, keys) resets it too, so an
  // auto tick can never fire right on top of a user's click.
  useEffect(() => {
    if (!autoplaying) return;
    setCycle((c) => c + 1);
    const tick = () => {
      if (animating.current) {
        autoplayTimer.current = window.setTimeout(tick, AUTOPLAY_RETRY_MS);
        return;
      }
      autoAdvance.current();
    };
    autoplayTimer.current = window.setTimeout(tick, AUTOPLAY_MS);
    return () => {
      if (autoplayTimer.current !== null) window.clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    };
  }, [active, autoplaying]);

  // Hold while the tab is in the background, so no transitions queue up.
  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Hold while the hero is scrolled out of view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Respect users who ask the OS for less motion.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const pauseOnHover = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setHovered(true);
  };

  // Keyboard users get time to read too; mouse clicks (no focus ring) don't pause.
  const onFocusIn = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) setFocused(true);
  };
  const onFocusOut = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

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
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="container-lux relative grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6">
        {/* Copy */}
        <div className="relative z-10 order-2 text-center lg:order-1 lg:text-left">
          <p className="hero-fade eyebrow">
            {dish.category} · No. {String(active + 1).padStart(2, "0")}
          </p>
          <h1
            key={dish.id}
            aria-label={dish.name}
            className={`mt-4 font-display leading-[1.05] ${titleSize(dish.name)}`}
          >
            {dish.name.split(" ").map((word, wi) => (
              <span key={wi} aria-hidden className="mr-[0.25em] inline-block overflow-hidden whitespace-nowrap pb-2 align-bottom">
                {wi === 0 ? (
                  <span className="hero-char inline-block pr-1 font-script font-normal tracking-normal text-gold-light">
                    {word}
                  </span>
                ) : (
                  word.split("").map((char, ci) => (
                    <span key={ci} className="hero-char inline-block">
                      {char}
                    </span>
                  ))
                )}
              </span>
            ))}
          </h1>
          <p className="hero-fade mx-auto mt-3 max-w-sm font-script text-2xl text-cream/85 lg:mx-0">{dish.subtitle}</p>
          <div className="hero-fade mt-6 flex items-end justify-center gap-6 lg:justify-start">
            <p className="font-display text-5xl text-gold-light">
              <span className="mr-1 align-top text-3xl text-gold">৳</span>
              {dish.price.toLocaleString("en-US")}
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

        {/* Orbit stage: the ring's centre sits just below the stage's bottom edge,
            so only the upper arc of the orbit is visible and the rest is clipped. */}
        <div
          ref={stageRef}
          onPointerEnter={pauseOnHover}
          className="relative order-1 w-full lg:order-2"
          style={{ "--r": "240px", height: `calc(var(--r) * ${1.68 - RING_DROP})` } as CSSProperties}
        >
          <div
            className="pointer-events-none absolute -inset-x-[50vw] -top-[50vh] bottom-0 overflow-hidden"
            // Feather the clip line so plates dissolve into the horizon instead of being sliced.
            style={{
              maskImage: "linear-gradient(to bottom, #000 calc(100% - var(--r) * 0.22), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - var(--r) * 0.22), transparent)",
            }}
          >
            {/* Spotlight behind the active plate */}
            <div
              className="absolute left-1/2 h-[calc(var(--r)*1.3)] w-[calc(var(--r)*1.3)] -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/15 blur-3xl"
              style={{ bottom: `calc(var(--r) * ${1 - RING_DROP})` }}
              aria-hidden
            />
            <div ref={orbitRef} className="absolute left-1/2 h-0 w-0" style={{ bottom: `calc(var(--r) * ${-RING_DROP})` }}>
              <div
                className="orbit-ring absolute left-[calc(var(--r)*-1)] top-[calc(var(--r)*-1)] h-[calc(var(--r)*2)] w-[calc(var(--r)*2)] rounded-full border border-dashed border-cream/20"
                aria-hidden
              />
              <div
                className="orbit-ring absolute left-[calc(var(--r)*-1.28)] top-[calc(var(--r)*-1.28)] h-[calc(var(--r)*2.56)] w-[calc(var(--r)*2.56)] rounded-full border border-cream/[0.06]"
                aria-hidden
              />
              {DISHES.map((d, i) => {
                const initial = plateState(i, 0);
                return (
                  <div
                    key={d.id}
                    ref={(el) => {
                      slotRefs.current[i] = el;
                    }}
                    className="absolute left-0 top-0"
                    style={{
                      transform: `rotate(${i * STEP}deg) translateY(calc(var(--r) * -1))`,
                      zIndex: initial.zIndex,
                    }}
                  >
                    <div
                      ref={(el) => {
                        plateRefs.current[i] = el;
                      }}
                      className="absolute h-[calc(var(--r)*0.95)] w-[calc(var(--r)*0.95)] will-change-transform"
                      style={{
                        marginLeft: "calc(var(--r) * -0.475)",
                        marginTop: "calc(var(--r) * -0.475)",
                        transform: `rotate(${-i * STEP}deg) scale(${initial.scale})`,
                        opacity: initial.opacity,
                      }}
                    >
                      <div
                        ref={(el) => {
                          floatRefs.current[i] = el;
                        }}
                        className="h-full w-full"
                      >
                        <OrbitPlate dish={d} active={i === active} priority={i < 2 || i === COUNT - 1} onSelect={() => goTo(i)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Glass card */}
        <aside
          onPointerEnter={pauseOnHover}
          className="relative z-10 order-3 mx-auto w-full max-w-md lg:ml-auto lg:mr-0"
        >
          <div className="glass rounded-3xl p-6 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
            <div className="hero-fade flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-light to-gold text-ink shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)]">
                  <span className="font-display text-xl">{dish.rating.toFixed(1)}</span>
                </span>
                <div>
                  <div className="flex gap-0.5" aria-label={`${dish.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < Math.round(dish.rating) ? "fill-gold-light text-gold-light" : "text-cream/20"} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-cream/55">Guest rating</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {dish.tags.slice(0, 2).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div role="tablist" aria-label="Dish details" className="hero-fade mt-6 grid grid-cols-2 rounded-full border border-line bg-ink/70 p-1">
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
                    tab === t ? "bg-gold font-semibold text-ink" : "text-cream/60 hover:text-gold-light"
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
                        <div key={label} className="rounded-2xl border border-line bg-ink/60 px-2 py-3">
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
                      <li key={ing} className="rounded-full border border-line bg-ink/60 px-3 py-1.5 text-xs text-cream/80">
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
      <div className="container-lux relative z-10 mt-10">
        <div className="glass flex items-center gap-2 rounded-full p-2">
          <button type="button" onClick={prev} aria-label="Previous dish" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold">
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
                  i === active ? "bg-gold/10 ring-1 ring-gold" : "hover:bg-gold/5"
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
                  <span className="block text-[11px] font-semibold text-gold-light">{formatPrice(d.price)}</span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next dish" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink transition hover:bg-gold-light">
            <ChevronRight size={18} />
          </button>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={userPaused}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-cream/80 transition hover:text-gold"
            >
              {/* Countdown ring: fills over one autoplay interval, freezes while held. */}
              <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
                <circle
                  key={cycle}
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  pathLength={100}
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  strokeLinecap="round"
                  className="text-gold"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    animation: `hero-countdown ${AUTOPLAY_MS}ms linear forwards`,
                    animationPlayState: autoplaying ? "running" : "paused",
                  }}
                />
              </svg>
              {userPaused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * The dish photos are transparent cut-outs that already include their own
 * bowl, plate or pan, so they are shown whole (never cropped) with a soft
 * drop shadow that grounds them on the dark stage.
 */
function OrbitPlate({
  dish,
  active,
  priority,
  onSelect,
}: {
  dish: Dish;
  active: boolean;
  priority: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={onSelect}
      className={`pointer-events-auto relative block h-full w-full rounded-full transition-[filter] duration-500 ${
        active
          ? "cursor-default [filter:drop-shadow(0_28px_32px_rgba(0,0,0,0.75))]"
          : "cursor-pointer [filter:drop-shadow(0_12px_16px_rgba(0,0,0,0.7))]"
      }`}
    >
      <SafeImage
        src={dish.image}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 1024px) 60vw, 380px"
        className="object-contain"
        fallback={<PlateFallback accent={dish.bgAccent} label={dish.name} />}
      />
    </button>
  );
}
