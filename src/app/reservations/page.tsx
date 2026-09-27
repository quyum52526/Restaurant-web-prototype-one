import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BookingForm from "@/components/reservations/BookingForm";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Book a table at Aurum — choose your date, time and seating in a few taps.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title={<>An evening <em className="text-gold-light">worth</em> remembering</>}
        intro="Choose your date, time and seating. We hold every table for 15 minutes and are happy to help with any occasion."
      />
      <Suspense fallback={<div className="container-lux py-24 text-center text-cream/50">Loading booking…</div>}>
        <BookingForm />
      </Suspense>
    </>
  );
}
