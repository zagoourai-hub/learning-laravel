import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee } from "@/components/magicui/marquee";

export type Topic = { title: string; url: string };

const pill =
  "inline-flex h-10 items-center whitespace-nowrap rounded-full border border-border-strong bg-surface px-4 text-sm text-foreground transition-colors hover:bg-surface-2";

// Two slow rows of real lesson titles. Pauses on hover/focus, static and scrollable with reduced motion.
export function TopicsMarquee({ topics }: { topics: Topic[] }) {
  const a = topics.filter((_, i) => i % 2 === 0);
  const b = topics.filter((_, i) => i % 2 === 1);
  const row = (items: Topic[]) =>
    items.map((t) => (
      <Link key={t.url} href={t.url} className={pill}>
        {t.title}
      </Link>
    ));
  return (
    <BlurFade>
      <div className="space-y-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <Marquee duration="150s">{row(a)}</Marquee>
        <Marquee duration="170s" reverse>
          {row(b)}
        </Marquee>
      </div>
    </BlurFade>
  );
}
