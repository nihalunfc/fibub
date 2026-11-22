// Engineering entrance (nihal, 2026-11-22): Plus Two Physics, Chemistry and Maths for KEAM, CUSAT CAT, COMEDK UGET,
// JEE Main and JEE Advanced, from the basics to top-rank questions. Plan: /mnt/project-files/entrance-courses/plan.md.
// Chapters come from src/data/entrance.ts: each is a module with the chapter lesson and its "question types" lesson,
// plus a practice set in the shared question bank (public/qbank/entrance-<subject>/<chapter>.js).
// Physics and Chemistry lesson files live here and are also shown in the medical course (see entrance.ts).
// Same engine as the other long text courses, with the lesson kit (`kit: true`).
import type { CourseModule, CourseSyllabus } from '../types';
import { CHAPTERS, SUBJECT_NAMES, type Subject } from '../../data/entrance';

/** Modules for a subject's chapters, numbered from `first`. */
export function chapterModules(subject: Subject, first: number, keep: (c: (typeof CHAPTERS)[Subject][number]) => boolean = () => true): CourseModule[] {
  return CHAPTERS[subject].filter(keep).map((c, i) => {
    const n = first + i;
    return { n, name: c.name, lessons: [[`${n}.1`, c.id, c.name], [`${n}.2`, `${c.id}-questions`, `${c.name}: question types and traps`]] };
  });
}

const START: CourseModule = { n: 1, name: 'Start here', lessons: [
  ['1.1', 'engineering-entrance-exams', 'Engineering entrance exams compared: KEAM, CUSAT CAT, COMEDK, JEE Main and Advanced'],
  ['1.2', 'engineering-study-plan', 'A study plan for one or two years'],
  ['1.3', 'question-formats', 'Every question format: assertion-reason, statements, match the columns, multi-correct and numerical'],
  ['1.4', 'practice-method', 'How to practise for a top rank: levels, mixed questions, mistakes log and mock tests'],
] };
const phy = chapterModules('physics', 2);
const che = chapterModules('chemistry', 2 + phy.length);
const mat = chapterModules('maths', 2 + phy.length + che.length);

export const ENGINEERING_ENTRANCE: CourseSyllabus = {
  id: 'engineering-entrance',
  name: 'Engineering entrance',
  title: 'Engineering entrance: Physics, Chemistry and Maths for KEAM, CUSAT, COMEDK, JEE Main and JEE Advanced',
  text: 'Every Plus Two Physics, Chemistry and Maths chapter for engineering entrance exams, from KEAM, CUSAT CAT and COMEDK to JEE Main and JEE Advanced: clear lessons with animations, every question type the exams use, traps and mixed-chapter questions, and a large bank of original practice questions with full solutions, sorted by chapter, exam and difficulty.',
  audience: 'For Class 11 and 12 students (and repeaters) preparing for engineering entrance tests. Starts from NCERT basics and climbs to JEE Advanced top-rank level.',
  updated: '2026-11-22',
  kit: true,
  kitDir: 'entrance',
  extras: [{ href: '/learn/courses/engineering-entrance/practice/', label: 'Practice questions, by chapter' }],
  footnote: 'Syllabus and exam patterns follow the official notices checked on 2026-11-22; they can change every year, so check the official exam website. All questions are original fibub work, not copied from past papers or books. Nothing you do here is sent anywhere.',
  parts: [
    { name: 'Part A: Start here', modules: [START] },
    { name: `Part B: ${SUBJECT_NAMES.physics}`, modules: phy },
    { name: `Part C: ${SUBJECT_NAMES.chemistry}`, modules: che },
    { name: `Part D: ${SUBJECT_NAMES.maths}`, modules: mat },
  ],
};
