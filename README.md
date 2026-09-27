# Aurum — Luxury Restaurant Website

A multi-page restaurant site built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **GSAP**.

## Pages

| Route           | What's there                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `/`             | Interactive hero (floating top-view plate, GSAP dish switcher, glass info card, thumbnail carousel), story teaser, bento categories, reservation quick-check, reviews carousel |
| `/menu`         | Full menu with category tabs, search and dietary filters (category is kept in the URL)                   |
| `/reservations` | Four-step booking flow with time-slot availability, seating choice, validation and confirmation         |
| `/about`        | Kitchen philosophy, chef profiles, milestones timeline, image gallery                                   |
| `/contact`      | Contact cards, map placeholder with Google Maps link, opening hours, inquiry form                        |

## Editing content

All content lives in **`src/data/restaurant.ts`**: dishes, menu, chefs, reviews, hours, address and image URLs.
Change it there and every page updates.

## Notes for production

- **Placeholder content**: name, address, prices, ratings, reviews and chef bios are demo data.
- **No backend yet**: reservation availability (`src/lib/reservations.ts`), the inquiry form and the newsletter
  are validated client-side only. Wire them to a real API or booking service before launch.
- **Images** load from the Unsplash CDN via `next/image`. `SafeImage` swaps in an inline illustration if any
  image fails, so no broken-image icons ever show.

## Scripts

```bash
npm run dev     # local development
npm run lint    # ESLint
npm run build   # production build + type check
```
