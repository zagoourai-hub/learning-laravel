import { z } from "zod";
import type { LessonFrontmatter } from "./types";

const lessonRef = z.string().regex(/^[\w-]+\/[\w-]+$/, 'harus berformat "<modul>/<slug>"');

export const lessonFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  module: z.string().min(1),
  order: z.number().int().positive(),
  level: z.enum(["pemula", "menengah"]),
  laravelVersion: z.string().min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "harus berformat YYYY-MM-DD"),
  estimatedMinutes: z.number().int().positive(),
  tags: z.array(z.string()),
  prerequisites: z.array(lessonRef).optional(),
  nextStep: lessonRef.optional(),
});

// Compile-time guard: the schema output must stay assignable to the shared contract.
type Assert<T extends LessonFrontmatter> = T;
export type ParsedFrontmatter = Assert<z.infer<typeof lessonFrontmatterSchema>>;
