// The school curricula Learn follows, and the free courses on offer. The home page's totals are worked
// out from these lists and from the tool files (src/lib/totals.ts), so adding a curriculum or a course
// here is all it takes for the numbers to grow. Nothing is counted by hand.
//
// To add a curriculum (for example Ontario, a US state or the UK national curriculum): write its chapter
// map like src/data/ncert.ts (a list of classes or grades, each with subjects and chapters that list
// tool ids), export it here with status 'live', and add its pages. A 'planned' entry is not counted.
import { CLASSES, type SchoolClass } from './ncert';
import { UK_LEVELS } from './uk';
import { ONTARIO_CLASSES } from './ontario';

export type Curriculum = {
  id: string;
  name: string;      // as people say it, e.g. "NCERT (India)"
  country: string;
  grades: string;    // e.g. "Class 8 to 12"
  status: 'live' | 'planned';
  classes: SchoolClass[]; // empty while planned
  unit?: string;     // what a chapter is called here (default "chapter"; Ontario uses "strand")
  note?: string;     // shown at the foot of each grade page: which documents the topics follow
};

export const CURRICULA: Curriculum[] = [
  { id: 'ncert', name: 'NCERT (India)', country: 'India', grades: 'Class 8 to 12', status: 'live', classes: CLASSES,
    note: 'Chapters follow the topics of the NCERT books used in 2026-27 (the new books for Class 8 and 9, the 2023 rationalised books for Class 10 to 12). fibub is an independent free site, not part of NCERT, and copies no textbook text or pictures.' },
  { id: 'canada', name: 'Canada (Ontario)', country: 'Canada', grades: 'Grade 8 to 12', status: 'live', classes: ONTARIO_CLASSES, unit: 'strand',
    note: 'Education in Canada is set by each province, so this starts with Ontario, the largest. Strands follow the Ontario Ministry of Education course outlines (course codes such as SNC1W, MPM2D and SPH3U); courses are revised from time to time, so check the official Ontario curriculum for the current wording. fibub is an independent free site, not part of the Ontario government, and copies no curriculum or textbook text. British Columbia and Alberta may follow.' },
  { id: 'usa', name: 'United States', country: 'United States', grades: 'Grade 8 to 12', status: 'planned', classes: [] },
  { id: 'uk', name: 'England national curriculum (UK)', country: 'United Kingdom', grades: 'Key Stage 3, GCSE, A-level', status: 'live', classes: UK_LEVELS, unit: 'topic',
    note: "Topics follow the national curriculum for England (Key Stage 3, GCSE and A-level subject content) as exam boards teach it, so they fit students in England, Wales and Northern Ireland with small differences; Scotland has its own system. Check your own exam board's specification. fibub is an independent free site, not part of the Department for Education or any exam board, and copies no textbook text or pictures." },
];

export type Course = { id: string; name: string; text: string; status: 'live' | 'planned'; href?: string };

// Short free courses (see /learn/courses/). Mark one 'live' with its page address when it is published.
export const COURSES: Course[] = [
  { id: 'coding-data', name: 'Coding and data', text: 'Start with simple steps, then sort, count and draw charts from real-looking data.', status: 'planned' },
  { id: 'how-ai-works', name: 'How AI works', text: 'What a model is, how it learns from examples, and where it goes wrong, with small things to try.', status: 'planned' },
  { id: 'space-sky', name: 'Space and the sky', text: 'Find the planets tonight, measure the Moon, and learn how we know how far away stars are.', status: 'planned' },
  { id: 'climate-energy', name: 'Climate and energy', text: 'Weather, carbon and clean energy, worked out with your own numbers.', status: 'planned' },
  { id: 'money-basics', name: 'Money basics', text: 'Saving, interest and budgets, explained with calculators you can play with.', status: 'planned' },
  { id: 'think-like-scientist', name: 'Thinking like a scientist', text: 'Asking a question, measuring, uncertainty and fair tests.', status: 'planned' },
];

/** Every grade or class of every live curriculum, with the curriculum it belongs to. */
export const allClasses = () => CURRICULA.filter((c) => c.status === 'live').flatMap((cur) => cur.classes.map((cls) => ({ cur, cls })));

/** Every chapter (in any live curriculum) that lists a tool, for "In the school syllabus" on the tool's page. */
export function chaptersForAll(toolId: string) {
  const out: { cur: Curriculum; cls: SchoolClass; subject: SchoolClass['subjects'][number]; chapter: SchoolClass['subjects'][number]['chapters'][number] }[] = [];
  for (const { cur, cls } of allClasses()) for (const subject of cls.subjects) for (const chapter of subject.chapters)
    if (chapter.tools.includes(toolId)) out.push({ cur, cls, subject, chapter });
  return out;
}
