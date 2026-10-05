// Fast MDX syntax check for lesson files, without a full `next build`.
// Usage: node scripts/check-mdx.mjs content/laravel-13/03-service-pattern
//        node scripts/check-mdx.mjs path/to/lesson.mdx [...]
// Frontmatter schema and cross-references are validated by `pnpm build` (lib/content.ts).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";

const files = process.argv.slice(2).flatMap((p) =>
  statSync(p).isDirectory()
    ? readdirSync(p).filter((f) => f.endsWith(".mdx")).map((f) => join(p, f))
    : [p],
);

let failed = 0;
for (const file of files) {
  const { content, data } = matter(readFileSync(file, "utf8"));
  try {
    await compile(content, { remarkPlugins: [remarkGfm] });
    console.log(`ok    ${file}  (${data.title ?? "no title"})`);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${file}\n      ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
