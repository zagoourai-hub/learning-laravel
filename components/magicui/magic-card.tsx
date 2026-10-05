"use client"

import { type PointerEvent, type ReactNode } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children: ReactNode
  className?: string
  gradientSize?: number
  /** Spotlight color, dark mode only. */
  gradientColor?: string
}

// Magic UI "Magic Card", adapted: no next-themes. Light mode is a plain surface with a hairline border;
// the pointer-following spotlight only exists under `.dark` and is hidden for reduced motion.
export function MagicCard({ children, className, gradientSize = 240, gradientColor = "rgba(255, 107, 94, 0.14)" }: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const spotlight = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  function reset() {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }

  return (
    <div
      className={cn("group relative isolate overflow-hidden rounded-lg border border-border bg-surface", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:block motion-reduce:hidden"
        style={{ background: spotlight }}
      />
      {children}
    </div>
  )
}
