// Long text courses (w3schools style: a lesson list on the side, one page per lesson, no sign-up).
// Each course has a syllabus file (src/courses/<id>/syllabus.ts) and one Markdown file per written lesson.
export type LessonRef = [n: string, slug: string, title: string];
export type CourseModule = { n: number; name: string; lessons: LessonRef[] };
export type CourseSyllabus = {
  id: string;
  name: string;      // short, for menus and crumbs
  title: string;     // the H1 of the course page
  text: string;      // one or two sentences for cards and the page lead
  audience: string;
  updated: string;
  footnote?: string; // the small print under every lesson (default: the Offline AI price note)
  parts: { name: string; modules: CourseModule[] }[];
};

/** Every lesson in order, with its module. */
export function flatLessons(c: CourseSyllabus) {
  return c.parts.flatMap((p) => p.modules.flatMap((m) => m.lessons.map(([n, slug, title]) => ({ n, slug, title, module: m, part: p.name }))));
}
