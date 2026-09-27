import type { Metadata } from "next";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import InquiryForm from "@/components/contact/InquiryForm";
import { HOURS, RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Contact",
  description: "Opening hours, directions and how to reach the Ai Restaurant team.",
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.mapsQuery)}`;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>We&apos;d love to <em className="text-gold-light">hear</em> from you</>}
        intro="Questions, private dining, or just want to say hello — reach out and our team will get back to you within a day."
      />

      <section className="container-lux grid gap-6 py-20 md:grid-cols-3">
        {[
          { icon: MapPin, title: "Address", lines: [RESTAURANT.address.line1, RESTAURANT.address.line2], href: mapsUrl, cta: "Get directions" },
          { icon: Phone, title: "Phone", lines: [RESTAURANT.phone, "Daily from 11:00 AM"], href: `tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`, cta: "Call us" },
          { icon: Mail, title: "Email", lines: [RESTAURANT.email, "Replies within one day"], href: `mailto:${RESTAURANT.email}`, cta: "Write to us" },
        ].map(({ icon: Icon, title, lines, href, cta }) => (
          <article key={title} className="glass flex flex-col rounded-3xl p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
              <Icon size={20} />
            </span>
            <h2 className="mt-6 font-display text-2xl">{title}</h2>
            {lines.map((l) => (
              <p key={l} className="mt-1 break-words text-sm text-cream/60">{l}</p>
            ))}
            <a
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-auto pt-6 text-sm font-semibold text-gold hover:underline"
            >
              {cta} →
            </a>
          </article>
        ))}
      </section>

      <section className="container-lux grid gap-6 pb-24 lg:grid-cols-[1.3fr_1fr]">
        {/* Map placeholder */}
        <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-line bg-[#100C09]">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
            <defs>
              <pattern id="blocks" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="#1A1410" />
                <rect x="6" y="6" width="68" height="68" rx="6" fill="#221a14" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#blocks)" />
            <path d="M-20 330 C180 280 300 380 480 320 S760 220 840 260" stroke="#1f3340" strokeWidth="46" fill="none" />
            <path d="M0 140 H800" stroke="#2a251f" strokeWidth="14" />
            <path d="M380 0 V500" stroke="#2a251f" strokeWidth="14" />
            <path d="M120 0 L260 500" stroke="#2a251f" strokeWidth="9" />
            <path d="M600 0 L540 500" stroke="#2a251f" strokeWidth="9" />
            <circle cx="400" cy="230" r="80" fill="#F59E0B" opacity="0.08" />
            <circle cx="400" cy="230" r="40" fill="#F59E0B" opacity="0.12" />
          </svg>
          <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-full">
            <span className="grid h-14 w-14 place-items-center rounded-full rounded-bl-none bg-gold text-ink shadow-2xl [transform:rotate(-45deg)]">
              <MapPin size={22} className="[transform:rotate(45deg)]" />
            </span>
          </div>
          <div className="glass absolute bottom-5 left-5 right-5 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg">{RESTAURANT.name}</p>
              <p className="text-xs text-cream/60">{RESTAURANT.address.line1}, {RESTAURANT.address.line2}</p>
            </div>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold !py-2.5">
              <Navigation size={15} /> Open in Google Maps
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="glass rounded-3xl p-8">
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <Clock size={20} className="text-gold" /> Opening Hours
          </h2>
          <ul className="mt-6 space-y-4">
            {HOURS.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-line pb-4 text-sm">
                <span className="text-cream/60">{h.days}</span>
                <span className={h.time === "Closed" ? "text-cream/40" : "font-medium"}>{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-cream/45">
            Kitchen closes 45 minutes before the dining room. Bar snacks are served until close.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 py-24">
        <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Inquiries</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Private dining, events &amp; <em className="text-gold-light">everything</em> else
            </h2>
            <p className="mt-5 text-cream/60">
              Our private room seats up to 18 guests. Tell us about your plans and we&apos;ll put
              together a menu around them.
            </p>
          </div>
          <div className="glass rounded-3xl p-8">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
