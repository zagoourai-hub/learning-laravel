# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repo is

"Laravel Belajar": a static Next.js site of Indonesian-language Laravel 13 tutorials, hosted on Vercel Hobby. The product plan is in `docs/PRD.md`. It covers architecture decisions (section 9), frontmatter (section 11), the code-tutorial pattern (section 11b) and the curriculum (section 12).

Current content: all 8 modules are published (43 lessons). Module `02-crud-pemula` is the author's own tutorial (`docs/tutorial-laravel.md`); the other modules were written from the official Laravel 13.x docs via Context7, following `docs/content-guide.md`. Any Product CRUD code in any module must match `docs/tutorial-laravel.md` verbatim, plus only the changes the lesson's topic needs. Run `node scripts/check-mdx.mjs <folder|file>` for a fast MDX syntax check without a full build.

## Commands

Package manager is **pnpm** (pinned via `packageManager`).

```bash
pnpm dev      # next dev, http://localhost:3000
pnpm build    # static export to out/; also validates all lesson frontmatter
pnpm start    # serve the production build
pnpm exec next typegen && pnpm exec tsc --noEmit   # type check
```

- `pnpm lint` currently **fails** for the whole repo: typescript-eslint does not support TypeScript 7 yet. Do not downgrade TypeScript without asking the user.
- There is no test framework for the site. CI (`.github/workflows/ci.yml`) runs `pnpm check:content`, `pnpm typecheck` and `pnpm build`.

## Architecture

- **Fully static:** `next.config.ts` sets `output: "export"`, `trailingSlash: true` and `images.unoptimized`. Dynamic routes use `generateStaticParams` + `dynamicParams = false`, and route handlers need `dynamic = "force-static"`. Don't add anything that needs a runtime server: no request-dependent Route Handlers, ISR, Server Actions, or next.config headers/redirects. Security headers live in `vercel.json`.
- **Shared contract:** `lib/types.ts` (`ModuleMeta`, `Lesson`, `TocItem`, `SearchEntry`) and `lib/site.ts` (`SITE_URL` falls back to `VERCEL_PROJECT_PRODUCTION_URL`).
- **Content pipeline:**
  - Lessons live in `content/laravel-13/<module>/<slug>.mdx`, and module metadata in `content/laravel-13/_modules.ts`.
  - `lib/content.ts` reads them with gray-matter and validates frontmatter with Zod (`lib/schemas.ts`). The build fails on invalid frontmatter, a `module` that doesn't match the folder name, a duplicate `order`, or a `prerequisites`/`nextStep` that points to a missing lesson.
  - `lib/mdx.tsx` compiles MDX at build time with `@mdx-js/mdx` `evaluate` (not `@next/mdx`), using remark-gfm, rehype-slug, a hand-written TOC/section collector and `@shikijs/rehype` (theme `github-dark-default`, so code is always dark). The fence meta `title="..."` becomes `data-title` on `<pre>`.
  - `getSearchEntries()` builds the search index, which is served as static `/search-index.json` (`app/search-index.json/route.ts`). Pagefind is not used.
- **Routes:** `/`, `/belajar/`, `/belajar/[module]/`, `/belajar/[module]/[slug]/`, `/tentang/`, plus `sitemap.ts` and `robots.ts`. Components live in `components/layout`, `components/learn` and `components/mdx` (`mdxComponents` maps `pre` to the copyable `CodeBlock`).
- **Client state:** learning progress is in `lib/progress.ts`, a `useSyncExternalStore` store over localStorage (key `laravel-belajar:progress`), with no Zustand. The theme uses a `.dark` class set by an inline script in `app/layout.tsx`. Search is a native `<dialog>` opened with Ctrl/⌘ K. giscus comments (`components/learn/comments.tsx`, no package) stay disabled until the `NEXT_PUBLIC_GISCUS_*` env vars are set (see `.env.example`).
- **Design:** tokens and the `.prose` and `.code-block` styles are in `app/globals.css` (Tailwind v4 `@theme inline`, no `tailwind.config`). Fonts are self-hosted from `@fontsource-variable/*` through `next/font/local` in `lib/fonts.ts`, because `fonts.gstatic.com` is unreachable from the dev machine, so don't switch back to `next/font/google`. The fonts are Plus Jakarta Sans for headings and UI, Source Serif 4 for lesson body text, and JetBrains Mono for code.

## Lesson writing rules (PRD section 11b)

- Lesson flow: explanation → small per-step snippets → **Final Complete File** → how to test → common errors.
- Each changed file gets the line "Here's your complete `path/to/file`:" followed by a full-file fenced block with `title="path/to/file"`.
- Final code must match the companion repo `laravel-belajar-demo` at that lesson's tag. Follow Laravel 13 defaults.
- The title comes from frontmatter, so lessons have no `#` H1.
