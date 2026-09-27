"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, CircleCheck, Clock, TriangleAlert, Users } from "lucide-react";
import { TIME_SLOTS } from "@/data/restaurant";
import { MAX_GUESTS, formatDate, getAvailability, isClosedDay, todayISO } from "@/lib/reservations";
import Reveal from "../Reveal";

type Feedback = { tone: "ok" | "warn" | "error"; message: string } | null;

export default function ReservationTeaser() {
  const [minDate, setMinDate] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState(TIME_SLOTS[3]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  // Set "today" on the client so server and client markup always match.
  useEffect(() => setMinDate(todayISO()), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date) return setFeedback({ tone: "error", message: "Please choose a date first." });
    if (isClosedDay(date)) return setFeedback({ tone: "error", message: "We're closed on Mondays — please pick another day." });
    const status = getAvailability(date, time, guests);
    const when = `${formatDate(date)} at ${time}`;
    if (status === "full") {
      setFeedback({ tone: "error", message: `${when} is fully booked. Try a nearby time slot.` });
    } else if (status === "limited") {
      setFeedback({ tone: "warn", message: `Only a few tables left for ${guests} on ${when}. Book soon!` });
    } else {
      setFeedback({ tone: "ok", message: `Great news — a table for ${guests} is available on ${when}.` });
    }
  };

  const bookHref = `/reservations?date=${date}&time=${encodeURIComponent(time)}&guests=${guests}`;
  const Icon = feedback?.tone === "ok" ? CircleCheck : TriangleAlert;

  return (
    <section className="container-lux py-24 lg:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-[#1d1712] via-panel to-ink p-8 md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <p className="eyebrow">Reservations</p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Reserve your <em className="text-gold-light">table</em>
              </h2>
              <p className="mt-4 max-w-sm text-cream/65">
                Check availability instantly. For parties larger than {MAX_GUESTS}, please call us.
              </p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-3" noValidate>
              <div>
                <label htmlFor="teaser-date" className="field-label flex items-center gap-1.5">
                  <CalendarDays size={13} /> Date
                </label>
                <input
                  id="teaser-date"
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setFeedback(null);
                  }}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="teaser-guests" className="field-label flex items-center gap-1.5">
                  <Users size={13} /> Guests
                </label>
                <select
                  id="teaser-guests"
                  value={guests}
                  onChange={(e) => {
                    setGuests(Number(e.target.value));
                    setFeedback(null);
                  }}
                  className="field"
                >
                  {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n} className="bg-panel">
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="teaser-time" className="field-label flex items-center gap-1.5">
                  <Clock size={13} /> Time
                </label>
                <select
                  id="teaser-time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setFeedback(null);
                  }}
                  className="field"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t} className="bg-panel">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-gold sm:col-span-3">
                Check Availability
              </button>

              <div aria-live="polite" className="sm:col-span-3">
                {feedback && (
                  <div
                    className={`flex flex-col gap-3 rounded-2xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${
                      feedback.tone === "ok"
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : feedback.tone === "warn"
                          ? "border-gold/40 bg-gold/10 text-gold-light"
                          : "border-red-400/30 bg-red-400/10 text-red-200"
                    }`}
                  >
                    <p className="flex items-start gap-2">
                      <Icon size={16} className="mt-0.5 shrink-0" /> {feedback.message}
                    </p>
                    {feedback.tone !== "error" && (
                      <Link href={bookHref} className="inline-flex shrink-0 items-center gap-1 font-semibold text-cream hover:text-gold">
                        Complete booking <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
