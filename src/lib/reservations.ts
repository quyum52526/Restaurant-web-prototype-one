/**
 * Mock availability for the prototype — there is no booking backend yet.
 * Results are deterministic for a given date/time/party size so the UI
 * behaves consistently; swap this for a real API call when one exists.
 */

export type Availability = "available" | "limited" | "full";

export const MAX_GUESTS = 12;

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function isClosedDay(date: string): boolean {
  if (!date) return false;
  // Parse as a local date so the weekday matches what the guest picked.
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 1; // Mondays
}

export function getAvailability(date: string, time: string, guests: number): Availability {
  if (!date || !time) return "available";
  if (isClosedDay(date)) return "full";
  const score = (hash(`${date}|${time}`) + guests * 7) % 10;
  if (guests >= 9) return score < 5 ? "limited" : "full";
  if (score < 6) return "available";
  if (score < 9) return "limited";
  return "full";
}

export function makeReference(date: string, time: string, name: string): string {
  return `AUR-${(hash(`${date}${time}${name}`) % 900000 + 100000).toString()}`;
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
  if (!date) return "";
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
