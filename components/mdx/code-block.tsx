"use client";

import { useRef, useState, type ComponentProps } from "react";

type Props = ComponentProps<"pre"> & {
  "data-title"?: string;
  "data-language"?: string;
};

export function CodeBlock({
  "data-title": title,
  "data-language": language,
  ...pre
}: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (insecure context / permissions): leave the button as is
    }
  }

  return (
    <figure className="code-block">
      <div className="code-block__bar">
        <span className="code-block__title" data-language={language ?? "kode"}>
          {title}
        </span>
        <button
          type="button"
          className="code-block__copy"
          data-copied={copied}
          onClick={copy}
          aria-label={title ? `Salin kode ${title}` : "Salin kode"}
        >
          <span aria-live="polite">{copied ? "Tersalin" : "Salin"}</span>
        </button>
      </div>
      <pre ref={ref} {...pre} />
    </figure>
  );
}
