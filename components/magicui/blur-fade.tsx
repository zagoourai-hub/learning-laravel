"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useInstantMotion } from "@/components/ui/use-instant-motion"

interface BlurFadeProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  blur?: string
}

// Magic UI "Blur Fade", adapted so SSR output is always visible:
// the server and the first client render show the final state. After mount, only elements that are
// still BELOW the fold are hidden and revealed once on scroll. Elements already on screen are left alone,
// so nothing flashes and no text is ever invisible in the HTML. Reduced motion: never animates.
export function BlurFade({ children, className, duration = 0.5, delay = 0, offset = 8, blur = "6px" }: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const instant = useInstantMotion()
  const [phase, setPhase] = useState<"ssr" | "hidden" | "shown">("ssr")

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setPhase("shown")
      return
    }
    setPhase("hidden")
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown")
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hidden = phase === "hidden" && !instant

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        hidden
          ? { opacity: 0, y: offset, filter: `blur(${blur})` }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={hidden ? { duration: 0 } : { duration, delay: 0.04 + delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
