"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Minus,
  Plus,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { OCCASIONS, RESTAURANT, SEATING_OPTIONS, TIME_SLOTS } from "@/data/restaurant";
import {
  MAX_GUESTS,
  formatDate,
  getAvailability,
  isClosedDay,
  makeReference,
  todayISO,
  type Availability,
} from "@/lib/reservations";

type Seating = (typeof SEATING_OPTIONS)[number]["id"];
type Errors = Partial<Record<"date" | "time" | "name" | "email" | "phone", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AVAILABILITY_STYLE: Record<Availability, string> = {
  available: "border-cream/15 hover:border-gold",
  limited: "border-gold/40 hover:border-gold",
  full: "cursor-not-allowed border-cream/5 text-cream/25 line-through",
};

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export default function BookingForm() {
  const params = useSearchParams();
  const [today, setToday] = useState("");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [guests, setGuests] = useState(() => {
    const g = Number(params.get("guests"));
    return g >= 1 && g <= MAX_GUESTS ? g : 2;
  });
  const [time, setTime] = useState(() => {
    const t = params.get("time");
    return t && TIME_SLOTS.includes(t) ? t : "";
  });
  const [seating, setSeating] = useState<Seating>("dining-room");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState<string | null>(null);

  // "Today" is computed on the client to avoid a server/client mismatch.
  useEffect(() => setToday(todayISO()), []);

  const quickDates = useMemo(
    () => (today ? Array.from({ length: 7 }, (_, i) => addDays(today, i)) : []),
    [today],
  );

  const slotStatus = (slot: string): Availability => getAvailability(date, slot, guests);

  // Drop a chosen slot if it becomes unavailable after changing date or party size.
  useEffect(() => {
    if (time && date && getAvailability(date, time, guests) === "full") setTime("");
  }, [date, guests, time]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!date) e.date = "Choose a date.";
    else if (today && date < today) e.date = "That date has passed.";
    else if (isClosedDay(date)) e.date = "We're closed on Mondays.";
    if (!time) e.time = "Choose a time slot.";
    if (name.trim().length < 2) e.name = "Enter your full name.";
    if (!EMAIL_RE.test(email)) e.email = "Enter a valid email.";
    if (phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(`field-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    // No booking backend yet — generate a reference locally.
    setConfirmed(makeReference(date, time, name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setConfirmed(null);
    setTime("");
    setNotes("");
    setErrors({});
  };

  const seatingLabel = SEATING_OPTIONS.find((s) => s.id === seating)?.label;

  if (confirmed) {
    return (
      <div className="container-lux py-20">
        <div className="glass mx-auto max-w-xl rounded-[2rem] p-10 text-center">
          <CircleCheck size={52} className="mx-auto text-gold" />
          <h2 className="mt-6 font-serif text-4xl">Your table is reserved</h2>
          <p className="mt-3 text-cream/65">
            Thank you, {name.split(" ")[0]}. A confirmation will be sent to {email}.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-ink/50 p-6 text-left text-sm">
            <Summary label="Reference" value={confirmed} />
            <Summary label="Guests" value={`${guests}`} />
            <Summary label="Date" value={formatDate(date)} />
            <Summary label="Time" value={time} />
            <Summary label="Seating" value={seatingLabel ?? ""} />
            <Summary label="Occasion" value={occasion} />
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn-ghost">Make another booking</button>
            <Link href="/menu" className="btn-gold">Browse the menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="container-lux grid gap-10 py-16 lg:grid-cols-[1fr_380px] lg:py-20">
      <div className="min-w-0 space-y-12">
        {/* Step 1 */}
        <Step n={1} title="Date & party size" icon={<CalendarDays size={18} />}>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {quickDates.map((d) => {
              const [y, m, day] = d.split("-").map(Number);
              const dt = new Date(y, m - 1, day);
              const closed = isClosedDay(d);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={closed}
                  onClick={() => setDate(d)}
                  aria-pressed={date === d}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition ${
                    date === d
                      ? "border-gold bg-gold text-ink"
                      : closed
                        ? "cursor-not-allowed border-cream/5 text-cream/25"
                        : "border-cream/15 hover:border-gold"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">
                    {dt.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="font-serif text-2xl">{day}</span>
                  <span className="text-[10px]">{closed ? "Closed" : dt.toLocaleDateString("en-US", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="field-date" className="field-label">Or pick a date</label>
              <input
                id="field-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={!!errors.date}
                className="field"
              />
              <FieldError msg={errors.date} />
            </div>
            <div>
              <span className="field-label" id="guests-label">Guests</span>
              <div className="flex items-center justify-between rounded-xl border border-cream/15 bg-cream/[0.04] p-1.5" role="group" aria-labelledby="guests-label">
                <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="Fewer guests" className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-cream/10 disabled:opacity-30">
                  <Minus size={16} />
                </button>
                <span className="text-sm font-semibold" aria-live="polite">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
                <button type="button" onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))} disabled={guests >= MAX_GUESTS} aria-label="More guests" className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-cream/10 disabled:opacity-30">
                  <Plus size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs text-cream/45">Larger party? Call {RESTAURANT.phone}.</p>
            </div>
          </div>
        </Step>

        {/* Step 2 */}
        <Step n={2} title="Choose a time" icon={<Clock size={18} />}>
          {!date ? (
            <p className="rounded-2xl border border-dashed border-cream/15 p-6 text-center text-sm text-cream/50">
              Pick a date to see available times.
            </p>
          ) : isClosedDay(date) ? (
            <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-center text-sm text-red-200">
              We&apos;re closed on Mondays. Please choose another day.
            </p>
          ) : (
            <>
              <div id="field-time" tabIndex={-1} className="grid grid-cols-3 gap-2 focus:outline-none sm:grid-cols-5">
                {TIME_SLOTS.map((slot) => {
                  const status = slotStatus(slot);
                  const selected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={status === "full"}
                      onClick={() => setTime(slot)}
                      aria-pressed={selected}
                      className={`relative rounded-xl border px-2 py-3 text-sm transition ${
                        selected ? "border-gold bg-gold font-semibold text-ink" : AVAILABILITY_STYLE[status]
                      }`}
                    >
                      {slot}
                      {status === "limited" && !selected && (
                        <span className="absolute -top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-gold" aria-label="Few tables left" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-cream/50">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-cream/40" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold" /> Few tables left</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cream/10" /> Fully booked</span>
              </div>
            </>
          )}
          <FieldError msg={errors.time} />
        </Step>

        {/* Step 3 */}
        <Step n={3} title="Seating preference" icon={<UtensilsCrossed size={18} />}>
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Seating preference">
            {SEATING_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={seating === opt.id}
                onClick={() => setSeating(opt.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  seating === opt.id ? "border-gold bg-gold/10" : "border-cream/15 hover:border-cream/40"
                }`}
              >
                <p className="font-serif text-lg">{opt.label}</p>
                <p className="mt-1 text-xs text-cream/55">{opt.detail}</p>
              </button>
            ))}
          </div>
        </Step>

        {/* Step 4 */}
        <Step n={4} title="Your details" icon={<Users size={18} />}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="field-name" className="field-label">Full name</label>
              <input id="field-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className="field" placeholder="Jane Doe" />
              <FieldError msg={errors.name} />
            </div>
            <div>
              <label htmlFor="field-email" className="field-label">Email</label>
              <input id="field-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className="field" placeholder="jane@example.com" />
              <FieldError msg={errors.email} />
            </div>
            <div>
              <label htmlFor="field-phone" className="field-label">Phone</label>
              <input id="field-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" aria-invalid={!!errors.phone} className="field" placeholder="+1 555 000 0000" />
              <FieldError msg={errors.phone} />
            </div>
            <div>
              <label htmlFor="field-occasion" className="field-label">Occasion</label>
              <select id="field-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className="field">
                {OCCASIONS.map((o) => (
                  <option key={o} value={o} className="bg-panel">{o}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-notes" className="field-label">Special requests (optional)</label>
              <textarea id="field-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={400} className="field resize-none" placeholder="Allergies, accessibility needs, a surprise we can help with…" />
              <p className="mt-1 text-right text-xs text-cream/35">{notes.length}/400</p>
            </div>
          </div>
        </Step>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="glass rounded-3xl p-7">
          <p className="eyebrow">Your reservation</p>
          <dl className="mt-6 space-y-4 text-sm">
            <Row label="Date" value={date ? formatDate(date) : "—"} />
            <Row label="Time" value={time || "—"} />
            <Row label="Guests" value={`${guests}`} />
            <Row label="Seating" value={seatingLabel ?? "—"} />
            {occasion !== "None" && <Row label="Occasion" value={occasion} />}
          </dl>
          {occasion !== "None" && (
            <p className="mt-5 flex gap-2 rounded-xl bg-gold/10 p-3 text-xs text-gold-light">
              <Sparkles size={14} className="shrink-0" /> We&apos;ll prepare a little something for your {occasion.toLowerCase()}.
            </p>
          )}
          <button type="submit" className="btn-gold mt-7 w-full">Confirm Reservation</button>
          {Object.keys(errors).length > 0 && (
            <p className="mt-3 text-center text-xs text-red-300" role="alert">
              Please fix the highlighted fields.
            </p>
          )}
          <p className="mt-4 text-center text-xs text-cream/40">
            Tables are held for 15 minutes. Free cancellation up to 24 hours before.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Step({ n, title, icon, children }: { n: number; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`}>
      <div className="mb-6 flex items-center gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 text-gold">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cream/40">Step {n}</p>
          <h2 id={`step-${n}`} className="font-serif text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-2 text-xs text-red-300">{msg}</p>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-3">
      <dt className="text-cream/50">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-cream/45">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
