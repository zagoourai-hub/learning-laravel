import React, { type ComponentPropsWithoutRef, type CSSProperties, type Ref } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import styles from "./shimmer-button.module.css"

type Common = {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

// With `href` it renders a Next <Link> (same look), otherwise a <button>.
export type ShimmerButtonProps =
  | (Common & Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: undefined })
  | (Common & Omit<ComponentPropsWithoutRef<typeof Link>, keyof Common> & { href: string })

export const ShimmerButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const style = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties

    const classes = cn(
      "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)]",
      "transform-gpu transition-transform duration-150 ease-in-out active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0",
      className
    )

    const inner = (
      <>
        {/* spark container */}
        <div className={cn(styles.spark, "-z-30 blur-[2px]", "absolute inset-0 overflow-visible")}>
          {/* spark */}
          <div className={cn(styles.slide, "absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]")}>
            {/* spark before */}
            <div
              className={cn(
                styles.spin,
                "absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"
              )}
            />
          </div>
        </div>
        {children}
        {/* highlight */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 size-full",
            "[border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-150 ease-in-out motion-reduce:transition-none",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />
        {/* backdrop */}
        <div className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
      </>
    )

    if (props.href !== undefined) {
      return (
        <Link
          style={style}
          className={classes}
          ref={ref as Ref<HTMLAnchorElement>}
          {...(props as ComponentPropsWithoutRef<typeof Link>)}
        >
          {inner}
        </Link>
      )
    }
    return (
      <button
        style={style}
        className={classes}
        ref={ref as Ref<HTMLButtonElement>}
        {...(props as ComponentPropsWithoutRef<"button">)}
      >
        {inner}
      </button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"
