// The site in numbers, for the top of the home page and of each Learn hub (nihal, 2026-11-22). Everything
// is counted at build time from the site's own files: live tools, live courses, written lessons, the
// figures and simulations placed in those lessons (<!--fig:...--> and data-fig="..."), and the question banks
// (src/lib/qtotals.ts). Nothing is typed in by hand; a number of 0 is left out.
import { getCollection } from 'astro:content';
import { COURSES, type CourseCat } from '../data/curricula';
import { courseCards } from './learn';
import { allTools } from './tools';
import { questionTotals, bankCat } from './qtotals';

export type Count = { value: number; label: string; href?: string; note?: string };
const figRe = /<!--\s*fig:|data-fig="/g;

let memo: ReturnType<typeof load> | null = null;
async function load() {
  const cards = (await courseCards()).filter((c) => c.status === 'live');
  const liveIds = new Set(cards.map((c) => c.id));
  const catOf = new Map(COURSES.map((c) => [c.id, c.cat]));
  const lessons = (await getCollection('lessons')).filter((e) => liveIds.has(e.id.split('/')[0]));
  const per: Record<string, { courses: number; lessons: number; figures: number }> = {};
  const at = (cat: string) => (per[cat] ??= { courses: 0, lessons: 0, figures: 0 });
  for (const c of cards) { at(c.cat).courses++; if (c.kind === 'skill') at(c.cat).lessons += c.lessons; }
  for (const e of lessons) { const k = at(catOf.get(e.id.split('/')[0]) ?? 'other'); k.lessons++; k.figures += (e.body ?? '').match(figRe)?.length ?? 0; }
  const q = await questionTotals();
  const qcat: Record<string, { items: number; gens: number }> = {};
  for (const [b, n] of Object.entries(q.byBank)) { const k = (qcat[bankCat(b)] ??= { items: 0, gens: 0 }); k.items += n.items; k.gens += n.gens; }
  const tools = (await allTools()).filter((t) => t.data.status === 'live').length;
  return { per, q, qcat, tools };
}
const sum = (per: Record<string, { courses: number; lessons: number; figures: number }>) =>
  Object.values(per).reduce((a, k) => ({ courses: a.courses + k.courses, lessons: a.lessons + k.lessons, figures: a.figures + k.figures }), { courses: 0, lessons: 0, figures: 0 });
const tpl = (n: number) => (n ? `+ ${n.toLocaleString('en')} templates that make new numbers` : undefined);

/** Headline numbers for the home page, and the per-exam question row under them. */
export async function siteHeadline() {
  const { per, q, tools } = await (memo ??= load());
  const s = sum(per);
  const counts: Count[] = [
    { value: tools, label: 'tools', href: '/tools/' },
    { value: s.courses, label: 'courses', href: '/learn/courses/' },
    { value: s.lessons, label: 'lessons', href: '/learn/courses/' },
    { value: s.figures, label: 'animations and figures', href: '/learn/courses/' },
    { value: q.items, label: 'practice questions', href: '/learn/exam-prep/', note: tpl(q.gens) },
  ].filter((c) => c.value > 0);
  return { counts, exams: q.exams };
}

/** The same numbers for one Learn hub (its courses, lessons, figures and, for exams and school, questions). */
export async function hubHeadline(cat: CourseCat) {
  const { per, q, qcat } = await (memo ??= load());
  const k = per[cat] ?? { courses: 0, lessons: 0, figures: 0 };
  const qn = qcat[cat] ?? { items: 0, gens: 0 };
  const counts: Count[] = [
    { value: k.courses, label: 'courses' },
    { value: k.lessons, label: 'lessons' },
    { value: k.figures, label: 'animations and figures' },
    { value: qn.items, label: 'practice questions', note: tpl(qn.gens) },
  ].filter((c) => c.value > 0);
  const exams = cat === 'exams' ? q.exams.filter((e) => e.id !== 'ncert') : cat === 'school' ? q.exams.filter((e) => e.id === 'ncert') : [];
  return { counts, exams };
}
