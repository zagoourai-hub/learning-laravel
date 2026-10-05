import Link from "next/link";
import { Children, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from "react";
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

export const mdxComponents = {
  pre: CodeBlock,
  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <aside className="callout" data-variant={calloutVariant(children)} role="note">
      {children}
    </aside>
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
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
