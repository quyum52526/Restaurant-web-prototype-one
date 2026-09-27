import Link from "next/link";
import { Camera, Clock, Mail, MapPin, Phone } from "lucide-react";
import { HOURS, INSTAGRAM, NAV_LINKS, RESTAURANT } from "@/data/restaurant";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import SafeImage from "./SafeImage";

export default function Footer() {
  return (
    <footer className="border-t-2 border-wine bg-panel/60">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="space-y-5">
          <Logo imageClassName="h-20" />
          <p className="max-w-xs text-sm leading-relaxed text-cream/60">
            A live-fire kitchen cooking the best of the field and the sea, one hearth at a time.
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-cream/40">Newsletter</p>
          <NewsletterForm />
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg">
            <Clock size={16} className="text-gold" /> Opening Hours
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {HOURS.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-line pb-3">
                <span className="text-cream/60">{h.days}</span>
                <span className={h.time === "Closed" ? "text-cream/40" : ""}>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg">
            <MapPin size={16} className="text-gold" /> Visit Us
          </h3>
          <address className="mt-5 space-y-3 text-sm not-italic text-cream/70">
            <p>
              {RESTAURANT.address.line1}
              <br />
              {RESTAURANT.address.line2}
            </p>
            <p>
              <a href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 hover:text-gold">
                <Phone size={14} /> {RESTAURANT.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${RESTAURANT.email}`} className="flex items-center gap-2 hover:text-gold">
                <Mail size={14} /> {RESTAURANT.email}
              </a>
            </p>
          </address>
          <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-cream/60 hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg">
            <Camera size={16} className="text-gold" /> {RESTAURANT.instagram}
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {INSTAGRAM.map((src, i) => (
              <a
                key={src}
                href="#"
                aria-label={`Instagram post ${i + 1}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-panel"
              >
                <SafeImage
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 120px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-wine-dark/60">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/60 md:flex-row">
          <p>© {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.</p>
          <p>Crafted with fire &amp; patience.</p>
        </div>
      </div>
    </footer>
  );
}
