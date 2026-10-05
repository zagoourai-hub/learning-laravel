import Link from "next/link";
import { Children, cloneElement, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { CodeBlock } from "./code-block";

type WithChildren = ReactElement<{ children?: ReactNode }>;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return isValidElement(node) ? textOf((node as WithChildren).props.children) : "";
}

// Variant from the first <strong> of the first paragraph, e.g. "> **Penting:** ...".
function calloutVariant(children: ReactNode): string {
  const p = Children.toArray(children).find(isValidElement) as WithChildren | undefined;
  const strong = p && Children.toArray(p.props.children).find((c) => isValidElement(c) && c.type === "strong");
  const label = textOf(strong).trim().toLowerCase();
  if (/^(penting|perhatian)/.test(label)) return "warning";
  if (/^(jebakan umum|bahaya|jangan)/.test(label)) return "danger";
  if (/^tips?\b/.test(label)) return "tip";
  return "info";
}

// The heading text itself is the anchor link; "#" appears on hover/focus (keeps the heading's accessible name clean).
function heading(Tag: "h2" | "h3") {
  return function Heading({ id, children, ...props }: ComponentProps<"h2">) {
    if (!id) return <Tag {...props}>{children}</Tag>;
    return (
      <Tag id={id} {...props}>
        <a
          href={`#${id}`}
          className="group !text-inherit !no-underline after:ml-2 after:text-muted after:opacity-0 after:transition-opacity after:duration-150 after:content-['#'] hover:after:opacity-100 focus-visible:after:opacity-100 motion-reduce:after:transition-none"
        >
          {children}
        </a>
      </Tag>
    );
  };
}

const isCheckbox = (c: ReactNode): c is ReactElement<ComponentProps<"input">> =>
  isValidElement(c) && c.type === "input" && (c.props as ComponentProps<"input">).type === "checkbox";

// remark-gfm task items render <li><input type="checkbox" disabled /> text</li>; name the checkbox after the item text.
function ListItem({ children, ...props }: ComponentProps<"li">) {
  const items = Children.toArray(children);
  if (!items.some(isCheckbox)) return <li {...props}>{children}</li>;
  const label = textOf(items.filter((c) => !isCheckbox(c))).trim();
  return (
    <li {...props}>
      {items.map((c) => (isCheckbox(c) ? cloneElement(c, { "aria-label": label || "Item daftar tugas" }) : c))}
    </li>
  );
}

export const mdxComponents = {
  li: ListItem,
  h2: heading("h2"),
  h3: heading("h3"),
  pre: CodeBlock,
  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <aside className="callout" data-variant={calloutVariant(children)} role="note">
      {children}
    </aside>
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabel, dapat digulir">
      <table {...props} />
    </div>
  ),
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : href.startsWith("#") ? (
      <a href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
};
