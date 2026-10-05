import { evaluate } from "@mdx-js/mdx";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllLessons, getModule } from "./content";
import type { Lesson, SearchEntry, TocItem } from "./types";

export type MDXContent = Awaited<ReturnType<typeof evaluate>>["default"];

type Section = { id: string; heading: string; text: string };
// Minimal hast shape (@types/hast is not a direct dependency).
type HNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HNode[];
};
type Compiled = { Content: MDXContent; toc: TocItem[]; sections: Section[] };

// Block-level tags whose text should not run into the next block when flattened.
const BLOCK_TAGS = new Set([
  "p", "li", "tr", "td", "th", "br", "pre", "div", "ul", "ol",
  "table", "thead", "tbody", "blockquote", "dt", "dd", "h1", "h2", "h3", "h4",
]);

function toText(node: HNode): string {
  if (node.type === "text") return node.value ?? "";
  if (node.type !== "element") return "";
  const inner = (node.children ?? []).map(toText).join("");
  return BLOCK_TAGS.has(node.tagName ?? "") ? ` ${inner} ` : inner;
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const isHeading = (node: HNode) =>
  node.type === "element" && (node.tagName === "h2" || node.tagName === "h3");

// Collects the TOC and per-heading sections after rehype-slug, so ids match the rendered anchors.
function rehypeCollect(out: { toc: TocItem[]; sections: Section[] }) {
  return () => (tree: HNode) => {
    let current: Section = { id: "", heading: "", text: "" };
    out.sections.push(current);
    for (const node of tree.children ?? []) {
      if (isHeading(node)) {
        const id = String(node.properties?.id ?? "");
        const text = clean(toText(node));
        out.toc.push({ id, text, depth: node.tagName === "h2" ? 2 : 3 });
        current = { id, heading: text, text: "" };
        out.sections.push(current);
      } else {
        current.text += toText(node);
      }
    }
    for (const s of out.sections) s.text = clean(s.text);
  };
}

const shikiOptions: RehypeShikiOptions = {
  theme: "github-dark-default",
  langs: ["php", "blade", "bash", "shell", "js", "ts", "json", "ini", "sql", "html", "yaml"],
  defaultLanguage: "text",
  fallbackLanguage: "text",
  transformers: [
    {
      pre(node) {
        const title = this.options.meta?.__raw?.match(/title="([^"]*)"/)?.[1];
        if (title) node.properties["data-title"] = title;
        node.properties["data-language"] = this.options.lang;
      },
    },
  ],
};

const cache = new Map<string, Promise<Compiled>>();

function compile(lesson: Lesson): Promise<Compiled> {
  let result = cache.get(lesson.id);
  if (!result) {
    result = (async () => {
      const out = { toc: [] as TocItem[], sections: [] as Section[] };
      const { default: Content } = await evaluate(lesson.body, {
        ...runtime,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeCollect(out),
          [rehypeShiki, shikiOptions],
        ],
      });
      return { Content, ...out };
    })();
    cache.set(lesson.id, result);
  }
  return result;
}

export async function compileLesson(lesson: Lesson): Promise<{ Content: MDXContent; toc: TocItem[] }> {
  const { Content, toc } = await compile(lesson);
  return { Content, toc };
}

export async function getSearchEntries(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  for (const lesson of getAllLessons()) {
    const { sections } = await compile(lesson);
    const moduleTitle = getModule(lesson.module)?.title ?? lesson.module;
    for (const s of sections) {
      if (!s.heading && !s.text) continue;
      entries.push({
        url: s.id ? `${lesson.url}#${s.id}` : lesson.url,
        lessonTitle: lesson.title,
        moduleTitle,
        heading: s.heading,
        text: s.text,
      });
    }
  }
  return entries;
}
