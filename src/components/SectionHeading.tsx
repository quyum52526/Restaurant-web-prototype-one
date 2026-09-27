import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, intro, align = "left" }: Props) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-cream/65">{intro}</p>}
    </div>
  );
}
