import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-base font-semibold transition-[color,background-color,opacity,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:translate-y-0";

// Renders a Next <Link> when `href` is given, otherwise a <button>.
type ButtonProps = (ComponentProps<typeof Link> | ComponentProps<"button">) & {
  size?: "lg";
};

export function Button({ className, size: _size, ...props }: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    return <Link className={cn(base, className)} {...(props as ComponentProps<typeof Link>)} />;
  }
  return <button className={cn(base, className)} {...(props as ComponentProps<"button">)} />;
}
