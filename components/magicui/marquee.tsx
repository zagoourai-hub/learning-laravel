import { type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import styles from "./marquee.module.css"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  reverse?: boolean
  pauseOnHover?: boolean
  /** Number of copies. The first is real content; the rest are decorative (aria-hidden + inert). */
  repeat?: number
  duration?: string
  gap?: string
}

// Magic UI "Marquee", adapted: CSS-module keyframes, duplicates hidden from assistive tech and the tab order,
// static scrollable row under prefers-reduced-motion.
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 2,
  duration = "60s",
  gap = "0.75rem",
  children,
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{ "--duration": duration, "--gap": gap, ...style } as CSSProperties}
      className={cn(styles.root, className)}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          inert={i > 0 ? true : undefined}
          className={cn(styles.track, reverse && styles.reverse, pauseOnHover && styles.pause, i > 0 && styles.copy)}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
