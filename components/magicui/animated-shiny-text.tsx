import { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"
import styles from "./animated-shiny-text.module.css"

interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

// Magic UI "Animated Shiny Text", adapted: the shine only exists in dark mode (see the CSS module).
export function AnimatedShinyText({ children, className, shimmerWidth = 100, style, ...props }: AnimatedShinyTextProps) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px`, ...style } as CSSProperties}
      className={cn(styles.text, className)}
      {...props}
    >
      {children}
    </span>
  )
}
