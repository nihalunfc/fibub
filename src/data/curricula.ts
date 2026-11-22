// The school curricula Learn follows, and the free courses on offer. The home page's totals are worked
// out from these lists and from the tool files (src/lib/totals.ts), so adding a curriculum or a course
// here is all it takes for the numbers to grow. Nothing is counted by hand.
//
// To add a curriculum (for example Ontario, a US state or the UK national curriculum): write its chapter
// map like src/data/ncert.ts (a list of classes or grades, each with subjects and chapters that list
// tool ids), export it here with status 'live', and add its pages. A 'planned' entry is not counted.
import { CLASSES, type SchoolClass } from './ncert';
import { NCERT_COURSES } from '../courses/ncert';
import { UK_LEVELS } from './uk';
import { ONTARIO_CLASSES } from './ontario';
import { USA_GRADES } from './usa';
import { SKILL_COURSES } from './skill-courses';
import { KERALA_CLASSES } from './kerala';
import { TN_CLASSES } from './tamil-nadu';
import { TELANGANA_CLASSES } from './telangana';
import { WB_CLASSES } from './west-bengal';

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
  // Other Indian states with their own science and maths syllabus (nihal, 2026-11-22). States whose boards use
  // the NCERT books are listed in INDIA_NCERT_BOARDS below instead of getting pages of their own.
  { id: 'tamil-nadu', name: 'Tamil Nadu state syllabus (Samacheer Kalvi)', country: 'India', grades: 'Class 8 to 10', status: 'live', classes: TN_CLASSES,
    note: 'Chapters follow the Tamil Nadu State Board (Samacheer Kalvi, TNSCERT) English-medium science and maths books for 2026-27; the computer chapters of the science book are left out. Check the official books (textbooksonline.tn.nic.in) for the current list. fibub is an independent free site, not part of TNSCERT or the Government of Tamil Nadu, and copies no textbook text or pictures.' },
  { id: 'telangana', name: 'Telangana state syllabus (SCERT)', country: 'India', grades: 'Class 8 to 10', status: 'live', classes: TELANGANA_CLASSES,
    note: 'Chapters follow the SCERT Telangana English-medium Physical Science, Biological Science and Mathematics books used for 2026-27. The state has proposed moving maths and science to the NCERT books from 2027-28; if it does, use the NCERT pages. Check the official books (scert.telangana.gov.in) for the current list. fibub is an independent free site, not part of SCERT Telangana or the Government of Telangana, and copies no textbook text or pictures.' },
  { id: 'west-bengal', name: 'West Bengal state syllabus (WBBSE)', country: 'India', grades: 'Class 8 to 10', status: 'live', classes: WB_CLASSES,
    note: 'Chapters follow the West Bengal Board of Secondary Education syllabus for 2026-27 (Paribesh o Bigyan and Ganitprabha in Class 8; Physical Science, Life Science and Mathematics for the Madhyamik in Class 9 and 10), with the English chapter names used in English-medium schools. Check the official WBBSE syllabus (wbbse.wb.gov.in) for the current list. fibub is an independent free site, not part of WBBSE or the Government of West Bengal, and copies no textbook text or pictures.' },
];

// Indian state boards that teach science and maths from the NCERT books (or close copies of them), so their
// students use the NCERT pages. Checked 2026-11-22; each line says what the board uses and where that is stated.
export type NcertBoard = { id: string; name: string; board: string; text: string; source: string };
export const INDIA_NCERT_BOARDS: NcertBoard[] = [
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', board: 'BSEAP and BIEAP', text: 'NCERT books for Class 1 to 10 from 2025 (in two languages), and NCERT for Intermediate from 2025-26.', source: 'https://www.sakshipost.com/news/education/ap-intermediate-syllabus-2025-key-changes-ncert-cbse-syllabus-academic-year-390590' },
  { id: 'karnataka', name: 'Karnataka', board: 'KSEAB', text: 'SSLC science and maths follow the NCERT chapters; PUC science has used NCERT since 2012-13.', source: 'https://udayavani.com/english-news/karnataka-implements-ncert-syllabus-for-pucs-three-key-subjects' },
  { id: 'punjab', name: 'Punjab', board: 'PSEB', text: 'Class 10 science and maths have the same chapters as the NCERT books.', source: 'https://school.careers360.com/articles/pseb-10th-syllabus' },
  { id: 'meghalaya', name: 'Meghalaya', board: 'MBOSE', text: 'NCERT books, with small changes, for Class 1 to 10 since the 2023 state decision.', source: 'https://news.careers360.com/meghalaya-opts-ncert-textbooks-maths-english-science-books-national-standard' },
  { id: 'nagaland', name: 'Nagaland', board: 'NBSE', text: 'The board prescribes NCERT books (Nagaland edition) for science and maths.', source: 'https://nbsenl.edu.in/cms/document/13/syllabi' },
  { id: 'tripura', name: 'Tripura', board: 'TBSE', text: 'Moved to the NCERT curriculum and books from 2019-20.', source: 'https://www.business-standard.com/article/pti-stories/tripura-to-adopt-ncert-curriculum-education-minister-118053001308_1.html' },
  { id: 'mizoram', name: 'Mizoram', board: 'MBSE', text: 'Class 11 and 12 use the NCERT books; Class 9 and 10 use bilingual books from approved publishers, so check chapter names against the NCERT pages.', source: 'https://www.mbse.edu.in/wp-content/uploads/2025/12/HS-Textbook-List-2026-2027.pdf' },
  { id: 'manipur', name: 'Manipur', board: 'BOSEM and COHSEM', text: 'The board\'s own books, written by local authors, follow the NCERT science and maths syllabus, so check chapter names against the NCERT pages.', source: 'https://ncert.nic.in/division/der/pdf/Curriculum_Textbook_Development.pdf' },
];

/**
 * The Learn categories (nihal, 2026-11-22): every course belongs to one, and its card shows up on that
 * category's hub page (/learn/<hub>/), on /learn/courses/ and in the Learn overview automatically.
 * School curricula are their own hub (/learn/school/).
 */
export const COURSE_CATS = [
  { id: 'school', name: 'School study notes', short: 'School', href: '/learn/school/', blurb: 'NCERT chapters explained with animations, tools and practice questions.' },
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
  // How AI works (nihal, 2026-11-21): filled by the ML foundations course (src/courses/ml-foundations/).
  { id: 'ml-foundations', name: 'From a straight line to an LLM', text: 'How machines learn from data: regression, decision trees, random forests, neural networks and what an LLM is, with simulations and the maths worked by hand.', status: 'live', href: '/learn/courses/ml-foundations/', cat: 'data-ai' },
  // Analyst courses (nihal, 2026-11-22): src/courses/statistics/ and src/courses/pandas/.
  { id: 'statistics', name: 'Statistics for analysts', text: 'Averages, spread, probability, distributions, confidence intervals, hypothesis tests and A/B testing, with simulations and every formula worked by hand.', status: 'live', href: '/learn/courses/statistics/', cat: 'data-ai' },
  { id: 'pandas', name: 'Python pandas for analysis', text: 'Real Python in the page: load, clean, filter, group, join and reshape data with pandas, with exercises that check your answer and a retail analysis capstone.', status: 'live', href: '/learn/courses/pandas/', cat: 'data-ai' },
  // Pipeline to Dashboard and Data at Scale (nihal, 2026-11-22): rebuilt on fibub from the old portfolio courses (src/courses/etl/, src/courses/data-at-scale/).
  { id: 'etl', name: 'Pipeline to Dashboard', text: 'Build the pipelines that bring data in from email, drives and APIs, clean it, run it on a schedule with Dagster, load a warehouse, model it with dbt and show it in Power BI, with a project at the end of every module.', status: 'live', href: '/learn/courses/etl/', cat: 'data-ai' },
  { id: 'data-at-scale', name: 'Data at Scale', text: 'Spark, BigQuery, Airflow, Kafka and the databases behind big platforms, data for machine learning and AI, and how retail media and ad measurement work, with mini projects and free sandboxes.', status: 'live', href: '/learn/courses/data-at-scale/', cat: 'data-ai' },
  // Power BI and DAX, Data storytelling (nihal, 2026-11-22): the BI courses (src/courses/power-bi/, src/courses/data-storytelling/).
  { id: 'power-bi', name: 'Power BI and DAX', text: 'Clean data in Power Query, model a star schema, write DAX measures and time intelligence, and build a dashboard, with DAX you can type and run in every lesson.', status: 'live', href: '/learn/courses/power-bi/', cat: 'data-ai' },
  { id: 'data-storytelling', name: 'Data storytelling', text: 'Pick the right chart, cut the clutter, design KPI cards and present numbers so managers act, with charts you can change and writing practice in every lesson.', status: 'live', href: '/learn/courses/data-storytelling/', cat: 'data-ai' },
  // SQL for analysts and Data modelling (nihal, 2026-11-22): src/courses/sql/, src/courses/data-modelling/.
  { id: 'sql', name: 'SQL for analysts', text: 'Learn SQL by typing it: live editors on a store database, answer checks, and step-by-step pictures of joins, GROUP BY and window functions.', status: 'live', href: '/learn/courses/sql/', cat: 'data-ai' },
  { id: 'data-modelling', name: 'Data modelling and warehousing', text: 'Star schemas, facts and dimensions, slowly changing dimensions, Data Vault and the lakehouse, with live SQL to build a warehouse yourself.', status: 'live', href: '/learn/courses/data-modelling/', cat: 'data-ai' },
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
  // Plus Two entrance (nihal, 2026-11-22): src/courses/engineering-entrance/ and src/courses/medical-entrance/,
  // chapters in src/data/entrance.ts, questions in public/qbank/entrance-<subject>/.
  { id: 'engineering-entrance', name: 'Engineering entrance (KEAM to JEE Advanced)', text: 'Plus Two Physics, Chemistry and Maths for KEAM, CUSAT CAT, COMEDK, JEE Main and JEE Advanced: lessons, every question type, and original practice questions with full solutions at five levels.', status: 'live', href: '/learn/courses/engineering-entrance/', cat: 'exams' },
  { id: 'medical-entrance', name: 'Medical entrance (NEET)', text: 'Plus Two Physics, Chemistry and Biology for NEET UG: lessons, every NEET question format, and original practice questions with full solutions at five levels.', status: 'live', href: '/learn/courses/medical-entrance/', cat: 'exams' },
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
  // GMAT and GRE prep (nihal, 2026-11-22): src/courses/gmat/ and src/courses/gre/.
  { id: 'gmat', name: 'GMAT prep', text: 'The whole GMAT from zero: number properties, algebra, word problems, statistics, Critical Reasoning, Reading Comprehension and Data Insights, with worked examples, fresh practice questions every visit and timed practice.', status: 'live', href: '/learn/courses/gmat/', cat: 'exams' },
  { id: 'gre', name: 'GRE prep', text: 'The shorter GRE from zero: Quantitative Comparison, arithmetic, algebra, geometry and data, Text Completion, Sentence Equivalence, reading and the Issue essay, with worked examples, fresh practice questions every visit and a timed practice test.', status: 'live', href: '/learn/courses/gre/', cat: 'exams' },
  // NCERT study materials (nihal, 2026-11-22): src/courses/ncert.ts, one course per class and subject.
  ...NCERT_COURSES.map((c) => ({ id: c.id, name: c.name, text: c.text, status: 'live' as const, href: `/learn/courses/${c.id}/`, cat: 'school' as const })),
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
