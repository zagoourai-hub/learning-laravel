import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-base font-semibold transition-colors";

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
