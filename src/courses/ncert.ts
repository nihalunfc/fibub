// NCERT study materials (nihal, 2026-11-22): one course per class and subject (Class 10 Science, Class 10 Maths, ...),
// built from the chapter map in src/data/ncert.ts, so the chapters, their order and their tools come from one place.
// Each chapter is a module with two lessons: the chapter itself (notes with animations, step players, live problems
// and the chapter's fibub tools embedded as <!--fig:tool tool-id-->) and its practice page (board-style questions with
// worked answers plus the chapter's set in the shared question bank, public/qbank/ncert-<class>-<subject>/).
// Lesson files: src/courses/ncert-class-<n>-<subject>/<chapter-slug>.md and <chapter-slug>-practice.md.
// Figures and live problems: public/learn-kit/ncert/ (figs/<name>.js, problems/<course>.js). A course appears on the
// site once it is in NCERT_LIVE below; a lesson goes live when its file exists.
import type { CourseModule, CourseSyllabus } from './types';
import { CLASSES, type Chapter } from '../data/ncert';

/** Courses that are published (the others wait until their first lessons are written). */
export const NCERT_LIVE = ['ncert-class-10-science', 'ncert-class-10-maths', 'ncert-class-9-science', 'ncert-class-9-maths', 'ncert-class-12-physics', 'ncert-class-12-chemistry', 'ncert-class-12-biology', 'ncert-class-12-maths', 'ncert-class-11-physics', 'ncert-class-11-chemistry', 'ncert-class-11-maths', 'ncert-class-11-biology', 'ncert-class-8-science', 'ncert-class-8-maths']; // add a course here once its lessons are written, then run scripts/ncert-pages.mjs

// Short, readable addresses for chapters whose full titles are long.
const SLUGS: Record<string, string> = {
  'Light – Reflection and Refraction': 'light-reflection-refraction',
  'The Human Eye and the Colourful World': 'human-eye-colourful-world',
  'Magnetic Effects of Electric Current': 'magnetic-effects-of-current',
  'Pair of Linear Equations in Two Variables': 'pair-of-linear-equations',
  'Some Applications of Trigonometry': 'applications-of-trigonometry',
  'How do Organisms Reproduce?': 'how-organisms-reproduce',
  'Exploration: Entering the World of Secondary Science': 'exploration-secondary-science',
  'Describing Motion Around Us': 'describing-motion',
  'Exploring Mixtures and their Separation': 'mixtures-and-separation',
  'Sound Waves: Characteristics and Applications': 'sound-waves',
  'Reproduction: How Life Continues': 'reproduction-how-life-continues',
  'Patterns in Life: Diversity and Classification': 'diversity-and-classification',
  'Earth as a System: Energy, Matter, and Life': 'earth-as-a-system',
  'Cell: The Building Block of Life': 'cell-building-block-of-life',
  'Orienting Yourself: The Use of Coordinates': 'use-of-coordinates',
  "I\'m Up and Down, and Round and Round": 'up-and-down-round-and-round',
  'Measuring Space: Perimeter and Area': 'perimeter-and-area',
  'The Mathematics of Maybe: Introduction to Probability': 'introduction-to-probability',
  'Predicting What Comes Next: Exploring Sequences and Progressions': 'sequences-and-progressions',
  'How Quantities Combine: Understanding Data': 'understanding-data',
  'Math of Space: Surface Area and Volume': 'surface-area-and-volume',
};

/** The address of a chapter inside its course. */
export function chapterSlug(ch: Chapter) {
  return SLUGS[ch.title] ?? ch.title.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');
}

export const ncertCourseId = (classId: string, subjectId: string) => `ncert-${classId}-${subjectId}`;

const AUDIENCE: Record<string, string> = {
  'class-10': 'For Class 10 students (CBSE and every state board that uses the NCERT books) preparing for the board exam, and anyone who wants the basics before Class 11.',
  'class-9': 'For Class 9 students following the NCERT books, and anyone who wants a clear start in secondary science and maths.',
  'class-11': 'For Class 11 students following the NCERT books, preparing for school exams and for entrance tests later.',
  'class-12': 'For Class 12 students preparing for the board exam and entrance tests.',
  'class-8': 'For Class 8 students following the new NCERT books.',
};

function build(classId: string, subjectId: string): CourseSyllabus {
  const cls = CLASSES.find((k) => k.id === classId)!;
  const sub = cls.subjects.find((s) => s.id === subjectId)!;
  const id = ncertCourseId(classId, subjectId);
  const modules: CourseModule[] = sub.chapters.map((ch) => {
    const slug = chapterSlug(ch);
    return { n: ch.n, name: ch.title, lessons: [[`${ch.n}.1`, slug, ch.title], [`${ch.n}.2`, `${slug}-practice`, `${ch.title}: practice questions`]] };
  });
  return {
    id,
    name: `${cls.name} ${sub.name}`,
    title: `${cls.name} ${sub.name}: every NCERT chapter explained, with animations and practice`,
    text: `Complete study material for ${cls.name} ${sub.name}, chapter by chapter in NCERT order: clear notes, animations and step-by-step pictures for every idea, the fibub tools for each chapter built into the lesson, live problems with fresh numbers, and board-style practice questions with full worked answers.`,
    audience: AUDIENCE[classId] ?? `For ${cls.name} students following the NCERT books.`,
    updated: '2026-11-22',
    kit: true,
    kitDir: 'ncert',
    footnote: 'Chapter names follow the NCERT books for 2026-27. fibub is an independent free site, not part of NCERT or CBSE; no textbook text, figures or exercise questions are copied, and every question here is original. Nothing you do here is sent anywhere.',
    parts: [{ name: `${cls.name} ${sub.name}`, modules }],
  };
}

export const NCERT_COURSES: CourseSyllabus[] = CLASSES.flatMap((cls) => cls.subjects.map((s) => build(cls.id, s.id))).filter((c) => NCERT_LIVE.includes(c.id));
export const ncertCourse = (id: string) => NCERT_COURSES.find((c) => c.id === id)!;

/** The study lessons of a chapter, for the class page: the course and both lesson slugs. */
export function chapterLessons(classId: string, subjectId: string, ch: Chapter) {
  const id = ncertCourseId(classId, subjectId);
  if (!NCERT_LIVE.includes(id)) return undefined;
  const slug = chapterSlug(ch);
  return { course: id, notes: `/learn/courses/${id}/${slug}/`, practice: `/learn/courses/${id}/${slug}-practice/`, slug, practiceSlug: `${slug}-practice` };
}
