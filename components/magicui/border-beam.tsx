"use client"

import { motion, type MotionStyle } from "motion/react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  borderWidth?: number
}

// Magic UI "Border Beam", adapted: wrapped so it only renders under `.dark` and never with reduced motion.
// The parent must be `relative` and have a border radius; the beam follows it.
export function BorderBeam({
  className,
  size = 80,
  delay = 0,
  duration = 8,
  colorFrom = "#ff6b5e",
  colorTo = "#c8231a",
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden rounded-[inherit] dark:block motion-reduce:hidden">
      <div
        className="absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
        style={{ "--border-beam-width": `${borderWidth}px` } as React.CSSProperties}
      >
        <motion.div
          className={cn("absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent", className)}
          style={
            {
              width: size,
              offsetPath: `rect(0 auto auto 0 round ${size}px)`,
              "--color-from": colorFrom,
              "--color-to": colorTo,
            } as MotionStyle
          }
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay }}
        />
      </div>
    </div>
  )
}
