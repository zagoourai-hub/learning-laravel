"use client";

import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Meteors } from "@/components/ui/meteors";
import { TextAnimate } from "@/components/ui/text-animate";

type HeroProps = {
  startHref: string;
  pathHref: string;
  /** Rendered below the CTAs, inside the animated group (a code excerpt). */
  children?: ReactNode;
};

export default function HeroSection({ startHref, pathHref, children }: HeroProps) {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      gradientRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" },
    );
  }, []);

  return (
    <div className="relative w-full overflow-hidden border-b border-border">
      <div className="relative w-full px-4 sm:px-6">
        {/* Gradient only in dark mode; light mode stays plain. */}
        <div
          ref={gradientRef}
          aria-hidden
          className="absolute inset-0 -z-10 hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(180deg, #0f1720 0%, #16202b 40%, #2a1416 75%, #3d1518 100%),
              radial-gradient(at 20% 30%, #ffffff12 0%, transparent 60%),
              radial-gradient(at 80% 70%, #ff6b5e14 0%, transparent 70%)
            `,
            backgroundBlendMode: "overlay, screen",
          }}
        />

        {/* Meteor background; hidden for reduced motion */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden">
          <Meteors number={16} className="opacity-35 dark:opacity-70" />
        </div>

        <div className="pt-16 pb-10 text-center sm:pt-20 sm:pb-12">
          <div className="relative mx-auto max-w-3xl">
            <p className="font-mono text-sm text-muted">Laravel 13 · Bahasa Indonesia</p>
            <TextAnimate
              as="h1"
              animation="blurInUp"
              by="word"
              duration={0.7}
              className="mt-4 font-heading text-3xl text-balance text-foreground sm:text-5xl md:text-6xl"
            >
              Belajar Laravel 13 dengan membangun CRUD sungguhan
            </TextAnimate>
            <TextAnimate
              as="p"
              animation="blurIn"
              by="word"
              duration={1.2}
              delay={0.5}
              className="mx-auto mt-6 max-w-[56ch] font-body text-lg leading-relaxed text-muted sm:text-xl"
            >
              Mulai dari CRUD Product dengan semua logic di controller, lalu refactor ke Service Pattern. Setiap langkah menjelaskan kenapa kodenya bekerja, lengkap dengan file final yang bisa langsung disalin.
            </TextAnimate>
            <AnimatedGroup
              className="mt-10 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div className="rounded-[14px] border border-border bg-foreground/10 p-0.5">
                {/* Inner highlight (shading) only in dark mode; light mode is flat red with the shimmer light as the only effect. */}
                <ShimmerButton
                  href={startHref}
                  background="var(--accent)"
                  shimmerColor="#ffffff"
                  borderRadius="12px"
                  shimmerDuration="3.5s"
                  className="min-h-11 rounded-xl px-5 text-base font-semibold !text-accent-foreground [&>.pointer-events-none]:hidden dark:[&>.pointer-events-none]:block"
                >
                  Mulai Belajar
                </ShimmerButton>
              </div>
              <div className="rounded-[14px] border border-border-strong p-0.5">
                <Button size="lg" href={pathHref} className="bg-background text-foreground hover:bg-surface-2">
                  Lihat Jalur Belajar
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>

        {children && (
          <AnimatedGroup
          >
            <div className="mx-auto max-w-3xl pb-14 text-left sm:pb-16">{children}</div>
          </AnimatedGroup>
        )}
      </div>
    </div>
  );
}

// Entrance animation is pure CSS (the `fade-up` keyframe in globals.css, `both` fill). The markup is rendered
// in its final state on the server, so the buttons stay visible without JS and there is nothing to hydrate-mismatch.
// `motion-safe:` drops the animation for prefers-reduced-motion users.
function AnimatedGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="motion-safe:animate-[fade-up_.6s_ease-out_both]"
          style={{ animationDelay: `${0.2 + index * 0.05}s` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export { AnimatedGroup };
