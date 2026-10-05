"use client";

import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";

type HeroProps = {
  startHref: string;
  pathHref: string;
  /** Rendered below the CTAs, inside the animated group (a code excerpt). */
  children?: ReactNode;
};

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 },
    },
  },
} as { item: Variants };

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
              linear-gradient(180deg, #0f1720 0%, #16202b 40%, #2a1f3d 75%, #3a2147 100%),
              radial-gradient(at 20% 30%, #ffffff12 0%, transparent 60%),
              radial-gradient(at 80% 70%, #c084fc1f 0%, transparent 70%)
            `,
            backgroundBlendMode: "overlay, screen",
          }}
        />

        {/* Meteor background; hidden for reduced motion */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden">
          <Meteors number={24} />
        </div>

        <div className="pt-16 pb-10 text-center sm:pt-20 sm:pb-12">
          <div className="relative mx-auto max-w-3xl">
            <p className="font-mono text-sm text-muted">Laravel 13 · Bahasa Indonesia</p>
            <h1 className="mt-4 font-heading text-3xl text-balance text-foreground sm:text-5xl md:text-6xl">
              Belajar Laravel 13 dengan membangun CRUD sungguhan
            </h1>
            <p className="mx-auto mt-6 max-w-[56ch] font-body text-lg leading-relaxed text-muted sm:text-xl">
              Mulai dari CRUD Product dengan semua logic di controller, lalu refactor ke Service Pattern. Setiap langkah
              menjelaskan kenapa kodenya bekerja, lengkap dengan file final yang bisa langsung disalin.
            </p>
            <AnimatedGroup
              variants={{
                container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
                ...transitionVariants,
              }}
              className="mt-10 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div className="rounded-[14px] border border-border bg-foreground/10 p-0.5">
                <Button size="lg" href={startHref} className="bg-accent text-accent-foreground hover:opacity-90">
                  Mulai Belajar
                </Button>
              </div>
              <div className="rounded-[14px] border border-border p-0.5">
                <Button size="lg" href={pathHref} className="bg-background text-foreground hover:bg-surface-2">
                  Lihat Jalur Belajar
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>

        {children && (
          <AnimatedGroup
            variants={{
              container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
              ...transitionVariants,
            }}
          >
            <div className="mx-auto max-w-3xl pb-14 text-left sm:pb-16">{children}</div>
          </AnimatedGroup>
        )}
      </div>
    </div>
  );
}

type PresetType = "fade" | "slide" | "scale" | "blur" | "blur-slide" | "zoom" | "flip" | "bounce" | "rotate" | "swing";

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
  preset?: PresetType;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  fade: { container: defaultContainerVariants, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } },
  slide: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  },
  scale: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  },
  blur: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, filter: "blur(4px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
  },
  "blur-slide": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(4px)", y: 20 },
      visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
  },
  zoom: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
    },
  },
  flip: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
    },
  },
  bounce: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
    },
  },
  rotate: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -180 },
      visible: { opacity: 1, rotate: 0, transition: { type: "spring" as const, stiffness: 200, damping: 15 } },
    },
  },
  swing: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0, transition: { type: "spring" as const, stiffness: 300, damping: 8 } },
    },
  },
};

function AnimatedGroup({ children, className, variants, preset }: AnimatedGroupProps) {
  const selected = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selected.container;
  const itemVariants = variants?.item || selected.item;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AnimatedGroup };
