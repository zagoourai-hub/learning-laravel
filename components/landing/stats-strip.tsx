import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";

export type Stat = { label: string; value: number };

// Slim strip with real numbers computed from the content (modules, lessons, minutes of material).
export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <BlurFade>
      <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse px-4 py-5 sm:px-8 sm:py-6">
            <dt className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
            <dd className="font-heading text-3xl font-extrabold sm:text-4xl">
              <NumberTicker value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
    </BlurFade>
  );
}
