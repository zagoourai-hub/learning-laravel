"use client";

import { useState } from "react";

type Props = {
  filename: string;
  /** Shiki output (`<pre class="shiki"><code><span class="line">…`), rendered at build time. */
  html: string;
  /** Plain code for the Copy button. */
  code: string;
  /** Terminal-style result line shown under the code. */
  result: { status: string; text: string };
};

export function HeroCodeCard({ filename, html, code, result }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: leave the label unchanged */
    }
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] text-left shadow-2xl shadow-black/30 ring-1 ring-black/10">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-xs text-[#c9d1d9]">
          <span className="rounded bg-[#7c6cf0]/25 px-1.5 text-[10px] font-semibold text-[#b9b0ff]">PHP</span>
          <span className="truncate">{filename}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          data-copied={copied}
          aria-label={`Salin kode ${filename}`}
          className="ml-auto min-h-8 rounded-md border border-white/10 px-2.5 text-xs font-medium text-[#c9d1d9] transition-colors hover:bg-white/10 data-[copied=true]:text-[#4ade80]"
        >
          <span aria-live="polite">{copied ? "Tersalin" : "Salin"}</span>
        </button>
      </div>

      {/* Code with line numbers (CSS counter on Shiki's .line spans) */}
      <div
        className="hero-code overflow-x-auto py-4 text-[0.8125rem] leading-[1.75] sm:text-sm [&_pre]:!bg-transparent [&_pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Result line */}
      <div className="flex items-center gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-[#8b949e]">
        <span className="rounded bg-[#28c840]/15 px-1.5 py-0.5 font-semibold text-[#4ade80]">{result.status}</span>
        <span className="truncate">{result.text}</span>
      </div>
    </figure>
  );
}
