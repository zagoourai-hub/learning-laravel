import type { ReactNode } from "react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";

// Small label (shine only in dark mode) + h2 + optional description, revealed on scroll.
export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <BlurFade className="max-w-[60ch]">
      <AnimatedShinyText className="font-mono text-sm">{eyebrow}</AnimatedShinyText>
      <h2 id={id} className="mt-3 font-heading text-2xl sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </BlurFade>
  );
}
