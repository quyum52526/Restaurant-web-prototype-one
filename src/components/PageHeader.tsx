import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="container-lux relative text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-serif text-5xl leading-[1.05] md:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/65">{intro}</p>
      </div>
    </header>
  );
}
