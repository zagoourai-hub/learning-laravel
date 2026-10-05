import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { modules } from "@/content/laravel-13/_modules";
import { lessonFrontmatterSchema } from "./schemas";
import type { Lesson, ModuleMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "laravel-13");

const sortedModules = [...modules].sort((a, b) => a.order - b.order);

let cache: Lesson[] | undefined;

function loadLessons(): Lesson[] {
  const lessons: Lesson[] = [];

  for (const mod of sortedModules) {
    const dir = path.join(CONTENT_DIR, mod.id);
    if (!fs.existsSync(dir)) continue;

    const moduleLessons: Lesson[] = [];
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const filePath = path.join("content", "laravel-13", mod.id, file);
      // gray-matter keeps Windows line endings in the body; normalize so MDX and slugs stay stable.
      const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
      // Pass an options object so gray-matter skips its content-keyed cache (stale data in dev).
      const { data, content } = matter(raw, {});

      const parsed = lessonFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Frontmatter tidak valid di ${filePath}:\n${z.prettifyError(parsed.error)}`);
      }
      if (parsed.data.module !== mod.id) {
        throw new Error(
          `${filePath}: frontmatter module "${parsed.data.module}" harus sama dengan folder "${mod.id}"`,
        );
      }

      const slug = file.slice(0, -".mdx".length);
      moduleLessons.push({
        ...parsed.data,
        slug,
        id: `${mod.id}/${slug}`,
        url: `/belajar/${mod.id}/${slug}/`,
        body: content,
      });
    }

    moduleLessons.sort((a, b) => a.order - b.order);
    for (let i = 1; i < moduleLessons.length; i++) {
      if (moduleLessons[i].order === moduleLessons[i - 1].order) {
        throw new Error(
          `Modul ${mod.id}: order ${moduleLessons[i].order} dipakai dua kali (${moduleLessons[i - 1].slug}, ${moduleLessons[i].slug})`,
        );
      }
    }
    lessons.push(...moduleLessons);
  }

  const ids = new Set(lessons.map((l) => l.id));
  for (const lesson of lessons) {
    for (const ref of [...(lesson.prerequisites ?? []), ...(lesson.nextStep ? [lesson.nextStep] : [])]) {
      if (!ids.has(ref)) {
        throw new Error(`${lesson.id}: referensi "${ref}" tidak menunjuk pelajaran yang ada`);
      }
    }
  }

  return lessons;
}

export function getAllLessons(): Lesson[] {
  cache ??= loadLessons();
  return cache;
}

export function getModules(): ModuleMeta[] {
  return sortedModules;
}

export function getModule(id: string): ModuleMeta | undefined {
  return sortedModules.find((m) => m.id === id);
}

export function getLessonsByModule(moduleId: string): Lesson[] {
  return getAllLessons().filter((l) => l.module === moduleId);
}

export function getLesson(moduleId: string, slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.module === moduleId && l.slug === slug);
}

export function getAdjacentLessons(moduleId: string, slug: string): { prev?: Lesson; next?: Lesson } {
  const lessons = getAllLessons();
  const i = lessons.findIndex((l) => l.module === moduleId && l.slug === slug);
  if (i === -1) return {};
  return { prev: lessons[i - 1], next: lessons[i + 1] };
}

export function getAllLessonParams(): { module: string; slug: string }[] {
  return getAllLessons().map((l) => ({ module: l.module, slug: l.slug }));
}
