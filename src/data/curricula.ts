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

/**
 * The Learn categories (nihal, 2026-11-22): every course belongs to one, and its card shows up on that
 * category's hub page (/learn/<hub>/), on /learn/courses/ and in the Learn overview automatically.
 * School curricula are their own hub (/learn/school/).
 */
export const COURSE_CATS = [
  { id: 'data-ai', name: 'Data and AI', short: 'Data & AI', href: '/learn/data-ai/', blurb: 'Statistics, SQL, dashboards, machine learning and running AI on your own computer.' },
  { id: 'science', name: 'Science and space', short: 'Science', href: '/learn/science/', blurb: 'Astronomy, cosmology, climate and how scientists work things out.' },
  { id: 'exams', name: 'Exam prep', short: 'Exam prep', href: '/learn/exam-prep/', blurb: 'Practice and strategy for entrance and admission tests such as the SAT and LSAT.' },
  { id: 'life', name: 'Life, money and business', short: 'Life & business', href: '/learn/life-skills/', blurb: 'Home skills like tyres, tools and carpentry, plus money and starting a business.' },
] as const;
export type CourseCat = (typeof COURSE_CATS)[number]['id'];

// `cat` is required: pick the hub the course belongs in (COURSE_CATS above). The build fails on an unknown one.
export type Course = { id: string; name: string; text: string; status: 'live' | 'planned'; href?: string; cat: CourseCat };

// Short free courses (see /learn/courses/). Mark one 'live' with its page address when it is published.
export const COURSES: Course[] = [
  // Home skills (nihal, 2026-11-16): src/data/skill-courses.ts, pages at /learn/courses/<id>/.
  ...SKILL_COURSES.map((c) => ({ id: c.id, name: c.name, text: c.text, status: 'live' as const, href: `/learn/courses/${c.id}/`, cat: 'life' as const })),
  // Long text courses (src/courses/<id>/), pages at /learn/courses/<id>/.
  { id: 'offline-ai', name: 'Offline AI', text: 'Run AI models on your own laptop or desktop with no internet and no monthly limit: tokens, hardware, setup, Python workflows and costs.', status: 'live', href: '/learn/courses/offline-ai/', cat: 'data-ai' },
  { id: 'coding-data', name: 'Coding and data', text: 'Start with simple steps, then sort, count and draw charts from real-looking data.', status: 'planned', cat: 'data-ai' },
  // How AI works (nihal, 2026-11-21): filled by the ML foundations course (src/courses/ml-foundations/).
  { id: 'ml-foundations', name: 'From a straight line to an LLM', text: 'How machines learn from data: regression, decision trees, random forests, neural networks and what an LLM is, with simulations and the maths worked by hand.', status: 'live', href: '/learn/courses/ml-foundations/', cat: 'data-ai' },
  // Analyst courses (nihal, 2026-11-22): src/courses/statistics/ and src/courses/pandas/.
  { id: 'statistics', name: 'Statistics for analysts', text: 'Averages, spread, probability, distributions, confidence intervals, hypothesis tests and A/B testing, with simulations and every formula worked by hand.', status: 'live', href: '/learn/courses/statistics/', cat: 'data-ai' },
  { id: 'pandas', name: 'Python pandas for analysis', text: 'Real Python in the page: load, clean, filter, group, join and reshape data with pandas, with exercises that check your answer and a retail analysis capstone.', status: 'live', href: '/learn/courses/pandas/', cat: 'data-ai' },
  // Power BI and DAX, Data storytelling (nihal, 2026-11-22): the BI courses (src/courses/power-bi/, src/courses/data-storytelling/).
  { id: 'power-bi', name: 'Power BI and DAX', text: 'Clean data in Power Query, model a star schema, write DAX measures and time intelligence, and build a dashboard, with DAX you can type and run in every lesson.', status: 'live', href: '/learn/courses/power-bi/', cat: 'data-ai' },
  { id: 'data-storytelling', name: 'Data storytelling', text: 'Pick the right chart, cut the clutter, design KPI cards and present numbers so managers act, with charts you can change and writing practice in every lesson.', status: 'live', href: '/learn/courses/data-storytelling/', cat: 'data-ai' },
  // Space and the sky (nihal, 2026-11-22): replaced by two courses that never repeat each other or the
  // cosmology course: Sky watching (src/courses/sky-watching/) and Astronomy (src/courses/astronomy/).
  { id: 'sky-watching', name: 'Sky watching', text: 'Amateur astronomy from your own eyes to binoculars, telescopes and astrophotography: how the sky moves, finding anything, dark skies, what to observe and taking honest astrophotos.', status: 'live', href: '/learn/courses/sky-watching/', cat: 'science' },
  { id: 'astronomy', name: 'Astronomy', text: 'The science of stars, planets and galaxies: light and spectra, gravity and orbits, how stars live and die, galaxies, and the research methods astronomers use.', status: 'live', href: '/learn/courses/astronomy/', cat: 'science' },
  // Start a startup (nihal, 2026-11-22): India, Canada and the USA, src/courses/startup/.
  { id: 'startup', name: 'Start a startup', text: 'Start a business in India, Canada or the USA, online or offline, alone or with co-founders: registering, licences, GST and sales tax, income tax, payroll, IP and equity, with official sources.', status: 'live', href: '/learn/courses/startup/', cat: 'life' },
  // Cosmology A to Z (nihal, 2026-11-22): src/courses/cosmology/.
  { id: 'cosmology', name: 'Cosmology from A to Z', text: 'The story of the universe from ancient sky watchers to JWST: light, distances, Einstein, the Big Bang, the cosmic microwave background, dark matter and dark energy, with animations and live problems.', status: 'live', href: '/learn/courses/cosmology/', cat: 'science' },
  // IELTS preparation (nihal, 2026-11-22): src/courses/ielts/, practice room /learn/courses/ielts/practice/.
  { id: 'ielts', name: 'IELTS preparation', text: 'IELTS Academic and General Training from band 5 to 8+: every Listening, Reading, Writing and Speaking question type with a method, model answers, and a practice room of original questions with listening read aloud in your browser.', status: 'live', href: '/learn/courses/ielts/', cat: 'exams' },
  // University physics exams (nihal, 2026-11-22): src/courses/<id>/, questions from the shared bank public/qbank/physics/.
  { id: 'iit-jam-physics', name: 'IIT JAM Physics', text: 'The full IIT JAM Physics syllabus taught from scratch, with thousands of original MCQ, MSQ and NAT questions by topic and difficulty, full solutions and timed mock tests.', status: 'live', href: '/learn/courses/iit-jam-physics/', cat: 'exams' },
  { id: 'gate-physics', name: 'GATE Physics', text: 'GATE PH at MSc level: mathematical physics, quantum, electrodynamics, statistical, solid state, nuclear physics and electronics, with original practice questions and GATE-marked mock tests.', status: 'live', href: '/learn/courses/gate-physics/', cat: 'exams' },
  { id: 'csir-net-physics', name: 'CSIR NET Physics', text: 'CSIR NET Physical Sciences for JRF: roadmaps for every unit, lessons on the advanced topics only NET asks, and original practice questions with NET-marked mock tests.', status: 'live', href: '/learn/courses/csir-net-physics/', cat: 'exams' },
  // English tests (nihal, 2026-11-22): CELPIP (Canada) and the 2026 TOEFL iBT, src/courses/celpip/ and src/courses/toefl/.
  { id: 'celpip', name: 'CELPIP preparation', text: 'Reach your CELPIP target for Canadian PR or citizenship: every part of Listening, Reading, Writing and Speaking, with listening read aloud, timed practice, model answers and original questions.', status: 'live', href: '/learn/courses/celpip/', cat: 'exams' },
  { id: 'toefl', name: 'TOEFL preparation', text: 'Prepare for the new 2026 TOEFL iBT: every task explained, listening read aloud, word-building and sentence drills, timed writing and speaking, model answers and original questions.', status: 'live', href: '/learn/courses/toefl/', cat: 'exams' },
  // Exam prep (nihal, 2026-11-22): SAT and LSAT, src/courses/sat/ and src/courses/lsat/, questions in public/qbank/.
  { id: 'sat', name: 'SAT prep', text: 'The digital SAT from start to finish: how the adaptive test works, every Math and Reading and Writing skill, and thousands of original practice questions with worked solutions.', status: 'live', href: '/learn/courses/sat/', cat: 'exams' },
  { id: 'lsat', name: 'LSAT prep', text: 'The LSAT explained from everyday reasoning: how arguments work, every Logical Reasoning question type, Reading Comprehension and Argumentative Writing, with original practice questions and full explanations.', status: 'live', href: '/learn/courses/lsat/', cat: 'exams' },
  // CUET (UG) preparation (nihal, 2026-11-22): src/courses/cuet/.
  { id: 'cuet', name: 'CUET (UG) preparation', text: 'The Common University Entrance Test from start to finish: marking strategy, English, the General Test and the domain subjects, with thousands of original questions and full timed mocks.', status: 'live', href: '/learn/courses/cuet/', cat: 'exams' },
  { id: 'climate-energy', name: 'Climate and energy', text: 'Weather, carbon and clean energy, worked out with your own numbers.', status: 'planned', cat: 'science' },
  { id: 'money-basics', name: 'Money basics', text: 'Saving, interest and budgets, explained with calculators you can play with.', status: 'planned', cat: 'life' },
  { id: 'think-like-scientist', name: 'Thinking like a scientist', text: 'Asking a question, measuring, uncertainty and fair tests.', status: 'planned', cat: 'science' },
];

for (const c of COURSES) if (!COURSE_CATS.some((k) => k.id === c.cat)) throw new Error(`Course "${c.id}" has unknown cat "${c.cat}": use ${COURSE_CATS.map((k) => k.id).join(', ')} (COURSE_CATS in src/data/curricula.ts)`);
const dup = COURSES.find((c, i) => COURSES.findIndex((d) => d.id === c.id) !== i);
if (dup) throw new Error(`Course "${dup.id}" is listed twice in COURSES`);

/** Every grade or class of every live curriculum, with the curriculum it belongs to. */
export const allClasses = () => CURRICULA.filter((c) => c.status === 'live').flatMap((cur) => cur.classes.map((cls) => ({ cur, cls })));

/** Every chapter (in any live curriculum) that lists a tool, for "In the school syllabus" on the tool's page. */
export function chaptersForAll(toolId: string) {
  const out: { cur: Curriculum; cls: SchoolClass; subject: SchoolClass['subjects'][number]; chapter: SchoolClass['subjects'][number]['chapters'][number] }[] = [];
  for (const { cur, cls } of allClasses()) for (const subject of cls.subjects) for (const chapter of subject.chapters)
    if (chapter.tools.includes(toolId)) out.push({ cur, cls, subject, chapter });
  return out;
}
