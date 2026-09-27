import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu",
  description: "Starters, live-fire mains, desserts and cocktails — the full Ai Restaurant menu.",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Menu"
        title={<>Seasonal plates, <em className="text-gold-light">fire-kissed</em></>}
        intro="Our menu changes with what our farms and boats bring in. Search by dish or ingredient, or filter by what suits you tonight."
      />
      <Suspense fallback={<div className="container-lux py-24 text-center text-cream/50">Loading menu…</div>}>
        <MenuBrowser />
      </Suspense>
    </>
  );
}
