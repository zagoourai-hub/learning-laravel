"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { animate } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  delay?: number
  duration?: number
}

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(Math.round(n))

// Magic UI "Number Ticker", adapted: the markup (and the SSR HTML) always holds the real final value.
// After mount the number counts up from 0 once it scrolls into view; reduced motion keeps the final value.
export function NumberTicker({ value, delay = 0, duration = 1.4, className, ...props }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let stop: (() => void) | undefined
    el.textContent = fmt(0)
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const controls = animate(0, value, {
        duration,
        delay,
        ease: "easeOut",
        onUpdate: (v) => {
          el.textContent = fmt(v)
        },
      })
      stop = () => controls.stop()
    })
    io.observe(el)
    return () => {
      io.disconnect()
      stop?.()
      el.textContent = fmt(value)
    }
  }, [value, delay, duration])

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {fmt(value)}
    </span>
  )
}
