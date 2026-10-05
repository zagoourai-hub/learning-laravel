import { getLessonsByModule, getModules } from "@/lib/content";
import { Sidebar, type SidebarModule } from "@/components/layout/sidebar";

export default function BelajarLayout({ children }: LayoutProps<"/belajar">) {
  const modules: SidebarModule[] = getModules().map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    comingSoon: m.status === "coming-soon",
    lessons: getLessonsByModule(m.id).map(({ id, title, url }) => ({ id, title, url })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:py-12">
      <Sidebar modules={modules} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
