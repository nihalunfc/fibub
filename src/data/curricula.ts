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
import { USA_GRADES } from './usa';
import { SKILL_COURSES } from './skill-courses';
import { KERALA_CLASSES } from './kerala';

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
  { id: 'ncert', name: 'NCERT and CBSE (India)', country: 'India', grades: 'Class 8 to 12', status: 'live', classes: CLASSES,
    note: 'CBSE schools use the NCERT books for science and maths, so these pages fit CBSE students too. Chapters follow the topics of the NCERT books used in 2026-27 (the new books for Class 8 and 9, the 2023 rationalised books for Class 10 to 12). fibub is an independent free site, not part of NCERT or CBSE, and copies no textbook text or pictures.' },
  { id: 'canada', name: 'Canada (Ontario)', country: 'Canada', grades: 'Grade 8 to 12', status: 'live', classes: ONTARIO_CLASSES, unit: 'strand',
    note: 'Education in Canada is set by each province, so this starts with Ontario, the largest. Strands follow the Ontario Ministry of Education course outlines (course codes such as SNC1W, MPM2D and SPH3U); courses are revised from time to time, so check the official Ontario curriculum for the current wording. fibub is an independent free site, not part of the Ontario government, and copies no curriculum or textbook text. British Columbia and Alberta may follow.' },
  { id: 'usa', name: 'United States', country: 'United States', grades: 'Grade 8 to 12', status: 'live', classes: USA_GRADES, unit: 'topic',
    note: 'Topics follow the Common Core State Standards for Mathematics and the Next Generation Science Standards, with standard codes such as 8.EE, HS-PS1 and MS-ESS2 so you can match them to your own state\'s list (some states, such as Texas, Virginia and New York, have their own standards). High school courses differ by school, so each grade shows the usual course for it. fibub is an independent free site, not part of Common Core, NGSS or any state, and copies no standards or textbook text.' },
  { id: 'uk', name: 'England national curriculum (UK)', country: 'United Kingdom', grades: 'Key Stage 3, GCSE, A-level', status: 'live', classes: UK_LEVELS, unit: 'topic',
    note: "Topics follow the national curriculum for England (Key Stage 3, GCSE and A-level subject content) as exam boards teach it, so they fit students in England, Wales and Northern Ireland with small differences; Scotland has its own system. Check your own exam board's specification. fibub is an independent free site, not part of the Department for Education or any exam board, and copies no textbook text or pictures." },
  { id: 'kerala', name: 'Kerala state syllabus (SCERT)', country: 'India', grades: 'Class 8 to 10', status: 'live', classes: KERALA_CLASSES,
    note: 'Chapters follow the SCERT Kerala English-medium textbooks for 2026-27 (the new Class 9 books of 2024 and the new Class 8 and 10 books of 2025), the books used in Kerala state syllabus schools in Kerala and in Kerala-syllabus schools in the Gulf. Check the official SCERT Kerala textbooks (scert.kerala.gov.in, samagra.kite.kerala.gov.in) for the current list. fibub is an independent free site, not part of SCERT Kerala or the Government of Kerala, and copies no textbook text or pictures.' },
];

export type Course = { id: string; name: string; text: string; status: 'live' | 'planned'; href?: string };

// Short free courses (see /learn/courses/). Mark one 'live' with its page address when it is published.
export const COURSES: Course[] = [
  // Home skills (nihal, 2026-11-16): src/data/skill-courses.ts, pages at /learn/courses/<id>/.
  ...SKILL_COURSES.map((c) => ({ id: c.id, name: c.name, text: c.text, status: 'live' as const, href: `/learn/courses/${c.id}/` })),
  // Long text courses (src/courses/<id>/), pages at /learn/courses/<id>/.
  { id: 'offline-ai', name: 'Offline AI', text: 'Run AI models on your own laptop or desktop with no internet and no monthly limit: tokens, hardware, setup, Python workflows and costs.', status: 'live', href: '/learn/courses/offline-ai/' },
  { id: 'coding-data', name: 'Coding and data', text: 'Start with simple steps, then sort, count and draw charts from real-looking data.', status: 'planned' },
  // How AI works (nihal, 2026-11-21): filled by the ML foundations course (src/courses/ml-foundations/).
  { id: 'ml-foundations', name: 'From a straight line to an LLM', text: 'How machines learn from data: regression, decision trees, random forests, neural networks and what an LLM is, with simulations and the maths worked by hand.', status: 'live', href: '/learn/courses/ml-foundations/' },
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
