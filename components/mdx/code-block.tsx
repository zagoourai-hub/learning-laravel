"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

type Props = ComponentProps<"pre"> & {
  "data-title"?: string;
  "data-language"?: string;
};

type CopyState = "idle" | "copied" | "failed";

const LABEL: Record<CopyState, string> = { idle: "Salin", copied: "Tersalin", failed: "Gagal menyalin" };

export function CodeBlock({
  "data-title": title,
  "data-language": language,
  ...pre
}: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: CopyState = "copied";
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? "");
    } catch {
      next = "failed"; // clipboard blocked (insecure context / permissions)
    }
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
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
          data-copied={state === "copied"}
          data-failed={state === "failed"}
          onClick={copy}
          aria-label={title ? `Salin kode ${title}` : "Salin kode"}
        >
          <span aria-live="polite">{LABEL[state]}</span>
        </button>
      </div>
      {/* Scrollable region must be keyboard-focusable so long lines can be scrolled with the arrow keys. */}
      <pre ref={ref} tabIndex={0} {...pre} />
    </figure>
  );
}
