"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No mailing-list backend yet: validate locally and confirm.
    setStatus(EMAIL_RE.test(email) ? "done" : "error");
  };

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-gold" role="status">
        <Check size={16} /> You&apos;re on the list — watch for our seasonal menu.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex rounded-full border border-cream/15 bg-cream/[0.04] p-1 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="Your email"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-cream placeholder:text-cream/35 focus:outline-none"
        />
        <button type="submit" aria-label="Subscribe" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink transition hover:bg-gold-light">
          <ArrowRight size={16} />
        </button>
      </div>
      {status === "error" && (
        <p id="newsletter-error" className="mt-2 text-xs text-red-300">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
