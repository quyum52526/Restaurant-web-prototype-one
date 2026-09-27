"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Send } from "lucide-react";

const SUBJECTS = ["General inquiry", "Private dining & events", "Gift cards", "Press", "Careers"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function InquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Enter your name.";
    if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email.";
    if (form.message.trim().length < 10) e.message = "Tell us a little more (10+ characters).";
    setErrors(e);
    // No inquiry backend yet: confirm locally once the form is valid.
    if (Object.keys(e).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16 text-center" role="status">
        <CircleCheck size={48} className="text-gold" />
        <h3 className="mt-5 font-serif text-3xl">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-cream/60">
          Thanks, {form.name.split(" ")[0]}. Our team replies within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
          }}
          className="btn-ghost mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="inq-name" className="field-label">Name</label>
        <input id="inq-name" value={form.name} onChange={update("name")} autoComplete="name" aria-invalid={!!errors.name} className="field" />
        {errors.name && <p className="mt-2 text-xs text-red-300">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="inq-email" className="field-label">Email</label>
        <input id="inq-email" type="email" value={form.email} onChange={update("email")} autoComplete="email" aria-invalid={!!errors.email} className="field" />
        {errors.email && <p className="mt-2 text-xs text-red-300">{errors.email}</p>}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="inq-subject" className="field-label">Subject</label>
        <select id="inq-subject" value={form.subject} onChange={update("subject")} className="field">
          {SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-panel">{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="inq-message" className="field-label">Message</label>
        <textarea id="inq-message" rows={6} value={form.message} onChange={update("message")} aria-invalid={!!errors.message} className="field resize-none" />
        {errors.message && <p className="mt-2 text-xs text-red-300">{errors.message}</p>}
      </div>
      <button type="submit" className="btn-gold sm:col-span-2 sm:justify-self-start">
        <Send size={16} /> Send Message
      </button>
    </form>
  );
}
