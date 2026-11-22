// Medical entrance (nihal, 2026-11-22): Plus Two Physics, Chemistry and Biology for NEET UG (the test behind MBBS,
// BDS, AYUSH and most allied admissions, including KEAM's medical allotment and Karnataka's medical seats).
// Plan: /mnt/project-files/entrance-courses/plan.md. Biology lessons live here; Physics and Chemistry lessons are
// the engineering course's files (src/courses/engineering-entrance/), shown here too with a canonical link to
// the engineering page. Chapters left out of NEET (`neet: false` in src/data/entrance.ts) are skipped.
import type { CourseModule, CourseSyllabus } from '../types';
import { SUBJECT_NAMES } from '../../data/entrance';
import { chapterModules } from '../engineering-entrance/syllabus';

const START: CourseModule = { n: 1, name: 'Start here', lessons: [
  ['1.1', 'neet-exam-guide', 'NEET UG explained: pattern, marking, cut-offs and how ranks lead to seats'],
  ['1.2', 'neet-study-plan', 'A NEET study plan for one or two years'],
  ['1.3', 'neet-question-formats', 'NEET question formats: assertion-reason, two statements, match the lists and NCERT-line questions'],
  ['1.4', 'neet-practice-method', 'How to practise for a top NEET rank: speed, accuracy, mistakes log and mock tests'],
] };
const inNeet = (c: { neet?: false }) => c.neet !== false;
const phy = chapterModules('physics', 2, inNeet);
const che = chapterModules('chemistry', 2 + phy.length, inNeet);
const bio = chapterModules('biology', 2 + phy.length + che.length);

/** Lessons whose file lives in the engineering course (Physics and Chemistry). */
export const SHARED_SLUGS = new Set([...phy, ...che].flatMap((m) => m.lessons.map((l) => l[1])));

export const MEDICAL_ENTRANCE: CourseSyllabus = {
  id: 'medical-entrance',
  name: 'Medical entrance (NEET)',
  title: 'Medical entrance: Physics, Chemistry and Biology for NEET UG',
  text: 'Every Plus Two Physics, Chemistry and Biology chapter for NEET UG: clear lessons with animations, every question type NEET uses (assertion-reason, two statements, match the lists, NCERT-line questions), traps and mixed-chapter questions, and a large bank of original practice questions with full solutions, sorted by chapter and difficulty.',
  audience: 'For Class 11 and 12 students (and repeaters) preparing for NEET UG. Follows the NCERT books line by line for Biology and climbs to top-rank level in every subject.',
  updated: '2026-11-22',
  kit: true,
  kitDir: 'entrance',
  extras: [{ href: '/learn/courses/medical-entrance/practice/', label: 'Practice questions, by chapter' }, { href: '/learn/courses/medical-entrance/mock-test/', label: 'NEET mock test (timed)' }],
  sharedFrom: 'engineering-entrance',
  footnote: 'Syllabus and exam pattern follow the official NMC and NTA notices checked on 2026-11-22; they can change every year, so check neet.nta.nic.in. All questions are original fibub work, not copied from past papers or books. Nothing you do here is sent anywhere.',
  parts: [
    { name: 'Part A: Start here', modules: [START] },
    { name: `Part B: ${SUBJECT_NAMES.physics}`, modules: phy },
    { name: `Part C: ${SUBJECT_NAMES.chemistry}`, modules: che },
    { name: `Part D: ${SUBJECT_NAMES.biology}`, modules: bio },
  ],
};
