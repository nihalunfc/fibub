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
  // Lesson kit (public/learn-kit/): step-by-step "watch it happen" players, live problems, count-ups, PNG downloads
  // and a printable summary sheet. Figures are JS modules in public/learn-kit/<id>/figs/<name>.js, problems in
  // public/learn-kit/<id>/problems.js; the course's pages import src/styles/lesson-kit.css.
  kit?: boolean;
  // Lessons written once in another course and shown here too (medical entrance borrows the engineering course's
  // Physics and Chemistry): files of that course whose slug this syllabus lists. Their pages here carry a
  // canonical link to the original, so each search has one page.
  sharedFrom?: string;
  kitDir?: string;   // folder under public/learn-kit/ for figures and problems (default: the course id)
  parts: { name: string; modules: CourseModule[] }[];
};

/** Every lesson in order, with its module. */
export function flatLessons(c: CourseSyllabus) {
  return c.parts.flatMap((p) => p.modules.flatMap((m) => m.lessons.map(([n, slug, title]) => ({ n, slug, title, module: m, part: p.name }))));
}
