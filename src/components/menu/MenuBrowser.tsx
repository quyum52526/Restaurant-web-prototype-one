"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, X } from "lucide-react";
import { DISHES, MENU, MENU_CATEGORIES, type DietaryTag, type MenuCategory } from "@/data/restaurant";
import PlateFallback from "../PlateFallback";
import SafeImage from "../SafeImage";

const TAGS: DietaryTag[] = ["Signature", "Vegetarian", "Gluten-Free", "Seafood", "Spicy"];
type Filter = MenuCategory | "All";

const accentFor = (id: string) => DISHES.find((d) => d.id === id)?.bgAccent ?? "#5a4a2e";

export default function MenuBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<Filter>(
    MENU_CATEGORIES.includes(initial as MenuCategory) ? (initial as MenuCategory) : "All",
  );
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<DietaryTag[]>([]);

  const selectCategory = (c: Filter) => {
    setCategory(c);
    // Keep the URL shareable without adding history entries.
    router.replace(c === "All" ? "/menu" : `/menu?category=${c}`, { scroll: false });
  };

  const toggleTag = (tag: DietaryTag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        tags.every((t) => item.tags.includes(t)) &&
        (!q || `${item.name} ${item.description}`.toLowerCase().includes(q)),
    );
  }, [category, query, tags]);

  const grouped = MENU_CATEGORIES.map((c) => ({
    category: c,
    items: results.filter((i) => i.category === c),
  })).filter((g) => g.items.length > 0);

  const clearAll = () => {
    setQuery("");
    setTags([]);
    selectCategory("All");
  };

  return (
    <div className="container-lux py-16 md:py-20">
      {/* Controls */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-line bg-ink/85 px-5 py-5 backdrop-blur-xl md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Menu categories" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {(["All", ...MENU_CATEGORIES] as Filter[]).map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                onClick={() => selectCategory(c)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition ${
                  category === c ? "bg-gold text-ink" : "border border-cream/15 text-cream/70 hover:border-gold hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" />
            <label htmlFor="menu-search" className="sr-only">Search the menu</label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, ingredients…"
              className="field !rounded-full !pl-11"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-widest text-cream/40">Filter</span>
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(t)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  on ? "bg-cream text-ink" : "border border-cream/15 text-cream/60 hover:text-cream"
                }`}
              >
                {t}
              </button>
            );
          })}
          {(tags.length > 0 || query) && (
            <button type="button" onClick={clearAll} className="ml-1 flex items-center gap-1 text-xs text-gold hover:underline">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-cream/50" aria-live="polite">
        Showing {results.length} {results.length === 1 ? "item" : "items"}
      </p>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <SearchX size={40} className="text-gold/60" />
          <p className="mt-4 font-display text-2xl">Nothing matches that search</p>
          <p className="mt-2 text-sm text-cream/55">Try a different word or remove a filter.</p>
          <button type="button" onClick={clearAll} className="btn-ghost mt-6">Reset filters</button>
        </div>
      ) : (
        grouped.map((group) => {
          const featured = group.items.filter((i) => i.image);
          const rest = group.items.filter((i) => !i.image);
          return (
            <section key={group.category} className="mt-14" aria-labelledby={`cat-${group.category}`}>
              <div className="flex items-baseline gap-4">
                <h2 id={`cat-${group.category}`} className="font-display text-4xl">{group.category}</h2>
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs text-cream/40">{group.items.length} items</span>
              </div>

              {featured.length > 0 && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((item) => (
                    <article key={item.id} className="group glass overflow-hidden rounded-3xl">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <SafeImage
                          src={item.image as string}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                          fallback={<PlateFallback accent={accentFor(item.id)} label={item.name} />}
                        />
                        <span className="absolute right-4 top-4 rounded-full border border-line bg-ink/80 px-3 py-1 font-display text-lg text-gold-light backdrop-blur">
                          ${item.price}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-2xl">{item.name}</h3>
                        <p className="mt-2 text-sm text-cream/60">{item.description}</p>
                        <TagList tags={item.tags} />
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <ul className="mt-8 grid gap-x-14 gap-y-7 md:grid-cols-2">
                  {rest.map((item) => (
                    <li key={item.id}>
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-display text-xl">{item.name}</h3>
                        <span className="flex-1 translate-y-[-4px] border-b border-dotted border-gold/25" />
                        <span className="font-display text-xl text-gold-light">${item.price}</span>
                      </div>
                      <p className="mt-1 text-sm text-cream/55">{item.description}</p>
                      <TagList tags={item.tags} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

function TagList({ tags }: { tags: DietaryTag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className="tag !px-2 !py-0.5">
          {t}
        </span>
      ))}
    </div>
  );
}
