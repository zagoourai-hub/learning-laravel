import { BlurFade } from "@/components/magicui/blur-fade";

// FAQ with native <details>/<summary>: keyboard and screen-reader support without JavaScript.
export function FaqList({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <BlurFade>
      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {items.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading font-semibold transition-colors hover:bg-surface-2 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
              {q}
              <span
                className="grid size-8 shrink-0 place-items-center rounded-md border border-border-strong text-muted transition-transform group-open:rotate-45 motion-reduce:transition-none"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="max-w-[65ch] px-5 pb-5 leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </BlurFade>
  );
}
