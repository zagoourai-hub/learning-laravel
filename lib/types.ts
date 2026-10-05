// Shared contract between the backend (content engine), frontend and design teams.
// Change it only with every consumer updated in the same change.

export type Level = "pemula" | "menengah";

export type ModuleMeta = {
  id: string; // folder name, e.g. "02-crud-pemula"
  title: string;
  description: string;
  level: Level;
  order: number;
  status: "published" | "coming-soon";
  nextModule?: string; // module id shown in the NextStepCard after the module's last lesson
};

export type LessonFrontmatter = {
  title: string;
  description: string;
  module: string;
  order: number;
  level: Level;
  laravelVersion: string;
  lastVerified: string; // YYYY-MM-DD
  estimatedMinutes: number;
  tags: string[];
  prerequisites?: string[]; // "<module>/<slug>"
  nextStep?: string; // "<module>/<slug>"
};

export type Lesson = LessonFrontmatter & {
  slug: string; // file name without .mdx
  id: string; // "<module>/<slug>", also the progress key
  url: string; // "/belajar/<module>/<slug>/"
  body: string; // MDX source without frontmatter
};

export type TocItem = { id: string; text: string; depth: 2 | 3 };

export type SearchEntry = {
  url: string; // lesson url, plus "#<heading-id>" for a section
  lessonTitle: string;
  moduleId: string; // for the module filter in the search dialog
  moduleTitle: string;
  level: Level; // for the level filter in the search dialog
  heading: string; // "" for the lesson intro
  text: string; // plain text of that section
};
