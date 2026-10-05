import { type ComponentPropsWithoutRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// Magic UI "Bento Grid", adapted to the site tokens: hairline border, plain surface (no shadows/glow in
// light mode), and a visual slot on top of the text. No icons or router dependencies.
export function BentoGrid({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-3", className)} {...props}>
      {children}
    </div>
  )
}

interface BentoCardProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: string
  description: string
  /** Small real visual (code excerpt, progress bar, keycaps ...). */
  visual: ReactNode
  /** Optional interactive element under the text (link or button). */
  action?: ReactNode
}

export function BentoCard({ title, description, visual, action, className, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface",
        "transition-colors duration-200 hover:border-border-strong motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="flex min-h-40 flex-1 items-center justify-center p-4 sm:p-6">{visual}</div>
      <div className="border-t border-border p-6">
        <h3 className="font-heading text-base">{title}</h3>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  )
}
