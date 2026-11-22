// The Learn catalogue (nihal, 2026-11-22): every course with its category, lesson count and minutes, worked
// out at build time so the Learn overview, the category hubs (/learn/data-ai/, /learn/science/,
// /learn/life-skills/) and /learn/courses/ fill themselves. To add a course, list it in COURSES
// (src/data/curricula.ts) with its `cat`; a long text course's numbers come from its syllabus.ts and lessons.
import { getCollection } from 'astro:content';
import { COURSES, COURSE_CATS, CURRICULA, type Course, type CourseCat } from '../data/curricula';
import { SKILL_COURSES } from '../data/skill-courses';
import { flatLessons, type CourseSyllabus } from '../courses/types';

// Every syllabus.ts, found by its exported object (any export with `parts` and `id`).
const syllabi = Object.values(import.meta.glob('../courses/*/syllabus.ts', { eager: true }) as Record<string, Record<string, unknown>>)
  .flatMap((m) => Object.values(m)).filter((v): v is CourseSyllabus => !!v && typeof v === 'object' && 'parts' in v && 'id' in v);

// English language courses, also listed on /learn/languages/ (they live in Exam prep).
export const ENGLISH = ['ielts', 'celpip', 'toefl'];

// Virtual experiments (/learn/experiments/): school practicals, each a live fibub tool. Ids that are not
// live are left out at build time, so a group fills up as labs are built.
export const EXPERIMENTS: { name: string; text: string; tools: string[] }[] = [
  { name: 'Electricity', text: 'Build a circuit, change the resistance and read the meters.', tools: ['ohms-law-lab', 'series-parallel', 'simple-circuit-lab', 'circuit-simulator', 'galvanic-cell'] },
  { name: 'Light', text: 'Move the object and watch the image form; bend light through glass.', tools: ['mirror-ray-diagram', 'lens-ray-diagram', 'plane-mirror-lab', 'snell-law', 'prism-dispersion'] },
  { name: 'Motion', text: 'Time a pendulum, then plot distance and speed against time.', tools: ['pendulum-lab', 'motion-graphs', 'distance-displacement', 'equations-of-motion'] },
  { name: 'Chemistry lab', text: 'Mix, measure and see the change, without the risk.', tools: ['titration-curve', 'ph-scale-explorer', 'rate-of-reaction-lab', 'reactivity-series'] },
  { name: 'Biology', text: 'Look, count and record.', tools: ['osmosis-lab', 'cell-explorer', 'hemocytometer'] },
  { name: 'Your own readings', text: 'Type in readings from a real practical to plot them, find the slope and work out the error.', tools: ['plot-maker', 'uncertainty-calculator', 'graph-digitizer'] },
];

export type CourseCard = Course & { lessons: number; total: number; minutes: number; kind: 'text' | 'skill' | 'planned'; i?: number };

export async function courseCards(): Promise<CourseCard[]> {
  const files = await getCollection('lessons');
  return COURSES.map((c) => {
    const syl = syllabi.find((s) => s.id === c.id);
    if (syl) {
      // A course can borrow lessons from another (sharedFrom: medical entrance shows the engineering Physics and Chemistry).
      const listed = new Set(flatLessons(syl).map((l) => l.slug));
      const mine = files.filter((e) => e.id.startsWith(`${c.id}/`) || (syl.sharedFrom && e.id.startsWith(`${syl.sharedFrom}/`) && listed.has(e.id.slice(syl.sharedFrom.length + 1))));
      // A course marked live with no lesson written yet still shows as coming soon.
      return { ...c, status: mine.length ? c.status : 'planned' as const, kind: 'text' as const, lessons: mine.length, total: flatLessons(syl).length, minutes: mine.reduce((s, e) => s + e.data.minutes, 0) };
    }
    const sk = SKILL_COURSES.find((s) => s.id === c.id);
    if (sk) return { ...c, kind: 'skill' as const, lessons: sk.lessons.length, total: sk.lessons.length, minutes: 0 };
    return { ...c, kind: 'planned' as const, lessons: 0, total: 0, minutes: 0 };
  }).sort((a, b) => Number(b.status === 'live') - Number(a.status === 'live'));
}

export const cardsIn = (cards: CourseCard[], cat: CourseCat) => cards.filter((c) => c.cat === cat);

/** "33 lessons · 9 h" style line for a card. */
export function cardMeta(c: CourseCard) {
  if (c.status !== 'live') return 'Coming soon';
  const parts = [c.lessons < c.total ? `${c.lessons} of ${c.total} lessons` : `${c.lessons} lessons`];
  if (c.minutes) parts.push(c.minutes >= 90 ? `${Math.round(c.minutes / 6) / 10} h` : `${c.minutes} min`);
  return parts.join(' · ');
}

/** The hubs of the Learn overview, in order: School first, then the course categories, then labs and languages. */
export function learnHubs(cards: CourseCard[]) {
  const live = (cat: CourseCat) => cardsIn(cards, cat).filter((c) => c.status === 'live');
  const sum = (cs: CourseCard[]) => cs.reduce((s, c) => s + c.lessons, 0);
  const curricula = CURRICULA.filter((c) => c.status === 'live');
  return [
    { id: 'school', name: 'School', href: '/learn/school/', blurb: 'Class 8 to 12, chapter by chapter: NCERT, Kerala, Canada, USA and UK.', count: `${new Set(curricula.map((c) => c.country)).size} countries` },
    ...COURSE_CATS.filter((k) => k.id !== 'school').map((k) => ({ id: k.id, name: k.name, href: k.href, blurb: k.blurb, count: live(k.id).length ? `${live(k.id).length} courses · ${sum(live(k.id))} lessons` : 'Courses on the way' })),
    { id: 'labs', name: 'Experiments', href: '/learn/experiments/', blurb: 'Virtual lab work: set up, take readings, plot and check.', count: `${EXPERIMENTS.reduce((s, g) => s + g.tools.length, 0)} virtual labs` },
    { id: 'languages', name: 'Languages', href: '/learn/languages/', blurb: 'English for IELTS, CELPIP and TOEFL, with vocabulary and practice.', count: `${cards.filter((c) => ENGLISH.includes(c.id) && c.status === 'live').length} English courses` },
  ];
}
